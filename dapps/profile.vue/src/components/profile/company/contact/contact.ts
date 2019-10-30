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
   * Only allow the following countries
   */
  @Prop({ default: countries, }) restrictCountries: Array<string>;

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
    this.onlyEdit && (this.$refs.form as any).setEditMode(true);
  }

  /**
   * Load the mail details
   */
  async loadProfileData() {
    let contactData = this.data || this.$store.state.profileDApp.data.contact || { };

    // setup registration form
    this.form = (<ContactFormInterface>new EvanForm(this, {
      country: {
        value: contactData.country || 'DE',
        validate: function(vueInstance: CompanyContactForm, form: ContactFormInterface) {
          // resubmit postalCode validation
          form.postalCode.value = form.postalCode.value;
          return this.value && this.value.length !== 0 && vueInstance.restrictCountries.indexOf(this.value) !== -1;
        },
        uiSpecs: {
          type: 'v-select',
          attr: {
            options: this.countryOptions,
          }
        }
      },
      city: {
        value: contactData.city || '',
        validate: function(vueInstance: CompanyContactForm) {
          return this.value.length !== 0;
        },
      },
      postalCode: {
        value: contactData.postalCode || '',
        validate: function(vueInstance: CompanyContactForm, form: ContactFormInterface) {
          // check postcode validity only in germany
          return form.country.value === 'DE' ?
            /^\d{5}$/.test(this.value) :
            true;
        },
      },
      streetAndNumber: {
        value: contactData.streetAndNumber || '',
        validate: function(vueInstance: CompanyContactForm) {
          return this.value.length !== 0;
        },
      },
      website: {
        value: contactData.website || '',
        validate: function(vueInstance: CompanyContactForm) {
          return !this.value ||
            /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:\/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm.test(this.value);
        },
      },
    }));
  }

  async changeProfileData() {
    const formData = this.form.getFormData();

    dispatchers.updateProfileDispatcher.start((<any>this).getRuntime(), {
      address: this.$store.state.profileDApp.address,
      formData,
      type: 'contact'
    });
  }

  getCountriesOption(): OptionInterface[] {
    return countries
      .map(isoCode => {
        return { value: isoCode, label: (this as any).$t(`_countries.${isoCode}`), };
      })
      .sort((countryA, countryB) => {
          return countryA.label - countryB.label;
      });
  }
}
