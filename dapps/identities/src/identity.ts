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
import * as dispatchers from './dispatchers/registy';

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
   * bcc.DigitalIdentity.isValidDigitalIdentity result
   */
  validity: any;

  /**
   * Digital identity left navigation entries
   */
  navigation: Array<any>;

  /**
   * List of data containers.
   */
  containers: Array<any> = [ ];

  /**
   * watch for dispatcher updates
   */
  dispatcherListeners: Array<Function> = [ ];

  /**
   * is the identity currently loading?
   */
  loading = true;

  /**
   * creation is in progress
   */
  isCreating = false;

  /**
   * Return the default identity config.
   */
  static getIdentityConfig(runtime: bcc.Runtime, address: string, dbcp?: any) {
    return {
      accountId: runtime.activeAccount,
      address: address,
      containerConfig: { accountId: runtime.activeAccount, },
      description: dbcp,
      factoryAddress: '0xE8aB5213BDD998FB39Ed41352a7c84a6898C288a',
    }
  }

  constructor(address: string) {
    this.address = address;

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
  async initialize(vueInstance: any, runtime: bcc.Runtime) {
    this.loading = true;

    // if we are not loading the create components, show the details.
    this.validity = await bcc.DigitalIdentity.getValidity((<any>runtime), this.address);

    if (this.validity.exists) {
      const identity = new bcc.DigitalIdentity(
        <any>runtime,
        EvanUIIdentity.getIdentityConfig(runtime, this.address)
      );

      this.dbcp = await identity.getDescription();
    } else {
      this.dbcp = await getIdentityBaseDbcp();
      // set default dbcp name
      this.dbcp.name = this.address;

      // check for running dispatchers
      this.setIsCreating(runtime);
      this.dispatcherListeners.push(dispatchers.identityCreateDispatcher
        .watch(() => this.setIsCreating(runtime)));
    }

    this.setNameTranslations(vueInstance);
    this.loading = false;
    console.log('finished loading')
  }

  /**
   * Set the translation for the current dbcp name, so the breadcrumbs will be displayed correctly.
   */
  setNameTranslations(vueInstance: any) {
    const customTranslation = { };
    const i18n = vueInstance.$i18n;

    customTranslation[ `_identities.breadcrumbs.${ this.address }`] = this.dbcp.name;

    i18n.add(i18n.locale(), customTranslation);
  }

  /**
   * Check if the current identity with the specific address is in creation
   *
   * @return     {<type>}  { description_of_the_return_value }
   */
  setIsCreating = async (runtime) => {
    const instances = await dispatchers.identityCreateDispatcher.getInstances(runtime);
    // is currently an identity for this address is in creation?
    this.isCreating = Object.keys(instances)
      .filter(id => instances[id].data.address).length !== 0;
  }

  /**
   * Stops all dispatcher listeners and kill the vue store instance, if it's set
   *
   * @param      {any}  vueInstance  a vue instance
   */
  destroy(vueInstance?: Vue) {
    if (vueInstance) {
      vueInstance.$store.state.uiIdentity = null;
    }

    this.dispatcherListeners.forEach((listener: Function) => listener());
  }
}
