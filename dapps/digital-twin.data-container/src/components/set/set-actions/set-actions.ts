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

import ContainerCache from '../../../container-cache';
import UiContainer from '../../../UiContainer';

@Component({ })
export default class SetActionsComponent extends mixins(EvanComponent) {
  /**
   * Current opened container address
   */
  @Prop() containerAddress;

  /**
   * Current opened set
   */
  @Prop() entryName = '';

  /**
   * Dropdown mode (buttons / dropdownButton / dropdownIcon / dropdownHidden)
   */
  @Prop({
    default: 'buttons'
  }) displayMode;

  /**
   * Set actions (delete, ...)
   */
  @Prop() setActions;

  /**
   * Show functions like, schema reset, ...
   */
  @Prop() schemaActions;

  /**
   * ref handlers
   */
  reactiveRefs: any = { };

  /**
   * Used per default for normal buttons (will be overwritten within dropdown)
   */
  buttonClasses = {
    primary: 'btn btn-primary btn-circle d-flex align-items-center justify-content-center mr-3',
    secondary: 'btn btn-circle btn-outline-secondary mr-3',
    tertiar: 'btn btn-circle btn-sm btn-tertiary mr-3',
  }

  buttonTextComp = 'evan-tooltip';

  /**
   * ui container instance
   */
  uiContainer: any = null;

  /**
   * Currents container template definition.
   */
  templateEntry: any = null;

  /**
   * Show loading symbol
   */
  loading = true;

  /**
   * Watch for cache updates
   */
  saving = false;
  cacheWatcher = null;
  savingWatcher = null;

  /**
   * Set button classes
   */
  async created() {
    if (this.displayMode !== 'buttons') {
      Object.keys(this.buttonClasses).forEach(
        type => this.buttonClasses[type] = 'dropdown-item pt-2 pb-2 pl-3 pr-3 clickable'
      );

      this.buttonTextComp = 'span';
    }

    // load the data
    this.uiContainer = new UiContainer(this);
    (await this.uiContainer.loadData(false));
    this.templateEntry = this.uiContainer.plugin.template.properties[this.entryName];
    this.saving = await this.uiContainer.isSaving();

    // watch for cache updates
    this.savingWatcher = this.uiContainer
      .watchSaving(async () => this.saving = await this.uiContainer.isSaving());
    this.cacheWatcher = this.uiContainer.watchForUpdates(async () => {
      (await this.uiContainer.loadData(false));
      this.templateEntry = this.uiContainer.plugin.template.properties[this.entryName];
    });

    this.loading = false;
  }

  /**
   * Clear update watcher
   */
  beforeDestroy() {
    this.cacheWatcher && this.cacheWatcher();
  }

  /**
   * Show the actions dropdown.
   */
  showDropdown($event?: any) {
    (<any>this).$refs.dtContextMenu.show();

    $event && $event.preventDefault();
  }

  /**
   * Close the actions dropdown.
   */
  closeDropdown() {
    if ((<any>this).$refs.dtContextMenu) {
      (<any>this).$refs.dtContextMenu.hide();
    }
  }

  /**
   * Reset the current changes and reloads the data.
   */
  async resetEntry() {
    const runtime = utils.getRuntime(this);

    delete this.uiContainer.plugin.template.properties[this.entryName];

    // reset the cache
    const containerCache = new ContainerCache(runtime.activeAccount);
    containerCache.put(this.containerAddress, this.uiContainer.plugin);

    // hide the modal
    (<any>this.$refs.resetModal) && (<any>this.$refs.resetModal).hide();
  }
}
