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

// vue imports
import Component, { mixins } from 'vue-class-component';

// evan.network imports
import { EvanComponent } from '@evan.network/ui-vue-core';

import { PaymentServiceV3 } from './paymentv3.service';

/// <reference path="stripe/stripe.d.ts" /> // TODO ?

declare var Stripe: any;

@Component({})
export default class WalletComponent extends mixins(EvanComponent) {
  payment_providers = [
    { value: 'sepa', label: 'SEPA Debit' },
    { value: 'card', label: 'Card' },
    { value: 'iban', label: 'IBAN' }
  ];

  paymentService;

  // stripe = Stripe(`pk_test_TYooMQauvdEDq54NiTphI7jx`);
  // elements = this.stripe.elements();
  // card = undefined;

  private elementStyles = {
    // TODO: evan styles
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

  created() {
    const runtime = (this as any).getRuntime();

    // Stripe.setPublishableKey('pk_test_TYooMQauvdEDq54NiTphI7jx');
    // // const stripe = Stripe();

    // console.log(Stripe);

    this.paymentService = new PaymentServiceV3(runtime);
    // this.paymentService.initStripe('pk_test_kpO3T5fXA7aaftg9D0OO0w3S');
  }

  amountChangeHandler(amount) {
    // this.paymentService.createPaymentIntent(amount, customer, Stripe);
  }

  methodChangeHandler(event: Event) {
    // this.card = this.elements.create((<HTMLSelectElement>event.target).value, {
    //   style: this.elementStyles
    // });
    // this.card.mount('#card');
  }

  async buyEve() {
    // let token = await this.stripe.createToken(this.card);
    const customer = this.paymentService.getCustomer({
      name: 'karl',
      email: 'adlerkarl@gmail.com',
      company: 'evan',
      street: 'Test street',
      city:  'test city',
      zip: '42424',
      country: 'de',
      vat: '4242424242424242'
    });
    const intent = this.paymentService.createPaymentIntent('10', customer)

    console.log(intent);

    // this.paymentService.pay(customer, 20);
  }
}
