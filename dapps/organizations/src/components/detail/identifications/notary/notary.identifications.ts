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
import * as dappBrowser from '@evan.network/ui-dapp-browser';

import axios from 'axios';

/**
 * Account id of the notary smart agent
 */
let notarySmartAgentAccountId;
const coreRuntime = dappBrowser.bccHelper.coreRuntimes[bcc.instanceId];
if (coreRuntime.environment === 'testcore') {
  notarySmartAgentAccountId = '0x74479766e4997F397942cc607dc59f7cE5AC70b2';
} else {
  notarySmartAgentAccountId = '0x74479766e4997F397942cc607dc59f7cE5AC70b2';
}

// const agentUrl = 'http://192.168.100.56:8080'
const agentUrl = 'https://agents.test.evan.network'

/**
 * Requests the request/close action to clear open requests, when the identification process has
 * finished.
 *
 * @param      {bccRuntime}  runtime    bcc runtime
 * @param      {string}      requestId  identification request id
 */
async function closeRequest(runtime: bcc.Runtime, requestId: string) {
  const evanAuthHeader = await generateEvanAuthHeader(runtime);
  const allRequests = await axios({
    method: 'POST',
    url: `${ agentUrl }/api/smart-agents/smart-agent-2fi/request/close`,
    headers: { 'Authorization': evanAuthHeader },
    data: { requestId }
  });
}

/**
 * Trigger reload event, so the verification overview will reload the latest requests
 *
 * @param      {string}  orgAddress  The organization address
 */
function triggerRequestReload(orgAddress: string) {
  setTimeout(
    () => window.dispatchEvent(new CustomEvent(`org-ident-reload-${ orgAddress }`)),
    3000
  );
}

/**
 * Return the list of requested identifications
 */
async function getRequests(runtime: bcc.Runtime, address: string) {
  const evanAuthHeader = await generateEvanAuthHeader(runtime);
  const allRequests = await axios({
    method: 'POST',
    url: `${ agentUrl }/api/smart-agents/smart-agent-2fi/status/getAll`,
    headers: { 'Authorization': evanAuthHeader }
  });
  return (<any>allRequests).data.result;
}

/**
 * Return the status and the payload for a specific organization.
 *
 *   - nichts / unknown
 *   - beantragt / requested
 *   - vom Provider bearbeitet / forwarding (optional)
 *   - in Prüfung / confirming
 *   - erteilt / issued
 */
async function getIdentificationDetails(runtime: bcc.Runtime, address: string, requestId: string) {
  let status = 'unknown';

  try {
    const evanAuthHeader = await generateEvanAuthHeader(runtime);
    const ret: any = { };
    const requestedStatus: any = (await axios({
      method: 'POST',
      url: `${ agentUrl }/api/smart-agents/smart-agent-2fi/status/get`,
      headers: { 'Authorization': evanAuthHeader },
      data: {
        question: requestId
      }
    })).data.result;

    ret.status = requestedStatus.status;

    // check if verifications were issued by evan, so checkup for already sent bmail
    if (requestedStatus.issuedMailId) {
      ret.issuedMail = (await runtime.mailbox.getMail(requestedStatus.issuedMailId)).content;
      ret.issuedMailAddress = requestedStatus.issuedMailId;
    }

    return ret;
  } catch (ex) {
    runtime.logger.log(ex.message, 'error');
    throw ex;
  }
}

async function getIssuedVerifications(runtime) {
  const verifications = await runtime.profile.getBcContract('verifications', 'notary');
  if (verifications) {
    bcc.Ipld.purgeCryptoInfo(verifications);
    return verifications;
  } else {
    return [ ];
  }
}

/**
 * Issue a identity verification for a identification requests. Takes optional files that should be
 * attached to the verification.
 *
 * @param      {bcc.Runtime}  runtime    blockchain-core runtime
 * @param      {string}       requestId  identification request id
 * @param      {any}          files      object space seperated (private, public) that contains
 *                                       files that should be attached (HTML 5 file selection)
 */
async function issueVerification(runtime, requestId, files = { private: [ ], public: [ ] }) {
  const evanAuthHeader = await generateEvanAuthHeader(runtime);
  const formData = new FormData();

  // add files to the specific assets objects
  Object.keys(files).forEach(key => {
    for (let file of files[key]) {
      formData.append(key === 'private' ? 'assets' : 'publicAssets', file.blob, file.name);
    }
  });

  formData.append('requestId', requestId);

  await axios({
    method: 'POST',
    url: `${ agentUrl }/api/smart-agents/smart-agent-2fi/question/finalize`,
    headers: { 'Authorization': evanAuthHeader, 'content-type': 'multipart/form-data' },
    data: formData
  });
}

async function getAnswer(runtime, question, requestId) {
  const evanAuthHeader = await generateEvanAuthHeader(runtime);
  const answerResponse = await axios({
    method: 'POST',
    url: `${ agentUrl }/api/smart-agents/smart-agent-2fi/question/solve`,
    headers: { 'Authorization': evanAuthHeader },
    data: {
      question,
      requestId
    },
    responseType: 'blob', // important
  });
  return answerResponse.data;
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
  closeRequest,
  getAnswer,
  getIdentificationDetails,
  getIssuedVerifications,
  getRequests,
  issueVerification,
  notarySmartAgentAccountId,
  triggerRequestReload,
}
