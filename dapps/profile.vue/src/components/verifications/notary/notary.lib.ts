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
import * as bcc from '@evan.network/api-blockchain-core';
import { utils } from '@evan.network/ui-dapp-browser';

import axios from 'axios';
import { agentUrl } from '@evan.network/ui';

let notarySmartAgentAccountId = '0xD2Ce53253e56C0F7AF7A4AED096AEC11e59A2024';
let verificationCost = '200000000000000000000'; // 200 EVE

if (utils.environment === 'testcore') {
  notarySmartAgentAccountId = '0xa03f8849Dbbc1AEF2aD47A1444B118717043433c';
  verificationCost = '2000000000000000000'; // 2 EVE
}

/**
 * Requests the request/close action to clear open requests, when the identification process has
 * finished.
 *
 * @param      {bccRuntime}  runtime    bcc runtime
 * @param      {string}      requestId  identification request id
 */
async function closeRequest(runtime: bcc.Runtime, requestId: string) {
  await axios({
    method: 'POST',
    url: `${agentUrl}/api/smart-agents/smart-agent-2fi/request/close`,
    headers: { Authorization: await bcc.utils.getSmartAgentAuthHeaders(runtime) },
    data: { requestId },
  });
}

/**
 * Trigger reload event, so the verification overview will reload the latest requests
 *
 * @param      {string}  orgAddress  organization address for that the data should be reloaded
 * @param      {string}  type        data that should be sent
 */
function triggerRequestReload(orgAddress: string, detail: any) {
  window.dispatchEvent(new CustomEvent(`notary-verification-reload-${orgAddress}`, {
    detail,
  }));
}

/**
 * Return the list of requested identifications
 */
async function getRequests(runtime: bcc.Runtime, address: string) {
  const allRequests = await axios({
    method: 'POST',
    url: `${agentUrl}/api/smart-agents/smart-agent-2fi/status/getAll`,
    headers: { Authorization: await bcc.utils.getSmartAgentAuthHeaders(runtime) },
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
  const status = 'unknown';

  try {
    const ret: any = { };
    const requestedStatus: any = (await axios({
      method: 'POST',
      url: `${agentUrl}/api/smart-agents/smart-agent-2fi/status/get`,
      headers: { Authorization: await bcc.utils.getSmartAgentAuthHeaders(runtime) },
      data: {
        question: requestId,
      },
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

/**
 * Get the verifications for the current opened account.
 *
 * @param      {EvanComponent}  vueInstance  vue instance, where the profileDApp vuex was loaded for
 *                                           a opened account.
 */
async function getIssuedVerifications(vueInstance) {
  const verifications = await vueInstance.$store.state.profileDApp.profile.getBcContract('verifications', 'notary');
  if (verifications) {
    bcc.Ipld.purgeCryptoInfo(verifications);
    return verifications;
  }
  return [];
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
async function issueVerification(runtime, requestId, files = { private: [], public: [] }) {
  const formData = new FormData();

  // add files to the specific assets objects
  Object.keys(files).forEach((key) => {
    for (const file of files[key]) {
      formData.append(key === 'private' ? 'assets' : 'publicAssets', file.blob, file.name);
    }
  });

  formData.append('requestId', requestId);

  await axios({
    method: 'POST',
    url: `${agentUrl}/api/smart-agents/smart-agent-2fi/question/finalize`,
    headers: {
      Authorization: await bcc.utils.getSmartAgentAuthHeaders(runtime),
      'content-type': 'multipart/form-data',
    },
    data: formData,
  });
}

async function getAnswer(runtime, question, requestId) {
  const answerResponse = await axios({
    method: 'POST',
    url: `${agentUrl}/api/smart-agents/smart-agent-2fi/question/solve`,
    headers: { Authorization: await bcc.utils.getSmartAgentAuthHeaders(runtime) },
    data: {
      question,
      requestId,
    },
    responseType: 'blob', // important
  });
  return answerResponse.data;
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
  verificationCost,
};
