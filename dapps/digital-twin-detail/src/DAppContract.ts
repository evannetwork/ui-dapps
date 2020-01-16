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

import { Runtime, lodash, Profile, ProfileOptions } from '@evan.network/api-blockchain-core';
import { DispatcherInstance, bccUtils } from '@evan.network/ui';
import { EvanComponent } from '@evan.network/ui-vue-core';

import * as dispatchers from './dispatchers';

// TODO: remove type description when ticket is implemented
// (https://evannetwork.atlassian.net/browse/CORE-864)
export interface DBCPDescriptionInterface {
  author: string;
  description?: string;
  i18n?: {
    [language: string]: {
      [id: string]: any;
      description?: string;
      name: string;
    };
  };
  name: string;
}

/**
 * Multiple extending classes. (https://www.typescriptlang.org/docs/handbook/mixins.html)
 *
 * @param      {any}  derivedCtor  The derived constructor
 * @param      {any}  baseCtors    The base ctors
 */
export function applyMixins(derivedCtor: any, baseCtors: any[]) {
  baseCtors.forEach(baseCtor => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
      Object.defineProperty(derivedCtor.prototype, name, Object.getOwnPropertyDescriptor(baseCtor.prototype, name));
    });
  });
}

/**
 * General class for handling the general functions of a DigitalTwin / Container to load
 * their data for the UI.
 */
export class DAppContract {
  /**
   * Twins contract address (also resolved ens address)
   */
  contractAddress: string;

  /**
   * Currents twin description
   */
  description: DBCPDescriptionInterface;

  /**
   * List of dispatcher watchers, so they can be cleared on page leaving
   */
  listeners: Function[];

  /**
   * Container owner address and name
   */
  ownerAddress: string;
  ownerName: string;

  /**
   * Initial provided runtime for creating DAppContainer instances.
   */
  runtime: Runtime;

  /**
   * Vue state for accessing and extending translations
   */
  vue: EvanComponent;

  /**
   * Initialize the contract (DigitalTwin / Container)
   */
  baseConstructor(vue: EvanComponent,runtime: Runtime, address: string) {
    this.listeners = [ ];
    this.runtime = runtime;
    this.vue = vue;
  }

  /**
   * Load the base information of the contract type.
   */
  async loadBaseInfo() {
    await (this as any).ensureContract();

    this.contractAddress = await (this as any).getContractAddress();
    this.description = await (this as any).getDescription();

    // load owner address and owner name
    this.ownerAddress = await this.runtime.executor
      .executeContractCall((this as any).contract, 'owner');
    this.ownerName = await bccUtils.getUserAlias(new Profile({
      accountId: this.runtime.activeAccount,
      profileOwner: this.ownerAddress,
      ...(this.runtime as ProfileOptions)
    }));
  }

  /**
   * Start the description dispatcher.
   *
   * @param      {DBCPDescriptionInterface}  description  description to use, default to current
   *                                                      description
   */
  async baseSetDescription(description: DBCPDescriptionInterface = this.description) {
    await dispatchers.descriptionDispatcher.start(this.runtime, {
      address: this.contractAddress,
      description,
    });
  }

  /**
   * Check descriptions i18n and extend vue translation pipeline.
   */
  protected ensureI18N() {
    const locales = [ 'en', this.vue.$i18n.locale(), ];
    const i18n = this.description?.i18n || { };
    const newTranslations = {
      description: this.description.description,
      name: this.description.name,
      properties: { },
    };

    // also support default language
    for (let locale in locales) {
      if (i18n[locale]) {
        newTranslations.name = i18n[locale].name || newTranslations.name;
        newTranslations.description = i18n[locale].name || newTranslations.description;

        // check if properties are sent and merge them
        if (i18n[locale].properties) {
          newTranslations.properties = lodash.merge(newTranslations.properties,
            i18n[locale].properties);
        }
      }
    }

    this.vue.$i18n.add(locales[0], { [this.contractAddress]: newTranslations });
  }
}
