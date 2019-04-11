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

import * as dispatchers from '../../dispatchers/registry';
import * as utils from '../../utils';
import ContainerCache from '../../container-cache';

interface CreateInterface extends EvanForm {
  description: EvanFormControl;
  img: EvanFormControl;
  name: EvanFormControl;
  template: EvanFormControl;
}

@Component({ })
export default class CreateComponent extends mixins(EvanComponent) {
  /**
   * Show loading symbol
   */
  loading = true;

  /**
   * Is a datacontainer currently in creation?
   */
  creating = false;

  /**
   * formular specific variables
   */
  createForm: CreateInterface = null;

  /**
   *   digitalTwin address, where the container should be created for
   */
  digitalTwinAddress = '';

  /**
   * Available steps represented by it's titles
   */
  steps: Array<any> = [ ];

  /**
   * current active step
   */
  activeStep = 0;

  /**
   * Available templates
   */
  templates: Array<any> = [
    {
      title: '_datacontainer.createForm.base-template',
      type: 'metadata',
      properties: { },
    }
  ];

  /**
   * unmount dispatcher listeners
   */
  creationWatcher: Function;

  /**
   * Setup the form.
   */
  async created() {
    const runtime = utils.getRuntime(this);
    const splitHash = (<any>this).dapp.baseHash.split('/');
    this.digitalTwinAddress = splitHash
      [splitHash.indexOf(`digitaltwins.${ (<any>this).dapp.domainName }`) + 1];

    // TODO: load templates
    this.createForm = (<CreateInterface>new EvanForm(this, {
      name: {
        value: '',
        validate: function(vueInstance: CreateComponent, form: CreateInterface) {
          return this.value.length !== 0;
        }
      },
      description: {
        value: ''
      },
      template: {
        value: 0
      },
      img: {
        value: '',
      },
    }));

    if ((<any>this).$route.params.cloneContainer) {
      const container = utils.getContainer(<any>runtime, (<any>this).dapp.contractAddress);
      const description = await container.getDescription();
      const template = await container.toTemplate(true);

      this.activeStep = 1;
      this.createForm.name.value = description.name;
      this.createForm.description.value = description.description;
      this.$set(this.templates, 0, template);
    }

    // configure steps and it' titles
    this.steps = [
      {
        title: '_datacontainer.createForm.general',
        disabled: () => false
      },
      {
        title: '_datacontainer.createForm.container-configuration',
        disabled: () => !this.createForm.isValid
      },
    ];

    this.loading = false;
    this.watchForCreation();
    this.$nextTick(() => this.createForm.name && this.createForm.name.$ref.focus());
  }

  /**
   * Unmount dispatcher watchers
   */
  beforeDestroy() {
    this.creationWatcher && this.creationWatcher();
  }

  /**
   * Create the new container
   */
  async create() {
    const runtime = utils.getRuntime(this);

    dispatchers.createDispatcher.start(runtime, {
      description: this.createForm.description.value,
      digitalTwinAddress: this.digitalTwinAddress,
      img: this.createForm.img.value,
      name: this.createForm.name.value,
      template: this.templates[this.createForm.template.value],
    });

    (<any>this.$refs.createModal).hide();
    await (new ContainerCache(runtime.activeAccount)).delete('create');
  }

  /**
   * Start a listener to watch for creation updates
   */
  async watchForCreation() {
    const watch = async ($event?: any) => {
      const instances = await dispatchers.createDispatcher.getInstances(utils.getRuntime(this));
      const beforeCreating = this.creating;

      this.creating = Object
        .keys(instances)
        .filter((key) => instances[key].data.digitalTwinAddress === this.digitalTwinAddress)
        .length > 0;

      if (!this.creating && beforeCreating && $event) {
        (<any>this).evanNavigate($event.data.contractAddress);
      }
    }

    watch();
    if (!this.creationWatcher) {
      this.creationWatcher = dispatchers.createDispatcher.watch(() => this.watchForCreation());
    }
  }
}