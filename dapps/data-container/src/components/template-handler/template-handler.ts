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

// vue imports
import Vue from 'vue';
import Component, { mixins } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

// evan.network imports
import { EvanComponent, EvanForm, EvanFormControl } from '@evan.network/ui-vue-core';
import * as bcc from '@evan.network/api-blockchain-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';
import ContainerCache from '../../container-cache';

interface EntryFormInterface extends EvanForm {
  name: EvanFormControl;
  type: EvanFormControl;
}

@Component({ })
export default class TemplateHandlerComponent extends mixins(EvanComponent) {
  /**
   * Id for the template that is edited (e.g.: create, container address, template type, ...)
   */
  @Prop() id: string;

  /**
   * The full data container template
   */
  @Prop() template: bcc.ContainerTemplate;

  /**
   * Container cache, so we can check, if the user left some unsaved work
   */
  containerCache: ContainerCache;

  /**
   * Template that was cached into the indexeddb
   */
  cachedTemplate: any;

  /**
   * current displayed active template
   */
  activeTab = 0;

  /**
   * Active dataset, that should be displayed
   */
  activeEntry: any = { };

  /**
   * formular specific variables
   */
  entryForm: EntryFormInterface = null;

  /**
   * all available entry types
   */
  entryTypes: Array<string> = [
    'object',
    'list',
    'string',
    'number',
    'files',
    'images',
  ];

  /**
   * Initialize and try to restore latest cached template
   */
  created() {
    this.entryForm = (<EntryFormInterface>new EvanForm(this, {
      name: {
        value: '',
        validate: function(vueInstance: TemplateHandlerComponent, form: EntryFormInterface) {
          return this.value.length !== 0 && !vueInstance.template.properties[this.value];
        }
      },
      type: {
        value: this.entryTypes[0],
        validate: function(vueInstance: TemplateHandlerComponent, form: EntryFormInterface) {
          return this.value.length !== 0;
        }
      },
    }));

    // auto focus property name input
    if (Object.keys(this.template.properties).length === 0) {
      this.activeTab = -1;

      this.$nextTick(() => this.entryForm.name.$ref.focus());
    }
  }

  async mounted() {
    // try to restore previous left work
    this.containerCache = new ContainerCache((<any>this).getRuntime().activeAccount);
    this.cachedTemplate = await this.containerCache.get(this.id);

    // ask for restore
    if (this.cachedTemplate) {
      (<any>this.$refs.cacheModal).show();
    }
  }

  /**
   * Cache latest configuration for this type, so the data wont be lost, when the users leaves
   */
  beforeDestroy() {
    // wait for opened containers to saved the work
    setTimeout(() => this.containerCache.put(this.id, this.template));
  }

  /**
   * Set the active tab and apply the current data set, so it can be accessed easily.
   *
   * @param      {number}  activeTab  index of active data set
   */
  activateTab(activeTab: number) {
    if (activeTab !== -1) {
      this.activeEntry = this.template.properties[Object.keys(this.template.properties)[activeTab]];
    }
    // force rerendering of ajv and field components and set the specified tab
    this.activeTab = -2;
    this.$nextTick(() => this.activeTab = activeTab);
  }

  /**
   * Add a new, empty property to the metadata
   */
  addEntry() {
    if (!this.template.properties[this.entryForm.name.value]) {
      // create a new empty data set
      const entry = {
        dataSchema: {
          type: this.entryForm.type.value,
        },
        permissions: { 0: ['set'] },
      };

      // apply it to the current template
      this.$set(this.template.properties, this.entryForm.name.value, entry);

      // navigate to the new data set
      this.activateTab(Object.keys(this.template.properties).indexOf(this.entryForm.name.value));

      // reset add form
      this.entryForm.name.value = '';
    }
  }

  /**
   * Restore latest template from cache
   */
  restoreTemplate() {
    this.template = this.cachedTemplate;
    this.$emit('update:template', this.template);

    (<any>this.$refs.cacheModal).hide();
  }
}
