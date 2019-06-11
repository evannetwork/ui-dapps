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
import Component, { mixins } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import * as bcc from '@evan.network/api-blockchain-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';
import { EvanComponent, EvanForm, EvanFormControl } from '@evan.network/ui-vue-core';
import { EvanUIDigitalTwink, utils } from '@evan.network/digitaltwin.lib'

import UiContainer from '../../../UiContainer';
import * as fieldUtils from '../../../fields';

@Component({ })
export default class DataSetComponent extends mixins(EvanComponent) {
  /**
   * current opened container
   */
  containerAddress = '';

  /**
   * Last opened ui container
   */
  uiContainer: UiContainer;

  /**
   * selected entry name
   */
  entryName = '';

  /**
   * Current selected entries calculated type
   */
  entryType = '';

  /**
   * Tabs for top navigation
   */
  tabs: Array<any> = [ ];

  /**
   * Watch for hash updates and load digitaltwin detail, if a digitaltwin was laod
   */
  hashChangeWatcher: any;

  /**
   * show loading
   */
  loading = true;

  /**
   * Data container could not be loaded, e.g. no permissions.
   */
  error = false;


  /**
   * ref handlers
   */
  reactiveRefs: any = { };

  /**
   * Set button classes
   */
  async created() {
    await this.initialize();
    this.defaultRouting();

    // watch for saving updates
    let beforeEntry = this.entryName;
    this.hashChangeWatcher = (async () => {
      if (beforeEntry !== this.$route.params.entryName) {
        beforeEntry = this.$route.params.entryName;
        await this.initialize();
      }

      this.defaultRouting();
    }).bind(this);

    // add the hash change listener
    window.addEventListener('hashchange', this.hashChangeWatcher);
  }

  /**
   * Clear location change watchers
   */
  beforeDestroy() {
    this.hashChangeWatcher && window.removeEventListener('hashchange', this.hashChangeWatcher);
  }

  /**
   * Setup tabs and set the entryName
   */
  async initialize() {
    this.loading = true;

    try {
      const tabNames = [ 'entry-schema', 'entry-permissions', 'entry-changes' ];

      this.containerAddress = this.$route.params.containerAddress;
      this.entryName = this.$route.params.entryName;

      // load basic data schema, for checking entry type
      this.uiContainer = new UiContainer(this);
      (await this.uiContainer.loadPlugin());

      // only allow list entries for contracts
      const entry = this.uiContainer.plugin.template.properties[this.entryName];
      this.entryType = fieldUtils.getType(entry.dataSchema);
      if (this.uiContainer.isContainer) {
        // add list entries overview, when it's type of array
        if (this.entryType === 'array') {
          tabNames.unshift('list-entries');
        } else {
          tabNames.unshift('entry-values');
        }
      }

      this.tabs = tabNames
        .map(urlKey => ({
          id: `tab-${ urlKey }`,
          href: [
            (<any>this).dapp.fullUrl,
            this.containerAddress,
            'data-set',
            this.entryName,
            urlKey,
          ].join('/'),
          text: `_digitaltwins.breadcrumbs.${ urlKey }`
        }));
      } catch (ex) {
        this.error = ex;
        utils.getRuntime(this).logger.log(ex.message, 'error');
      }

    this.loading = false;
  }

  /**
   * Check if the base route for the data set was navigated to, directly navigate to sub page.
   */
  defaultRouting() {
    if (this.$route.name === 'entry-base') {
      if (!this.containerAddress.startsWith('0x')) {
        this.$router.push({ name: 'entry-schema' });
      } else {
        if (this.entryType === 'array') {
          this.$router.push({ name: 'list-entries' });
        } else {
          this.$router.push({ name: 'entry-values' })
        }
      }
    }
  }
}
