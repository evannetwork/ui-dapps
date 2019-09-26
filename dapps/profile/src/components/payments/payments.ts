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
*/

import {
  getDomainName,
  lightwallet,
  System
} from '@evan.network/ui-dapp-browser';

import {
  ChangeDetectorRef,
  Component,
  DomSanitizer,
  NavController,
  OnInit,
  TranslateService,
  ViewChild,
  Http, Response, RequestOptions, Headers,
  Input,
} from '@evan.network/ui-angular-libs';

import {
  AnimationDefinition,
  AsyncComponent,
  createOpacityTransition,
  createRouterTransition,
  createTabSlideTransition,
  EvanAddressBookService,
  EvanAlertService,
  EvanBCCService,
  EvanVerificationService,
  EvanCoreService,
  EvanPaymentService,
  EvanQueue,
  EvanToastService,
  EvanTranslationService,
  QueueId,
} from '@evan.network/ui-angular-core';

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
 * Shows the current payment channel information for the ipfs payments
 */
export class EvanProfilePaymentsComponent extends AsyncComponent {
  /**
   * show the base loading symbol.
   */
  public loading: boolean;

  /**
   * holds the payment channel details for the current account
   */
  private paymentDetails: any = {};

  /**
   * opened payment channels.
   */
  private paymentChannels: any = {
    channels: [ ],
  };

  /**
   * Current input values.
   */
  private paymentChannelForm: any = { topUp: 0 };

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
   * current active visbile action tab
   */
  private actionTab: number = 0;

  /**
   * currently selectec channel for actions
   */
  private activeChannel: any;

  /**
   * all active channels
   */
  private activeChannels: any;

  /**
   * Balancer input reference
   */
  @ViewChild('balanceInput') balanceInput: any;

  constructor(
    private _DomSanitizer: DomSanitizer,
    private addressBookService: EvanAddressBookService,
    private alertService: EvanAlertService,
    private bcc: EvanBCCService,
    private verificationsService: EvanVerificationService,
    private core: EvanCoreService,
    private http: Http,
    private paymentService: EvanPaymentService,
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
    this.toEve = this.bcc.web3.utils.fromWei;

    // setup channel manager
    this.bcc.payments.setChannelManager(this.paymentService.paymentChannelManagerAccountId);

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
    });
  }

  /**
   * Load the payment details for the current account
   */
  async loadPaymentDetails() {
    try {
      const status = await this.paymentService.requestPaymentAgent('status/get');

      // parse correct value for estimated values
      status.monthlyPayments = Math.floor(status.monthlyPayments).toString();
      status.fundsAvailable = Math.floor(status.fundsAvailable).toString();
      status.estimatedFunds = Math.floor(status.fundsAvailable / status.monthlyPayments);

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
      this.paymentChannels = await this.paymentService.requestPaymentAgent('channel/get');

      // find active channels
      this.activeChannels = this.paymentChannels.channels
        .filter(channel => channel.state === 'OPEN' || channel.state === 'UNCONFIRMED');

      // preselect first active channel for actions
      this.activeChannel = this.activeChannels.length > 0 ? this.activeChannels[0] : null;
    } catch (ex) {
      this.error = ex.message;
      this.core.utils.log(ex.message, 'error');
    }
  }

  /**
   * Trigger the payment queue to create open a new payment channel, if no was registered before.
   */
  async createPaymentChannel() {
    try {
      await this
        .alertService.showSubmitAlert(
          '_dappprofile.payment.topup-alert.title',
          {
            key: '_dappprofile.payment.topup-alert.description',
            translateOptions: {
              eve: this.paymentChannelForm.value
            }
          },
          '_dappprofile.payment.topup-alert.cancel',
          '_dappprofile.payment.topup-alert.submit',
        );
    } catch (ex) {
      return;
    }

    this.runPaymentQueue({
      type: 'openChannel',
      eve: this.paymentChannelForm.value,
    });

    // reset input
    this.paymentChannelForm.value = 0;
  }

  /**
   * Add eve to a payment channel.
   */
  async topupPaymentChannel(channel) {
    try {
     await this
      .alertService.showSubmitAlert(
        '_dappprofile.payment.topup-alert.title',
        {
          key: '_dappprofile.payment.topup-alert.description',
          translateOptions: {
            eve: this.paymentChannelForm.topUp
          }
        },
        '_dappprofile.payment.topup-alert.cancel',
        '_dappprofile.payment.topup-alert.submit',
      );
    } catch (ex) {
      return;
    }

    this.runPaymentQueue({
      type: 'topUp',
      eve: this.paymentChannelForm.topUp,
      channel: this.activeChannel,
    });

    // reset input
    this.paymentChannelForm.topUp = 0;
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


  /**
   * Actives the new chosen tab.
   *
   * @param      {number}  index   index of the tab that should be displayed.
   */
  activateActionTab(index: number) {
    this.actionTab = index;

    this.ref.detectChanges();
    setTimeout(() => this.ref.detectChanges(), 500);
  }

  /**
   * Transform incoming bytes to a displayable version.
   *
   * @param      {number}  bytes     bytes that should be parsed
   * @param      {number}  decimals  amount of decimals, that should be displayed
   * @return     {string}  parsed displayable size
   */
  formatBytes(bytes: number, decimals: number) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024,
      dm = decimals <= 0 ? 0 : decimals || 2,
      sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
      i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  /**
   * Check if a ipfs hash is valid.
   *
   * @param      {string}  hash    the hash that should be checked.
   * @return     {boolean}  true / false
   */
  validIpfsHash(hash: string = '') {
    return hash.length === 46 && hash.indexOf('Qm') === 0;
  }
}
