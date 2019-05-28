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
import { deepEqual } from '@evan.network/ui';
import { EvanComponent, EvanForm, EvanFormControl } from '@evan.network/ui-vue-core';
import { EvanUIDigitalTwink, utils, } from '@evan.network/digitaltwin.lib';

import * as dispatchers from '../../../dispatchers/registry';
import * as entryUtils from '../../../entries';
import ContainerCache from '../../../container-cache';
import UiContainer from '../../../UiContainer';
import { getEntryChanges } from '../../../utils';

@Component({ })
export default class SetSchemaComponent extends mixins(EvanComponent) {
  /**
   * Current opened container address
   */
  containerAddress = '';

  /**
   * selected entry name
   */
  entryName = '';

  /**
   * Show loading symbol
   */
  loading = true;

  /**
   * Data container could not be loaded, e.g. no permissions.
   */
  error = false;

  /**
   * ui container instance
   */
  uiContainer: any = null;

  /**
   * Currents container template definition.
   */
  templateEntry: any = null;

  /**
   * Active data container entry
   */
  selectedEntry = 'string';

  /**
   * Data container permission specifications
   */
  permissions: any = null;

  /**
   * ref handlers
   */
  reactiveRefs: any = { };

  /**
   * is the current container in save mode
   */
  saving = false;
  savingWatcher = null;
  cacheWatcher = null;

  /**
   * Set button classes
   */
  async created() {
    this.containerAddress = this.$route.params.containerAddress;
    this.entryName = this.$route.params.entryName;
    this.uiContainer = new UiContainer(this);

    this.savingWatcher = this.uiContainer
      .watchSaving(async () => this.saving = await this.uiContainer.isSaving());
    this.cacheWatcher = this.uiContainer.watchForUpdates(() => this.initialize());

    await this.initialize();
  }

  /**
   * Load the entry data
   */
  async initialize() {
    this.loading = true;

    const runtime = utils.getRuntime(this);

    try {
      (await this.uiContainer.loadData(false));
      this.templateEntry = this.uiContainer.plugin.template.properties[this.entryName];
      this.permissions = this.uiContainer.permissions;

      if (this.containerAddress.startsWith('0x')) {
        const container = utils.getContainer(<any>runtime, this.containerAddress);

        // load only the value, when it wasn't cached before
        if (typeof this.templateEntry.value === 'undefined') {
          this.templateEntry.value = await container.getEntry(this.entryName);
        }
      }

      // if it's a new value, apply full readWrite permissions
      if (this.templateEntry.isNew) {
        this.permissions.readWrite.push(this.entryName);
      }

      this.saving = await this.uiContainer.isSaving();

      // ensure edit values for schema component
      entryUtils.ensureValues(this.templateEntry);
    } catch (ex) {
      runtime.logger.log(`Could not load DataContainer detail: ${ ex.message }`, 'error');
      this.error = true;

      return;
    }

    this.loading = false;
  }

  /**
   * Save latest changes to cache
   */
  beforeDestroy() {
    this.savingWatcher && this.savingWatcher();
    this.cacheWatcher && this.cacheWatcher();

    this.loading = true;
    this.$nextTick(async () => {
      const runtime = utils.getRuntime(this);
      const edit = this.templateEntry.edit;
      const entry = this.templateEntry;

      const schemaChanged = !deepEqual(edit.dataSchema, entry.dataSchema);
      let valueChanged;
      if (entry.type !== 'list') {
        valueChanged = !deepEqual(edit.value, entry.value);
      } else {
        valueChanged = entry.value && entry.value.length > 0;
      }

      // if the current entry was changed, cache the values
      if (schemaChanged || valueChanged) {
        this.templateEntry.changed = true;
        const containerCache = new ContainerCache(runtime.activeAccount);
        containerCache.put(this.containerAddress, this.uiContainer.plugin);
      }
    });
  }

  /**
   * Save the current changes.
   */
  saveEntry() {
    const runtime = utils.getRuntime(this);

    // save changes for this entry
    this.reactiveRefs.entryComp.save();

    if (this.containerAddress.startsWith('0x')) {
      dispatchers.updateDispatcher.start(runtime, {
        address: this.containerAddress,
        description: this.uiContainer.description,
        digitalTwinAddress: this.uiContainer.digitalTwinAddress,
        plugin: this.uiContainer.plugin,
      });
    } else {
      dispatchers.pluginDispatcher.start(runtime, {
        description: this.uiContainer.description,
        plugin: this.uiContainer.plugin,
      });
    }
  }
}
