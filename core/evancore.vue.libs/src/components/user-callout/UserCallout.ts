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
import { session } from '@evan.network/ui-session';

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

  show = false;

  isChangingRuntime = false;

  // clear event handlers
  clearIdentityCalloutWatch: () => void;

  beforeDestroy(): void {
    this.clearIdentityCalloutWatch();
  }

  async created(): Promise<void> {
    // be able to open the user callout programmatically
    const watch = (): void => {
      this.show = true;
    };
    this.clearIdentityCalloutWatch = (): void => window.removeEventListener('open-identity-callout', watch);
    window.addEventListener('open-identity-callout', watch);

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
