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

interface DbcpFormInterface extends EvanForm {
  description: EvanFormControl;
  imgSquare: EvanFormControl;
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
   * Containers transformed to plugin
   */
  plugin: any = null;

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

    // watch for saving updates
    this.savingWatcher = dispatchers.updateDispatcher.watch(this.checkSaving);

    // load the owner
    const container = utils.getContainer(<any>runtime, this.containerAddress);
    const [ plugin, owner ] = await Promise.all([
      container.toPlugin(false),
      container.getOwner()
    ]);

    this.plugin = plugin;
    this.isOwner = owner === runtime.activeAccount;
    this.checkSaving();

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
   * Check, if currently a dbcp definition gets saved.
   */
  async checkSaving() {
    const runtime = utils.getRuntime(this);

    const instances = await dispatchers.updateDispatcher.getInstances(runtime);
    const beforeSaving = this.$store.state.saving;
    const saving = instances
      .filter(instance => instance.data.address === this.containerAddress)
      .map(instance => instance.data.description);

    if (saving.length !== 0) {
      this.plugin.description.description = saving[0].description;
      this.plugin.description.imqSquare = saving[0].imqSquare;
      this.plugin.description.name = saving[0].name;
    }

    this.$set(this.$store.state, 'saving', saving.length > 0);
  }

  /**
   * Trigger the digital twin save
   *
   * @param      {boolean}  onlyDbcp  save only the description
   */
  async saveDbcp() {
    const dbcpForm = this.reactiveRefs.dbcpForm;

    if (!this.$store.state.saving && dbcpForm.isValid) {
      const runtime = utils.getRuntime(this);

      // hide current schema editor, so the beforeDestroy event is triggered and the data of the
      // opened ajv editor is saved
      this.loading = true;
      this.$store.state.saving = true;

      // update description backup
      this.plugin.description.name = dbcpForm.name.value;
      this.plugin.description.description = dbcpForm.description.value;

      // hide dbcp modal
      (<any>this.$refs.dbcpModal) && (<any>this.$refs.dbcpModal).hide();

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
    entryUtils.ensureValues(this.plugin.template.properties[newEntry.name]);

    // send event
    containerCache.put(this.containerAddress, this.plugin);
  }
}
