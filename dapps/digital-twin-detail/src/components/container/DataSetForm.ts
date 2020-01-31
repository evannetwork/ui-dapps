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
import {
  EvanComponent,
  EvanForm,
  EvanFormControl,
  EvanFormControlOptions,
} from '@evan.network/ui-vue-core';


// check min / max value configuration for array types
const ajvMinMaxProperties = {
  array: {
    min: 'minItems',
    max: 'maxItems',
  },
  files: {
    min: 'maxItems',
    max: 'maxItems',
  },
  string: {
    min: 'minLength',
    max: 'maxLength',
  },
  number: {
    min: 'minimum',
    max: 'maximum',
  },
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
    const i18nScope = '_twin-detail.container.validation';
    // array of functions that should be executed to validate the specific controlOpts
    const validationChecks: ((value, number) => boolean|string)[] = [];

    // only check validation for supported types
    if (ajvMinMaxProperties[type]) {
      const min = subSchema[ajvMinMaxProperties[type].min];
      const max = subSchema[ajvMinMaxProperties[type].max];

      if (!Number.isNaN(min)) {
        controlOpts.uiSpecs.attr.required = true; // eslint-disable-line no-param-reassign
        validationChecks.push((value, valueLength) => {
          if (valueLength < min) {
            return this.$t(`${i18nScope}.${type}.min`, { number: min });
          }
          return true;
        });
      }

      if (!Number.isNaN(max)) {
        validationChecks.push((value, valueLength) => {
          if (valueLength > max) {
            return this.$t(`${i18nScope}.${type}.max`, { number: max });
          }
          return true;
        });
      }
    }

    // check for custom nested validation
    if (type === 'array' || type === 'object') {
      controlOpts.uiSpecs.attr.required = true; // eslint-disable-line no-param-reassign
      validationChecks.push((value) => {
        // transform values into an array, so we can support correct array validation
        let validationValues = value;
        if (!Array.isArray(validationValues)) {
          validationValues = [validationValues];
        }

        // nested validation
        const validator = new Validator({ schema: type === 'array' ? subSchema.items : subSchema });
        const checkFails = [].concat(
          ...validationValues.map((subValue) => validator.validate(subValue)),
        ).filter((result) => result !== true);
        if (checkFails.length !== 0) {
          return checkFails
            .map((error) => `${error.dataPath} - ${error.message}`)
            .join(', ');
        }
        return true;
      });
    }

    // ignore boolean values, validation for nested objects is also not supported
    if (validationChecks.length > 0) {
      // eslint-disable-next-line no-param-reassign
      controlOpts.validate = (
        dbcpForm: DataSetFormComponent,
        form: EvanForm,
        control: EvanFormControl,
      ): boolean|string => {
        const valueLength = (type === 'number' ? control?.value : control?.value?.length) || 0;

        for (let i = 0; i < validationChecks.length; i += 1) {
          const validation = validationChecks[i](control.value, valueLength);
          if (validation !== true) {
            return validation;
          }
        }

        return true;
      };
    }
  }
}
