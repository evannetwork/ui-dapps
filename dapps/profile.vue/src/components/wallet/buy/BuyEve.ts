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

// Example IBAN: DE89 3704 0044 0532 0130 00

import * as bcc from '@evan.network/api-blockchain-core';
import { agentUrl } from '@evan.network/ui';
import { EvanComponent, EvanForm, EvanFormControl } from '@evan.network/ui-vue-core';

import Component, { mixins } from 'vue-class-component';
import axios from 'axios';

import { PaymentService } from '../paymentService';
import CompanyContactForm from 'components/profile/company/contact/contact';

// TODO: evan style
const elementStyles = {
  base: {
    color: '#32325d',
    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    fontSmoothing: 'antialiased',
    fontSize: '16px',
    '::placeholder': {
      color: '#aab7c4'
    }
  },
  invalid: {
    color: '#fa755a',
    iconColor: '#fa755a'
  }
};

interface PayFormInterface extends EvanForm {
  type: EvanFormControl;
  amount: EvanFormControl;
}

interface ContactFormInterface extends EvanForm {
  name: EvanFormControl;
  mail: EvanFormControl;
  company: EvanFormControl;
  street: EvanFormControl;
  postalCode: EvanFormControl;
  city: EvanFormControl;
  country: EvanFormControl;
  vat: EvanFormControl;
}

interface OptionInterface {
  value: string;
  label: string;
}

@Component({})
export default class BuyEveComponent extends mixins(EvanComponent) {
  /**
   * loading states
   */
  loading = true;
  buying = false;

  /**
   * Current active step (displayed fomular, payForm = 0, contactForm = 1)
   */
  step = 0;
  eveAmount: number;
  // selectedMethod is different from stripe element type (sepa_debit vs iban)
  selectedMethod = '';
  stripeElement: any;
  elements: any;
  isLoading = false;

  /**
   * Formular for retrieving the amount of eve and payment method.
   */
  payForm: PayFormInterface = null;

  /**
   * Formular for retrieving users / companies contact informatione
   */
  contactForm: ContactFormInterface = null;

  /**
   * payment service instance
   */
  paymentService: PaymentService;

  /**
   * Current users runtime.
   */
  runtime: bcc.Runtime;

  /**
   * VAT specific values (timeout for retrieving information, taxValue, ...)
   */
  vatCalcTimeout = null;
  taxValue = 0;
  reverseCharge = false;

  /**
   * Setup formulars and stripe
   */
  created() {
    this.initialize();
  }

  /**
   * Setup formular
   */
  async initialize() {
    this.runtime = (<any>this).getRuntime();

    // setup payment service
    this.paymentService = new PaymentService(this.runtime);
    await this.paymentService.ensureStripe();

    // setup pay formular
    this.payForm = (<PayFormInterface>new EvanForm(this, {
      amount: {
        value: 10,
        validate: function(vueInstance: PayFormInterface) {
          const parsed = parseFloat(this.value);

          if (isNaN(parsed)) {
            return '_profile.wallet.buy-eve.form.amount.error';
          } else {
            if (parsed < 10) {
              return '_profile.wallet.buy-eve.form.amount.error-less';
            } else {
              return true;
            }
          }
        },
        uiSpecs: {
          attr: {
            required: true,
            type: 'number',
          }
        }
      },
      type: {
        value: 'card',
        uiSpecs: {
          type: 'select',
          attr: {
            options: [
              { value: 'iban', label: (this as any).$t('_profile.wallet.buy-eve.payForm.type.iban') },
              { value: 'card', label: (this as any).$t('_profile.wallet.buy-eve.payForm.type.card') },
            ],
            required: true,
          }
        }
      },
    }));

    // setup contact formular and pass profile data
    const data = (this as any).$store.state.profileDApp.data;
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.contactForm = (<ContactFormInterface>new EvanForm(this, {
      name: {
        value: data.accountDetails.accountName || '',
        validate: function(vueInstance: CompanyContactForm) {
          return this.value.length !== 0;
        },
        uiSpecs: {
          attr: {
            required: true,
          }
        }
      },
      mail: {
        value: 'test@test.de',
        validate: function(vueInstance: CompanyContactForm) {
          return emailRegex.test(this.value);
        },
        uiSpecs: {
          attr: {
            required: true,
            type: 'email',
          }
        }
      },
      company: {
        value: data.accountDetails.accountName || '',
        validate: function(vueInstance: CompanyContactForm) {
          return this.value.length !== 0;
        },
        uiSpecs: {
          attr: {
            required: true,
            type: 'email',
          }
        }
      },
      streetAndNumber: {
        value: data.contact.streetAndNumber || '',
        validate: function(vueInstance: CompanyContactForm) {
          return this.value.length !== 0;
        },
        uiSpecs: {
          attr: {
            required: true,
          }
        }
      },
      postalCode: {
        value: data.contact.postalCode || '',
        validate: function(vueInstance: CompanyContactForm, form: ContactFormInterface) {
          // check postcode validity only in germany
          return form.country.value === 'DE' ?
            /^\d{5}$/.test(this.value) :
            true;
        },
        uiSpecs: {
          attr: {
            required: () => this.contactForm.country.value === 'DE',
          }
        }
      },
      city: {
        value: data.contact.city || '',
        validate: function(vueInstance: CompanyContactForm) {
          return this.value.length !== 0;
        },
        uiSpecs: {
          attr: {
            required: true,
          }
        }
      },
      country: {
        value: data.contact.country || 'DE',
        validate: function(vueInstance: CompanyContactForm, form: ContactFormInterface) {
          // resubmit postalCode validation
          form.postalCode.value = form.postalCode.value;
          // resubmit vat calculation
          form.vat.value = form.vat.value;
          return this.value && this.value.length !== 0;
        },
        uiSpecs: {
          type: 'countries',
          attr: {
            required: true,
          }
        }
      },
      vat: {
        value: 'ATU43666001',
        validate: function(vueInstance: CompanyContactForm) {
          return vueInstance.validateVat(this.value,
            vueInstance.contactForm ? vueInstance.contactForm.country.value : null);
        },
        uiSpecs: {
          attr: {
            required: true,
          }
        }
      },
    }));

    this.loading = false;
  }

  /**
   * Show corresponding stripe element depending on selected payment method
   * @param event Passed event from select input
   */
  methodChangeHandler(event: Event) {
    this.selectedMethod = (<HTMLSelectElement>event.target).value;
    // TODO: any until stripe types properly imported
    let options: any = {
      style: elementStyles
    };

    if (this.selectedMethod === 'iban') {
      options.supportedCountries = ['SEPA'];
      options.placeholderCountry = 'DE'; // TODO: set to user lang
    }

    this.elements = this.paymentService.getStripeElements();
    this.stripeElement = this.elements.create(this.selectedMethod, options);
    // clear old childs if needed
    document.getElementById('stripeElement').innerHTML = '';
    // insert new childs
    this.stripeElement.mount('#stripeElement');

    console.log(this.selectedMethod);
  }

  async buyEve() {
    this.isLoading = true;
    const customer = this.paymentService.getCustomer({
      name: 'karl',
      email: 'adlerkarl@gmail.com'
      // company: 'evan',
      // street: 'Test street',
      // city: 'test city',
      // zip: '42424',
      // country: 'de',
      // vat: 'DE145146812'
    });
    await this.paymentService.buyEve(
      customer,
      this.eveAmount.toString(),
      this.stripeElement,
      { type: this.selectedMethod }
    );
    this.isLoading = false;
  }

  /**
   * Check if a vat number is valid
   *
   * @param      {string}  vat      vat number to check
   * @param      {string}  country  current select country
   */
  async validateVat(vat: string, country: string): Promise<boolean> {
    // allow empty vat in germany
    if (country === 'DE' && !vat) {
      this.taxValue = 19;
      return true;
    }

    // request server
    if (vat) {
      return new Promise(resolve => {
        this.vatCalcTimeout && clearTimeout(this.vatCalcTimeout);
        this.vatCalcTimeout = setTimeout(async () => {
          const { data: { result: { error, reverseCharge, tax, } } } = await axios({
            method: 'GET',
            url: `${ agentUrl }/api/smart-agents/payment-processor/checkVat?` + 
              `vat=${ vat }&country=${ country }`
          });

          // update taxValue
          this.taxValue = tax || 0;
          // needs reverse charge to be displayed?
          this.reverseCharge = reverseCharge;
          // clear timeout
          delete this.vatCalcTimeout;
          // resolve the error
          if (error) {
            resolve(`_profile.company.contact.vat.${ error }`);
          } else {
            resolve(true);
          }
        }, 500);
      });
    }
  }
}
