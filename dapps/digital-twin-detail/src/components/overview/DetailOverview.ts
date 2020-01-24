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

@Component
export default class DetailOverviewComponent extends mixins(EvanComponent) {
  twin = null;

  did = null;

  transactions = [
    {
      id: 0, amount: 0.01, name: 'Hans', date: '08.01.2020 13:01',
    },
    {
      id: 1, amount: 0.21, name: '0xfab7fc548d24dc0eae9aaf69ba4f8ced7bf18353', date: '03.01.2020 13:01',
    },
  ]

  async created(): Promise<void> {
    this.twin = this.$store.state.twin;
    const { identity } = this.$store.state.twin.description;

    this.did = await this.getRuntime().did.convertIdentityToDid(identity);
    console.log(this.twin);
    console.log(identity);
  }
}
