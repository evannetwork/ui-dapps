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

import Component, { mixins } from 'vue-class-component';
import { bccHelper } from '@evan.network/ui-session';
import { EvanComponent, EvanForm, EvanFormControl } from '@evan.network/ui-vue-core';
import { Prop } from 'vue-property-decorator';

import { ipfsPaymentDispatcher } from '../../../dispatchers';

interface TopupForm extends EvanForm {
  amount: EvanFormControl;
}

@Component({})
export default class TopUpComponent extends mixins(EvanComponent) {
  /**
   * Current account to show the wallet for
   */
  @Prop() accountId: string = null;

  /**
   * current window width
   */
  windowWidth = 0;

  /**
   * Formular for handling wallet topup
   */
  topupForm: TopupForm = null;

  /**
   * Watch for dispatcher updates
   */
  listeners: Array<any> = [];

  /**
   * Is currently a dispatcher running?
   */
  toppingUp = false;

  /**
   * Show loading symbol
   */
  loading = true;

  /**
   * Clear dispatcher listeners
   */
  beforeDestroy(): void {
    this.listeners.forEach((listener) => listener());

    window.removeEventListener('resize', this.handleWindowResize);
    // ensure side-panel to be closed
    this.$store.state.uiState.swipePanel = '';
  }

  /**
   * Setup forms and stripe
   */
  async created(): Promise<void> {
    await this.initialize();
    window.addEventListener('resize', this.handleWindowResize);
    this.handleWindowResize();

    // setup dispatcher watchers
    this.listeners.push(ipfsPaymentDispatcher.watch(async () => {
      this.toppingUp = !!(await ipfsPaymentDispatcher.getInstances(this.getRuntime())).length;
    }));

    this.loading = false;
  }

  async initialize(): Promise<void> {
    const gasFee = 0.001;
    const currBalance = await bccHelper.getBalance(this.getRuntime().activeAccount);

    this.topupForm = (new EvanForm(this, {
      amount: {
        value: 1,
        validate(vueInstance: TopUpComponent): boolean|string {
          const parsed = parseFloat(this.value);

          if (Number.isNaN(parsed) || parsed <= 0) {
            return '_wallet.send-eve.form.amount.error';
          }
          if ((parsed + gasFee) < currBalance) {
            return true;
          }
          return (vueInstance as any).$t('_wallet.send-eve.form.amount.error-less', {
            balance: vueInstance.getReadableBalance(currBalance),
          });
        },
        uiSpecs: {
          attr: {
            required: true,
            type: 'number',
          },
        },
      },
    })) as TopupForm;
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
   * Takes a amount of eve and parse them to be readable.
   *
   * @param      {number}  amount  amount of eve
   */
  getReadableBalance(amount: number): string {
    // load balance and parse it to 3 decimal places
    return ((Math.floor(amount * 100) / 100).toFixed(2) as any).toLocaleString(this.$i18n.locale());
  }

  /**
   * Add eve to a payment channel.
   */
  topupPaymentChannel(): void {
    ipfsPaymentDispatcher.start(this.getRuntime(), { eve: this.topupForm.amount.value.toString() });
  }
}
