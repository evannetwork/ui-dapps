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
import { Watch } from 'vue-property-decorator';

import { PaymentService } from '../paymentService';
import { ErrorStatus } from '../interfaces';
import { STRIPE_ELEMENT_CONFIG } from '../stripe-config';
import { StatusResponse } from '../StatusResponse.interface';

interface PayFormInterface extends EvanForm {
  type: EvanFormControl;
  amount: EvanFormControl;
}

interface ContactFormInterface extends EvanForm {
  name: EvanFormControl;
  email: EvanFormControl;
  company: EvanFormControl;
  streetAndNumber: EvanFormControl;
  postalCode: EvanFormControl;
  city: EvanFormControl;
  country: EvanFormControl;
  vat: EvanFormControl;
}

interface OptionInterface {
  value: string;
  label: string;
}

const GERMAN_VAT = 19;

@Component({})
export default class BuyEveComponent extends mixins(EvanComponent) {
  /**
   * current window width
   */
  windowWidth = 0;

  /**
   * loading states
   */
  loading = true;

  buying = false;

  /**
   * Current active step (displayed form, pay-form = 0, contact-form = 1)
   */
  step = 0;

  /**
   * Form for retrieving the amount of eve and payment method.
   */
  payForm: PayFormInterface = null;

  /**
   * Form for retrieving users / companies contact information
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
  vatCalcTimeout = 1;

  taxValue = 0;

  reverseCharge = false;

  /**
   * Current stripe element
   */
  stripe = {
    complete: false,
    element: null,
    error: null,
    payError: '',
    success: false,
  };

  @Watch('contactForm.country.value')
  onCountryChange(country: string): void {
    // change tax value depends on country select
    if (country === 'DE') {
      this.taxValue = GERMAN_VAT;
    }
  }

  /**
   * Watch for dispatcher updates
   */
  listeners: Array<any> = [];

  /**
   * check if object is of type ErrorStatus or StatusResponse
   *
   * @param {ErrorStatus | StatusResponse} object
   */
  static isErrorStatus(object: ErrorStatus | StatusResponse): object is ErrorStatus {
    return (object as ErrorStatus).code !== undefined;
  }

  /**
   * computed property for the swipe panel title.
   */
  get panelTitle(): string {
    if (this.buying) {
      return this.$t('_profile.wallet.buy-eve.titles.processing');
    }

    if (this.step === 0) {
      return this.$t('_profile.wallet.buy-eve.titles.buy-eve');
    }

    if (this.stripe.success === true) {
      return this.$t('_profile.wallet.buy-eve.titles.finished');
    }

    return this.$t('_profile.wallet.buy-eve.titles.billing-info');
  }

  /**
   * Clear dispatcher listeners
   */
  beforeDestroy(): void {
    window.removeEventListener('resize', this.handleWindowResize);
    this.listeners.forEach((listener) => listener());
    // ensure side-panel to be closed
    this.$store.state.uiState.swipePanel = '';
  }

  /**
   * Setup forms and stripe
   */
  created(): void {
    this.initialize();

    window.addEventListener('resize', this.handleWindowResize);
    this.handleWindowResize();
  }

  /**
   * Setup Form
   */
  async initialize(): Promise<void> {
    this.loading = true;
    this.runtime = this.getRuntime();

    // reset previous values
    this.step = 0;
    this.stripe.complete = null;
    this.stripe.element = null;
    this.stripe.error = null;
    this.stripe.payError = null;
    this.stripe.success = null;

    // setup forms
    this.setupForms();

    // setup payment service
    this.paymentService = new PaymentService(this.runtime);
    await this.paymentService.ensureStripe();

    this.loading = false;
    // render stripe element for initial payment type
    this.$nextTick(() => this.renderStripeElement());
  }

  /**
   * Set the forms for the buy eve process.
   */
  setupForms() {
    // setup pay form
    this.payForm = (new EvanForm(this, {
      amount: {
        value: 10,
        validate(): boolean|string {
          const parsed = parseFloat(this.value);

          if (Number.isNaN(parsed)) {
            return '_profile.wallet.buy-eve.form.amount.error';
          }
          if (parsed < 10) {
            return '_profile.wallet.buy-eve.form.amount.error-less';
          }
          return true;
        },
        uiSpecs: {
          attr: {
            required: true,
            type: 'number',
          },
        },
      },
      type: {
        value: 'card',
        validate(vueInstance: BuyEveComponent): boolean {
          if (vueInstance.payForm) {
            vueInstance.renderStripeElement();
          }

          // invalidate stripe content
          vueInstance.stripe.error = null; // eslint-disable-line no-param-reassign
          vueInstance.stripe.complete = false; //  eslint-disable-line no-param-reassign

          return true;
        },
        uiSpecs: {
          type: 'select',
          attr: {
            options: [
              { value: 'iban', label: this.$t('_profile.wallet.buy-eve.payForm.type.iban') },
              { value: 'card', label: this.$t('_profile.wallet.buy-eve.payForm.type.card') },
            ],
            required: true,
          },
        },
      },
    })) as PayFormInterface;

    // setup contact Form and pass profile data
    const data = this.getProfileData();
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.contactForm = (new EvanForm(this, {
      name: {
        value: data.accountDetails.accountName || '',
        validate(vueInstance: BuyEveComponent) {
          return this.value.length !== 0;
        },
        uiSpecs: {
          attr: {
            required: true,
          },
        },
      },
      email: {
        value: '',
        validate(vueInstance: BuyEveComponent) {
          return emailRegex.test(this.value);
        },
        uiSpecs: {
          attr: {
            required: true,
            type: 'email',
          },
        },
      },
      company: {
        value: data.accountDetails.accountName || '',
        uiSpecs: {
          attr: {
            required: false,
            type: 'email',
          },
        },
      },
      streetAndNumber: {
        value: data.contact.streetAndNumber || '',
        validate(vueInstance: BuyEveComponent) {
          return this.value.length !== 0;
        },
        uiSpecs: {
          attr: {
            required: true,
          },
        },
      },
      postalCode: {
        value: data.contact.postalCode || '',
        validate(vueInstance: BuyEveComponent, form: ContactFormInterface) {
          // check postcode validity only in germany
          return form.country.value === 'DE'
            ? /^\d{5}$/.test(this.value)
            : true;
        },
        uiSpecs: {
          attr: {
            required: () => this.contactForm.country.value === 'DE',
          },
        },
      },
      city: {
        value: data.contact.city || '',
        validate(vueInstance: BuyEveComponent) {
          return this.value.length !== 0;
        },
        uiSpecs: {
          attr: {
            required: true,
          },
        },
      },
      country: {
        value: data.contact.country || 'DE',
        validate(vueInstance: BuyEveComponent, form: ContactFormInterface) {
          /* TODO: validate if self assignation is necessary here.
             resubmit postalCode validation */
          form.postalCode.value = form.postalCode.value; // eslint-disable-line no-self-assign, no-param-reassign
          // resubmit vat calculation
          form.vat.value = form.vat.value; // eslint-disable-line no-self-assign, no-param-reassign
          return this.value && this.value.length !== 0;
        },
        uiSpecs: {
          type: 'countries',
          attr: {
            required: true,
          },
        },
      },
      vat: {
        value: '',
        validate(vueInstance: BuyEveComponent) {
          return vueInstance.validateVat(this.value,
            vueInstance.contactForm ? vueInstance.contactForm.country.value : null);
        },
        uiSpecs: {
          attr: {
            required: () => this.contactForm.country.value !== 'DE',
          },
        },
      },
    })) as ContactFormInterface;

    // check initial vat
    this.contactForm.vat.value = this.contactForm.vat.value; // eslint-disable-line no-self-assign, no-param-reassign
  }

  private getProfileData() {
    const defaultProfile = {
      accountDetails: {
        accountName: '',
      },
      contact: {
        streetAndNumber: '',
        postalCode: '',
        city: '',
        country: 'DE',
      },
    };

    return Object.assign(defaultProfile, this.$store.state.profileDApp.data);
  }

  /**
   * Renders the stripe element for the current payment method
   *
   * @param      {Event}  event   Passed event from select input
   */
  renderStripeElement(): void {
    if (document.getElementById('stripeElement') && !this.loading) {
      const options: any = {
        hidePostalCode: true,
        style: STRIPE_ELEMENT_CONFIG,
      };

      if (this.payForm.type.value === 'iban') {
        options.supportedCountries = ['SEPA'];
        options.placeholderCountry = this.$i18n.locale().toUpperCase();
      }

      const elements = this.paymentService.getStripeElements(this.$i18n.locale());
      this.stripe.element = elements.create(this.payForm.type.value, options);
      // clear old childs if needed
      document.getElementById('stripeElement').innerHTML = '';
      // insert new childs
      this.stripe.element.mount('#stripeElement');
      // check if current values are correct
      this.stripe.element.on('change', ($event) => {
        this.stripe.complete = $event.complete;
        this.stripe.error = $event.error;
      });
    }
  }

  /**
   * Trigger payment service to buy eve
   *
   * Set `this.buying` after the process has started, so stripe can retrieve the mounted element.
   * Setting `this.buying` to `true`, removes the element from the DOM.
   */
  async buyEve(): Promise<void> {
    this.$nextTick(() => { this.buying = true; });

    const customer = PaymentService.getCustomer({
      name: this.contactForm.name.value,
      email: this.contactForm.email.value,
      company: this.contactForm.company.value,
      street: this.contactForm.streetAndNumber.value,
      city: this.contactForm.city.value,
      zip: this.contactForm.postalCode.value,
      country: this.contactForm.country.value.toLowerCase(),
      vat: this.contactForm.vat.value,
    });

    const result = await this.paymentService.buyEve(
      customer,
      // prevent 1e2 values that breaks the server
      parseFloat(this.payForm.amount.value).toString(),
      this.stripe.element,
      { type: this.payForm.type.value === 'iban' ? 'sepa_debit' : 'card' },
    );

    if (BuyEveComponent.isErrorStatus(result)) {
      this.stripe.payError = result.code;
    } else {
      this.stripe.payError = '';
      this.stripe.success = true;

      // send event, so e.g. the transactions overview can reload
      window.dispatchEvent(new CustomEvent('evan-credit-recharge'));
    }

    this.buying = false;
  }

  /**
   * Check if a vat number is valid
   *
   * @param      {string}  vat      vat number to check
   * @param      {string}  country  current select country
   */
  async validateVat(vat: string, country: string): Promise<boolean|string> { // eslint-disable-line consistent-return
    this.vatCalcTimeout && clearTimeout(this.vatCalcTimeout); // eslint-disable-line no-unused-expressions

    // allow empty vat in germany
    if (country === 'DE' && !vat) {
      this.vatCalcTimeout = null;
      return true;
    }

    // request server
    if (vat) {
      return new Promise((resolve) => {
        this.vatCalcTimeout = window.setTimeout(async () => {
          try {
            const { data: { result: { error, reverseCharge, tax } } } = await axios({
              method: 'GET',
              url: `${agentUrl}/api/smart-agents/payment-processor/checkVat`,
              params: {
                vat,
                country,
              },
            });

            // update taxValue
            this.taxValue = tax !== undefined ? tax : GERMAN_VAT;
            // needs reverse charge to be displayed?
            this.reverseCharge = reverseCharge;
            // clear timeout
            clearTimeout(this.vatCalcTimeout);
            this.vatCalcTimeout = null;
            // resolve the error
            if (error) {
              resolve(`_profile.company.contact.vat.${error}`);
            } else {
              resolve(true);
            }
          } catch (e) {
            clearTimeout(this.vatCalcTimeout);
            this.vatCalcTimeout = null;
            resolve('_profile.company.contact.vat.error');
          }
        }, 500);
      });
    }
    this.taxValue = GERMAN_VAT;
    this.vatCalcTimeout = null;
  }

  /**
   * Handle side panel opened state on wide screens
   */
  handleWindowResize(): void {
    this.windowWidth = window.innerWidth;
    if (this.windowWidth >= 1400) {
      this.$store.state.uiState.swipePanel = 'sharing';
    }
  }

  /**
   * Resets stripe payment error to show the buy eve Form again.
   */
  removeStripeError(): void {
    this.stripe.payError = '';
    this.buying = false;
  }
}
