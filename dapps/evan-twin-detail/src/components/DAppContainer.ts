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

// TODO: remove type description when ticket is implemented
// (https://evannetwork.atlassian.net/browse/CORE-864)
export interface DBCPDescriptionInterface {
  author: string;
  description?: string;
  i18n?: {
    [language: string]: {
      description?: string;
      name: string;
    };
  };
  name: string;
}

/**
 * Extended Container class to merge backend logic with dispatcher watching functionalities. Also
 * provides for stateful data holding.
 */
export class DAppContainer extends bcc.Container {
  /**
   * Call super and initialize new container class.
   */
  constructor(runtime: bcc.Runtime, address: string) {
    super(runtime as bcc.ContainerOptions, {
      accountId: runtime.activeAccount,
      address,
    });
  }

}
