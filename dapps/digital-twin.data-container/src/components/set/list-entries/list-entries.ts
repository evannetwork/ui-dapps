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

import * as dispatchers from '../../../dispatchers/registry';
import * as entryUtils from '../../../entries';
import * as fieldUtils from '../../../fields';
import UiContainer from '../../../UiContainer';

@Component({ })
export default class DcListEntriesComponent extends mixins(EvanComponent) {
  /**
   * Current opened container address
   */
  containerAddress = '';

  /**
   * selected entry name
   */
  entryName = '';

  /**
   * Currents container template definition.
   */
  templateEntry: any = null;

  /**
   * ref handlers
   */
  reactiveRefs: any = { };

  /**
   * Show loading symbol
   */
  initialized = false;
  loading = true;
  loadingEntries = false;

  /**
   * List of existing list entries, when an real container was opened
   */
  listEntries: Array<any> = [ ];
  dispatcherEntries: any = [ ];


  /**
   * paging specific values
   */
  count = 10;
  maxListentries = 0;
  offset = 0;
  reverse = true;

  /**
   * is the current container in save mode
   */
  cacheWatcher = null;
  error = false;
  permitted = false;
  saving = false;
  savingWatcher = null;

  /**
   * Calculated type
   */
  itemType = '';

  /**
   * Load first entries
   */
  async created() {
    const runtime = utils.getRuntime(this);

    this.containerAddress = this.$route.params.containerAddress;
    this.entryName = this.$route.params.entryName;

    let beforeSaving = false;
    await UiContainer.watch(this, async (uiContainer: UiContainer, dispatcherData: any) => {
      this.saving = uiContainer.isSaving;
      this.templateEntry = uiContainer.plugin.template.properties[this.entryName];
      this.itemType = fieldUtils.getType(this.templateEntry.dataSchema.items);

      if (uiContainer.permissions.read.indexOf(this.entryName) !== -1 ||
          uiContainer.permissions.readWrite.indexOf(this.entryName) !== -1) {
        this.permitted = true;

        // ensure values
        entryUtils.ensureValues(this.containerAddress, this.templateEntry);
        // setup dispatcher entries
        this.setDispatcherEntries(dispatcherData);

        // reload after save process has finished
        if (
            // load initially
            !this.initialized ||
            // dispatcher has finished loading
            (!this.loading && beforeSaving && !this.saving)
          ) {
          // reset values
          this.count = 10;
          this.initialized = true;
          this.listEntries = [ ];
          this.loading = true;
          this.maxListentries = 0;
          this.offset = 0;

          await this.loadEntries();
        }

        beforeSaving = this.saving;
      } else {
        this.permitted = false;
      }

      this.loading = false;
    });
  }

  /**
   * Load next list entries
   */
  async loadEntries() {
    if (this.permitted) {
      this.loadingEntries = true;

      const runtime = utils.getRuntime(this);
      try {
        // detect maxListEntries, so we can load until the max list entries were loaded
        this.maxListentries = await runtime.dataContract.getListEntryCount(
          this.containerAddress,
          this.entryName
        );

        // load the next entries
        const container = utils.getContainer(runtime, this.containerAddress);
        const newEntries = await container.getListEntries(
          this.entryName,
          this.count,
          this.offset,
          this.reverse
        );

        // apply the new entries to the list and increase the page params
        this.offset += newEntries.length;
        this.listEntries = this.listEntries.concat(
          newEntries.map(entry => ({
            data: entry
          }))
        );
      } catch (ex) {
        runtime.logger.log(ex.message, 'error');
        this.error = true;
      }
    }

    this.loadingEntries = false;
  }

  /**
   * Set dispatcher entries for displaying list entries that are currently saved.
   *
   * @param      {Arrayany}  dispatcherData  The dispatcher data
   */
  async setDispatcherEntries(dispatcherData: Array<any>) {
    // reset previous dispatcher data
    this.dispatcherEntries = [ ];

    // only get the dispatcher data, that corresponds to this entry
    const filtered = dispatcherData
      .filter(data => data.plugin && data.address === this.containerAddress &&
        data.plugin.template.properties[this.entryName].value.length !== 0
      )
      .map(data => data.plugin.template.properties[this.entryName].value);

    // will always be an array of values, so flat and push them into the dispatcherEntries
    filtered.forEach(values => values.forEach((value: any) => {
      this.dispatcherEntries.push({
        data: value,
        loading: true,
      });
    }));
  }
}
