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
import ContainerCache from '../../../container-cache';

interface DbcpFormInterface extends EvanForm {
  description: EvanFormControl;
  img: EvanFormControl;
  name: EvanFormControl;
}

@Component({ })
export default class ContainerActionsComponent extends mixins(EvanComponent) {
  /**
   * Current opened container address (save it from routes to this variable, so all beforeDestroy
   * listeners for template-handlers will work correctly and do not uses a new address that is
   * laoding)
   */
  @Prop() containerAddress;

  /**
   * Is container opened in context to the digital twin
   */
  @Prop() digitalTwinAddress;

  /**
   * UI Digital Twin instances, where the actions should be triggered.
   */
  @Prop() dbcp;

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
   * formular specific variables
   */
  dbcpForm: DbcpFormInterface = null;

  /**
   * ref handlers
   */
  reactiveRefs: any = { };

  /**
   * Watch for updates and disable current save button
   */
  savingWatcher: Function = null;

  /**
   * Show loading symbol
   */
  loading = true;

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
   * is the current user the owner of the data container?
   */
  isOwner = false;

  /**
   * Set button classes
   */
  async created() {
    const runtime = utils.getRuntime(this);

    // check for actions mode
    if (this.displayMode !== 'buttons') {
      Object.keys(this.buttonClasses).forEach(
        type => this.buttonClasses[type] = 'dropdown-item pt-2 pb-2 pl-3 pr-3 clickable'
      );

      this.buttonTextComp = 'span';
    }

    // set dbcp form
    this.dbcpForm = (<DbcpFormInterface>new EvanForm(this, {
      name: {
        value: this.dbcp.name,
        validate: function(vueInstance: ContainerActionsComponent, form: DbcpFormInterface) {
          return this.value.trim().length !== 0;
        }
      },
      description: {
        value: this.dbcp.description,
        validate: function(vueInstance: ContainerActionsComponent, form: DbcpFormInterface) {
          return true;
        }
      },
      img: {
        value: '',
      },
    }));

    // watch for saving updates
    this.savingWatcher = dispatchers.updateDispatcher.watch(async () => {
      const instances = await dispatchers.updateDispatcher.getInstances(runtime);
      const beforeSaving = this.$store.state.saving;

      const saving = instances
        .filter(instance => instance.data.address === this.containerAddress)
        .length > 0;

      this.$set(this.$store.state, 'saving', saving);
    });

    // load the owner
    const container = utils.getContainer(<any>runtime, this.containerAddress);
    this.isOwner = (await container.getOwner()) === runtime.activeAccount;

    this.loading = false;
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
   * Trigger the digital twin save
   *
   * @param      {boolean}  onlyDbcp  save only the description
   */
  async saveDbcp() {
    if (!this.$store.state.saving && this.dbcpForm.isValid) {
      const runtime = utils.getRuntime(this);

      // hide current schema editor, so the beforeDestroy event is triggered and the data of the
      // opened ajv editor is saved
      this.loading = true;
      this.$store.state.saving = true;

      // update description backup
      this.dbcp.name = this.dbcpForm.name.value;
      this.dbcp.description = this.dbcpForm.description.value;

      // hide dbcp modal
      (<any>this.$refs.dbcpModal) && (<any>this.$refs.dbcpModal).hide();

      // wait for the template handler to saved all the data
      this.$nextTick(async () => {
        dispatchers.updateDispatcher.start(runtime, {
          address: this.containerAddress,
          description: {
            description: this.dbcpForm.description.value,
            imgSquare: this.dbcpForm.img.value,
            name: this.dbcpForm.name.value,
          },
          digitalTwinAddress: this.digitalTwinAddress,
        });

        this.loading = false;
      });
    }
  }

  /**
   * When the dbcp edit modal was canceled, restore original dbcp value
   */
  cancelDbcpModal(eventArgs: any) {
    this.$nextTick(() => {
      // don't close on backdrop
      if (eventArgs.backdrop) {
        (<any>this).$refs.dbcpModal.show();
      } else {
        this.dbcpForm.name.value = this.dbcp.name;
        this.dbcpForm.description.value = this.dbcp.description;
      }
    });
  }
}
