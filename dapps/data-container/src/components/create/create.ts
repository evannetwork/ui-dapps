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
import { getRuntime } from '../../utils';

interface CreateInterface extends EvanForm {
  description: EvanFormControl;
  img: EvanFormControl;
  name: EvanFormControl;
  type: EvanFormControl;
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
   * identity address, where the container should be created for
   */
  identityAddress = '';

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
  templates: Array<string> = [
    'metadata',
    'list'
  ];

  /**
   * Setup the form.
   */
  created() {
    const splitHash = (<any>this).dapp.baseHash.split('/');
    this.identityAddress = splitHash
      [splitHash.indexOf(`identities.${ (<any>this).dapp.domainName }`) + 1];

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
      type: {
        value: this.templates[0]
      },
      img: {
        value: '',
      },
    }));

    // configure steps and it' titles
    this.steps = [
      {
        title: '_datacontainer.createForm.general',
      },
      {
        title: '_datacontainer.createForm.container-configuration',
        disabled: () => !this.createForm.isValid
      },
    ];

    this.loading = false;
    this.$nextTick(() => this.createForm.name.$ref.focus());
  }

  /**
   * Create the new container
   */
  create() {
    dispatchers.createDispatcher.start(getRuntime(this), {
      description: this.createForm.description.value,
      identityAddress: this.identityAddress,
      img: this.createForm.img.value,
      name: this.createForm.name.value,
      type: this.createForm.type.value,
    });
  }
}
