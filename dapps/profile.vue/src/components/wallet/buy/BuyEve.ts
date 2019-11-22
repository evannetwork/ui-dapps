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

import Component, { mixins } from 'vue-class-component';
import { EvanComponent } from '@evan.network/ui-vue-core';
import { PaymentService } from '../paymentService';

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

@Component({})
export default class BuyEveComponent extends mixins(EvanComponent) {
  paymentService: PaymentService;

  paymentMethods = [
    { value: 'iban', label: 'SEPA Debit' },
    { value: 'card', label: 'Card' }
  ];

  detailedInputs = [
    { id: 'name', label: '_wallet.name', type: 'text', value: '' },
    { id: 'mail', label: '_wallet.mail', type: 'email', value: '' },
    { id: 'company', label: '_wallet.company', type: 'text', value: '' },
    { id: 'street', label: '_wallet.street', type: 'text', value: '' },
    {
      id: 'postal_code',
      label: '_wallet.postal-code',
      type: 'text',
      value: ''
    },
    { id: 'city', label: '_wallet.city', type: 'text', value: '' },
    { id: 'country', label: '_wallet.country', type: 'text', value: '' },
    { id: 'vat', label: '_wallet.vat', type: 'number', value: '' }
  ];

  step = 0;
  eveAmount: number;
  // selectedMethod is different from stripe element type (sepa_debit vs iban)
  selectedMethod: 'card' | 'sepa_debit';
  stripeElement: any;
  elements: any;
  isLoading = false;

  created() {
    const runtime = (this as any).getRuntime();
    this.paymentService = new PaymentService(runtime);
    this.paymentService.initStripe();
    this.preloadDetails();
  }

  amountChangeHandler(amount) {
    // this.paymentService.createPaymentIntent(amount, customer, Stripe);
  }

  /**
   * Show corresponding stripe element depending on selected payment method
   * @param event Passed event from select input
   */
  methodChangeHandler(event: Event) {
    const input = (<HTMLSelectElement>event.target).value;
    // TODO: any until stripe types properly imported
    let options: any = {
      style: elementStyles
    };

    if (input === 'iban') {
      this.selectedMethod = 'sepa_debit';
      options.supportedCountries = ['SEPA'];
      options.placeholderCountry = 'DE'; // TODO: set to user lang
    } else if (input === 'card') {
      this.selectedMethod = 'card';
    }

    this.elements = this.paymentService.getStripeElements();
    this.stripeElement = this.elements.create(input, options);
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

  preloadDetails() {
    const data = this.$store.state.profileDApp.data;
    
    this.detailedInputs[0].value = '';
    this.detailedInputs[1].value = '';
    this.detailedInputs[2].value = data.accountDetails.accountName || '';
    this.detailedInputs[3].value = data.contact.streetAndNumber || '';
    this.detailedInputs[4].value = data.contact.postalCode || '';
    this.detailedInputs[5].value = data.contact.city || '';
    this.detailedInputs[6].value = data.contact.country || '';
    this.detailedInputs[7].value = data.accountDetails.vat || ''; // TODO doesnt exist yet
  }
}
