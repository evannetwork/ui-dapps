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
  @Prop() uiDT;

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
   * Set button classes
   */
  created() {
    if (this.displayMode !== 'buttons') {
      Object.keys(this.buttonClasses).forEach(
        type => this.buttonClasses[type] = 'dropdown-item pt-2 pb-2 pl-3 pr-3 clickable'
      );

      this.buttonTextComp = 'span';
    }
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
   * Gets the edited dbcp information from the dc-dbcp-edit component and saves the twin
   *
   * @param      {any}  newDbcp  The new dbcp
   */
  saveDbcp(newDbcp: any) {
    // hide dbcp modal
    (<any>this.$refs.dbcpModal).hide();

    // save the dbcp
    this.uiDT.dbcp.name = newDbcp.name;
    this.uiDT.dbcp.description = newDbcp.description;
    this.uiDT.dbcp.imgSquare = newDbcp.imgSquare;
    this.uiDT.saveDbcp(this, utils.getRuntime(this), dispatchers.digitaltwinSaveDispatcher);
  }

  /**
   * Add / remove the twin from profile favorites.
   */
  toggleFavorite() {
    this.uiDT.toggleFavorite(
      utils.getRuntime(this),
      dispatchers.favoriteAddDispatcher,
      dispatchers.favoriteRemoveDispatcher
    );
  }
}
