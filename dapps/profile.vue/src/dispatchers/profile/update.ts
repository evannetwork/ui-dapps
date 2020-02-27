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

import * as bcc from '@evan.network/api-blockchain-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';
import { Dispatcher, DispatcherInstance } from '@evan.network/ui';
import { EvanComponent, EvanForm, EvanFormControl } from '@evan.network/ui-vue-core';
import ProfileMigrationLibrary from '../../lib/profileMigration';

const dispatcher = new Dispatcher(
  `profile.vue.${dappBrowser.getDomainName()}`,
  'updateProfileDispatcher',
  60000,
  '_profile.dispatchers.profile-update',
);

dispatcher
  .step(async (instance: DispatcherInstance, data: any) => {
    const profile = new bcc.Profile({
      accountId: instance.runtime.activeIdentity,
      profileOwner: data.address,
      ...instance.runtime,
    });

    try {
      await profile.loadForAccount();
    } catch (ex) { }

    // do not allow profile migration for foreign profiles
    if (data.address && instance.runtime.activeIdentity !== data.address) {
      if (!profile.profileContainer) {
        throw new Error('Cannot migrate the profile for an other account!');
      }
    } else {
      // check, if profile was migrated before, else migrate it
      await ProfileMigrationLibrary.checkOrMigrateProfile(instance.runtime, data.formData.profileType);
      delete profile.profileContract;
      await profile.loadForAccount();
    }

    await profile.setProfileProperties({
      [data.type]: data.formData,
    });
  });

export default dispatcher;
