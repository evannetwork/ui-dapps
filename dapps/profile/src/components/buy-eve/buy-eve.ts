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

import * as CoreBundle from 'bcc';

import {
  getDomainName,
  lightwallet,
  System
} from '@evan.network/ui-dapp-browser';

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
  EvanQueue,
  EvanToastService,
  EvanTranslationService,
  QueueId,
} from '@evan.network/ui-angular-core';

import {
  StripeService,
  Elements,
  Element as StripeElement,
  ElementsOptions
} from 'ngx-stripe';

/**************************************************************************************************/

@Component({
  selector: 'evan-buy-eve',
  templateUrl: 'buy-eve.html',
  animations: [
    createOpacityTransition(),
    createTabSlideTransition()
  ]
})

/**
 * Buy eves with credit cards component
 *
 * @class      EvanBuyEveComponent (name)
 */
export class EvanBuyEveComponent extends AsyncComponent implements AfterViewInit {
  /**
   * current used active account id
   */
  private activeAccount: string;

  private PAYMENT_TIMEOUT = 1000 * 60 * 10; // 10 minutes
  private PAYMENT_RETRY = 5000; // 5 seconds

  /**
   * show an loading symbol
   */
  public loading: boolean;

  /**
   * current active payment tab id
   */
  private activePaymentTab = 0;

  /**
   * Current input values.
   */
  private buyEveForm: any = { amount: 0 };


  /**
   * holds form inputs for the payment process
   */
  private payEve: any = {
    country: 'DE'
  };

  /**
   * external agent url to send the payment tokens
   */
  public agentUrl = 'https://agents.test.evan.network/api';

  /**
   * holds all ISO country codes
   */
  public isoCountries = [{"Code":"AD","Name":"Andorra"},{"Code":"AT","Name":"Austria"},{"Code":"BE","Name":"Belgium"},{"Code":"BG","Name":"Bulgaria"},{"Code":"HR","Name":"Croatia"},{"Code":"CY","Name":"Cyprus"},{"Code":"CZ","Name":"Czech Republic"},{"Code":"DK","Name":"Denmark"},{"Code":"EE","Name":"Estonia"},{"Code":"FI","Name":"Finland"},{"Code":"FR","Name":"France"},{"Code":"DE","Name":"Germany"},{"Code":"EL","Name":"Greece"},{"Code":"HU","Name":"Hungary"},{"Code":"IE","Name":"Ireland"},{"Code":"IT","Name":"Italy"},{"Code":"LV","Name":"Latvia"},{"Code":"LT","Name":"Lithuania"},{"Code":"LU","Name":"Luxembourg"},{"Code":"MT","Name":"Malta"},{"Code":"NL","Name":"Netherlands"},{"Code":"PL","Name":"Poland"},{"Code":"PT","Name":"Portugal"},{"Code":"RO","Name":"Romania"},{"Code":"SK","Name":"Slovakia"},{"Code":"SI","Name":"Slovenia"},{"Code":"ES","Name":"Spain"},{"Code":"SE","Name":"Sweden"},{"Code":"GB","Name":"United Kingdom"}];

  /**
   * stripe element holder
   */
  elements: Elements;

  /**
   * stripe card element
   */
  card: StripeElement;

  /**
   * stripe iban element
   */
  iban: StripeElement;

  /**
   * bool value if an error exists
   */
  public cardError: boolean;

  /**
   * holds error messages for credit card errors from stripe
   */
  public cardErrorMessage: string;

  /**
   * holds the url to the sepa mandate from stripe if the user paid via sepa debit
   */
  public sepaMandateUrl: string;

  /**
   * bool value if an error exists
   */
  public ibanError: boolean;

  /**
   * holds error messages for sepa card errors from stripe
   */
  public ibanErrorMessage: string;

  /**
   * do we have a valid VAT Number?
   */
  public isValidVat: boolean = true;


  colorTheme: string


  /**
   * stripe options for card or iban elements
   */
  elementsOptions: ElementsOptions = {
    locale: 'auto'
  };

  /**
   * stripe payment formgroup
   */
  stripePayment: FormGroup;

  /**
   * holds the response from the payment agent
   */
  paymentResponse: any;

  /**
   * variable to check if the payment process is currently running
   */
  paymentRunning = false;

  /**
   * element holder for the credit card stripe element
   */
  @ViewChild('cardElement') cardElement: any;

  /**
   * element holder for the sepa card stripe element
   */
  @ViewChild('sepaElement') sepaElement: any;

  /**
   * vat tax rate to apply
   */
  public tax = 19;

  /**
   * error from vat validation on edge server
   */
  public vatError: string;

  /**
   * timeout after key press for edge server vat checks
   */
  private waitingForKeypressTimeout: number;

  constructor(
    private _DomSanitizer: DomSanitizer,
    private bcc: EvanBCCService,
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
   * Set initial values for the payment form
   *
   * @return     {Promise<void>}  resolved when done
   */
  async _ngOnInit() {
  // set the initial loading cricle
    this.loading = true;
    this.colorTheme = window.localStorage ? window.localStorage.getItem('evan-color-theme') : ''

    this.ref.detectChanges();
    // load profile information
    this.activeAccount = this.core.activeAccount();

    // buidl the form validators
    this.stripePayment = this.formBuilder.group({
      name: ['', [Validators.required]],
      company: ['', [Validators.required]],
      street: ['', [Validators.required]],
      city: ['', [Validators.required]],
      zip: ['', [Validators.required, Validators.pattern(`^[0-9]*$`)]],
      country: ['', [Validators.required, Validators.minLength(2),  Validators.maxLength(2), Validators.pattern(`^[A-Z]*$`)]],
      vat: ['', []],
      email: ['', [Validators.required, Validators.email]],
      amount: ['', [Validators.required, Validators.min(10)]],
    });

    // activate the card tab initially
    this.activatePaymentTab(0);

    this.loading = false;
    this.ref.detectChanges();

    // get a new stripe element with the defined options
    this.stripeService.elements(this.elementsOptions)
      .subscribe(elements => {

        // initially mark the form as invalid because no card input is made
        this.ibanError = true;
        this.cardError = true;

        this.elements = elements;

        const style = {
          base: {
            iconColor: this.colorTheme === 'light' ? '#333333' : '#FFFFFF',
            color: this.colorTheme === 'light' ? '#333333' : '#FFFFFF',
            lineHeight: '40px',
            fontWeight: 300,
            fontFamily: '"Open Sans", sans-serif',
            fontSize: '14px',
            '::placeholder': {
              color: this.colorTheme === 'light' ? 'rgba(50,50,50,0.5)' : 'rgba(255,255,255,0.5)'
            }
          }
        }
        // create a new credit card element
        this.card = this.elements.create('card', {
          hidePostalCode: true,
          supportedCountries: ['SEPA'],
          style
        });
        // create a new iban element from stripe
        this.iban = this.elements.create('iban', {
          supportedCountries: ['SEPA'],
          style
        });

        // listen on changes to the cards and display possible error messages
        this.card.on('change', (ev) => {
          if (ev.error || ev.empty) {
            this.cardError = true;
            this.cardErrorMessage = ev.error ? ev.error.message : '';
          } else {
            this.cardError = false;
            this.cardErrorMessage = '';
          }
          this.ref.detectChanges();
        });
        this.iban.on('change', (ev) => {
          if (ev.error || ev.empty) {
            this.ibanError = true;
            this.ibanErrorMessage = ev.error ? ev.error.message : '';
          } else {
            this.ibanError = false;
            this.ibanErrorMessage = '';
          }
          this.ref.detectChanges();
        });

        // mount the card uis to the referenced elements
        this.card.mount(this.cardElement.nativeElement);
        this.iban.mount(this.sepaElement.nativeElement);
      });
  }

  /**
   * activate a given tab id
   *
   * @param      {number}  index   the tab index
   */
  activatePaymentTab(index: number) {
    this.activePaymentTab = index;

    if (this.iban && this.card) {
      this.iban.clear();
      this.card.clear();

      this.cardError = true;
      this.cardErrorMessage  = '';

      this.ibanError = true;
      this.ibanErrorMessage  = '';
    }

    this.ref.detectChanges();
    setTimeout(() => {
      this.ref.detectChanges()
    }, 500);
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
   * Run detectChanges directly and after and timeout again, to update select fields.
   */
  detectTimeout() {
    if(this.stripePayment.get('country').value !== 'DE') {
      this.stripePayment.get('vat').setValidators([Validators.required]);
    } else {
      this.stripePayment.get('vat').setValidators([]);
    }

    this.stripePayment.get('vat').updateValueAndValidity();
    this.ref.detectChanges();

    setTimeout(() => this.ref.detectChanges());
  }

  /**
   * buy eves with defined credit card information
   *
   * @return     {Promise<any>}  resolved when done
   */
  public buy() {
    this.paymentResponse = null;
    this.paymentRunning = true;

    this.ref.detectChanges();

    const name = this.stripePayment.get('name').value;
    const email = this.stripePayment.get('email').value;
    const company = this.stripePayment.get('company').value;
    const street = this.stripePayment.get('street').value;
    const city = this.stripePayment.get('city').value;
    const zip = this.stripePayment.get('zip').value;
    const country = this.stripePayment.get('country').value;
    const vat = this.stripePayment.get('vat').value;
    const amount = this.stripePayment.get('amount').value;

    this.stripeService
      .createSource(this.activePaymentTab === 0 ? this.card : this.iban,
        <any>{
          type: this.activePaymentTab === 0 ? null: 'sepa_debit',
          currency: 'eur',
          owner: {
            name,
            email
          },
          usage: this.activePaymentTab === 0 ? 'single_use' : 'reusable',
          mandate: {
            // Automatically send a mandate notification email to your customer
            // once the source is charged.
            notification_method: 'email',
          },
        }
      )
      .subscribe(async (result) => {
        if (result.source) {
          const tax_info = vat ? {
            tax_id: vat,
            type: 'vat'
          } : undefined;

          const source = result.source;
          const customer = {
            email,
            shipping: {
              name,
              address: {
                city,
                country,
                line1: company,
                line2: street,
                postal_code: zip,
              }
            },
            tax_info
          }
          console.log('Payment initiated!', source);

          const headers = {
            authorization: await CoreBundle.utils.getSmartAgentAuthHeaders(this.bcc.coreRuntime),
          };

          try {
            this.paymentResponse = await this.executePayment(source.id, amount, customer, headers)
          } catch (error) {
            this.paymentResponse = {
              status: 'error',
              code: this.getErrorCode(error.code)
            }
          };

          this.paymentRunning = false;

          if ((<any>source).sepa_debit && (<any>source).sepa_debit.mandate_url) {
            this.sepaMandateUrl = (<any>source).sepa_debit.mandate_url;
          }

          this.ref.detectChanges();
        } else if (result.error) {
          // Error creating the token
          this.paymentResponse = {
            status: 'error',
            code: this.getErrorCode(result.error.message)
          }

          this.paymentRunning = false;
          this.ref.detectChanges();
        }
      });
  }

  getErrorCode(code: string) {
    const translatedCodes = [
      'unknown_state',
      'transaction_failed',
      'charge_failed',
      'invalid_customer',
      'price_not_okay',
      'too_many_accounts',
      'wallet_not_enough_funds'
    ];

    return translatedCodes.indexOf(code) !== -1 ? code : 'unknown_state';
  }

  /**
   * Validate VAT number and update UI.
   *
   * @param vat
   */
  public async validateVat(vat: string) {
    const timeout = 500;
    this.waitingForKeypressTimeout = Date.now();

    setTimeout(async () => {
      if (this.waitingForKeypressTimeout + timeout < Date.now()) {
        const country = this.stripePayment.get('country').value;
        const { result } = (await this.http
          .get(`${ this.agentUrl }/smart-agents/payment-processor/checkVat?country=${country}${vat ? '&vat=' + vat : ''}`)
          .toPromise()
        ).json();

        this.isValidVat = !result.error;
        this.tax = result.tax;
        this.vatError = result.error;

        this.ref.detectChanges();
      }
    }, timeout);
  }

  /**
   * execute a payment incl. polling of the result
   *
   * @param      {string}  id        the token for the payment
   * @param      {number}  amount    the eve amount to buy
   * @param      {object}  customer  the customer object
   * @param      {object}  headers   additional headers to send
   * @return     {promise}  resolved when done
   */
  public async executePayment(id, amount, customer, headers = {}) {
    let intervalTimer = null;
    let requestId = null;

    // Check current payment state against smart agent
    const checkStatus = async() => {
      return (await this.http
        .post(
          `${ this.agentUrl }/smart-agents/payment-processor/executePayment`,
          {
            token: id,
            amount: amount,
            customer: customer,
            requestId
          },
          (<any>{
            headers,
          })
        )
        .toPromise()
      ).json();
    }

    // request every 5 seconds til we got success or error response status
    const getStatus = async () => {
      return new Promise((resolve, reject) => {
        intervalTimer = setInterval( async () => {
          const response = await checkStatus();

          if (response.status === 'new') {
            requestId = response.result;
          }

          if (response.status === 'transferring' || response.status === 'success') {
            clearInterval(intervalTimer);

            resolve(response);
          }
          if (response.status === 'error') {
            clearInterval(intervalTimer);

            reject(response);
          }
        }, this.PAYMENT_RETRY)
      })
    };

    // return the first resolving promise
    return Promise.race([
      getStatus(),
      new Promise((_, reject) =>
          setTimeout(() => {
            clearInterval(intervalTimer);
            reject(new Error('timeout for payment'));
          }, this.PAYMENT_TIMEOUT)
      )
    ]);
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
