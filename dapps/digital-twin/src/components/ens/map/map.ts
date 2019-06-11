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

import { EvanComponent, EvanForm, EvanFormControl } from '@evan.network/ui-vue-core';
import * as bcc from '@evan.network/api-blockchain-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';
import { utils } from '@evan.network/digitaltwin.lib';

import * as dispatchers from '../../../dispatchers/registy';

interface LookupFormInterface extends EvanForm {
  address: EvanFormControl;
}

@Component({ })
export default class MapComponent extends mixins(EvanComponent) {
  /**
   * Digital twin address, that should be bound.
   */
  @Prop() digitalTwinAddress;

  /**
   * Watch if the current contract address is binding
   */
  watchForBinding: Function;

  /**
   * Switch the texts for the current lookup modal.
   */
  lookupModalScope = '';

  /**
   * Address that was returned by the lookup form
   */
  ensAddress: string;

  /**
   * gets this digital twin bind to a ens address?
   */
  binding = false;

  /**
   * ref handlers
   */
  reactiveRefs: any = { };

  /**
   * formular specific variables
   */
  lookupForm: LookupFormInterface = null;

  /**
   * Watch for updates
   */
  created() {
    this.$emit('init', this);

    this.lookupForm = (<LookupFormInterface>new EvanForm(this, {
      address: {
        value: '',
        validate: function(vueInstance: MapComponent, form: LookupFormInterface) {
          return this.value.trim().length !== 0;
        }
      },
    }));

    const watchForBinding = async ($event?: CustomEvent) => {
      const ensAddresses = (await dispatchers.mapEnsDispatcher
        .getInstances(utils.getRuntime(this)))
        .filter((inst: any) =>
          inst.data.contractAddress === this.$route.params.digitalTwinAddress
        )
        .map((inst: any) => inst.data.ensAddress);

      // set binding and ens address type
      this.binding = ensAddresses.length > 0;
      if (this.binding) {
        this.ensAddress = ensAddresses[0];
      }

      if ($event) {
        // when the synchronisation has finished, navigate to the correct entry
        const instance = $event.detail.instance;
        if (!this.binding && instance.status === 'finished') {
          (<any>this).evanNavigate(instance.data.ensAddress);
        }
      }
    };

    watchForBinding();
    this.watchForBinding = dispatchers.mapEnsDispatcher.watch(watchForBinding);
  }

  /**
   * Remove watch binding listener.
   */
  beforeDestroy() {
    this.watchForBinding && this.watchForBinding();
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
        ensActions.checkAddress(this.lookupForm.address.value);
      }
    }
  }

  /**
   * Takes the twin address from the lookup form component and opens it.
   *
   * @param      {any}  eventResult  twin address that should be opened
   */
  openTwin(eventResult: any) {
    if (eventResult.type === 'open') {
      this.lookupModalScope = 'exists';
      this.ensAddress = '';
    } else if (eventResult.type === 'create') {
      this.ensAddress = this.lookupForm.address.value = eventResult.address;
      this.lookupModalScope = 'available';
    } else {
      this.lookupModalScope = '';
    }

    this.lookupModalScope && (<any>this).$refs.lookupModal.show();
  }

  /**
   * Map the twin to the specific ens address.
   */
  mapEns() {
    dispatchers.mapEnsDispatcher.start(utils.getRuntime(this), {
      ensAddress: this.ensAddress,
      contractAddress: this.digitalTwinAddress || this.$route.params.digitalTwinAddress,
    });

    (<any>this).$refs.lookupModal.hide();
  }
}
