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
 * Return the list of requested identifications
 */
async function getRequests(runtime: bcc.Runtime, address: string) {
  return [
    '1234567890',
    '2234567890',
    '3234567890',
    '4234567890',
  ];
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
async function getIdentificationDetails(runtime: bcc.Runtime, address: string, requestId: string) {
  let status = 'unkown';

  // TODO: add status loading
  if (requestId) {
    status = 'unkown';
  }

  return {
    id: requestId,
    pdfUrl: 'http://www.africau.edu/images/default/sample.pdf',
    status: 'unkown',
    verifications: [
      '/twi/company',
      '/twi/company/XYZ',
    ]
  };
}

export {
  getIdentificationDetails,
  getRequests,
  notarySmartAgentAccountId,
}
