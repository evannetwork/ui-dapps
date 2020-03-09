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

// evan.network imports
import { deepEqual, profileUtils } from '@evan.network/ui';
import {
  Runtime, Profile, ProfileOptions, lodash,
} from '@evan.network/api-blockchain-core';
import { Prop, Watch } from 'vue-property-decorator';
import {
  ContactInterface,
  ContainerPermissionsInterface,
} from '../../interfaces';
import EvanComponent from '../../component';

interface SortFiltersInterface {
  [key: string]: string[];
}

@Component
class PermissionsEditor extends mixins(EvanComponent) {
  permissionsChanged = false;

  initialPermissions: ContainerPermissionsInterface[] = null;

  isLoading = false;

  /**
   * initial contacts from current user
   */
  @Prop({
    default: null,
  })
  contacts: ContactInterface[];

  @Prop({
    default: null,
  })
  containersPermissions: { [address: string]: ContainerPermissionsInterface };

  /**
   * Function to write the updated permissions object.
   * Should return a promise resolving a `boolean`.
   *
   * - updatePermissions(permissions: ContainerPermissionsInterface): Promise<boolean>
   */
  @Prop({
    required: true,
  })
  updatePermissions: Function;

  /**
   * Function to load the desired permissions object.
   * Should return a promise resolving a `ContainerPermissionsInterface`.
   *
   * - loadPermissions(userId: string): Promise<ContainerPermissionsInterface>
   */
  @Prop({
    required: true,
  })
  loadPermissions: (userId: string) => Promise<any>;

  /**
   * Initially pre-selected contact id.
   */
  @Prop({
    default: null,
  })
  selectedContact: string;

  /**
   * General translation scope.
   */
  @Prop({
    default: '_evan.sharing',
  })
  i18nScope: string;

  /**
   * Callback function when contact was selected.
   */
  @Prop({
    type: Function,
  })
  onSelect: Function;

  /**
   * Use component in relative context.
   */
  @Prop({
    default: false,
  })
  relative: boolean;

  @Prop() bMailContent: any;

  /**
   * An object with arrays of sorted keys for each contract id,
   * which may be used to sort and filter the visible permissions.
   *
   * `{ '0xd65D17035bE5964E9842004458B2F90e0B7B6604': ['accountDetails', 'registration', 'contact'], ... };`
   *
   * Or a simple array of keys for convenience if only one datacontract is used.
   *  `['accountDetails', 'registration', 'contact']`
   */
  @Prop({
    default: null,
  })
  sortFilters: SortFiltersInterface | string[];

  /**
   * Current users runtime.
   */
  runtime: Runtime;

  /**
   * Name of the selected account adress
   */
  selectedUsername = '';

  /**
   *  Update shown permissions according to selected contact.
   *
   * @param val
   * @param oldVal
   */
  @Watch('selectedContact')
  onSelectedContactChanged(val: string, oldVal: string): void {
    if (val !== oldVal) {
      this.getPermissionsForContact();

      if (typeof this.onSelect === 'function') {
        this.onSelect(val);
      }
    }
  }

  created(): void {
    this.runtime = this.getRuntime();
    if (this.selectedContact) {
      this.getPermissionsForContact();
    }
  }

  /**
   * Receives updated permissions from permissions component and passes it to current contract.
   * Performs check whether it's different to the initial state.
   *
   * @param updates
   *  - contractId: the id of the contract which was changed
   *  - permissions: the updated permissions object
   */
  updateContractPermissions({ contractId, permissions }): void {
    this.containersPermissions[contractId].permissions = permissions;
    this.permissionsChanged = !deepEqual(
      this.containersPermissions,
      this.initialPermissions,
    );
    /**
     * Inform parent about dirty status of form
     * TODO apply event listener to other listeners too
     */
    this.$emit('permissionsChanged', this.permissionsChanged);
  }

  /**
   * set editor to null and close the panel if neccessary
   */
  cancel(): void {
    this.selectedContact = null;
    this.containersPermissions = null;
    this.initialPermissions = null;
    if (typeof this.onSelect === 'function') {
      this.onSelect();
    }
    this.$store.commit('toggleSidePanel', ''); // TODO: replace "right" by new panel id
  }

  /**
   * Calls the `loadPermissions` function from properties with current contact id.
   */
  async getPermissionsForContact(): Promise<void> {
    if (!this.selectedContact || typeof this.selectedContact !== 'string') {
      this.containersPermissions = null;

      return;
    }

    this.isLoading = true;
    this.setUserNameWithAddress();
    this.containersPermissions = null;
    this.containersPermissions = await this.loadPermissions(
      this.selectedContact,
    ).catch((e: Error) => {
      console.error('Error loading permissions', e.message);
      this.isLoading = false;
    });

    this.initialPermissions = this.containersPermissions
      ? lodash.cloneDeep(this.containersPermissions)
      : this.initialPermissions;

    this.isLoading = false;
  }

  /**
   * Calls the `updatePermissions` function from properties with the updated containersPermissions object.
   */
  async writePermissions(): Promise<void> {
    this.isLoading = true;

    try {
      await this.updatePermissions(
        this.runtime,
        this.selectedContact,
        this.containersPermissions,
        this.initialPermissions,
        this.bMailContent,
      );
      this.initialPermissions = lodash.cloneDeep(this.containersPermissions);
    } catch (ex) {
      this.runtime.logger.log(`Error writing permissions for ${this.selectedContact}: ${ex.message}`);
    }

    this.cancel();
    this.isLoading = false;
  }

  /**
   * Return the sort & filter array for the correct contract id.
   *
   * @param contractId
   */
  getSortFilter(contractId: string): string[] {
    if (!this.sortFilters) {
      return null;
    }

    if (Array.isArray(this.sortFilters)) {
      return this.sortFilters;
    }

    if (this.sortFilters[contractId] || this.sortFilters[contractId] === null) {
      return this.sortFilters[contractId];
    }

    console.warn(
      `getSortFilter function can not determine the desired filter array for ${contractId}`,
    );

    return null;
  }

  /**
   * writes specific string in selectedUsername variable used in permission text
   */
  async setUserNameWithAddress(): Promise<void> {
    this.selectedUsername = await profileUtils.getUserAlias(this.runtime, this.selectedContact);
  }

  /**
   * Return a short contact name with a max character length of 100.
   *
   * @param      {string}  name    name that should be shortened
   * @return     {string}  shortened string
   */
  // eslint-disable-next-line class-methods-use-this
  getShortName(name: string): string {
    if (name.length > 100) {
      return `${name.slice(100)}...`;
    }

    return name;
  }
}

export default PermissionsEditor;
