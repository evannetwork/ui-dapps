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
  Http, Response, RequestOptions, Headers       // @angular/http
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
   * holds the payment channel details for the current account
   */
  private paymentDetails: any;


  private agentEndpoint: string;

  private paymentChannelForm: any;
  private paymentChannels: any;

  private toppingUp: boolean;

  private deleting: boolean;

  public toEve: any;

  constructor(
    private _DomSanitizer: DomSanitizer,
    private addressBookService: EvanAddressBookService,
    private alertService: EvanAlertService,
    private bcc: EvanBCCService,
    private claimsService: EvanClaimService,
    private core: EvanCoreService,
    private queue: EvanQueue,
    private ref: ChangeDetectorRef,
    private toastService: EvanToastService,
    private translateService: EvanTranslationService,
    private http: Http
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
    this.paymentChannelForm = {
      topUp: 0
    };
    this.agentEndpoint = `https://payments.evan.network/api/ipfs-payments`;
    this.toEve = this.bcc.web3.utils.fromWei;

    const channelManagerAddress = '0x0A0D9dddEba35Ca0D235A4086086AC704bbc8C2b';
    this.bcc.payments.setChannelManager(channelManagerAddress);
    await this.loadPaymentDetails();
    await this.loadPaymentChannels();
  }

  /**
   * Actives the new chosen tab.
   *
   * @param      {number}  index   index of the tab that should be displayed.
   */
  activateTab(index: number) {
    this.ref.detectChanges();
    setTimeout(() => this.ref.detectChanges(), 500);
  }

  async loadPaymentDetails() {
    const activeAccount = this.core.activeAccount();
    const toSignedMessage = this.bcc.web3.utils.soliditySha3(new Date().getTime() + activeAccount).replace('0x', '');
    const hexMessage = this.bcc.web3.utils.utf8ToHex(toSignedMessage);
    const signature = await this.signMessage(toSignedMessage, activeAccount);
    const headers = {
      authorization: `EvanAuth ${activeAccount},EvanMessage ${hexMessage},EvanSignedMessage ${signature}`
    };
    try {
      const result = await this.http.get(`${this.agentEndpoint}/getStatus`, {headers}).toPromise();
      const jsonResult = result.json();
      jsonResult.monthlyPayments = Math.floor(jsonResult.monthlyPayments).toString();


      this.paymentDetails = jsonResult;
      this.paymentDetails.fundsAvailable = Math.floor(this.paymentDetails.fundsAvailable).toString()
      this.paymentDetails.estimatedFunds = Math.floor(this.paymentDetails.fundsAvailable / this.paymentDetails.monthlyPayments)
      this.paymentDetails.overallSize = Number(this.paymentDetails.monthlyPayments).toFixed(2);

    }
    catch (ex) {
      console.dir(ex);
    }
  }

  async loadPaymentChannels() {
     const activeAccount = this.core.activeAccount();
    const toSignedMessage = this.bcc.web3.utils.soliditySha3(new Date().getTime() + activeAccount).replace('0x', '');
    const hexMessage = this.bcc.web3.utils.utf8ToHex(toSignedMessage);
    const signature = await this.signMessage(toSignedMessage, activeAccount);
    const headers = {
      authorization: `EvanAuth ${activeAccount},EvanMessage ${hexMessage},EvanSignedMessage ${signature}`
    };
    try {
      const result = await this.http.get(`${this.agentEndpoint}/getChannels`, {headers}).toPromise();
      this.paymentChannels = result.json();
    }
    catch (ex) {
      console.dir(ex);
    }
  }

  async createPaymentChannel() {
    const agentAddress = '0xAF176885bD81D5f6C76eeD23fadb1eb0e5Fe1b1F';
    await this.bcc.payments.openChannel(
      this.core.activeAccount(),
      agentAddress,
      this.bcc.web3.utils.toWei(this.paymentChannelForm.value, 'milliether')
    );
    console.dir(this.bcc)
  }

  async topupPaymentChannel(channel) {
    this.toppingUp = true;
    channel.account = this.core.activeAccount();
    channel.proof = {};
    channel.block = channel.openBlockNumber;
    this.bcc.payments.setChannel(channel);
    await this.bcc.payments.topUpChannel(
      this.bcc.web3.utils.toWei(this.paymentChannelForm.topUp, 'milliether')
    );
    this.toppingUp = false;
    await this.loadPaymentDetails();
    await this.loadPaymentChannels();
  }

  async removeHash() {
    this.deleting = true;
    const response = await this.bcc.dfs.remoteNode.pin.rm(this.paymentChannelForm.hash);
    console.dir(response);
    this.deleting = false;
    await this.loadPaymentDetails();
    await this.loadPaymentChannels();
  }

  async signMessage(msg: string, account: string) {
    const signer = account.toLowerCase();
    const pk = await this.bcc.executor.signer.accountStore.getPrivateKey(account);
    return this.bcc.web3.eth.accounts.sign(msg, '0x' + pk).signature;
  }
}
