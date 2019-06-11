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
import ContainerCache from '../../../container-cache';
import UiContainer from '../../../UiContainer';

interface FieldFormInterface extends EvanForm {
  value: EvanFormControl;
}

@Component({ })
export default class NewListEntryComponent extends mixins(EvanComponent) {
  /**
   * Current opened container address
   */
  @Prop() containerAddress;

  /**
   * List entry name
   */
  @Prop() entryName;

  /**
   * Ui container instance
   */
  @Prop() uiContainer;

  /**
   * Entry object for the given entryName
   */
  entry = null;

  /**
   * Calculated type
   */
  itemType = '';

  /**
   * Template of the opened container
   */
  template: any = null;

  /**
   * New entry definition
   */
  newEntry: any = null;

  /**
   * ref handlers
   */
  reactiveRefs: any = { };

  /**
   * Show loading symbol
   */
  loading = true;

  /**
   * Show the add list entry dialog
   */
  addListEntryForm: FieldFormInterface = null;

  async created() {
    const runtime = utils.getRuntime(this);
    this.entry = this.uiContainer.plugin.template.properties[this.entryName];
    this.itemType = fieldUtils.getType(this.entry.dataSchema.items);

    // ensure values
    entryUtils.ensureValues(this.containerAddress, this.entry);

    // add form handling for field controls
    if (this.itemType !== 'object') {
      this.addListEntryForm = <FieldFormInterface>new EvanForm(this, {
        value: {
          value: this.entry.edit.value,
          validate: function(vueInstance: NewListEntryComponent, form: FieldFormInterface) {
            return fieldUtils.validateField(
              vueInstance.itemType,
              this,
              form,
              vueInstance.containerAddress,
            );
          }
        },
      });
    }

    this.loading = false;
    this.$emit('init', this);
  }

  /**
   * Add the current form data as a new list entry.
   */
  addEntry() {
    if (this.itemType === 'object') {
      // save the current ajv values to the edit.value object and save the value into the original
      // object
      this.reactiveRefs.addAjv.save();
      this.entry.value.unshift(this.entry.edit.value);
    } else {
      const correctValue = fieldUtils.parseFieldValue(
        this.itemType,
        this.addListEntryForm.value.value
      );

      // apply the new data to the list
      this.entry.value.push(correctValue);
    }

    // apply the new value into the array, and clear the old add value
    this.entry.edit.value = fieldUtils.defaultValue(this.entry.dataSchema);
    if (this.addListEntryForm) {
      // clear the formular value
      this.addListEntryForm.value.value = this.entry.edit.value;
    }

    // ensure the new empty edit.value
    entryUtils.ensureValues(this.containerAddress, this.entry);

    (<any>this).$refs.listEntryAddModal.hide();

    if (this.containerAddress.startsWith('0x')) {
      dispatchers.updateDispatcher.start(this.uiContainer.runtime, {
        address: this.containerAddress,
        description: this.uiContainer.description,
        digitalTwinAddress: this.uiContainer.digitalTwinAddress,
        plugin: this.uiContainer.plugin,
      });
    } else {
      dispatchers.pluginDispatcher.start(this.uiContainer.runtime, {
        description: this.uiContainer.description,
        template: this.uiContainer.plugin.template,
      });
    }
  }

  /**
   * Shows the entry add modal.
   */
  showModal() {
    (<any>this).$refs.listEntryAddModal.show();
  }
}
