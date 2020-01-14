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
import { DBCPDescriptionInterface, DAppContainer } from './DAppContainer';

/**
 * Extended DigitalTwin class to merge backend logic with dispatcher watching functionalities. Also
 * provides for stateful data holding.
 *
 * @class      DigitalTwinService (name)
 */
export class DAppTwin extends bcc.DigitalTwin {
  /**
   * All loaded containers, enhanced with ui flags and data.
   */
  containers: { [id: string]: DAppContainer };

  /**
   * Twins contract address (also resolved ens address)
   */
  contractAddress: string;

  /**
   * Currents twin description
   */
  description: DBCPDescriptionInterface;

  /**
   * Initial provided runtime for creating DAppContainer instances.
   */
  runtime: bcc.Runtime;

  /**
   * Call super and initialize new twin class.
   */
  constructor(runtime: bcc.Runtime, address: string) {
    super(runtime as bcc.DigitalTwinOptions, {
      accountId: runtime.activeAccount,
      address,
    });
  }

  /**
   * Basic twin information and update instance params.
   */
  public async ensureTwinInfo() {
    this.contractAddress = await this.getContractAddress();
    this.description = await this.getDescription();
  }

  /**
   * Reset containers object and reload all container definitions.
   */
  public async loadContainers() {
    this.containers = { };

    // transform twinEntries to containers object, so all 
    const twinEntries = await this.getEntries();
    // await Promise.all(Object.keys(twinEntries).map(key => {
    //   this.containers[key] = new DAppContainer(
    //     this.runtime,
    //     {
    //       accountId; this.
    //     }
    //   );
    // }));
  }

  /**
   * Load basic twin information and setup dispatcher watchers for loading states.
   */
  public async initialize() {
  }

  /**
   * Saves the current description for this twin.
   *
   * @param      {DBCPDescriptionInterface}  description  description to save
   */
  public async setDescription(description = this.description) {
    await super.setDescription(description);
    this.description = await this.getDescription();
  }
}
