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
import * as bcc from '@evan.network/api-blockchain-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';
import { countries } from '@evan.network/ui-countries';
import { EvanComponent, EvanForm, EvanFormControl } from '@evan.network/ui-vue-core';

// internal
import * as dispatchers from '../../../../dispatchers/registry';

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
   * Apply required fiels from outside.
   */
  @Prop({ default: [ 'company' ] }) required;

  /**
   * hides the cancel button and directly jumps into formular edit mode
   */
  @Prop() onlyEdit;

  /**
   * Display inputs with labels in oneline or stacked.
   */
  @Prop({
    default: false,
  }) stacked: boolean;

  /**
   * Render only the formular without adding the formular wrapper.
   */
  @Prop() onlyForm: boolean;

  /**
   * Data that should be passed into the component, so it should not be loaded from api.
   */
  @Prop() data: RegistrationFormInterface;

  /**
   * Evan form instance for registration data.
   */
  form: RegistrationFormInterface = null;

  /**
   * Load the mail details
   */
  async created() {
    // load profile data
    await this.loadProfileData();
  }

  /**
   * Directly open the formular edit mode.
   */
  mounted() {
    this.onlyEdit && (this.$refs.form as any).setEditMode(true);
  }

  /**
   * Load the profile data an specify the registration form.
   */
  async loadProfileData() {
    const registrationData = this.data || this.$store.state.profileDApp.data.registration || {};

    // setup registration form
    this.form = (<RegistrationFormInterface>new EvanForm(this, {
      court: {
        value: registrationData.court || '',
        validate: function(vueInstance: CompanyRegistrationForm) {
          return vueInstance.required.indexOf('court') === -1 || this.value.length !== 0;
        },
        uiSpecs: {
          attr: {
            required: !this.stacked || this.required.indexOf('court') !== -1,
          }
        },
      },
      register: {
        value: registrationData.register || 'hrb',
        uiSpecs: {
          type: 'select',
          attr: {
            options: [
              { value: 'hra', label: '_profile.company.registration.register.types.hra', },
              { value: 'hrb', label: '_profile.company.registration.register.types.hrb', },
            ],
            required: !this.stacked || this.required.indexOf('register') !== -1,
          }
        },
        validate: function(vueInstance: CompanyRegistrationForm) {
          return vueInstance.required.indexOf('register') === -1 || this.value.length !== 0;
        },
      },
      registerNumber: {
        value: registrationData.registerNumber || '',
        validate: function(vueInstance: CompanyRegistrationForm) {
          return vueInstance.required.indexOf('registerNumber') === -1 || this.value.length !== 0;
        },
        uiSpecs: {
          attr: {
            required: !this.stacked || this.required.indexOf('registerNumber') !== -1,
          }
        }
      },
      salesTaxID: {
        value: registrationData.salesTaxID || '',
        validate: function(vueInstance: CompanyRegistrationForm) {
          return vueInstance.required.indexOf('salesTaxID') === -1 || this.value.length !== 0;
        },
        uiSpecs: {
          attr: {
            required: !this.stacked || this.required.indexOf('salesTaxID') !== -1,
          }
        }
      },
    }));
  }

  async changeProfileData() {
    dispatchers.updateProfileDispatcher.start((<any>this).getRuntime(), {
      address: this.$store.state.profileDApp.address,
      formData: this.form.getFormData(),
      type: 'registration',
    });
  }
}
