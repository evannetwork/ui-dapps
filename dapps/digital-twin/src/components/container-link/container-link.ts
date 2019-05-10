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

import * as dispatchers from '../../dispatchers/registy';
import EvanUIDigitalTwin from '../../digitaltwin';
import * as utils from '../../utils';
import * as dataContainerAPI from '@evan.network/datacontainer.digitaltwin';

interface ContainerLinkFormInterface extends EvanForm {
  address: EvanFormControl;
  name: EvanFormControl;
}

@Component({ })
export default class ContainerLinkComponent extends mixins(EvanComponent) {
  /**
   * Should a container directly linked into a digital twin?
   */
  digitalTwinAddress = '';

  /**
   * Should a specific container be linked directly into any twin?
   */
  containerAddress = '';

  /**
   * Digital twin Address that exists and was created
   */
  validDTAddress = '';

  /**
   * Digital twin address that not exists and must be created
   */
  createDTAddress = '';

  /**
   * Current ui dt twin that should be created
   */
  uiDT: EvanUIDigitalTwin = null;

  /**
   * formular specific variables
   */
  containerLinkForm: ContainerLinkFormInterface = null;

  /**
   * Watch for digital twin creation
   */
  createDtWatcher: Function;

  /**
   * Watch for container linking
   */
  linkContainerWatcher: Function;

  /**
   * Checking validity of data container input?
   */
  checking = false;

  /**
   * Gets a container for the current digitaltwin address linked?
   */
  linking = false;

  /**
   * ref handlers
   */
  reactiveRefs: any = { };

  /**
   * Run initial digital twin check address only at first startup
   */
  initialAddressCheck = true;

  /**
   * Check digital twin addresses and container addresses. Start evaluation and create container
   * link form
   */
  async created() {
    const runtime = utils.getRuntime(this);

    this.digitalTwinAddress = (<any>this).$route.params.digitalTwinAddress;
    this.containerAddress = (<any>this).$route.params.containerAddress;

    this.containerLinkForm = (<ContainerLinkFormInterface>new EvanForm(this, {
      name: {
        value: '',
        validate: function(vueInstance: ContainerLinkComponent, form: ContainerLinkFormInterface) {
          return this.value.trim().length !== 0;
        }
      },
      address: {
        value: this.containerAddress || '',
        validate: function(vueInstance: ContainerLinkComponent, form: ContainerLinkFormInterface) {
          return this.value.trim().length !== 0;
        }
      },
    }));

    // wait until the dt was created and check again
    this.createDtWatcher = dispatchers.digitaltwinCreateDispatcher.watch(async () => {
      const instances = await dispatchers.digitaltwinCreateDispatcher
        .getInstances(runtime);

      if (instances.length === 0) {
        (<any>this.$refs.createDTAddress).hide();
        this.uiDT = null;
        this.$nextTick((<any>this.reactiveRefs.ensActions).checkAddress());
      }
    });

    // watch for linking to be finished
    this.linkContainerWatcher = dataContainerAPI.containerDispatchers.linkDispatcher
      .watch(() => this.checkLinking());
  }

  /**
   * Remove listeners
   */
  beforeDestroy() {
    this.createDtWatcher();
    this.linkContainerWatcher();
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
        ensActions.checkAddress(ensField.lookupForm.address.value);
      }
    }
  }

  /**
   * Takes the twin address from the lookup form component and opens it.
   *
   * @param      {any}  eventResult  twin address that should be opened
   */
  async useAddress(eventResult: any) {
    this.digitalTwinAddress = this.reactiveRefs.ensField.lookupForm.address.value =
      eventResult.address;

    if (eventResult.type === 'create') {
      const uiDT = new EvanUIDigitalTwin(eventResult.address);
      await uiDT.initialize(this, utils.getRuntime(this));

      this.uiDT = uiDT;
      (<any>this.$refs.createDTAddress).show();
    } else if (eventResult.type === 'open') {
      this.validDTAddress = eventResult.address;
      this.checkLinking();
    }
  }

  /**
   * Link the current container address into the digital twin.
   */
  async linkContainer() {
    const runtime = utils.getRuntime(this);
    const container = dataContainerAPI.utils.getContainer(
      runtime,
      this.containerLinkForm.address.value
    );

    // show loading animation
    this.checking = true;

    // try to load data from the container, to ensure it's an data container
    let valid = true;
    let description;
    try {
      await container.toTemplate();
      description = await container.getDescription();
    } catch (ex) {
      valid = false;
      runtime.logger.log(ex, 'error');
    }

    this.checking = false;

    // if the address is valid, start the link process
    if (valid) {
      // apply the also the description properties, so the container will be shown already in
      // digital twin left panel
      dataContainerAPI.containerDispatchers.linkDispatcher.start(runtime, {
        containerAddress: this.containerLinkForm.address.value,
        description: description.description,
        digitalTwinAddress: this.validDTAddress,
        img: description.imgSquare,
        name: this.containerLinkForm.name.value,
      });
    // else show an error
    } else {
      (<any>this.$refs.invalidContainerModal).show();
    }
  }

  /**
   * Check for the current selected digital twin, if a container gets linked.
   */
  async checkLinking() {
    const runtime = utils.getRuntime(this);

    // if a valid address was selected check for this dt to gets a new linked container
    if (this.validDTAddress) {
      // load link instances and check for corresponding instances
      const instances = await dataContainerAPI.containerDispatchers.linkDispatcher
        .getInstances(runtime);
      const contextInstances = instances
        .map(instance => instance.data)
        .filter((data) => data.digitalTwinAddress === this.validDTAddress);

      // load previous container address and set linking status
      const beforeLink = this.linking;
      if (contextInstances.length > 0) {
        this.containerLinkForm.address.value = contextInstances[0].containerAddress;
        this.containerLinkForm.name.value = contextInstances[0].name;
        this.linking = true;
      } else {
        this.linking = false;

        // if linking was finished, navigate to the container
        if (beforeLink) {
          const dapp = (<any>this).dapp;
          (<any>this).evanNavigate([
              this.validDTAddress,
              `datacontainer.digitaltwin.${ dapp.domainName }`,
              this.containerLinkForm.address.value,
            ].join('/')
          );
        }
      }
    }
  }
}
