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
import { EvanComponent, NavEntryInterface } from '@evan.network/ui-vue-core';

@Component
export default class RootComponent extends mixins(EvanComponent) {
  navEntries: NavEntryInterface[] = [
    {
      icon: 'mdi mdi-credit-card-outline',
      id: 'nav-entry-wallet-wallet',
      text: '_wallet.routes.wallet',
      to: { name: 'wallet' },
    },
    {
      icon: 'mdi mdi-calendar-month',
      id: 'nav-entry-wallet-ipfs',
      text: '_wallet.routes.ipfs',
      to: { name: 'ipfs' },
    },
  ];
}
