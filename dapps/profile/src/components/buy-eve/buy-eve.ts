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
  public isoCountries = [{"Code": "AF", "Name": "Afghanistan"},{"Code": "AX", "Name": "\u00c5land Islands"},{"Code": "AL", "Name": "Albania"},{"Code": "DZ", "Name": "Algeria"},{"Code": "AS", "Name": "American Samoa"},{"Code": "AD", "Name": "Andorra"},{"Code": "AO", "Name": "Angola"},{"Code": "AI", "Name": "Anguilla"},{"Code": "AQ", "Name": "Antarctica"},{"Code": "AG", "Name": "Antigua and Barbuda"},{"Code": "AR", "Name": "Argentina"},{"Code": "AM", "Name": "Armenia"},{"Code": "AW", "Name": "Aruba"},{"Code": "AU", "Name": "Australia"},{"Code": "AT", "Name": "Austria"},{"Code": "AZ", "Name": "Azerbaijan"},{"Code": "BS", "Name": "Bahamas"},{"Code": "BH", "Name": "Bahrain"},{"Code": "BD", "Name": "Bangladesh"},{"Code": "BB", "Name": "Barbados"},{"Code": "BY", "Name": "Belarus"},{"Code": "BE", "Name": "Belgium"},{"Code": "BZ", "Name": "Belize"},{"Code": "BJ", "Name": "Benin"},{"Code": "BM", "Name": "Bermuda"},{"Code": "BT", "Name": "Bhutan"},{"Code": "BO", "Name": "Bolivia, Plurinational State of"},{"Code": "BQ", "Name": "Bonaire, Sint Eustatius and Saba"},{"Code": "BA", "Name": "Bosnia and Herzegovina"},{"Code": "BW", "Name": "Botswana"},{"Code": "BV", "Name": "Bouvet Island"},{"Code": "BR", "Name": "Brazil"},{"Code": "IO", "Name": "British Indian Ocean Territory"},{"Code": "BN", "Name": "Brunei Darussalam"},{"Code": "BG", "Name": "Bulgaria"},{"Code": "BF", "Name": "Burkina Faso"},{"Code": "BI", "Name": "Burundi"},{"Code": "KH", "Name": "Cambodia"},{"Code": "CM", "Name": "Cameroon"},{"Code": "CA", "Name": "Canada"},{"Code": "CV", "Name": "Cape Verde"},{"Code": "KY", "Name": "Cayman Islands"},{"Code": "CF", "Name": "Central African Republic"},{"Code": "TD", "Name": "Chad"},{"Code": "CL", "Name": "Chile"},{"Code": "CN", "Name": "China"},{"Code": "CX", "Name": "Christmas Island"},{"Code": "CC", "Name": "Cocos (Keeling) Islands"},{"Code": "CO", "Name": "Colombia"},{"Code": "KM", "Name": "Comoros"},{"Code": "CG", "Name": "Congo"},{"Code": "CD", "Name": "Congo, the Democratic Republic of the"},{"Code": "CK", "Name": "Cook Islands"},{"Code": "CR", "Name": "Costa Rica"},{"Code": "CI", "Name": "C\u00f4te d'Ivoire"},{"Code": "HR", "Name": "Croatia"},{"Code": "CU", "Name": "Cuba"},{"Code": "CW", "Name": "Cura\u00e7ao"},{"Code": "CY", "Name": "Cyprus"},{"Code": "CZ", "Name": "Czech Republic"},{"Code": "DK", "Name": "Denmark"},{"Code": "DJ", "Name": "Djibouti"},{"Code": "DM", "Name": "Dominica"},{"Code": "DO", "Name": "Dominican Republic"},{"Code": "EC", "Name": "Ecuador"},{"Code": "EG", "Name": "Egypt"},{"Code": "SV", "Name": "El Salvador"},{"Code": "GQ", "Name": "Equatorial Guinea"},{"Code": "ER", "Name": "Eritrea"},{"Code": "EE", "Name": "Estonia"},{"Code": "ET", "Name": "Ethiopia"},{"Code": "FK", "Name": "Falkland Islands (Malvinas)"},{"Code": "FO", "Name": "Faroe Islands"},{"Code": "FJ", "Name": "Fiji"},{"Code": "FI", "Name": "Finland"},{"Code": "FR", "Name": "France"},{"Code": "GF", "Name": "French Guiana"},{"Code": "PF", "Name": "French Polynesia"},{"Code": "TF", "Name": "French Southern Territories"},{"Code": "GA", "Name": "Gabon"},{"Code": "GM", "Name": "Gambia"},{"Code": "GE", "Name": "Georgia"},{"Code": "DE", "Name": "Germany"},{"Code": "GH", "Name": "Ghana"},{"Code": "GI", "Name": "Gibraltar"},{"Code": "GR", "Name": "Greece"},{"Code": "GL", "Name": "Greenland"},{"Code": "GD", "Name": "Grenada"},{"Code": "GP", "Name": "Guadeloupe"},{"Code": "GU", "Name": "Guam"},{"Code": "GT", "Name": "Guatemala"},{"Code": "GG", "Name": "Guernsey"},{"Code": "GN", "Name": "Guinea"},{"Code": "GW", "Name": "Guinea-Bissau"},{"Code": "GY", "Name": "Guyana"},{"Code": "HT", "Name": "Haiti"},{"Code": "HM", "Name": "Heard Island and McDonald Islands"},{"Code": "VA", "Name": "Holy See (Vatican City State)"},{"Code": "HN", "Name": "Honduras"},{"Code": "HK", "Name": "Hong Kong"},{"Code": "HU", "Name": "Hungary"},{"Code": "IS", "Name": "Iceland"},{"Code": "IN", "Name": "India"},{"Code": "ID", "Name": "Indonesia"},{"Code": "IR", "Name": "Iran, Islamic Republic of"},{"Code": "IQ", "Name": "Iraq"},{"Code": "IE", "Name": "Ireland"},{"Code": "IM", "Name": "Isle of Man"},{"Code": "IL", "Name": "Israel"},{"Code": "IT", "Name": "Italy"},{"Code": "JM", "Name": "Jamaica"},{"Code": "JP", "Name": "Japan"},{"Code": "JE", "Name": "Jersey"},{"Code": "JO", "Name": "Jordan"},{"Code": "KZ", "Name": "Kazakhstan"},{"Code": "KE", "Name": "Kenya"},{"Code": "KI", "Name": "Kiribati"},{"Code": "KP", "Name": "Korea, Democratic People's Republic of"},{"Code": "KR", "Name": "Korea, Republic of"},{"Code": "KW", "Name": "Kuwait"},{"Code": "KG", "Name": "Kyrgyzstan"},{"Code": "LA", "Name": "Lao People's Democratic Republic"},{"Code": "LV", "Name": "Latvia"},{"Code": "LB", "Name": "Lebanon"},{"Code": "LS", "Name": "Lesotho"},{"Code": "LR", "Name": "Liberia"},{"Code": "LY", "Name": "Libya"},{"Code": "LI", "Name": "Liechtenstein"},{"Code": "LT", "Name": "Lithuania"},{"Code": "LU", "Name": "Luxembourg"},{"Code": "MO", "Name": "Macao"},{"Code": "MK", "Name": "Macedonia, the Former Yugoslav Republic of"},{"Code": "MG", "Name": "Madagascar"},{"Code": "MW", "Name": "Malawi"},{"Code": "MY", "Name": "Malaysia"},{"Code": "MV", "Name": "Maldives"},{"Code": "ML", "Name": "Mali"},{"Code": "MT", "Name": "Malta"},{"Code": "MH", "Name": "Marshall Islands"},{"Code": "MQ", "Name": "Martinique"},{"Code": "MR", "Name": "Mauritania"},{"Code": "MU", "Name": "Mauritius"},{"Code": "YT", "Name": "Mayotte"},{"Code": "MX", "Name": "Mexico"},{"Code": "FM", "Name": "Micronesia, Federated States of"},{"Code": "MD", "Name": "Moldova, Republic of"},{"Code": "MC", "Name": "Monaco"},{"Code": "MN", "Name": "Mongolia"},{"Code": "ME", "Name": "Montenegro"},{"Code": "MS", "Name": "Montserrat"},{"Code": "MA", "Name": "Morocco"},{"Code": "MZ", "Name": "Mozambique"},{"Code": "MM", "Name": "Myanmar"},{"Code": "NA", "Name": "Namibia"},{"Code": "NR", "Name": "Nauru"},{"Code": "NP", "Name": "Nepal"},{"Code": "NL", "Name": "Netherlands"},{"Code": "NC", "Name": "New Caledonia"},{"Code": "NZ", "Name": "New Zealand"},{"Code": "NI", "Name": "Nicaragua"},{"Code": "NE", "Name": "Niger"},{"Code": "NG", "Name": "Nigeria"},{"Code": "NU", "Name": "Niue"},{"Code": "NF", "Name": "Norfolk Island"},{"Code": "MP", "Name": "Northern Mariana Islands"},{"Code": "NO", "Name": "Norway"},{"Code": "OM", "Name": "Oman"},{"Code": "PK", "Name": "Pakistan"},{"Code": "PW", "Name": "Palau"},{"Code": "PS", "Name": "Palestine, State of"},{"Code": "PA", "Name": "Panama"},{"Code": "PG", "Name": "Papua New Guinea"},{"Code": "PY", "Name": "Paraguay"},{"Code": "PE", "Name": "Peru"},{"Code": "PH", "Name": "Philippines"},{"Code": "PN", "Name": "Pitcairn"},{"Code": "PL", "Name": "Poland"},{"Code": "PT", "Name": "Portugal"},{"Code": "PR", "Name": "Puerto Rico"},{"Code": "QA", "Name": "Qatar"},{"Code": "RE", "Name": "R\u00e9union"},{"Code": "RO", "Name": "Romania"},{"Code": "RU", "Name": "Russian Federation"},{"Code": "RW", "Name": "Rwanda"},{"Code": "BL", "Name": "Saint Barth\u00e9lemy"},{"Code": "SH", "Name": "Saint Helena, Ascension and Tristan da Cunha"},{"Code": "KN", "Name": "Saint Kitts and Nevis"},{"Code": "LC", "Name": "Saint Lucia"},{"Code": "MF", "Name": "Saint Martin (French part)"},{"Code": "PM", "Name": "Saint Pierre and Miquelon"},{"Code": "VC", "Name": "Saint Vincent and the Grenadines"},{"Code": "WS", "Name": "Samoa"},{"Code": "SM", "Name": "San Marino"},{"Code": "ST", "Name": "Sao Tome and Principe"},{"Code": "SA", "Name": "Saudi Arabia"},{"Code": "SN", "Name": "Senegal"},{"Code": "RS", "Name": "Serbia"},{"Code": "SC", "Name": "Seychelles"},{"Code": "SL", "Name": "Sierra Leone"},{"Code": "SG", "Name": "Singapore"},{"Code": "SX", "Name": "Sint Maarten (Dutch part)"},{"Code": "SK", "Name": "Slovakia"},{"Code": "SI", "Name": "Slovenia"},{"Code": "SB", "Name": "Solomon Islands"},{"Code": "SO", "Name": "Somalia"},{"Code": "ZA", "Name": "South Africa"},{"Code": "GS", "Name": "South Georgia and the South Sandwich Islands"},{"Code": "SS", "Name": "South Sudan"},{"Code": "ES", "Name": "Spain"},{"Code": "LK", "Name": "Sri Lanka"},{"Code": "SD", "Name": "Sudan"},{"Code": "SR", "Name": "Suriname"},{"Code": "SJ", "Name": "Svalbard and Jan Mayen"},{"Code": "SZ", "Name": "Swaziland"},{"Code": "SE", "Name": "Sweden"},{"Code": "CH", "Name": "Switzerland"},{"Code": "SY", "Name": "Syrian Arab Republic"},{"Code": "TW", "Name": "Taiwan, Province of China"},{"Code": "TJ", "Name": "Tajikistan"},{"Code": "TZ", "Name": "Tanzania, United Republic of"},{"Code": "TH", "Name": "Thailand"},{"Code": "TL", "Name": "Timor-Leste"},{"Code": "TG", "Name": "Togo"},{"Code": "TK", "Name": "Tokelau"},{"Code": "TO", "Name": "Tonga"},{"Code": "TT", "Name": "Trinidad and Tobago"},{"Code": "TN", "Name": "Tunisia"},{"Code": "TR", "Name": "Turkey"},{"Code": "TM", "Name": "Turkmenistan"},{"Code": "TC", "Name": "Turks and Caicos Islands"},{"Code": "TV", "Name": "Tuvalu"},{"Code": "UG", "Name": "Uganda"},{"Code": "UA", "Name": "Ukraine"},{"Code": "AE", "Name": "United Arab Emirates"},{"Code": "GB", "Name": "United Kingdom"},{"Code": "US", "Name": "United States"},{"Code": "UM", "Name": "United States Minor Outlying Islands"},{"Code": "UY", "Name": "Uruguay"},{"Code": "UZ", "Name": "Uzbekistan"},{"Code": "VU", "Name": "Vanuatu"},{"Code": "VE", "Name": "Venezuela, Bolivarian Republic of"},{"Code": "VN", "Name": "Viet Nam"},{"Code": "VG", "Name": "Virgin Islands, British"},{"Code": "VI", "Name": "Virgin Islands, U.S."},{"Code": "WF", "Name": "Wallis and Futuna"},{"Code": "EH", "Name": "Western Sahara"},{"Code": "YE", "Name": "Yemen"},{"Code": "ZM", "Name": "Zambia"},{"Code": "ZW", "Name": "Zimbabwe"}];

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
   * bool value if an error exists
   */
  public ibanError: boolean;

  /**
   * holds error messages for sepa card errors from stripe
   */
  public ibanErrorMessage: string;

  /**
   * stripe optiosn for card or iban elements
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
      vat: ['', [Validators.required]],
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
        // create a new credit card element
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
        // create a new iban element from stripe
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

        // listen on changes to the cards and display possible error messages
        this.card.on('change', (ev) => {
          if (ev.error || ev.empty) {
            this.cardError = true;
            this.cardErrorMessage  = ev.error.message;
          } else {
            this.cardError = false;
            this.cardErrorMessage = '';
          }
          this.ref.detectChanges();
        });
        this.iban.on('change', (ev) => {
          if (ev.error || ev.empty) {
            this.ibanError = true;
            this.ibanErrorMessage  = ev.error.message;
          } else {
            this.ibanError = false;
            this.ibanErrorMessage  = '';
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
          this.paymentResponse = await this.executePayment(source.id, amount, customer, headers)

          this.paymentRunning = false;

          this.ref.detectChanges();
        } else if (result.error) {
          // Error creating the token
          this.paymentResponse = {
            status: 'error',
            code: result.error.message
          }

          this.paymentRunning = false;
          this.ref.detectChanges();
        }
      });
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
    return new Promise(async (resolve, reject) => {
      let requestId;
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

      const resolver = async() => {
        const response = await checkStatus();
        if (response.status === 'new') {
          requestId = response.result;
          setTimeout(async () => {
            await resolver();
          }, 5000)
        }
        if (response.status === 'ongoing') {
          setTimeout(async () => {
            await resolver();
          }, 5000)
        }
        if (response.status === 'success' || response.status === 'error') {
          clearTimeout(timeout);
          resolve(response);
        }
      }

      const timeout = setTimeout(() => {
        reject(new Error(`timeout for payment`))
      }, 1000 * 60 * 10)
      await resolver();
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
