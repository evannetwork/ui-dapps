/*
  Copyright (C) 2018-present evan GmbH.

  This program is free software: you can redistribute it and/or modify it
  under the terms of the GNU Affero General Public License, version 3,
  as published by the Free Software Foundation.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty ofa
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
import axios from 'axios';

// evan.network imports
import { EvanComponent, EvanForm, EvanFormControl, getDomainName, } from '@evan.network/ui-vue-core';
import * as bcc from '@evan.network/api-blockchain-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';

// get the twin helper
import { getTranslationFromDBCP } from './twinHelper';

@Component({ })
export default class DataSetForm extends mixins(EvanComponent) {
  /**
   * Description of the container plugin.
   */
  @Prop() description: any;

  /**
   * Data schema of the set that should be displayed.
   */
  @Prop() dataSchema: any;

  /**
   * data object that should be filled.
   */
  @Prop() data: any;

  /**
   * Data set name to get translation relative to this out of dbcp description
   */
  @Prop() dataSetName: string;

  /**
   * Contains all forms, corresponding to dataSchema type.
   */
  forms: Array<EvanForm> = null;

  /**
   * Make it usable from the template
   */
  getTranslationFromDBCP: Function = null;

  /**
   * Setup twin forms.
   */
  created() {
    // bind this, so it will be passed automatically to the function
    this.getTranslationFromDBCP = getTranslationFromDBCP.bind(null, this, this.description);

    // should be an object, setup only one form
    const data = Array.isArray(this.data) ? this.data : [ this.data ];

    // setup initial formulars
    this.forms = data.map(dataObj => this.getEntryForm(dataObj));

    // send reference to parent component
    this.$emit('init', this);
  }

  /**
   * Returns a new evan form for a the given data schema.
   *
   * @param      {any}  dataObj  The data object
   */
  getEntryForm(dataObj: any) {
    const entrySchema = Array.isArray(this.data) ?
      this.dataSchema.items.properties : this.dataSchema.properties;
    const controlDefinition = { };
    const isList = Array.isArray(this.data);
    const keys = Object.keys(entrySchema);

    // add controls for all fields
    keys.forEach(key => {
      const required = entrySchema[key].minLength;

      controlDefinition[key] = {
        value: dataObj[key] || '',
        validate: (_: DataSetForm, __: EvanForm, c: EvanFormControl) => {
          // update parent
          dataObj[key] = c.value;

          // only validate when it's required
          return required ? c.value && c.value.length !== 0 : true;
        },
      };

      // setup general ui specs
      const baseKey = `${ this.dataSetName }.properties.${ key }`;
      const label = getTranslationFromDBCP(this, this.description, `${ baseKey }.label`);
      controlDefinition[key].uiSpecs = {
        attr: {
          error: this.$t('_onboarding.sign-up.twin.empty-field', { label }),
          label,
          placeholder: getTranslationFromDBCP(this, this.description, `${ baseKey }.placeholder`),
          required,
        },
      };

      // hide label and force the elements to be in one row
      if (isList) {
        controlDefinition[key].uiSpecs.attr.size = 12 / keys.length;
        controlDefinition[key].uiSpecs.attr.label = '';
      }
    });

    return new EvanForm(this, controlDefinition);
  }

  /**
   * Check if all containing formulars are valid.
   */
  isValid() {
    return this.forms.filter(form => !form.isValid).length === 0;
  }
}

