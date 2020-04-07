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
import { profileUtils } from '@evan.network/ui';

import EvanComponent from '../../component';

interface Account {
  id: string;
  displayName: string;
  type: string;
}

/**
 * Shows the callout element when extending the profile in bottom nav
 *
 * @class         UserCallout
 * @selector      evan-user-callout
 */
@Component
export default class UserCallout extends mixins(EvanComponent) {
  accounts: Account[] = [{
    id: '0x000',
    displayName: 'Test Account',
    type: this.$t('_evan.user-callout.user-account'),
  }]

  show = false;

  isChangingRuntime = false;

  async switchIdentity(id: string): Promise<void> {
    const TEST_ID = '0x67ed20047c1f6d955b7020dd8296afac6ababea5';
    console.log('id', id);
    this.show = false;
    this.isChangingRuntime = true;

    await new Promise((resolve) => {
      setTimeout(resolve, 2000);
    });

    this.isChangingRuntime = false;
  }

  async created () {
    const identityAccess = (await session.accountRuntime.profile.getIdentityAccessList() || {});
    const accessAddresses = Object
      .keys(identityAccess)
      .filter((address: string) => address !== session.activeIdentity);

    if (session.activeIdentity !== session.accountIdentity) {
      accessAddresses.push(session.accountIdentity);
    }

    this.accounts = await Promise.all(accessAddresses.map(async (address) => ({
      id: address,
      displayName: await profileUtils.getUserAlias(session.accountRuntime, address),
      type: await profileUtils.getProfileType(session.accountRuntime, address),
    })));
  }
}
