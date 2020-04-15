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
import { Watch } from 'vue-property-decorator';
import { session } from '@evan.network/ui-session';
import { Dispatcher } from '@evan.network/ui';

import EvanComponent from '../../component';

/**
 * Shows the callout element when extending the profile in bottom nav
 *
 * @class         UserCallout
 * @selector      evan-user-callout
 */
@Component
export default class UserCallout extends mixins(EvanComponent) {
  identities: string[] = [];

  isChangingRuntime = false;

  // clear event handler for toggling identity callout
  clearIdentityCalloutWatch: () => void;

  // clear event handler for toggling identity callout
  clearMailboxWatch: Function;

  get show(): boolean {
    return this.$store.state.uiState.isOpenIdentityCallout;
  }

  set show(isOpen: boolean) {
    this.$store.commit('setIdentityCalloutOpenState', isOpen);
  }

  beforeDestroy(): void {
    this.clearIdentityCalloutWatch();
    this.clearMailboxWatch();
  }

  async created(): Promise<void> {
    // check for mailbox attachment dispatchers and reload identities when something has changed
    this.clearMailboxWatch = Dispatcher.watch(($event) => {
      if ($event.detail.status === 'finished' || $event.detail.status === 'deleted') {
        const { data } = $event.detail.instance;
        if (data?.attachment?.type === 'identityAccess'
          || data?.attachment?.type === 'identityAccessRemove') {
          this.loadIdentities();
        }
      }
    }, `mailbox.vue.${this.dapp.domainName}`, 'attachmentDispatcher');

    await this.loadIdentities();
  }

  /**
   * Load the permitted identities for the current identity.
   */
  async loadIdentities(): Promise<void> {
    // load identities
    const accessibleIdentities = await session.accountRuntime.profile.getIdentityAccessList() || {};
    const addresses = Object
      .keys(accessibleIdentities)
      .filter((address: string) => address.length === 42 && address !== session.activeIdentity);

    // Add the initial identity to the list
    if (session.activeIdentity !== session.accountIdentity) {
      addresses.push(session.accountIdentity);
    }

    this.identities = addresses;
  }

  async switchIdentity(id: string): Promise<void> {
    this.isChangingRuntime = true;
    this.show = false;

    session.changeActiveIdentity(id);
  }
}
