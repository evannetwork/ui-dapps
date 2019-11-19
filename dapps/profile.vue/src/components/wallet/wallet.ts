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

import {PaymentServiceV3} from './paymentService';

/// <reference path="stripe/stripe.d.ts" /> // TODO ?

declare var Stripe: any;

@Component({ })
export default class WalletComponent extends mixins(EvanComponent) {
  payment_providers = [
    { value: '1', label: 'SEPA Debit'},
    { value: '2', label: 'Paypal'},
    { value: '3', label: 'Blood'}
  ];

  paymentService;

  async created() {
    // let ckeditor = document.createElement('script');

    // ckeditor.setAttribute('src', 'https://js.stripe.com/v1/');
    // document.head.appendChild(ckeditor);

    const runtime = (this as any).getRuntime();

    Stripe.setPublishableKey('pk_test_TYooMQauvdEDq54NiTphI7jx');
    // const stripe = Stripe();

    console.log(Stripe);

    this.paymentService = new PaymentServiceV3(runtime);

  }

  amountChangeHandler(amount) {
    this.paymentService.createPaymentIntent(amount, customer, Stripe, );
  }

  buyEve() {

    const customer = this.paymentService.getCustomer({
      name: 'karl',
      email: 'adlerkarl@gmail.com',
      company: 'evan',
      street: 'Teststreet',
      city:  'testcity',
      zip: '42424',
      country: 'de',
      vat: '4242424242424242'
    });

    this.paymentService.pay(customer, 20);

  }
}
