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

import { EvanComponent } from '@evan.network/ui-vue-core';
import { Runtime } from '@evan.network/api-blockchain-core';
import { System } from '@evan.network/ui-dapp-browser';

import * as dispatchers from './dispatchers';

/* TODO: remove type description when ticket is implemented
   (https://evannetwork.atlassian.net/browse/CORE-864) */
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
  identity?: string;
}

/**
 * Multiple extending classes. (https://www.typescriptlang.org/docs/handbook/mixins.html)
 *
 * @param      {any}  derivedCtor  The derived constructor
 * @param      {any}  baseCtors    The base ctors
 */
export function applyMixins(derivedCtor: any, baseCtors: any[]) {
  baseCtors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
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

  /**
   * is the current user the owner of this twin
   */
  isOwner: boolean;

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
  baseConstructor(vue: EvanComponent, runtime: Runtime, address: string): void {
    this.listeners = [];
    this.runtime = runtime;
    this.vue = vue;

    // used to handle focused component rerendering, when dispatcher states are final (finished / deleted)
    if (!this.vue.$store.state.reloadFlags) {
      this.vue.$set(this.vue.$store.state, 'reloadFlags', { });
    }
    this.vue.$set(this.vue.$store.state.reloadFlags, address, { });
  }

  /**
   * Load the base information of the contract type.
   */
  async loadBaseInfo(): Promise<void> {
    await (this as any).ensureContract();
    const [contractAddress, description, ownerAddress] = await Promise.all([
      (this as any).getContractAddress(),
      (this as any).getDescription(),
      this.runtime.executor.executeContractCall((this as any).contract, 'owner'),
    ]);

    this.contractAddress = contractAddress;
    this.description = description;
    this.ownerAddress = ownerAddress;

    // load owner address and owner name
    this.isOwner = this.ownerAddress === this.runtime.activeIdentity;
    this.ensureI18N();
  }

  /**
   * Start the description dispatcher.
   *
   * @param      {DBCPDescriptionInterface}  description  description to use, default to current
   *                                                      description
   */
  async baseSetDescription(description: DBCPDescriptionInterface = this.description): Promise<void> {
    await dispatchers.descriptionDispatcher.start(this.runtime, {
      address: this.contractAddress,
      description,
    });
  }

  /**
   * Check descriptions i18n and extend vue translation pipeline.
   */
  protected ensureI18N(): void {
    const currLocale = this.vue.$i18n.locale();
    const locales = ['en', currLocale];
    const i18n = this.description?.i18n || { };
    let newTranslations = {
      description: this.description.description,
      name: this.description.name,
    };

    // also support default language
    locales.forEach((locale: string) => {
      if (i18n[locale]) {
        newTranslations = {
          ...newTranslations,
          ...i18n[locale],
        };
      }
    });

    this.vue.$i18n.add(currLocale, { [this.contractAddress]: newTranslations });
  }

  /**
   * Sets a reload flag for a specific component to force rerender.
   *
   * @param      {string}  key     The new value
   */
  triggerReload(key: string): void {
    const { reloadFlags } = this.vue.$store.state;

    // reset loading state when ui had the possiblity for rerendering
    this.vue.$set(reloadFlags[this.contractAddress], key, true);
    this.vue.$nextTick(() => {
      this.vue.$set(reloadFlags[this.contractAddress], key, false);
    });
  }
}
