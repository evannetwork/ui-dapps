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

import * as fieldUtils from '../../../fields';
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
  @Prop() entryName;

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
   * Show add list entries action
   */
  @Prop() listActions;

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
   * Calculated entry type
   */
  entryType = '';

  /**
   * Show loading symbol
   */
  loading = false;

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
    this.$emit('init', this);

    if (this.displayMode !== 'buttons') {
      Object.keys(this.buttonClasses).forEach(
        type => this.buttonClasses[type] = 'dropdown-item pt-2 pb-2 pl-3 pr-3 clickable'
      );

      this.buttonTextComp = 'span';
    }

    // implement lazy dropdown loading later, currently we need the "show the dropdown icon"
    // directly on startup, when actions for everyone are available, load specific data after
    // opening dropdown
    await this.initialize();
  }

  /**
   * Load the set data.
   */
  async initialize() {
    this.loading = true;

    this.uiContainer = await UiContainer.watch(this, async (uiContainer: UiContainer) => {
      this.templateEntry = uiContainer.plugin.template.properties[this.entryName];
      this.saving = uiContainer.isSaving;
      this.entryType = fieldUtils.getType(this.templateEntry.dataSchema);
    });

    this.loading = false;
  }

  /**
   * Show the actions dropdown.
   */
  showDropdown($event?: any) {
    // load data for dropdowns
    !this.loading && !this.templateEntry && this.initialize();

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
    this.uiContainer.resetEntry(this.entryName);

    // hide the modal
    (<any>this.$refs.resetModal) && (<any>this.$refs.resetModal).hide();
  }

  /**
   * Should dropdown context menu be shown?
   */
  areDropdownDotsVisible() {
    return !this.saving && (
      (this.schemaActions && this.templateEntry.changed && !this.templateEntry.isNew) ||
      (this.listActions && this.entryType === 'array' && this.containerAddress.startsWith('0x'))
    );
  }
}
