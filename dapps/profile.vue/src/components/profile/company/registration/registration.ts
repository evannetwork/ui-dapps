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

// internal
import * as dispatchers from '../../../../dispatchers/registry';
import ProfileMigrationLibrary from '../../../../lib/profileMigration';

interface RegistrationFormInterface extends EvanForm {
  company: EvanFormControl;
  court: EvanFormControl;
  register: EvanFormControl;
  registerNumber: EvanFormControl;
  salesTaxID: EvanFormControl;
}

@Component({ })
export default class CompanyRegistrationForm extends mixins(EvanComponent) {
  /**
   * Address for that the data should be loaded
   */
  @Prop() address;

  /**
   * Evan form instance for registration data.
   */
  registrationForm: RegistrationFormInterface = null;

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
    const registrationData = await ProfileMigrationLibrary.loadProfileData(runtime, 'registration');

    // setup registration form
    this.registrationForm = (<RegistrationFormInterface>new EvanForm(this, {
      company: {
        value: registrationData.company || '',
        validate: function(vueInstance: CompanyRegistrationForm, form: RegistrationFormInterface) {
          return this.value.length !== 0;
        },
      },
      court: {
        value: registrationData.court || '',
        validate: function(vueInstance: CompanyRegistrationForm, form: RegistrationFormInterface) {
          return this.value.length !== 0;
        },
      },
      register: {
        value: registrationData.register || '',
        validate: function(vueInstance: CompanyRegistrationForm, form: RegistrationFormInterface) {
          return this.value.length !== 0;
        },
        uiSpecs: {
          type: 'select',
          attr: {
            options: [
              { value: 'germany', label: '_profile.company.registration.countries.germany', }
            ],
          }
        }
      },
      registerNumber: {
        value: registrationData.registerNumber || '',
        validate: function(vueInstance: CompanyRegistrationForm, form: RegistrationFormInterface) {
          return this.value.length !== 0;
        },
      },
      salesTaxID: {
        value: registrationData.salesTaxID || '',
        validate: function(vueInstance: CompanyRegistrationForm, form: RegistrationFormInterface) {
          return this.value.length !== 0;
        },
      },
    }));
  }

  async changeProfileData() {
    dispatchers.updateProfileDispatcher.start((<any>this).getRuntime(), {
      formData: this.registrationForm.toObject(),
      type: 'registration'
    });
  }
}
