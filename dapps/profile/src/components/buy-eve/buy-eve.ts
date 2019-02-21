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
  selector: 'evan-buy-eve',
  templateUrl: 'buy-eve.html',
  animations: [
    createOpacityTransition(),
    createTabSlideTransition()
  ]
})

/**
 * Shows the current profile information and provides the possibility to set some configurations
 * for the ui
 */
export class EvanBuyEveComponent extends AsyncComponent implements AfterViewInit {
  /**
   * current used active account id
   */
  private activeAccount: string;

  /**
   * show an loading symbol
   */
  private loading: boolean;


  private activePaymentTab: number = 0;

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


  @ViewChild('cardElement') cardElement: any;

  @ViewChild('sepaElement') sepaElement: any;
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
   * Set initial values and load the profile information
   *
   * @return     {Promise<void>}  resolved when done
   */
  async _ngOnInit() {
    this.loading = true;
    this.ref.detectChanges();

    // load profile information
    this.activeAccount = this.core.activeAccount();

    this.stripePayment = this.formBuilder.group({
      name: ['', [Validators.required]],
      street: ['', [Validators.required]],
      city: ['', [Validators.required]],
      zip: ['', [Validators.required]],
      country: ['', [Validators.required, Validators.minLength(2),  Validators.maxLength(2)]],
      vat: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      amount: ['', [Validators.required, Validators.min(1)]],
    });

    this.stripeService.elements(this.elementsOptions)
      .subscribe(elements => {
        this.elements = elements;
        this.card = this.elements.create('card', {
          hidePostalCode: true,
          supportedCountries: ['SEPA'],
          style: {
            base: {
              iconColor: '#FFFFFF',
              color: '#FFFFFF',
              lineHeight: '40px',
              fontWeight: 300,
              fontFamily: '"Open Sans", sans-serif',
              fontSize: '14px',
              '::placeholder': {
                color: '#CFD7E0'
              }
            }
          }
        });
        this.iban = this.elements.create('iban', {
          hidePostalCode: true,
          supportedCountries: ['SEPA'],
          style: {
            base: {
              iconColor: '#FFFFFF',
              color: '#FFFFFF',
              lineHeight: '40px',
              fontWeight: 300,
              fontFamily: '"Open Sans", sans-serif',
              fontSize: '14px',
              '::placeholder': {
                color: '#CFD7E0'
              }
            }
          }
        });
        this.card.on('change', (ev) => {
          if (ev.error) {
            this.cardError = ev.error.message;
          } else {
            this.cardError = '';
          }
          this.ref.detectChanges();
        })
        this.iban.on('change', (ev) => {
          if (ev.error) {
            this.ibanError = ev.error.message;
          } else {
            this.ibanError = '';
          }
          this.ref.detectChanges();
        })
        this.card.mount(this.cardElement.nativeElement);
        this.iban.mount(this.sepaElement.nativeElement);
      });
    this.activatePaymentTab(0)
    this.loading = false;
    this.ref.detectChanges();
  }


  /**
   * Remove watchers
   */
  _ngOnDestroy() {
    this.queueWatcher();
  }


  activatePaymentTab(index: number) {
    this.activePaymentTab = index;

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


  public buy() {
    const name = this.stripePayment.get('name').value;
    const email = this.stripePayment.get('email').value;
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
          usage: 'single_use',
          mandate: {
            // Automatically send a mandate notification email to your customer
            // once the source is charged.
            notification_method: 'email',
          },
        }
      )
      .subscribe(async (result) => {
        if (result.source) {
          const source = result.source;
          const customer = {
            email,
            shipping: {
              name,
              address: {
                city,
                country,
                line1: street,
                postal_code: zip,
              }
            },
            tax_info: {
              tax_id: vat,
              type: 'vat'
            }
          }
          console.log('Payment successful!', source);
          const activeAccount = this.core.activeAccount();
          const toSignedMessage = this.bcc.web3.utils
            .soliditySha3(new Date().getTime() + activeAccount)
            .replace('0x', '');
          const hexMessage = this.bcc.web3.utils.utf8ToHex(toSignedMessage);
          const signature = await this.signMessage(toSignedMessage, activeAccount);
          const headers = {
            authorization: [
              `EvanAuth ${ activeAccount }`,
              `EvanMessage ${ hexMessage }`,
              `EvanSignedMessage ${ signature }`
            ].join(',')
          };
          this.executePayment(source.id, amount, customer, headers)

          // Use the token to create a charge or a customer
          // https://stripe.com/docs/charges
          console.log(result.source);
        } else if (result.error) {
          // Error creating the token
          console.log(result.error.message);
        }
      });
  }

  public async executePayment(id, amount, customer, headers = {}) {
    return new Promise(async (resolve, reject) => {

      const checkStatus = async() => {
        return (await this.http
          .post(
            `${ this.agentUrl }/smart-agents/payment-processor/executePayment`,
            {
              token: id,
              amount: amount,
              customer: customer
            },
            {
              headers,
            }
          )
          .toPromise()
        ).json();
      }

      await checkStatus();
    })
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