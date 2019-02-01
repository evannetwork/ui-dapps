/*
  Copyright (C) 2018-present evan GmbH.

  This program is free software: you can redistribute it and/or modify it
  under the terms of the GNU Affero General Public License, version 3,
  as published by the Free Software Foundation.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
  See the GNU Affero General Public License for more details.

  You should have received a copy of the GNU Affero General Public License
  along with this program. If not, see http://www.gnu.org/licenses/ or
  write to the Free Software Foundation, Inc., 51 Franklin Street,
  Fifth Floor, Boston, MA, 02110-1301 USA, or download the license from
  the following URL: https://evan.network/license/

  You can be released from the requirements of the GNU Affero General Public
  License by purchasing a commercial license.
  Buying such a license is mandatory as soon as you use this software or parts
  of it on other blockchains than evan.network.

  For more information, please contact evan GmbH at this address:
  https://evan.network/license/
*/

import {
  getDomainName,
  lightwallet,
  System
} from 'dapp-browser';

import {
  ChangeDetectorRef,
  Component,
  DomSanitizer,
  NavController,
  OnInit,
  TranslateService,
  ViewChild,
  Http, Response, RequestOptions, Headers,       // @angular/http
  Input,
} from 'angular-libs';

import {
  AnimationDefinition,
  AsyncComponent,
  createOpacityTransition,
  createRouterTransition,
  createTabSlideTransition,
  EvanAddressBookService,
  EvanAlertService,
  EvanBCCService,
  EvanClaimService,
  EvanCoreService,
  EvanQueue,
  EvanToastService,
  EvanTranslationService,
  QueueId,
} from 'angular-core';

import { ProfileService } from '../../services/service';

/**************************************************************************************************/

@Component({
  selector: 'evan-payments-detail',
  templateUrl: 'payments.html',
  animations: [
    createOpacityTransition(),
    createTabSlideTransition()
  ]
})

/**
 * Shows the current pyment channel informations for the ipfs payments
 */
export class EvanProfilePaymentsComponent extends AsyncComponent {
  /**
   * show the base loading symbol.
   */
  private loading: boolean;
 
  /**
   * holds the payment channel details for the current account
   */
  private paymentDetails: any;

  /**
   * Current input values.
   */
  private paymentChannelForm: any;

  /**
   * opened payment channels.
   */
  private paymentChannels: any;

  /**
   * this.bcc.web3.utils.fromWei
   */
  public toEve: Function;

  /**
   * Function to unsubscribe from queue results.
   */
  private queueWatcher: Function;

  /**
   * QueueId for quick accessing queue add & watch.
   */
  private paymentQueueId: QueueId;

  /**
   * is currently the payment dispatcher running?
   */
  private dispatcherRunning: boolean;

  /**
   * is currently an error occured by loading data?
   */
  private error: any;

  /**
   * Balancer input reference
   */
  @ViewChild('balanceInput') balanceInput: any;

  constructor(
    private _DomSanitizer: DomSanitizer,
    private addressBookService: EvanAddressBookService,
    private alertService: EvanAlertService,
    private bcc: EvanBCCService,
    private claimsService: EvanClaimService,
    private core: EvanCoreService,
    private http: Http,
    private profileService: ProfileService,
    private queue: EvanQueue,
    private ref: ChangeDetectorRef,
    private toastService: EvanToastService,
    private translateService: EvanTranslationService,
  ) {
    super(ref);
  }

  /**
   * Set initial values and load the profile information
   *
   * @return     {Promise<void>}  resolved when done
   */
  async _ngOnInit() {
    this.paymentDetails = {};
    this.paymentChannels = {};
    this.paymentChannelForm = { topUp: 0 };
    this.toEve = this.bcc.web3.utils.fromWei;

    // setup channel manager§
    this.bcc.payments.setChannelManager(this.profileService.channelManagerAddress);

    // watch for updates and reload the ui data
    this.paymentQueueId = new QueueId(`profile.${ getDomainName() }`, 'paymentDispatcher'),
    this.queueWatcher = await this.queue.onQueueFinish(this.paymentQueueId, async (reload) => {
      // show loading
      if (reload) {
        this.loading = true;
        this.ref.detectChanges();
      }

      // load the data
      await this.loadPaymentDetails();
      await this.loadPaymentChannels();

      // check if something is loading
      this.dispatcherRunning = this.queue.getQueueEntry(this.paymentQueueId, true).data.length > 0;

      // remove loading
      if (reload) {
        this.loading = false;
        this.ref.detectChanges();
      }

      (<any>this).log = console.log;

      setTimeout(() => console.log(this.balanceInput));
    });
  }

  /**
   * Load the payment details for the current account
   */
  async loadPaymentDetails() {
    try {
      const status = await this.profileService.requestPaymentAgent('getStatus');

      // parse correct value for estimated values
      status.monthlyPayments = Math.floor(status.monthlyPayments).toString();
      status.fundsAvailable = Math.floor(status.fundsAvailable).toString();
      status.estimatedFunds = Math.floor(status.fundsAvailable / status.monthlyPayments);
      status.overallSize = Number(status.monthlyPayments).toFixed(2);

      // save status to components scope
      this.paymentDetails = status;
    } catch (ex) {
      this.error = ex.message;
      this.core.utils.log(ex.message, 'error');
    }
  }

  /**
   * Load available payment channels for the current user.
   */
  async loadPaymentChannels() {
    try {
      this.paymentChannels = await this.profileService.requestPaymentAgent('getChannels');
    } catch (ex) {
      this.error = ex.message;
      this.core.utils.log(ex.message, 'error');
    }
  }

  /**
   * Trigger the payment queue to create open a new payment channel, if no was registered before.
   */
  async createPaymentChannel() {
    this.runPaymentQueue({
      type: 'openChannel',
      eve: this.paymentChannelForm.value,
    });
  }

  /**
   * Add eve to a payment channel.
   */
  async topupPaymentChannel(channel) {
    this.runPaymentQueue({
      type: 'topUp',
      eve: this.paymentChannelForm.value,
      channel: channel
    });
  }

  /**
   * Trigger ipfs hash removal.
   */
  async removeHash() {
    this.runPaymentQueue({
      type: 'removeHash',
      hash: this.paymentChannelForm.hash,
    });
  }

  /**
   * Run the payment queue and show loading symbols / disable buttons.
   *
   * @param      {any}     data    queue entry data that should be pushed to the queue
   */
  runPaymentQueue(data: any) {
    // trigger dispatcher
    this.queue.addQueueData(this.paymentQueueId, data);

    // disable buttons and show loading
    this.dispatcherRunning = true;
    this.ref.detectChanges();
  }
}
