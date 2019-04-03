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

import Vue from 'vue';
import * as bcc from '@evan.network/api-blockchain-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';

import { getIdentityBaseDbcp } from './utils';

/**
 * Represents the UI representation for a evan.network. Handles data management and so on.
 *
 * @class      EvanUIIdentity
 */
export default class EvanUIIdentity {
  /**
   * dbcp description of the identity (initially the most smallest subset of data)
   */
  dbcp: any;

  /**
   * current contract address
   */
  address: string;

  /**
   * List of data containers.
   */
  containers: Array<any> = [ ];

  /**
   * current bcc runtime
   */
  runtime: bcc.Runtime;

  /**
   * bcc.DigitalIdentity.isValidDigitalIdentity result
   */
  validity: any;

  /**
   * Digital identity left navigation entries
   */
  navigation: Array<any>;

  /**
   * Current vue instance, that uses the ui identity, is used to directly add dynamic i18n, ...
   */
  vueInstance: Vue;

  constructor(runtime: bcc.Runtime, vueInstance: any, address: string) {
    this.address = address;
    this.runtime = runtime;
    this.vueInstance = vueInstance;

    // set initial navigation
    this.navigation = [
      {
        name: 'identity-details',
        active: true,
        children: [
          { name: 'general', path: address },
          { name: 'verifications', path: `${ address }/verifications` }
        ]
      },
      {
        name: 'containers',
        active: false,
        children: [ ]
      }
    ];
  }

  /**
   * Load the initial data for the digital identity
   */
  async initialize() {
    // if we are not loading the create components, show the details.
    this.validity = await bcc.DigitalIdentity.getValidity(<any>this.runtime, this.address);

    if (this.validity.exists) {
      console.log('load details')
    } else {
      this.dbcp = await getIdentityBaseDbcp();

      // set default dbcp name
      this.dbcp.name = this.address;
    }

    this.setNameTranslations();
  }

  /**
   * Set the translation for the current dbcp name, so the breadcrumbs will be displayed correctly.
   */
  setNameTranslations() {
    const customTranslation = { };
    const i18n = (<any>this.vueInstance).$i18n;

    customTranslation[ `_identities.breadcrumbs.${ this.address }`] = this.dbcp.name;

    i18n.add(i18n.locale(), customTranslation);
  }
}
