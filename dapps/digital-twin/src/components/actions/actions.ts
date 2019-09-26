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

import Vue from 'vue';
import Component, { mixins } from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';

import * as bcc from '@evan.network/api-blockchain-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';
import { EvanComponent, EvanForm, EvanFormControl } from '@evan.network/ui-vue-core';
import { EvanUIDigitalTwin, utils } from '@evan.network/digitaltwin.lib';

import * as dispatchers from '../../dispatchers/registy';


interface DetailFormInterface extends EvanForm {
  description: EvanFormControl;
  imgSquare: EvanFormControl;
  name: EvanFormControl;
}

@Component({ })
export default class DigitalTwinActionsComponent extends mixins(EvanComponent) {
  /**
   * UI Digital Twin instances, where the actions should be triggered.
   */
  @Prop() uiDT: EvanUIDigitalTwin;

  /**
   * If no uiDT was applied, load data for address.
   */
  @Prop() address;

  /**
   * Enable Digital twin Actions (edit dbcp, map to ens, favorite toggle)
   */
  @Prop() dtActions;

  /**
   * Enable container actions (link container, container add)
   */
  @Prop() containerActions;

  /**
   * Dropdown mode (buttons / dropdownButton / dropdownIcon / dropdownHidden)
   */
  @Prop({
    default: 'buttons'
  }) displayMode;

  /**
   * Show loading symbol
   */
  loading = false;

  /**
   * Digital twin that should be used internally
   */
  selectedUiDT: EvanUIDigitalTwin = null;

  /**
   * Custom ui dt was loaded with bypassed twin address
   */
  loadedUiDT: EvanUIDigitalTwin = null;

  /**
   * ref handlers
   */
  reactiveRefs: any = { };

  /**
   * Used per default for normal buttons (will be overwritten within dropdown)
   */
  buttonClasses = {
    primary: 'btn btn-circle btn-primary d-flex align-items-center justify-content-center mr-1',
    secondary: 'btn btn-circle btn-outline-primary mr-1',
    tertiar: 'btn btn-icon mr-1',
  }

  buttonTextComp = 'evan-tooltip';

  /**
   * Watch for ui dt changes to apply interactions to current select dt.
   */
  @Watch('uiDT')
  onChildChanged(val: string, oldVal: string) {
    if (val !== this.uiDT) {
      this.loadedUiDT && this.loadedUiDT.destroy();
      this.loadedUiDT = null;
      this.selectedUiDT = this.uiDT;
      this.reactiveRefs = { };

      // force reload
      this.loading = true;
      this.$nextTick(() => this.loading = false);
    }
  }

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

    if (this.uiDT) {
      this.selectedUiDT = this.uiDT;
    } else if (this.displayMode === 'buttons' && this.address) {
      await this.initialize();
    }
  }

  /**
   * Clear uiDt listeners
   */
  async beforeDestroy() {
    this.loadedUiDT && this.loadedUiDT.destroy();
  }

  /**
   * Load the plugin data.
   */
  async initialize() {
    this.loading = true;
    this.selectedUiDT = this.loadedUiDT = new EvanUIDigitalTwin(this.address);
    await this.selectedUiDT.initialize(this, utils.getRuntime(this));
    this.loading = false;
  }

  /**
   * Show the actions dropdown.
   */
  showDropdown($event?: any) {
    // load data for dropdowns
    !this.loading && !this.uiDT && this.initialize();

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
   * Gets the edited dbcp information from the dc-dbcp-edit component and saves the twin
   *
   * @param      {any}  newDbcp  The new dbcp
   */
  saveDbcp(newDbcp: any) {
    // hide dbcp modal
    (<any>this.reactiveRefs.dbcpModal).hide();

    // save the dbcp
    this.selectedUiDT.dbcp.name = newDbcp.name;
    this.selectedUiDT.dbcp.description = newDbcp.description;
    this.selectedUiDT.dbcp.imgSquare = newDbcp.imgSquare;
    this.selectedUiDT.saveDbcp(this, utils.getRuntime(this), dispatchers.digitaltwinSaveDispatcher);
  }

  /**
   * Add / remove the twin from profile favorites.
   */
  toggleFavorite() {
    this.selectedUiDT.toggleFavorite(
      utils.getRuntime(this),
      dispatchers.favoriteAddDispatcher,
      dispatchers.favoriteRemoveDispatcher
    );

    this.reactiveRefs.favoriteModal && this.reactiveRefs.favoriteModal.hide();
  }
}
