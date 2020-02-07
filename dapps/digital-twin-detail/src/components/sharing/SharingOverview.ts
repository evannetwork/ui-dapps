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
import { DAppTwin, DAppContainer } from '@evan.network/digital-twin-lib';
import { profileUtils } from '@evan.network/ui';

import ShareContainerComponent from '../container/ShareContainer';

/**
 * Used to start user name / type loading directly while container resolve.
 */
interface LoadingSharedUserInterface {
  containers: Array<string>;
  name: Promise<string>;
  type: Promise<string>;
}

/**
 * Format of resolved "search" results
 */
interface SharedUserInterface {
  address: string; // account address
  containerNames: Array<string>; // list of containers, mapped to it's names
  containers: Array<string>; // list of containers, for that the user is permitted;
  icon: string; // account type material icon
  name: string; // users name, alias or account address
  type: string; // account type
}

interface ColumnInterface {
  key: string;
  label: string;
  sortable?: boolean;
  tdClass?: string;
  thClass?: string;
}

@Component({ })
export default class SharingOverview extends mixins(EvanComponent) {
  columns: ColumnInterface[ ] = [];

  data: SharedUserInterface[ ] = [];

  isActiveSearch = false;

  loading = true;

  reverse = false;

  selectedFilter = 'all';

  searchTerm = '';

  sortBy = 'name';

  filters = [
    { type: 'unshared', icon: 'help-circle-outline' },
    { type: 'user', icon: 'account-outline' },
    { type: 'company', icon: 'office-building' },
    { type: 'all', icon: 'share-variant' },
  ];

  /**
   * Resolve permissions for the twin and containers.
   */
  async created(): Promise<void> {
    this.columns = [
      {
        key: 'icon',
        label: '',
        thClass: 'th-icon',
      },
      {
        key: 'name',
        label: this.$t('_twin-detail.sharings.table.name'),
        sortable: true,
        tdClass: 'truncate',
      },
      {
        key: 'containers',
        label: this.$t('_twin-detail.sharings.table.containers'),
        tdClass: 'truncate',
      },
    ];

    await this.resolvePermissions();
  }

  /**
   * Load all permissions for the current opened twins.
   */
  async resolvePermissions(): Promise<void> {
    const runtime = this.getRuntime();
    const { twin: { containerAddresses } }: { twin: DAppTwin } = this.$store.state;
    const permittedUsers: { [address: string]: LoadingSharedUserInterface } = { };

    // iterate through all containers and resolve the permissions
    await Promise.all(containerAddresses.map(async (containerAddress: string): Promise<void> => {
      /* Hint: Container API invites every shared user generally into the member role. As a result
       * of this, we can simply resolve all members from the rights and roles, to check with which
       * users anything was shared. */
      const contract = runtime.contractLoader.loadContract('DataContract', containerAddress);
      const roleMap = await runtime.rightsAndRoles.getMembers(contract);
      const unique = Array.from(new Set([].concat(...Object.values(roleMap))));

      // iterate through all permitted users and apply them to the permitted users mapping
      unique.forEach((address: string): void => {
        if (address !== runtime.activeAccount) {
          if (!permittedUsers[address]) {
            permittedUsers[address] = {
              type: profileUtils.getProfileType(runtime, address),
              name: profileUtils.getUserAliasFromAddress(runtime, address),
              containers: [],
            };
          }

          permittedUsers[address].containers.push(containerAddress);
        }
      });
    }));

    // iterate through all resolved profiles and push them into the datsa object
    await Promise.all(Object.keys(permittedUsers).map(async (address: string): Promise<void> => {
      this.data.push({
        address,
        containerNames: this.getContainerNames(permittedUsers[address].containers),
        containers: permittedUsers[address].containers,
        icon: profileUtils.getProfileTypeIcon(await permittedUsers[address].type),
        name: await permittedUsers[address].name,
        type: await permittedUsers[address].type,
      });

      this.sortHandler();
    }));

    this.loading = false;
  }

  /**
   * Maps a list of container addresses to it's names.
   */
  getContainerNames(containers: string[]): string[] {
    return containers.map((address: string) => {
      const container: DAppContainer = this.$store.state.twin.containerContracts[address];
      return container?.description?.name || container.name;
    });
  }

  /**
   * Recognize changed sorting and sort the current data with this data.
   *
   * @param      {any}  ctx     The context
   */
  sortHandler(ctx?: any): void {
    // apply latest sort changes to the context
    if (ctx) {
      const { sortBy, sortDesc: reverse } = ctx;
      this.sortBy = sortBy;
      this.reverse = reverse;
    }

    this.data.sort((a, b) => {
      let sortResult = 0;
      if (a[this.sortBy] > b[this.sortBy]) {
        sortResult = 1;
      } else if (a[this.sortBy] < b[this.sortBy]) {
        sortResult = -1;
      }

      if (this.reverse) {
        sortResult *= -1;
      }

      return sortResult;
    });
  }

  /**
   * Return the contacts data, filtered by the type filter.
   */
  getTableData(): Array<SharedUserInterface> {
    return this.data.filter((item: SharedUserInterface) => {
      if (this.searchTerm
        && JSON.stringify(item).toLowerCase().indexOf(this.searchTerm.toLowerCase()) === -1) {
        return false;
      }

      if (this.selectedFilter !== 'all' && item.type !== this.selectedFilter) {
        return false;
      }

      return true;
    });
  }

  /**
   * Opens the share sidepanel. If wanted, preselect a contact.
   *
   * @param      {string}  contact  contact address
   */
  openShareSidePanel(contact?: string): void {
    (this.$refs.shareContainer as ShareContainerComponent).showPanel(contact);
  }

  /**
   * Hide search input, when search term is empty.
   */
  handleSearchBlur(): void {
    if (this.searchTerm.length === 0) {
      this.isActiveSearch = false;
    }
  }
}
