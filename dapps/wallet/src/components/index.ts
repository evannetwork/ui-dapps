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

import BuyEveComponent from './wallet/buy/BuyEve.vue';
import IpfsSidePanel from './ipfs/side-panel/side-panel.vue';
import SendEveComponent from './wallet/send/SendEve.vue';
import TransactionsComponent from './wallet/transactions/transactions.vue';

export default [
  { name: 'ipfs-side-panel', component: IpfsSidePanel },
  { name: 'profile-buy-eve', component: BuyEveComponent },
  { name: 'profile-send-eve', component: SendEveComponent },
  { name: 'profile-transactions', component: TransactionsComponent },
];
