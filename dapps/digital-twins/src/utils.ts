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

  You can be released from the requirements of the GNU Affero General Public
  License by purchasing a commercial license.
  Buying such a license is mandatory as soon as you use this software or parts
  of it on other blockchains than evan.network.

  For more information, please contact evan GmbH at this address:
  https://evan.network/license/
*/

import * as dappBrowser from '@evan.network/ui-dapp-browser';
import * as bcc from '@evan.network/api-blockchain-core';

export * from '../../data-container/src/utils';

export const latestTwinsKey = 'evan-last-digital-digitaltwins';
export const nullAddress = '0x0000000000000000000000000000000000000000';

/**
 * Return the last opened digitaltwins that were persited in the localStorage.
 */
export function getLastOpenedTwins() {
  return JSON.parse(window.localStorage[latestTwinsKey] || '[ ]');
}

/**
 * Returns the active domain name (currently payable, until the nameresolve is fixed)
 *
 * @return     {string}  domain name (default evan)
 */
export function getDomainName(): string {
  return 'payable' || dappBrowser.getDomainName();
}

/**
 * Returns a minimal dbcp description set.
 */
export async function getDigitalTwinBaseDbcp(): Promise<any> {
  const digitaltwinDbcp = await dappBrowser.System
    .import(`digitaltwins.${ dappBrowser.getDomainName() }!ens`);

  return {
    author: '',
    dapp: digitaltwinDbcp.dapp,
    dbcpVersion: 2,
    description: '',
    name: '',
    version: '1.0.0',
  };
}
