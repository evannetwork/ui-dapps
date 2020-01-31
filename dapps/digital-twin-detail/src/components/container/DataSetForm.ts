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
import Component, { mixins } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { Validator } from '@evan.network/api-blockchain-core';
import ajvI18n from 'ajv-i18n';
import {
  EvanComponent,
  EvanForm,
  EvanFormControl,
  EvanFormControlOptions,
} from '@evan.network/ui-vue-core';


// check min / max value configuration for array types
const ajvMinProperties = {
  files: 'minItems',
  number: 'minimum',
  string: 'minLength',
};

@Component
export default class DataSetFormComponent extends mixins(EvanComponent) {
  /**
   * Data set name (entry / listentry)
   */
  @Prop() name: string;

  /**
   * DBCP entry data schema
   */
  @Prop() dataSchema: { properties: { [param: string]: { type: 'string' }}};

  /**
   * Current data set value.
   */
  @Prop() value: any;

  /**
   * Show the loading symbol and disable the accept button.
   */
  @Prop({
    type: Boolean,
    default: false,
  }) isLoading: boolean;

  /**
   * Dynamic formular definition for the corresponding dataSchema.
   */
  form: EvanForm = null;

  /**
   * I18N scope for translating data set properties
   */
  i18nScope: string = null;

  /**
   * is the subschema type is only primitive and no object (string, number, files)
   */
  isPrimitive = false;

  /**
   * Return the easy type definition from a ajv schema (e.g. used to detect file fields).
   *
   * @param      {any}      subSchema   ajv sub schema
   * @return     {string}   The type.
   */
  static getSchemaType(subSchema: any): string {
    // check if it's a file
    if (subSchema?.$comment) {
      let $comment;

      try {
        $comment = JSON.parse(subSchema.$comment);
      } catch (ex) {
        // could not parse comment
      }

      if ($comment?.isEncryptedFile) {
        return 'files';
      }
    }

    return subSchema?.type;
  }

  /**
   * Takes a data schema property and add's it to the formular.
   *
   * @param      {string}  name    property name
   * @param      {string}  type    property type
   */
  addPropertyToForm(name: string, type: string, subSchema: any): void {
    const control: EvanFormControlOptions = {
      uiSpecs: {
        attr: {
          // translate it before, so the formular will use correct fallback translations
          label: this.isPrimitive ? false : this.$t(`${this.i18nScope}.properties.${name}.label`, name),
          placeholder: this.isPrimitive
            ? this.$t(`${this.i18nScope}.placeholder`, '')
            : this.$t(`${this.i18nScope}.properties.${name}.placeholder`, ''),
        },
        type: 'input',
      },
      value: '',
    };

    if (this.value) {
      if (this.isPrimitive) {
        control.value = this.value;
      } else {
        control.value = this.value[name];
      }
    }

    // check all avaialable types and configure special form control requirements
    const { logger } = this.getRuntime();
    switch (type) {
      case 'array': {
        control.uiSpecs.type = 'json';
        // test for valid json
        try {
          JSON.stringify(JSON.parse(control.value));
        } catch (ex) {
          control.value = [];
          logger.log(`[${this.$route.params.twin}][${this.$route.params.container}][${this.name}] `
            + `Could not parse value of property ${name}`, 'error');
        }

        break;
      }
      case 'boolean': {
        control.uiSpecs.type = 'checkbox';
        control.value = !!control.value;
        break;
      }
      case 'files': {
        control.uiSpecs.type = 'files';
        control.value = control.value?.files || [];
        break;
      }
      case 'object': {
        control.uiSpecs.type = 'json';
        // test for valid json
        try {
          JSON.stringify(JSON.parse(control.value));
        } catch (ex) {
          control.value = { };
          logger.log(`[${this.$route.params.twin}][${this.$route.params.container}][${this.name}] `
            + `Could not parse value of property ${name}`, 'error');
        }
        break;
      }
      case 'number': {
        control.uiSpecs.attr.type = 'number';
        break;
      }
      case 'string': {
        control.uiSpecs.attr.type = 'text';
        break;
      }
      default: {
        control.uiSpecs.attr.type = type;
        break;
      }
    }

    // add form validation
    this.setControlValidation(control, type, subSchema);

    // add the control to the current formular definition
    this.form.addControl(name, control);
    this.$set(control, 'value', control.value);
    /* set the control directly dirty, so empty initial values will be directly validated and the
       form will be blocked */
    this.form[name].dirty = true;
    this.form[name].validate();
  }

  /**
   * Setup i18n scope and form structure.
   */
  created(): void {
    this.i18nScope = `${this.$route.params.container}.${this.name}`;
    this.form = new EvanForm(this, { });

    const type = DataSetFormComponent.getSchemaType(this.dataSchema);
    switch (type) {
      case 'object': {
        Object.keys(this.dataSchema.properties).forEach((property) => this.addPropertyToForm(
          property,
          DataSetFormComponent.getSchemaType(this.dataSchema.properties[property]),
          this.dataSchema.properties[property],
        ));

        break;
      }
      default: {
        this.isPrimitive = true;
        this.addPropertyToForm('primitive', type, this.dataSchema);

        break;
      }
    }
  }

  /**
   * Returns the current data from the dynamic data set formular
   */
  getTwinFormData(): any {
    const formData = this.form.getFormData();

    // format file to a container API understandable format
    this.form.controls.forEach((key: string) => {
      const uiSpecs = this.form[key]?.uiSpecs;

      if (uiSpecs?.type === 'files') {
        formData[key] = { files: formData[key] };
      } else if (uiSpecs.attr.type === 'number') {
        formData[key] = parseFloat(formData[key]);
      }
    });

    return this.isPrimitive
      ? formData.primitive
      : formData;
  }

  /**
   * Sets the control validation.
   *
   * @param      {EvanFormControl}  control    The control
   * @param      {string}           type       The type
   * @param      {any}              subSchema  The sub schema
   */
  setControlValidation(controlOpts: EvanFormControlOptions, type: string, subSchema: any): void {
    // check if min value is set required flag
    if (type === 'array' || type === 'object'
      || (ajvMinProperties[type] && !Number.isNaN(subSchema[ajvMinProperties[type]]))) {
      controlOpts.uiSpecs.attr.required = true; // eslint-disable-line no-param-reassign
    }

    // eslint-disable-next-line no-param-reassign
    controlOpts.validate = (
      dbcpForm: DataSetFormComponent,
      form: EvanForm,
      control: EvanFormControl,
    ): boolean|string => {
      // nested validation
      const validator = new Validator({ schema: subSchema });
      const validation = validator.validate(control.value);
      if (validation !== true) {
        const locale = this.$i18n.locale();
        (ajvI18n[locale] || ajvI18n.en)(validation);

        return validation.map((error) => error.message).join(', ');
      }
      return true;
    };
  }
}
