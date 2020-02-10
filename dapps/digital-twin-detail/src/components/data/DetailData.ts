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
import { EvanComponent } from '@evan.network/ui-vue-core';

@Component
export default class DetailDataComponent extends mixins(EvanComponent) {
  navItems = [];

  /**
   * Setup dynamic navigation structure.
   */
  async created(): Promise<void> {
    const { twin } = this.$store.state;
    this.navItems = this.navItems
      .concat(twin.containerAddresses.map((address) => ({
        label: this.$t(`${address}.name`, twin.containerContracts[address].name),
        to: address,
      })))
      .sort((a, b) => {
        if (a.label > b.label) {
          return 1;
        }
        if (a.label < b.label) {
          return -1;
        }
        return 0;
      });

    // add general always to the top
    this.navItems.unshift({
      label: '_twin-detail.data.general.general-title',
      to: 'general',
    });
  }
}
