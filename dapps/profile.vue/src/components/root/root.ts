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
import Vue from 'vue';
import Component, { mixins } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

// evan.network imports
import { EvanComponent } from '@evan.network/ui-vue-core';
import * as bcc from '@evan.network/api-blockchain-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';

@Component({ })
export default class ProfileRootComponent extends mixins(EvanComponent) {
  /**
   * navEntries for top navigation
   */
  navEntries: Array<any> = [ ];

  /**
   * Setup navigation structure
   */
  setNavEntries() {
    const address = this.$route.params.address;
    const runtime = (<any>this).getRuntime();

    // is currently my profile opened?
    this.$store.state.isMyProfile = !this.$route.params.address ||
      this.$route.params.address === this.$store.state.runtime.activeAccount;

    this.navEntries = [
      { key: 'detail', icon: 'mdi mdi-account-outline' },
      { key: 'wallet', icon: 'mdi mdi-wallet-outline' },
      { key: `verifications`, icon: 'mdi mdi-check-decagram' },
      { key: `addressbook.vue.${ (<any>this).dapp.domainName }`, icon: 'mdi mdi-account-group-outline' },
      null,
      { key: 'settings', icon: 'mdi mdi-settings' },
    ]
    .map(entry => (entry ? {
      id: `nav-entry-${ entry.key }`,
      href: `${ (<any>this).dapp.fullUrl }/${ entry.key }${ address ? '/' + address : '' }`,
      text: `_profile.breadcrumbs.${ entry.key.split('/')[0] }`,
      icon: entry.icon,
    } : null));
  }
}