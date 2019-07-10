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

import * as bcc from '@evan.network/api-blockchain-core';

/**
 * Account id of the notary smart agent
 */
const notarySmartAgentAccountId = '0x74479766e4997F397942cc607dc59f7cE5AC70b2';

/**
 * Currently no organization handling logic exists. Just return dummy data for the current user.
 *
 * @param      {bcc.Runtime}  runtime  The runtime
 */
async function getOrganizations(runtime) {
  const orgs = { };

  // just setup dummy organizations for the current user.
  orgs[runtime.activeAccount] = {
    alias: (await runtime.profile.getAddressBook()).profile[runtime.activeAccount].alias,
    img: '',
    type: 'organization',
  };

  orgs['0x001De828935e8c7e4cb56Fe610495cAe63fb2612'] = {
    alias: 'Test Account 0',
    img: '',
    type: 'organization',
  };

  return orgs;
}

/**
 * Return the detail for one single
 *
 * @param      {bccRuntime}  runtime  bcc runtime
 * @param      {string}      address  address that should be loaded
 */
async function getOrganization(runtime: bcc.Runtime, address: string) {
  return (await getOrganizations(runtime))[address];
}

/**
 * Return the status and the payload for a specific organization.
 *
 *   - nichts / unkown
 *   - beantragt / requested
 *   - vom Provider bearbeitet / forwarding (optional)
 *   - in Prüfung / confirming
 *   - erteilt / issued
 */
async function getIdentificationDetails(runtime: bcc.Runtime, address: string) {
  return {
    status: 'unkown',
    pdfUrl: 'http://www.africau.edu/images/default/sample.pdf',
    verifications: [
      '/evan/company',
      '/evan/company/12345',
    ]
  };
}

export {
  getIdentificationDetails,
  getOrganization,
  getOrganizations,
  notarySmartAgentAccountId,
};
