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
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  DomSanitizer,
  FormBuilder,
  FormControl,
  FormGroup,
  Http,
  NavController,
  OnInit,
  TranslateService,
  Validators,
  ViewChild,
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
  EvanVerificationService,
  EvanCoreService,
  EvanQueue,
  EvanToastService,
  EvanTranslationService,
  QueueId,
} from 'angular-core';

import {
  StripeService,
  Elements,
  Element as StripeElement,
  ElementsOptions
} from "ngx-stripe";

/**************************************************************************************************/

@Component({
  selector: 'evan-profile-detail',
  templateUrl: 'profile.html',
  animations: [
    createOpacityTransition(),
    createTabSlideTransition()
  ]
})

/**
 * Shows the current profile information and provides the possibility to set some configurations
 * for the ui
 */
export class EvanProfileDetailComponent extends AsyncComponent implements AfterViewInit {
  /**
   * balance of the current user
   */
  private balance: number;

  /**
   * current used active account id
   */
  private activeAccount: string;

  /**
   * my loaded profile instance
   */
  private myProfile: any;

  /**
   * show an loading symbol
   */
  private loading: boolean;

  /**
   * check if the balance was loaded before, only show toast message on later refreshs
   */
  private balanceWasLoaded: boolean;

  /**
   * balance of the current user
   */
  private getDomainName: number;

  /**
   * current active shown tabs
   */
  private activeTab: number;

  private activePaymentTab: number = 0;

  /**
   * current receiver address input
   */
  private receiverInput: string;

  /**
   * eve input
   */
  private eve: number = 0;

  /**
   * formular for eve send inputs
   */
  private sendEveForm: any;

  /**
   * Function to unsubscribe from queue results.
   */
  private queueWatcher: Function;

  /**
   * queue id for the send eve queue
   */
  private queueId: any;

  /**
   * is currently the sending eve queue running?
   */
  private sendingEve: boolean;

  /**
   * trigger rerendering of the eve form
   */
  private showSendEveForm: boolean = true;

  /**
   * Current input values.
   */
  private buyEveForm: any = { amount: 0 };

  private payEve: any = {};

  /**
   * User management agent account to check the balance for.
   */
  public agentUrl = 'https://payments-core.evan.network/api';


  elements: Elements;

  card: StripeElement;

  public cardError: string;
  public ibanError: string;
  iban: StripeElement;

  // optional parameters
  elementsOptions: ElementsOptions = {
    locale: 'auto'
  };

  stripePayment: FormGroup;

  /**
   * search input reference for autofocus
   */
  @ViewChild('receiverSelectComp') receiverSelectComp: any;


  @ViewChild('cardElement') cardElement: any;

  @ViewChild('sepaElement') sepaElement: any;
  constructor(
    private _DomSanitizer: DomSanitizer,
    private addressBookService: EvanAddressBookService,
    private alertService: EvanAlertService,
    private bcc: EvanBCCService,
    private verificationService: EvanVerificationService,
    private core: EvanCoreService,
    private formBuilder: FormBuilder,
    private queue: EvanQueue,
    private ref: ChangeDetectorRef,
    private toastService: EvanToastService,
    private translateService: EvanTranslationService,
    private http: Http,
    private stripeService: StripeService
  ) {
    super(ref);
  }

  /**
   * Set initial values and load the profile information
   *
   * @return     {Promise<void>}  resolved when done
   */
  async _ngOnInit() {
    this.loading = true;
    this.ref.detectChanges();

    // setup form validation
    this.sendEveForm = this.formBuilder.group({
      receiver: ['', (input: FormControl) =>
        this.isValidAddress(input.value) ? null : { invalidAddress: true }],
      eve: ['', (input: FormControl) => {
        const value = parseFloat(input.value);

        if (isNaN(value)) {
          return { invalidNumber: true }
        }

        if (value < 0.1) {
          return { minValue: true }
        }

        if (value > this.balance - 0.1) {
          return { maxValue: true }
        }

        return null;
      }]
    });

    // load profile information
    this.activeAccount = this.core.activeAccount();
    this.activeTab = 0;
    this.getDomainName = getDomainName;
    this.myProfile = await this.addressBookService.loadAccount(this.activeAccount);

    // watch for updates
    this.queueId = new QueueId(`profile.${ getDomainName() }`, 'sendEveDispatcher');
    this.queueWatcher = await this.queue.onQueueFinish(
      this.queueId,
      async (reload, results) => {
        // reset the send eve form
        if (reload) {
          await this.core.utils.timeout(0);

          this.eve = 0;
          this.receiverInput = '';
          this.showSendEveForm = false;
          this.ref.detectChanges();
        }

        // reload balance
        this.sendingEve = this.queue.getQueueEntry(this.queueId, true).data.length > 0;
        await this.loadBalance(reload);

        // rerender form
        if (reload) {
          this.showSendEveForm = true;
          this.ref.detectChanges();
        }
      }
    );
    this.loading = false;
    this.ref.detectChanges();
  }


  /**
   * Remove watchers
   */
  _ngOnDestroy() {
    this.queueWatcher();
  }

  /**
   * Actives the new chosen tab.
   *
   * @param      {number}  index   index of the tab that should be displayed.
   */
  activateTab(index: number) {
    this.activeTab = index;

    this.ref.detectChanges();
    setTimeout(() => this.ref.detectChanges(), 500);
  }

  /**
   * Load the balance for the current activeAccount and show an toast message.
   *
   * @param      {boolean}        disabledToast  should the toast be disabled?
   * @return     {Promise<void>}  resolved when done
   */
  async loadBalance(disabledToast?:  boolean) {
    this.balance = await this.core.getBalance(this.activeAccount);

    // only show the toast, when the user clicks explicit on the reload button
    if (this.balanceWasLoaded && !disabledToast) {
      this.toastService.showToast({
        message: '_dappprofile.balance-updated',
        duration: 2000
      });
    }

    this.balanceWasLoaded = true;
    this.ref.detectChanges();
  }

  /**
   * Ask if the user wants realy a logout and then logout the current user.
   *
   * @return     {Promise<void>}  resolved when done
   */
  async logout() {
    try {
      await this.alertService.showSubmitAlert(
        '_dappprofile.logout',
        '_dappprofile.logout-desc',
        '_dappprofile.cancel',
        '_dappprofile.logout',
      );

      this.core.logout();
    } catch (ex) { }
  }

  /**
   * Load the private key from the current valut and copies it into the clipboard.
   *
   * @return     {Promise<void>}  resolved when done
   */
  async copyPrivateKey() {
    try {
      await this.alertService.showSubmitAlert(
        '_dappprofile.export-privatekey',
        '_dappprofile.export-privatekey-desc',
        '_dappprofile.cancel',
        '_dappprofile.export-privatekey-ok',
      );

      // load the current vault, unlock it and export the privatekey
      const vault = await lightwallet.loadUnlockedVault();
      const privateKey = lightwallet.getPrivateKey(vault, this.core.activeAccount());

      this.core.copyString(
        privateKey,
        this.translateService.instant('_dappprofile.privatekey-exported')
      );
    } catch (ex) { }
  }

  /**
   * Load the encryption key from the current valut and copies it into the clipboard.
   *
   * @return     {Promise<void>}  resolved when done
   */
  async copyEncryptionKey() {
    try {
      await this.alertService.showSubmitAlert(
        '_dappprofile.export-encryptionkey',
        '_dappprofile.export-encryptionkey-desc',
        '_dappprofile.cancel',
        '_dappprofile.export-encryptionkey-ok',
      );

      // load the current vault, unlock it and export the encryptionkey
      const vault = await lightwallet.loadUnlockedVault();
      const encryptionKey = await lightwallet.getEncryptionKey();

      this.core.copyString(
        encryptionKey,
        this.translateService.instant('_dappprofile.encryptionkey-exported')
      );
    } catch (ex) { }
  }

  /**
   * Check if the provided address if a valid 0x0000... address.
   *
   * @param      {string}   address  address that should be checked
   * @return     {boolean}  True if valid address, False otherwise
   */
  isValidAddress(address: string) {
    return this.bcc.web3.utils.isAddress(address);
  }

  /**
   * Checks if a form property is touched and invalid.
   *
   * @param      {any}      form       The form that should be analyzed
   * @param      {string}   paramName  name of the form property that should be checked
   * @return     {boolean}  true if touched and invalid, else false
   */
  showError(form: any, paramName: string) {
    if (form && form.controls[paramName]) {
      return form.controls[paramName].invalid &&
        form.controls[paramName].touched;
    }
  }

  /**
   * When enter key is pressed and the form is valid, trigger the sendEve function.
   *
   * @param      {any}     $event  the input key up event
   * @param      {any}     form    the form that should be checked
   */
  sendEveOnEnter($event: any, form: any) {
    if ($event.keyCode === 13 && !form.invalid &&
      this.bcc.web3.utils.isAddress(this.receiverInput)) {
      this.sendEve();

      event.stopPropagation();
      return false;
    }
  }

  /**
   * Ask the user, if he wants to send the current entered eve to the desired address.
   */
  async sendEve() {
    // ask the user to reload the application
    try {
      await this.alertService.showSubmitAlert(
        '_dappprofile.send-eve.title',
        {
          key: '_dappprofile.send-eve.desc',
          translateOptions: {
            eve: this.eve,
            address: this.receiverInput
          }
        },
        '_dappprofile.cancel',
        '_dappprofile.send-eve.ok',
      );
    } catch (ex) {
      return;
    }

    // trigger the send eve dispatcher
    this.sendingEve = true;
    this.queue.addQueueData(
      new QueueId(`profile.${ getDomainName() }`, 'sendEveDispatcher'),
      { eve: this.eve, receiver: this.receiverInput }
    );
    this.ref.detectChanges();
  }

  /**
   * Sign a message for a specific account
   *
   * @param      {string}  msg      message that should be signed
   * @param      {string}  account  account id to sign the message with (default = activeAccount)
   * @return     {string}  signed message signature
   */
  public async signMessage(msg: string, account: string = this.core.activeAccount()): Promise<string> {
    const signer = account.toLowerCase();
    const pk = await this.bcc.executor.signer.accountStore.getPrivateKey(account);

    return this.bcc.web3.eth.accounts.sign(msg, '0x' + pk).signature;
  }
}