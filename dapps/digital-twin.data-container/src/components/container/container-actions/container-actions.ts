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
import { EvanUIDigitalTwink, utils } from '@evan.network/digitaltwin.lib';

import * as dispatchers from '../../../dispatchers/registry';
import * as entryUtils from '../../../entries';
import ContainerCache from '../../../container-cache';
import UiContainer from '../../../UiContainer';

interface DbcpFormInterface extends EvanForm {
  description: EvanFormControl;
  imgSquare: EvanFormControl;
  name: EvanFormControl;
}

@Component({ })
export default class ContainerActionsComponent extends mixins(EvanComponent) {
  /**
   * Current opened container address
   */
  @Prop() containerAddress;

  /**
   * Enable Digital twin Actions (edit dbcp, map to ens, favorite toggle)
   */
  @Prop() dcActions;

  /**
   * Enable data set actions (add set)
   */
  @Prop() setActions;

  /**
   * Dropdown mode (buttons / dropdownButton / dropdownIcon / dropdownHidden)
   */
  @Prop({
    default: 'buttons'
  }) displayMode;

  /**
   * Is the current container opened within a twin?
   */
  digitalTwinAddress = '';

  /**
   * ref handlers
   */
  reactiveRefs: any = { };

  /**
   * Watch for updates and disable current save button
   */
  savingWatcher: Function = null;

  /**
   * Status information
   */
  error = false;
  loading = false;
  saving = false;
  sharing = false;

  /**
   * Used per default for normal buttons (will be overwritten within dropdown)
   */
  buttonClasses = {
    primary: 'btn btn-primary btn-circle d-flex align-items-center justify-content-center mr-1',
    secondary: 'btn btn-circle btn-outline-secondary mr-1',
    tertiar: 'btn btn-icon mr-1',
  }

  buttonTextComp = 'evan-tooltip';

  /**
   * is the current logged in user the owner?
   */
  isOwner = false;

  /**
   * Container.toPlugin
   */
  plugin = null;

  /**
   * Set button classes
   */
  async created() {
    // check for actions mode
    if (this.displayMode !== 'buttons') {
      Object.keys(this.buttonClasses).forEach(
        type => this.buttonClasses[type] = 'dropdown-item pt-2 pb-2 pl-3 pr-3 clickable'
      );

      this.buttonTextComp = 'span';
    } else {
      // only initialize directly on startup when button view is enabled
      await this.initialize();
    }
  }

  /**
   * Load the container data.
   */
  async initialize() {
    this.loading = true;
    const runtime = utils.getRuntime(this);

    // load ui container data
    try {
      await UiContainer.watch(this, async (uiContainer: UiContainer) => {
        this.isOwner = uiContainer.owner === runtime.activeAccount;
        this.plugin = uiContainer.plugin;
        this.digitalTwinAddress = uiContainer.digitalTwinAddress;

        this.error = uiContainer.error;
        this.saving = uiContainer.isSaving;
        this.sharing = uiContainer.isSharing;
      });
    } catch (ex) {
      if (ex.message.indexOf('No container address applied!') === -1) {
        runtime.logger.log(ex.message, 'error');
      }

      return;
    }

    this.loading = false;
  }

  /**
   * Show the actions dropdown.
   */
  showDropdown($event?: any) {
    // load data for dropdowns
    !this.loading && !this.plugin && this.initialize();

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
   * Trigger the digital twin save
   *
   * @param      {boolean}  onlyDbcp  save only the description
   */
  async saveDbcp() {
    const dbcpForm = this.reactiveRefs.dbcpForm;

    if (!this.saving && dbcpForm.isValid) {
      const runtime = utils.getRuntime(this);

      // hide current schema editor, so the beforeDestroy event is triggered and the data of the
      // opened ajv editor is saved
      this.loading = true;
      this.saving = true;

      // update description backup
      this.plugin.description.name = dbcpForm.name.value;
      this.plugin.description.description = dbcpForm.description.value;

      // hide dbcp modal
      (<any>this.reactiveRefs.dbcpModal) && (<any>this.reactiveRefs.dbcpModal).hide();

      // wait for the template handler to saved all the data
      this.$nextTick(async () => {
        dispatchers.updateDispatcher.start(runtime, {
          address: this.containerAddress,
          description: {
            description: dbcpForm.description.value,
            imgSquare: dbcpForm.imgSquare.value,
            name: dbcpForm.name.value,
          },
          digitalTwinAddress: this.digitalTwinAddress,
          saveDescription: true,
        });

        this.loading = false;
      });
    }
  }

  /**
   * Executed by the `dc-new-entry` components submit event.
   *
   * @param      {any}  newEntry  dc-new-entry result obj
   */
  addNewEntry(newEntry: any) {
    const runtime = utils.getRuntime(this);
    const containerCache = new ContainerCache(runtime.activeAccount);

    // update template
    newEntry.entry.isNew = true;
    this.plugin.template.properties[newEntry.name] = newEntry.entry;
    entryUtils.ensureValues(this.containerAddress, this.plugin.template.properties[newEntry.name]);

    // send event
    containerCache.put(this.containerAddress, this.plugin);
  }
}
