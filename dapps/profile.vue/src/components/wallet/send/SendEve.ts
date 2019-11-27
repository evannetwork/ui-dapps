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
import * as dappBrowser from '@evan.network/ui-dapp-browser';
import * as bcc from '@evan.network/api-blockchain-core';
import { bccUtils } from '@evan.network/ui';
import { EvanComponent, EvanForm, EvanFormControl } from '@evan.network/ui-vue-core';

import { sendEveDispatcher } from '../../../dispatchers/registry';


interface SendEveFormInterface extends EvanForm {
  accountId: EvanFormControl;
  amount: EvanFormControl;
}

@Component({})
export default class SendEveComponent extends mixins(EvanComponent) {
  /**
   * current window width
   */
  windowWidth = 0;

  /**
   * loading states
   */
  loading = true;
  sending = false;

  /**
   * Formular instance for getting account id and eve amount to send.
   */
  form: SendEveFormInterface = null;

  /**
   * Currents users amount of eves (max. to send).
   */
  currBalance: number = 0;

  /**
   * List of accounts and it's names, that can be selected by the user.
   */
  accountOptions: Array<{label, value}> = null;

  /**
   * Watch for dispatcher updates
   */
  listeners: Array<any> = [];

  /**
   * Current users runtime.
   */
  runtime: bcc.Runtime;

  /**
   * Clear dispatcher listeners
   */
  beforeDestroy() {
    window.removeEventListener('resize', this.handleWindowResize);
    this.listeners.forEach(listener => listener());
    // ensure side-panel to be closed
    (this as any).$store.state.uiState.swipePanel = '';
  }

  /**
   * Bind listeners and setup data / form.
   */
  async created() {
    this.runtime = (<any>this).getRuntime();

    window.addEventListener('resize', this.handleWindowResize);
    this.handleWindowResize();

    // setup dispatcher watchers
    this.listeners.push(sendEveDispatcher.watch(async ($event: any) => {
      // check if any dispatcher instance is running
      this.$nextTick(async () => {
        const instances = await sendEveDispatcher.getInstances(this.runtime);
        this.sending = instances.length !== 0;
      })

      // if dispatcher was finished, reload data and reset formular
      if ($event.detail.status === 'finished' || $event.detail.status === 'deleted') {
        await this.initialize();
      }
    }));

    // setup all!
    this.initialize();
  }

  /**
   * Load currents users addressbook, balance and setup eve send formular.
   */
  async initialize() {
    this.loading = true;

    // load addressbook and prepare account id selection
    const addressbook = await this.runtime.profile.getAddressBook();
    this.accountOptions = await Promise.all(
      Object.keys(addressbook.profile).map(async (address: string) => {
        // ignore cryptoInfo
        if (this.runtime.web3.utils.isAddress(address)) {
          const profile = new bcc.Profile({
            accountId: this.runtime.activeAccount,
            profileOwner: address,
            ...this.runtime,
          } as any);

          return {
            label: await bccUtils.getUserAlias(profile),
            value: address,
          }
        }
      })
    );

    // filter empty options
    this.accountOptions = this.accountOptions.filter(option => !!option);

    // setup currents users balance and define the gas fee to send eve
    const gasFee = 0.001;
    this.currBalance = await dappBrowser.core.getBalance(this.runtime.activeAccount);

    // setup formular
    const web3 = this.runtime.web3;
    this.form = (<SendEveFormInterface>new EvanForm(this, {
      accountId: {
        value: '',
        validate: function(vueInstance: SendEveComponent, form: SendEveFormInterface) {
          return web3.utils.isAddress(this.value);
        },
        uiSpecs: {
          type: 'v-select',
          attr: {
            options: this.accountOptions,
            required: true,
          }
        }
      },
      amount: {
        value: 1,
        validate: function(vueInstance: SendEveComponent) {
          const parsed = parseFloat(this.value);

          if (isNaN(parsed)) {
            return '_profile.wallet.send-eve.form.amount.error';
          } else {
            if ((parsed + gasFee) < vueInstance.currBalance) {
              return true;
            } else {
              return (vueInstance as any).$t('_profile.wallet.send-eve.form.amount.error-less', {
                balance: vueInstance.getReadableBalance(vueInstance.currBalance),
              });
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
    }));

    this.loading = false;
  }

  /**
   * Searches for a user name within the account options.
   *
   * @param      {string}  accountId  account id for that the name should be retrieved
   */
  getUserNameWithAddress(accountId: string) {
    const found = this.accountOptions.filter(option => option.value === accountId)[0];
    return found ? `${ found.label } (${ accountId })` : accountId; 
  }

  /**
   * Takes a amount of eve and parse them to be readable.
   *
   * @param      {number}  amount  amount of eve
   */
  getReadableBalance(amount: number) {
    // load balance and parse it to 3 decimal places
    amount = Math.floor(amount * 100) / 100;
    return (amount.toFixed(2) as any).toLocaleString((this as any).$i18n.locale());
  }

  /**
   * Starts the send eve dispatcher.
   */
  sendEve() {
    sendEveDispatcher.start(this.runtime, (this as any).form.getFormData());
  }

  /**
   * Handle side panel opened state on wide screens
   */
  handleWindowResize() {
    this.windowWidth = window.innerWidth;
    if (this.windowWidth >= 1200) {
      (<any>this).$store.state.uiState.swipePanel = 'sharing';
    }
  }
}
