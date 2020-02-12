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
*/

// vue imports
import Vue from 'vue';
import Component, { mixins } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

// evan.network imports
import { EvanComponent, EvanForm, EvanFormControl } from '@evan.network/ui-vue-core';
import * as bcc from '@evan.network/api-blockchain-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';
import { FileHandler } from '@evan.network/ui';

// internal
import * as dispatchers from '../../../../dispatchers/registry';

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
   * Load the mail details
   */
  async created() {
    // load profile data
    await this.loadProfileData();
  }

  /**
   * Load the profile data an specify the registration form.
   */
  async loadProfileData() {
    const deviceData = this.$store.state.profileDApp.data.deviceDetails || {};

    // setup registration form
    this.deviceDetailForm = (new EvanForm(this, {
      type: {
        value: deviceData.type || '',
      },
      location: {
        value: deviceData.location || '',
      },
      manufacturer: {
        value: deviceData.manufacturer || '',
      },
      owner: {
        value: deviceData.owner || '',
      },
      serialNumber: {
        value: deviceData.serialNumber || '',
      },
      settings: {
        value: deviceData.settings ? deviceData.settings.files || deviceData.settings : [],
        uiSpecs: { type: 'files' },
      },
      dataStreamSettings: {
        value: deviceData.dataStreamSettings ? deviceData.dataStreamSettings.files
          || deviceData.dataStreamSettings : [],
        uiSpecs: { type: 'files' },
      },
    }) as DeviceDetailFormInterface);
  }

  async changeProfileData() {
    const formData = this.deviceDetailForm.getFormData();
    // set correct file format
    formData.settings = { files: formData.settings };
    formData.dataStreamSettings = { files: formData.dataStreamSettings };

    dispatchers.updateProfileDispatcher.start(this.getRuntime(), {
      address: this.$store.state.profileDApp.address,
      formData,
      type: 'deviceDetails',
    });
  }
}
