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
  loading = true;

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
  saving = false;
  savingWatcher = null;
  cacheWatcher = null;

  /**
   * Calculated type
   */
  itemType = '';

  /**
   * Load first entries
   */
  async created() {
    this.containerAddress = this.$route.params.containerAddress;
    this.entryName = this.$route.params.entryName;

    let beforeSaving = false;
    UiContainer.watch(this, async (uiContainer: UiContainer, dispatchetData: any) => {
      this.saving = uiContainer.isSaving;
      this.templateEntry = uiContainer.plugin.template.properties[this.entryName];
      this.itemType = fieldUtils.getType(this.templateEntry.dataSchema.items);

      // ensure values
      entryUtils.ensureValues(this.containerAddress, this.templateEntry);

      if (beforeSaving && !this.saving) {
        // reset values
        this.count = 10;
        this.maxListentries = 0;
        this.offset = 0;
        this.listEntries = [ ];

        await this.loadEntries();
      }

      beforeSaving = this.saving;
    });

    await this.loadEntries();
  }

  /**
   * Load next list entries
   */
  async loadEntries() {
    this.loading = true;

    try {
      const runtime = utils.getRuntime(this);

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
      this.listEntries = this.listEntries.concat(newEntries);
    } catch (ex) { }

    this.loading = false;
  }

  /**
   * Set dispatcher entries for displaying list entries that are currently saved.
   *
   * @param      {Arrayany}  dispatchetData  The dispatcher data
   */
  async setDispatcherEntries(dispatchetData: Array<any>) {
    this.dispatcherEntries = [ ].concat(
      ...(dispatchetData
        .filter(data => data.plugin && data.address === this.containerAddress &&
          data.plugin.template.properties[this.entryName].value.length > 0
        )
        .map(data => data.plugin.template.properties[this.entryName].value)
      ))
      .map(entry => {
        entry.loading = true;

        return entry;
      });
  }
}
