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
import { EvanUIDigitalTwin, utils } from '@evan.network/digitaltwin.lib';

import * as dispatchers from '../../dispatchers/registy';

interface CreateFormInterface extends EvanForm {
  address: EvanFormControl;
  description: EvanFormControl;
  img: EvanFormControl;
  name: EvanFormControl;
  type: EvanFormControl;
  useAddress: EvanFormControl;
}

@Component({ })
export default class CreateComponent extends mixins(EvanComponent) {
  /**
   * Digital twin that should be used for edition
   */
  uiDT = null;

  /**
   * formular specific variables
   */
  createForm: CreateFormInterface = null;

  /**
   * Watch for updates, when the twin gets created
   */
  watchForCreation: Function;

  /**
   * ref handlers
   */
  reactiveRefs: any = { };

  /**
   * Show loading during uiDT initialization
   */
  loading = true;

  /**
   * Setup the form.
   */
  async created() {
    this.uiDT = new EvanUIDigitalTwin('dt-create');
    await this.uiDT.initialize(this, utils.getRuntime(this));

    this.createForm = (<CreateFormInterface>new EvanForm(this, {
      name: {
        value: (this.uiDT.dbcp && this.uiDT.dbcp.name) ? this.uiDT.dbcp.name : '',
        validate: function(vueInstance: CreateComponent, form: CreateFormInterface) {
          return this.value.trim().length !== 0;
        }
      },
      useAddress: {
        value: false,
        validate: function(vueInstance: CreateComponent, form: CreateFormInterface) {
          // force form evaluation
          form.address.value = form.address.value;

          return true;
        }
      },
      address: {
        value: '',
        validate: function(vueInstance: CreateComponent, form: CreateFormInterface) {
          return !form.useAddress.value || this.value.trim().length !== 0;
        }
      },
    }));

    // watch for creation to redirect to the correct page after creation
    this.watchForCreation = dispatchers.digitaltwinCreateDispatcher
      .watch(($event: CustomEvent) => {
        const instance = $event.detail.instance;

        // when the synchronisation has finished, navigate to the correct entry
        if (instance.status === 'finished') {
          const dapp = (<any>this).dapp;
          window.location.hash = [
            dapp.rootEns,
            `digitaltwins.${ dapp.domainName }`,
            `digitaltwin.${ dapp.domainName }`,
            (instance.data.address === 'dt-create' ? '' : instance.data.address) ||
            instance.data.contractAddress
          ].join('/');

          this.hideModal();
        }
      });

    this.loading = false;
  }

  /**
   * Remove listeners
   */
  beforeDestroy() {
    this.watchForCreation && this.watchForCreation();
  }

  /**
   * Ensure ens domain address and trigger the address check
   */
  checkAddress() {
    const ensField = this.reactiveRefs.ensField;
    const ensActions = this.reactiveRefs.ensActions;

    if (ensField) {
      if (ensField.lookupForm.isValid) {
        ensField.checkAddressEnsDomain();
        ensActions.checkAddress(this.createForm.address.value);
      }
    }
  }

  /**
   * Create the new digitaltwin
   *
   * @param      {boolean}  triggerDispatcher  should the dispatcher be triggered or the ens address
   *                                           be checked?
   */
  createDigitalTwin(triggerDispatcher = !this.createForm.useAddress.value) {
    if (!triggerDispatcher) {
      this.checkAddress();
    } else {
      // hide create modal
      (<any>this.$refs.createModalQuestion).show();
    }
  }

  /**
   * Start the create dispatcher.
   */
  triggerCreateDispatcher() {
    (<any>this.$refs.createModalQuestion).hide();

    this.uiDT.dbcp.name = this.createForm.name.value;
    this.uiDT.dbcp.description = this.createForm.description.value;

    dispatchers.digitaltwinCreateDispatcher.start(utils.getRuntime(this), {
      address: this.createForm.useAddress.value ? this.createForm.address.value :
        this.uiDT.address,
      dbcp: this.uiDT.dbcp,
      isFavorite: this.uiDT.isFavorite,
    });
  }

  /**
   * Shows the create modal.
   */
  showModal() {
    (<any>this).$refs.createModal.show();
  }

  /**
   * Hide the create modal.
   */
  hideModal() {
    (<any>this).$refs.createModal.hide();
  }
}
