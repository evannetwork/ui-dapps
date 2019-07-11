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


import axios from 'axios';

/**
 * Account id of the notary smart agent
 */
const notarySmartAgentAccountId = '0x74479766e4997F397942cc607dc59f7cE5AC70b2';

const agentUrl = 'http://localhost:8080'

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

  try {
    // TODO: Add correct api endpoint

    const evanAuthHeader = await generateEvanAuthHeader(runtime);
    const allRequests = await axios({
      method: 'POST',
      url: `${ agentUrl }/api/smart-agents/smart-agent-2fi/status/getAll`,
      headers: { 'Authorization': evanAuthHeader }
    });

    await axios({
      method: 'POST',
      url: `${ agentUrl }/api/smart-agents/smart-agent-2fi/status/get`,
      headers: { 'Authorization': evanAuthHeader }
    });
  } catch (ex) {
    console.dir(ex)
  }
  return {
    status: 'unkown',
    pdfUrl: 'http://www.africau.edu/images/default/sample.pdf',
    verifications: [
      '/evan/company',
      '/evan/company/12345',
    ]
  };
}

/**
 * Send an rest get request to the payment agent using the corresponding new build headers.
 *
 * @param      {string}        endPoint  endpoint that should be called using this.agentEndpoint
 * @return     {Promise<any>}  json result of the request
 */
async function generateEvanAuthHeader(runtime: bcc.Runtime): Promise<any> {
  const activeAccount = runtime.activeAccount;
  const toSignedMessage = runtime.web3.utils
    .soliditySha3(new Date().getTime() + activeAccount)
    .replace('0x', '');
  const hexMessage = runtime.web3.utils.utf8ToHex(toSignedMessage);
  const signature = await signMessage(runtime, toSignedMessage);

  return [
    `EvanAuth ${ activeAccount }`,
    `EvanMessage ${ hexMessage }`,
    `EvanSignedMessage ${ signature }`
  ].join(',');
}

/**
 * Sign a message for a specific account
 *
 * @param      {string}  msg      message that should be signed
 * @param      {string}  account  account id to sign the message with (default = activeAccount)
 * @return     {string}  signed message signature
 */
async function signMessage(runtime: bcc.Runtime, msg: string): Promise<string> {
  const signer = runtime.activeAccount;
  const pk = await ((<any>runtime.executor.signer).accountStore.getPrivateKey(signer));


  return runtime.web3.eth.accounts.sign(msg, '0x' + pk).signature;
}


export {
  getIdentificationDetails,
  getOrganization,
  getOrganizations,
  notarySmartAgentAccountId,
};
