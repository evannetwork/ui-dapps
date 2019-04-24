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
import { Prop, Watch } from 'vue-property-decorator';

// evan.network imports
import { EvanComponent, EvanForm, EvanFormControl } from '@evan.network/ui-vue-core';
import { deepEqual } from '@evan.network/ui';
import * as bcc from '@evan.network/api-blockchain-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';
import ContainerCache from '../../container-cache';
import * as utils from '../../utils';

interface EntryFormInterface extends EvanForm {
  name: EvanFormControl;
  type: EvanFormControl;
  arrayType: EvanFormControl;
}

@Component({ })
export default class TemplateHandlerComponent extends mixins(EvanComponent) {
  /**
   * Id for the template that is edited (e.g.: create, container address, template type, ...)
   */
  @Prop() address: string;

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
  cachedTemplate: any = null;

  /**
   * current displayed active template
   */
  activeTab = 0;

  /**
   * Active dataset, that should be displayed
   */
  activeEntryName = '';
  activeEntry: any = { };

  /**
   * formular specific variables
   */
  entryForm: EntryFormInterface = null;

  /**
   * Enable the save button, when anything has changed
   */
  cacheChanges = false;

  /**
   * Watch for updates, so we can enable the save button
   */
  valuesChanged: any;

  /**
   * all available entry types
   */
  entryTypes: Array<string> = [
    'object',
    'array',
    'string',
    'number',
    // 'files',
    // 'images',
  ];

  /**
   * all available array types
   */
  arrayTypes: Array<string> = [
    'object',
    'string',
    'number',
    // 'files',
    // 'images',
  ];

  /**
   * show loading symbol
   */
  loading = false;

  /**
   * Permissions for the current account
   */
  permissions = null;

  /**
   * Initialize and try to restore latest cached template
   */
  async created() {
    this.entryForm = (<EntryFormInterface>new EvanForm(this, {
      name: {
        value: '',
        validate: function(vueInstance: TemplateHandlerComponent, form: EntryFormInterface) {
          return this.value.length !== 0 && !vueInstance.template.properties[this.value];
        }
      },
      type: {
        value: this.entryTypes[0]
      },
      arrayType: {
        value: this.arrayTypes[0]
      },
    }));

    // load permissions for the selected container
    if (this.address.startsWith('0x')) {
      this.loading = true;

      const runtime = utils.getRuntime(this);
      const container = utils.getContainer(runtime, this.address);

      // load the owner for the contract
      this.permissions = await container.getContainerShareConfigForAccount(runtime.activeAccount);
      this.permissions.isOwner = (await container.getOwner()) === runtime.activeAccount;

      this.loading = false;
    }

    // auto focus property name input
    if (Object.keys(this.template.properties).length === 0) {
      this.activateTab(-1, false);

      this.$nextTick(() => this.entryForm.name.$ref.focus());
    } else {
      let openedEntry = 0;
      if ((<any>this).$route.params.entry) {
        openedEntry = Object.keys(this.template.properties)
          .indexOf((<any>this).$route.params.entry);
      }

      this.activateTab(openedEntry === -1 ? 0 : openedEntry, false);
    }

    // watch for changes, so the internal values can be cached
    this.valuesChanged = (($event) => this.$set(this, 'cacheChanges', true)).bind(this);
    window.addEventListener('dt-value-changed', this.valuesChanged);
  }

  /**
   * Watch for container caches and ask to restore them.
   */
  async mounted() {
    // try to restore previous left work
    this.containerCache = new ContainerCache((<any>this).getRuntime().activeAccount);
    const cachedTemplate = await this.containerCache.get(this.address);

    // ask for restore
    if (cachedTemplate && !deepEqual(cachedTemplate, this.template)) {
      this.cachedTemplate = cachedTemplate;
    }
  }

  /**
   * Cache latest configuration for this type, so the data wont be lost, when the users leaves
   */
  async beforeDestroy() {
    window.removeEventListener('dt-value-changed', this.valuesChanged);

    // wait for opened containers to saved the work
    if (this.cacheChanges) {
      // check for changes
      const integrity = await utils.getEntryChanges(
        utils.getRuntime(this),
        this.address,
        this.template
      );

      if (integrity.changed) {
        setTimeout(() => {
          this.containerCache.put(this.address, this.template);
        });
      } else {
        this.containerCache.delete(this.address);
      }
    }
  }

  /**
   * Set the active tab and apply the current data set, so it can be accessed easily.
   *
   * @param      {number}   activeTab  index of active data set
   * @param      {boolean}  rerender   trigger content rerender on tab switch
   */
  activateTab(activeTab: number, rerender = true) {
    const beforeTab = this.activeTab;
    const updateActiveEntry = () => {
      // save the latest value
      if (beforeTab !== -1 && this.activeEntry && this.activeEntryName) {
        this.template.properties[this.activeEntryName] = this.activeEntry;
      }

      if (activeTab !== -1) {
        this.activeEntryName = Object.keys(this.template.properties)[activeTab];
        this.activeEntry = this.template.properties[this.activeEntryName];

        // ensure correct breadcrumb translations
        const customTranslation = { };
        customTranslation[ `_datacontainer.breadcrumbs.${ this.activeEntryName }`] =
          this.activeEntryName;

        (<any>this).$i18n.add((<any>this).$i18n.locale(), customTranslation);

        // be sure, that value and addValue params are added
        this.ensureEntryValues();
      }
    };

    if (rerender) {
      // force rerendering of ajv and field components and set the specified tab
      this.activeTab = -2;
      this.$nextTick(() => {
        updateActiveEntry();
        this.activeTab = activeTab;
      });
    } else {
      updateActiveEntry();
      this.activeTab = activeTab;
    }

    // update url to be stateful
    let relativeUrl = '';
    let relativeBasePath = this.$route.path.replace((<any>this).dapp.baseHash, '');
    if (relativeBasePath.startsWith('/')) {
      relativeBasePath = relativeBasePath.slice(1, relativeBasePath.length);
    }
    // check if we are in template or container create mode, then navigate to create base
    if (this.address.startsWith('create')) {
      relativeUrl = `${ this.address }/`;
    // if a template is opened, navigate to template base
    } else if (relativeBasePath.startsWith('template')) {
      relativeUrl = `template/${ this.address }/`;
    }

    const url = `${ relativeUrl }${ this.activeEntryName }`;
    (<any>this).evanNavigate(url);
  }

  /**
   * Add a new, empty property to the metadata
   */
  addEntry() {
    if (!this.template.properties[this.entryForm.name.value]) {
      utils.enableDTSave();

      // create a new empty data set
      const entry: any = {
        // $id: `${ this.entryForm.name.value }_schema`,
        dataSchema: { type: this.entryForm.type.value, },
        permissions: { 0: ['set'] },
        type: this.entryForm.type.value === 'array' ? 'list' : 'entry'
      };

      // add properties and empty value object directly, so the vue listeners will work correctly in
      // nested components
      if (this.entryForm.type.value === 'object') {
        entry.dataSchema.properties = { };
      } else if (this.entryForm.type.value === 'array') {
        // add the items schema, including the array type, will be defined only ontime, at entry
        // creation
        entry.dataSchema.items = { type: this.entryForm.arrayType.value, };
        if (this.entryForm.arrayType.value === 'object') {
          entry.dataSchema.items.properties = { };
        }
      }

      this.template.properties[this.entryForm.name.value] = entry;

      // navigate to the new data set
      this.activateTab(Object.keys(this.template.properties).indexOf(this.entryForm.name.value));

      // reset add form
      this.entryForm.name.value = '';
    }
  }

  /**
   * Restore latest template from cache
   */
  async restoreTemplate() {
    // submit the cached templated, update the parent components
    this.template = { ...this.cachedTemplate };
    this.$emit('update:template', this.template);
    utils.enableDTSave();

    // clear the cached templated
    this.cachedTemplate = null;
    await this.containerCache.delete(this.address);

    // trigger a rerender, so the current formular will be up to date
    const activeTab = this.activeTab;
    this.activeTab = -2;
    this.$nextTick(() => this.activateTab(activeTab));

    (<any>this.$refs.cacheModal).hide();
  }

  /**
   * Clear the current template cache.
   */
  async clearCachedTemplate() {
    this.cachedTemplate = null;
    await this.containerCache.delete(this.address);

    (<any>this.$refs.cacheModal).hide();
  }

  /**
   * Takes an entry and checks for type array. If it's an array, ensure, that the value array and an
   * addValue object is added. Per default, this values are not returned by the API, templates does
   * not support list entries export and must be load dynamically. The value array is used to handle
   * new arrays, that will be persisted for caching to the indexeddb like the normal entries
   *
   * @param      {any}  entry   the entry that should be checked
   */
  ensureEntryValues() {
    switch (this.activeEntry.dataSchema.type) {
      // add an empty value list and an addValue object, the addValue object is used for new
      case 'array': {
        this.activeEntry.value = this.activeEntry.value || [ ];
        this.activeEntry.addValue = this.activeEntry.addValue ||
          (this.activeEntry.dataSchema.items.type === 'object' ? { } : '');
        break;
      }
      case 'object': {
        this.activeEntry.value = this.activeEntry.value || { };
        break;
      }
      case 'string': {
        this.activeEntry.value = this.activeEntry.value || '';
        break;
      }
      case 'number': {
        this.activeEntry.value = this.activeEntry.value || 0;
        break;
      }
    }

    // redefine the object and bind new watchers
    this.activeEntry = { ...this.activeEntry };
  }
}

