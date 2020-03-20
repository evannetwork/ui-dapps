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

interface ContactFormInterface extends EvanForm {
  city: EvanFormControl;
  country: EvanFormControl;
  postalCode: EvanFormControl;
  streetAndNumber: EvanFormControl;
  website: EvanFormControl;
}

interface OptionInterface {
  value: string;
  label: string;
}

@Component({})
export default class CompanyContactForm extends mixins(EvanComponent) {
  /**
   * Address for that the data should be loaded
   */
  @Prop() address;

  /**
   * Apply required fiels from outside.
   */
  @Prop({ default: [] }) required;

  /**
   * Only allow the following countries
   */
  @Prop({ default: countries }) restrictCountries: Array<string>;

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
  @Prop() data: ContactFormInterface;

  /**
   * Evan form instance for registration data.
   */
  form: ContactFormInterface = null;

  /**
   * All available countries
   */
  countryOptions: OptionInterface[];

  /**
   * Load the mail details
   */
  async created() {
    // load country options
    this.countryOptions = this.getCountriesOption();

    // load profile data
    await this.loadProfileData();
  }

  /**
   * Directly open the formular edit mode.
   */
  mounted() {
    if (this.onlyEdit) {
      (this.$refs.form as any).setEditMode(true);
    }
  }

  /**
   * Load the mail details
   */
  async loadProfileData() {
    const contactData = this.data || this.$store.state.profileDApp.data.contact || { };

    // setup registration form
    this.form = (new EvanForm(this, {
      country: {
        value: contactData.country,
        validate: (vueInstance, form, control: EvanFormControl): boolean|string => {
          // resubmit postalCode validation
          form.postalCode.value = form.postalCode.value; // eslint-disable-line
          vueInstance.$emit('countryChanged', control.value);
          return vueInstance.required.indexOf('country') === -1
            || (control.value && control.value.length !== 0
              && vueInstance.restrictCountries.indexOf(control.value) !== -1);
        },
        uiSpecs: {
          type: 'v-select',
          attr: {
            options: this.countryOptions,
            required: !this.stacked || this.required.indexOf('country') !== -1,
          },
        },
      },
      streetAndNumber: {
        value: contactData.streetAndNumber || '',
        validate: (vueInstance, form, control: EvanFormControl): boolean|string => (
          vueInstance.required.indexOf('streetAndNumber') === -1 || control.value.length !== 0),
        uiSpecs: {
          attr: {
            required: !this.stacked || this.required.indexOf('streetAndNumber') !== -1,
          },
          type: 'input',
        },
      },
      postalCode: {
        value: contactData.postalCode || '',
        validate: (vueInstance, form, control: EvanFormControl): boolean|string => {
          if (control.value) {
            return (form.country.value === 'DE' ? /^\d{5}$/.test(control.value) : true);
          }

          return vueInstance.required.indexOf('postalCode') === -1;
        },
        uiSpecs: {
          type: 'input',
          attr: {
            required: () => !this.stacked || (
              this.form.country.value === 'DE' && this.required.indexOf('postalCode') !== -1),
          },
        },
      },
      city: {
        value: contactData.city || '',
        validate: (vueInstance, form, control: EvanFormControl): boolean|string => (
          vueInstance.required.indexOf('city') === -1 || control.value.length !== 0
        ),
        uiSpecs: {
          type: 'input',
          attr: {
            required: !this.stacked || this.required.indexOf('city') !== -1,
          },
        },
      },
      website: {
        value: contactData.website || '',
        validate: (vueInstance, form, control: EvanFormControl): boolean|string => (
          !control.value
            || /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/gm.test(control.value)
        ),
        uiSpecs: {
          attr: {
            required: !this.stacked || this.required.indexOf('website') !== -1,
          },
          type: 'input',
        },
      },
    }) as ContactFormInterface);
  }

  async changeProfileData() {
    const formData = this.form.getFormData();

    dispatchers.updateProfileDispatcher.start(this.getRuntime(), {
      address: this.$store.state.profileDApp.address,
      formData,
      type: 'contact',
    });
  }

  getCountriesOption(): OptionInterface[] {
    return countries
      .map((isoCode: string) => ({ value: isoCode, label: this.$t(`_countries.${isoCode}`) }))
      .sort((a, b) => {
        if (a.label > b.label) {
          return 1;
        }
        if (b.label > a.label) {
          return -1;
        }

        return 0;
      });
  }
}
