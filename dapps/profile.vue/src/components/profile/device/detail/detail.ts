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
import { FileHandler, } from '@evan.network/ui';

// internal
import * as dispatchers from '../../../../dispatchers/registry';
import ProfileMigrationLibrary from '../../../../lib/profileMigration';

interface DeviceDetailFormInterface extends EvanForm {
  dataStreamSettings: EvanFormControl;
  location: EvanFormControl;
  manufacturer: EvanFormControl;
  owner: EvanFormControl;
  serialNumber: EvanFormControl;
  settings: EvanFormControl;
  type: EvanFormControl;
}

@Component({ })
export default class DeviceDetailForm extends mixins(EvanComponent) {
  /**
   * Address for that the data should be loaded
   */
  @Prop() address;

  /**
   * Evan form instance for device details data.
   */
  deviceDetailForm: DeviceDetailFormInterface = null;

  /**
   * Watch for dispatcher updates
   */
  listeners: Array<any> = [ ];

  /**
   * Load the mail details
   */
  async created() {
    // watch for save updates
    this.listeners.push(dispatchers.updateProfileDispatcher.watch(($event: any) => {
      if ($event.detail.status === 'finished' || $event.detail.status === 'deleted') {
        this.loadProfileData();
      }
    }));

    // load profile data
    await this.loadProfileData();
  }

  /**
   * Clear dispatcher listeners
   */
  beforeDestroy() {
    this.listeners.forEach(listener => listener());
  }

  /**
   * Load the profile data an specify the registration form.
   */
  async loadProfileData() {
    const runtime = (<any>this).getRuntime();
    const profileContract = runtime.profile.profileContract;
    const profileAddress = profileContract.options.address;
    const deviceData = await ProfileMigrationLibrary.loadProfileData(runtime, 'deviceDetails');

    // setup registration form
    this.deviceDetailForm = (<DeviceDetailFormInterface>new EvanForm(this, {
      dataStreamSettings: {
        value: deviceData.dataStreamSettings || '',
        validate: function(vueInstance: DeviceDetailForm, form: DeviceDetailFormInterface) {
          return this.value.length !== 0;
        },
      },
      location: {
        value: deviceData.location || '',
        validate: function(vueInstance: DeviceDetailForm, form: DeviceDetailFormInterface) {
          return this.value.length !== 0;
        },
      },
      manufacturer: {
        value: deviceData.manufacturer || '',
        validate: function(vueInstance: DeviceDetailForm, form: DeviceDetailFormInterface) {
          return this.value.length !== 0;
        },
      },
      owner: {
        value: deviceData.owner || '',
        validate: function(vueInstance: DeviceDetailForm, form: DeviceDetailFormInterface) {
          return this.value.length === 0 || EvanForm.validEthAddress(this.value);
        },
      },
      serialNumber: {
        value: deviceData.serialNumber || '',
        validate: function(vueInstance: DeviceDetailForm, form: DeviceDetailFormInterface) {
          return this.value.length !== 0;
        },
      },
      settings: {
        value: deviceData.settings ? deviceData.settings.files || deviceData.settings : [ ],
        uiSpecs: { type: 'files' }
      },
      type: {
        value: deviceData.type ? deviceData.type.files || deviceData.type : [ ],
        uiSpecs: { type: 'files' }
      },
    }));
  }

  async changeProfileData() {
    const formData = this.deviceDetailForm.getFormData();
    // set correct file format
    formData.settings = { files: formData.settings };
    formData.type = { files: formData.type };

    dispatchers.updateProfileDispatcher.start((<any>this).getRuntime(), {
      formData: formData,
      type: 'deviceDetails'
    });
  }
}
