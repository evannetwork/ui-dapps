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
import { EvanComponent, NavEntryInterface } from '@evan.network/ui-vue-core';
import { DAppTwin } from 'core/digital-twin-lib/src';

@Component
export default class DetailDataComponent extends mixins(EvanComponent) {
  navItems: NavEntryInterface[] = [];

  /**
   * Setup dynamic navigation structure.
   */
  async created(): Promise<void> {
    const { twin }: { twin: DAppTwin } = this.$store.state;
    this.navItems = [
      ...twin.containerAddresses.map((address) => ({
        text: this.$t(`${address}.name`, twin.containerContracts[address].name),
        to: address,
      })).sort((a, b) => a.text.localeCompare(b.text)),
    ];

    // add general always to the top
    this.navItems.unshift({
      text: '_twin-detail.data.general.general-title',
      to: 'general',
    });
  }
}
