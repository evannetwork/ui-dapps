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
import { bccUtils } from '@evan.network/ui';

/**
 * Loads the owner address and owner name for a specific contract.
 *
 * @return     {Promise<{ owner: string, name: string}>}  The owner for contract.
 */
export const getOwnerForContract = async function (runtime: bcc.Runtime, contract: any)
  :Promise<{ owner: string, name: string }> {
  // load owner address and owner name
  const owner = await runtime.executor.executeContractCall(contract, 'owner');
  const name = await bccUtils.getUserAlias(new bcc.Profile({
    accountId: runtime.activeAccount,
    profileOwner: owner,
    ...(runtime as bcc.ProfileOptions)
  }));

  return { owner, name };
};