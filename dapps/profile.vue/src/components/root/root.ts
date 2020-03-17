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
import { Watch } from 'vue-property-decorator';

// evan.network imports
import * as bcc from '@evan.network/api-blockchain-core';
import { DispatcherInstance } from '@evan.network/ui';
import { EvanComponent, NavEntryInterface } from '@evan.network/ui-vue-core';

import * as dispatchers from '../../dispatchers/registry';
import { getPermissionSortFilter } from '../utils/shareSortFilters';

@Component({ })
export default class ProfileRootComponent extends mixins(EvanComponent) {
  /**
   * Shows the loading symbol, until general profile data is loaded.
   */
  loading = true;

  /**
   * navEntries for top navigation
   */
  navEntries: NavEntryInterface[] = [];

  /**
   * Nav entries that are visible by others
   */
  // TODO: add verification to public nav entries, when verifications are public visible
  publicNavEntries = ['detail', 'did'];

  /**
   * Watch for dispatcher updates
   */
  listeners: Array<any> = [];

  @Watch('$route')
  onRouteChange(to) {
    if (to.params.address !== this.$store.state.profileDApp.address) {
      this.initialize(true);
    }
  }

  /**
   * Watch for dispatcher updates§
   */
  created(): void {
    // watch for save updates
    this.listeners.push(dispatchers.updateProfileDispatcher.watch(async ($event: any) => {
      if ($event.detail.status === 'finished' || $event.detail.status === 'deleted') {
        await this.initialize();
      }
    }));
  }

  /**
   * Clear dispatcher listeners
   */
  beforeDestroy(): void {
    this.listeners.forEach((listener) => listener());
  }

  /**
   * Check if a route name is accessable by others.
   *
   * @return     {boolean}  True if access denied, False otherwise.
   */
  isAccessDenied(routeName: string): boolean {
    return !this.$store.state.profileDApp.isMyProfile
      && !this.publicNavEntries.includes(routeName);
  }

  /**
   * Setup navigation structure
   */
  async initialize(forceReload?: boolean): Promise<void> {
    // only show loading on detail page
    if (forceReload || this.$route.name === 'detail') {
      this.loading = true;
    }

    this.$store.state.loadingProfile = this.setupProfile();
    await this.$store.state.loadingProfile;
    this.setNavEntries();

    this.loading = false;
  }

  /**
   * Load currents profiles data.
   */
  async setupProfile(): Promise<void> {
    const { address } = this.$route.params;
    const runtime = this.getRuntime();
    const { activeIdentity } = runtime;
    const profile = new bcc.Profile({
      accountId: runtime.activeIdentity,
      profileOwner: address,
      ...runtime,
    } as bcc.ProfileOptions);
    const profileDApp: any = {
      activeIdentity,
      address,
      data: { },
      isMyProfile: address === activeIdentity,
      permissions: { read: [], readWrite: [] },
      profile,
    };
    this.$store.state.profileDApp = profileDApp;

    try {
      // load general profile information
      await profile.loadForAccount();
      // load profile container data
      profileDApp.description = await profile.profileContainer.getDescription();
    } catch (ex) {
      runtime.logger.log(`Could not description for ${address}: ${ex.message}`, 'error');
    }

    // load container data
    if (profile.profileContainer && profileDApp.description && profileDApp.description.dataSchema) {
      // load permissions
      const { readWrite, read } = await profile.profileContainer.getContainerShareConfigForAccount(
        activeIdentity,
      );
      profileDApp.permissions = {
        read: (read || []).concat(readWrite || []),
        readWrite: readWrite || [],
      };
      profileDApp.data = await this.loadProfileEntries();
      profileDApp.sharingFilter = getPermissionSortFilter(profileDApp.data);
    } else {
      if (profileDApp.isMyProfile) {
        profileDApp.permissions.read = ['accountDetails'];
      }

      profileDApp.old = true;
    }
  }

  /**
   * Load the profile container entry data and return them.
   */
  async loadProfileEntries(): Promise<any> {
    const data = {};
    const { profileDApp } = this.$store.state;
    const entryKeys = Object.keys(profileDApp.description.dataSchema);

    // load entry data from profile container
    await Promise.all(entryKeys.map(async (key: string) => {
      if (profileDApp.permissions.read.indexOf(key) !== -1) {
        try {
          // load account details
          data[key] = await this.loadProfileEntry(profileDApp.profile, key);
        } catch (ex) {
          profileDApp.profile.log(`Could nor load accountDetails for ${profileDApp.address}: ${ex.message}`, 'error');
        }
      }

      // fill empty values
      if (!data[key]) {
        data[key] = {};
      }
    }));

    return data;
  }

  /**
   * Load a specific entry for the given profile.
   *
   * @param      {bccProfile}  profile  bcc profile for current opened profile
   * @param      {string}      type     entry name
   */
  async loadProfileEntry(profile: bcc.Profile, type: string): Promise<any> {
    const runtime = this.getRuntime();
    const instances = await dispatchers.updateProfileDispatcher.getInstances(runtime, true);
    let scopeData;

    // if dispatcher is running, use this data
    if (instances && instances.length !== 0) {
      const filtered = (instances as DispatcherInstance[])
        .filter((instance) => instance.data.type === type);
      if (filtered.length !== 0) {
        scopeData = filtered[filtered.length - 1].data.formData;
      }
    }

    // if no dispatcher entry was found for this scope, load it!
    if (!scopeData) {
      scopeData = (await profile.getProfileProperty(type));
    }

    return scopeData;
  }

  /**
   * Applies the navigation entries for the current opened profile.
   */
  setNavEntries(): void {
    this.navEntries = [
      {
        icon: 'mdi mdi-account-outline',
        key: 'detail',
      },
      {
        disabled: !this.getRuntime().runtimeConfig.useIdentity,
        icon: 'mdi mdi-identifier',
        key: 'did',
      },
      {
        icon: 'mdi mdi-wallet-outline',
        key: 'wallet',
      },
      {
        icon: 'mdi mdi-check-decagram',
        key: 'verifications',
      },
      {
        icon: 'mdi mdi-share-variant',
        key: 'sharings',
      },
      null,
      {
        icon: 'mdi mdi-settings',
        key: 'settings',
      },
    ]
      .filter((entry) => !entry || !this.isAccessDenied(entry.key))
      .map((entry) => (entry ? {
        disabled: entry.disabled,
        icon: entry.icon,
        id: `nav-entry-${entry.key}`,
        text: `_profile.breadcrumbs.${entry.key.split('/')[0]}`,
        to: entry.key,
      } : null));

    // remove sharings from old profiles
    if (!this.$store.state.profileDApp.profile.profileContainer || !this.$store.state.profileDApp.description) {
      this.navEntries.splice(3, 1);
    }
  }
}
