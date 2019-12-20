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

// map the original System.path to @evan.network/smart-contracts-core
try {
  // tslint:disable-next-line
  const { getDomainName, System } = require('@evan.network/ui-dapp-browser');
  System.map['@evan.network/smart-contracts-core'] = `smartcontracts.${ getDomainName() }!dapp-content`;
} catch (ex) {
  // ignore this, when importing smart-contracts outside from the evan.network dapp-browser environment
}

export * from '@evan.network/smart-contracts-core/contracts/compiled.js';
