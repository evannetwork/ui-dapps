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

import * as dappBrowser from '@evan.network/ui-dapp-browser';
import { profileUtils } from '@evan.network/ui';
import { session, bccHelper } from '@evan.network/ui-session';

// vue imports
import Component, { mixins } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import EvanComponent from '../../../component';

@Component
export default class WalletCardComponent extends mixins(EvanComponent) {
  /**
   * Address of the specific account.
   */
  @Prop() address: string;

  /**
   * Directly pass already loaded account details to the component
   */
  @Prop() accountDetails: any;

  /**
   * Directly pass already loaded account details to the component
   */
  @Prop() registration: any;

  /**
   * Applies a specific link to the wallet display
   */
  @Prop() href: any;

  /**
   * Show loading symbol
   */
  loading = true;

  /**
   * Alias of the users address
   */
  alias: string = null;

  /**
   * Currents users eve balances and the timestamp, when the balance was loaded
   */
  balance: { amount: string; timestamp: number } = null;

  /**
   * Original url of the current vue core, so we can access assets via url.
   */
  vueCoreBaseUrl = '';

  /**
   * Link to the openend profile wallet for the passed address
   */
  walletLink = '';

  /**
   * Load user specific information
   */
  async created(): Promise<void> {
    const { dapp } = this.$store.state;
    this.walletLink = this.href !== undefined
      ? this.href
      : [
        dapp.baseUrl,
        dapp.rootEns,
        `profile.vue.${dapp.domainName}`,
        `${this.address}`,
      ].join('/');

    await Promise.all([
      (async (): Promise<void> => {
        this.alias = await profileUtils.getUserAlias(this.getRuntime(), this.address,
          this.accountDetails);
      })(),
      (async (): Promise<void> => {
        // load balance and parse it to 2 decimal places
        const amount = await bccHelper.getBalance(this.address);
        this.balance = {
          amount: amount.toLocaleString(this.$i18n.locale(), {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),
          timestamp: Date.now(),
        };
      })(),
      (async (): Promise<void> => {
        // load the vue evan core to get its origin and access the images
        const vueCoreDbcp = await dappBrowser.System.import(
          `evancore.vue.libs.${dappBrowser.getDomainName()}!ens`,
        );
        this.vueCoreBaseUrl = dappBrowser.dapp.getDAppBaseUrl(
          vueCoreDbcp,
          `${vueCoreDbcp.name}.${dappBrowser.getDomainName()}`,
        );
      })(),
    ]);

    this.loading = false;
  }

  /**
   * Open the qr code modal.
   *
   * @param      {Event}  $event  click event
   */
  showQRCode($event): boolean {
    (this.$refs.qrCodeModal as any).show();
    $event.stopPropagation();

    return false;
  }
}
