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

import { System } from '@evan.network/ui-dapp-browser';

// map the original vue path to vue.libs
import EvanComponent from './component';
import EvanForm from './form';
import EvanFormControl from './formControl';
import { getDomainName } from './utils';
import { NavEntryInterface } from './components/nav-list/NavEntryInterface';
import { EvanTableItem, EvanTableColumn } from './components/table/EvanTableInterfaces';

System.map['@evan.network/ui-vue-core'] = `evancore.vue.libs.${getDomainName()}!dapp-content`;

// export evan vue components, interfaces and functions
export * from './components/registry';
export * from './interfaces';
export * from './routing';
export * from './utils';
export * from './vue-core';
export { NavEntryInterface };
export { EvanTableItem, EvanTableColumn };
export { EvanComponent, EvanForm, EvanFormControl };
