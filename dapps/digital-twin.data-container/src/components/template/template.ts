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
import { Dispatcher, DispatcherInstance } from '@evan.network/ui';

import * as utils from '../../utils';
import * as dispatchers from '../../dispatchers/registry';
import ContainerCache from '../../container-cache';

interface DbcpFormInterface extends EvanForm {
  description: EvanFormControl;
  img: EvanFormControl;
  name: EvanFormControl;
}

interface ShareFormInterface extends EvanForm {
  subject: EvanFormControl;
}

@Component({ })
export default class TemplateComponent extends mixins(EvanComponent) {
  /**
   * Show loading symbol
   */
  loading = true;

  /**
   * Enable the save button, when anything has changed
   */
  enableSave = false;

  /**
   * Is a save dispatcher for this template running?
   */
  saving = false;

  /**
   * is a sharing dispatcher for this template running?
   */
  sharing = false;

  /**
   * container description
   */
  description: any;

  /**
   * containers template definition
   */
  template: any;

  /**
   * Watch for updates, so we can enable the save button
   */
  valuesChanged: any;

  /**
   * formular specific variables
   */
  dbcpForm: DbcpFormInterface = null;
  shareForm: ShareFormInterface = null;

  /**
   * Watch for updates and disable current save button
   */
  savingWatcher: Function = null;
  sharingWatcher: Function = null;

  /**
   * Share object
   */
  shareAccount = '';

  /**
   * List of my contacts
   */
  contacts: Array<any> = [ ];
  myProfile: any = null;

  /**
   * Load the container data
   */
  async created() {
    const runtime = utils.getRuntime(this);
    await this.initialize();

    this.valuesChanged = (($event) => this.enableSave = true).bind(this);
    // watch for saving updates
    this.savingWatcher = dispatchers.templateDispatcher.watch(async () => {
      const beforeSaving = this.saving;

      this.saving = (await dispatchers.templateDispatcher.getInstances(runtime))
        .filter(instance => instance.data.name === this.$route.params.template)
        .length > 0;

      // reload the data
      !this.saving && beforeSaving && this.initialize();
    });

    // watch for sharings watcher
    this.sharingWatcher = dispatchers.shareDispatcher.watch(async () => {
      this.sharing = (await dispatchers.templateDispatcher.getInstances(runtime))
        .filter(instance => instance.data.name === this.$route.params.template)
        .length > 0;
    });

    // watch for updates
    window.addEventListener('dt-value-changed', this.valuesChanged);
  }

  /**
   * Clear watchers
   */
  beforeDestroy() {
    window.removeEventListener('dt-value-changed', this.valuesChanged);
  }

  /**
   * Load the container data and setup the dbcp update form.
   */
  async initialize() {
    const runtime = utils.getRuntime(this);
    this.loading = true;

    const loadedTemplate = await bcc.Container.getContainerTemplate(runtime.profile,
      this.$route.params.template);

    this.description = loadedTemplate.description;
    this.template = loadedTemplate.template;

    // load contacts and transform them into an array
    const addressBook = await runtime.profile.getAddressBook();
    bcc.Ipld.purgeCryptoInfo(addressBook);
    this.myProfile = addressBook.profile[runtime.activeAccount];
    this.contacts = Object
      .keys(addressBook.profile)
      .filter(address => address !== runtime.activeAccount)
      .map((address) => {
        const contact = addressBook.profile[address];
        contact.address = address;

        return contact;
      });
    this.shareAccount = this.contacts[0].address;

    // set dbcp form
    this.dbcpForm = (<DbcpFormInterface>new EvanForm(this, {
      name: {
        value: this.description.name,
        validate: function(vueInstance: TemplateComponent, form: DbcpFormInterface) {
          vueInstance.enableSave = true;
          return this.value.length !== 0;
        }
      },
      description: {
        value: this.description.description,
        validate: function(vueInstance: TemplateComponent, form: DbcpFormInterface) {
          vueInstance.enableSave = true;
          return true;
        }
      },
      img: {
        value: '',
      },
    }));

    // setup share form, so the user can insert a custom form
    let subject = [
      (<any>this).$t('_datacontainer.breadcrumbs.template'),
      `: ${ this.description.name }`,
      this.$route.params.template ? ` - ${ this.$route.params.template }` : ''
    ].join('');

    this.shareForm = (<ShareFormInterface>new EvanForm(this, {
      subject: {
        value: subject,
        validate: function(vueInstance: TemplateComponent, form: ShareFormInterface) {
          return this.value.length !== 0;
        }
      },
    }));

    this.loading = false;
  }

  /**
   * Trigger the digital twin save
   */
  async saveTemplate() {
    if (!this.saving && this.dbcpForm.isValid) {
      // hide current schema editor, so the beforeDestroy event is triggered and the data of the
      // opened ajv editor is saved
      this.loading = true;
      this.saving = true;

      this.$nextTick(async () => {
        const runtime = utils.getRuntime(this);

        dispatchers.templateDispatcher.start(runtime, {
          beforeName: this.$route.params.template,
          description: this.dbcpForm.description.value,
          img: this.dbcpForm.img.value,
          name: this.dbcpForm.name.value,
          template: this.template,
        });

        await (new ContainerCache(runtime.activeAccount)).delete(this.$route.params.template);
        this.loading = false;
      });
    }
  }

  /**
   * Share the data contract with others
   */
  shareDt() {
    const runtime = utils.getRuntime(this);
    const address = this.$route.params.template;

    // transform the ui permission into an conainter share config
    const shareConfig: bcc.ContainerShareConfig = { accountId: this.shareAccount, };

    // build bmail for invited user
    const bMailContent = {
      content: {
        from: runtime.activeAccount,
        fromAlias: this.myProfile.alias,
        title: (<any>this).$t('_datacontainer.template.bmail.title'),
        body: (<any>this).$t('_datacontainer.template.bmail.body', {
          alias: this.myProfile.alias,
          subject: this.shareForm.subject.value,
        }),
        attachments: [{
          address: this.$route.params.template,
          bc: bcc.Container.profileTemplatesKey,
          fullPath: [
            `/digitaltwins.${ (<any>this).dapp.domainName }`,
            `datacontainer.digitaltwin.${ (<any>this).dapp.domainName }`,
            `template/${ this.dbcpForm.name.value }`,
          ].join('/'),
          type: 'contract',
          storeKey: this.$route.params.template,
          storeValue: {
            description: {
              description: this.dbcpForm.description.value,
              img: this.dbcpForm.img.value,
              name: this.dbcpForm.name.value,
            },
            template: this.template,
          },
        }]
      }
    };

    // start the dispatcher
    dispatchers.shareDispatcher.start(utils.getRuntime(this), {
      address,
      shareConfig,
      bMailContent,
    });

    (<any>this.$refs.shareModal).hide();
  }
}
