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
  EvanForm,
  EvanComponent,
  EvanFormControl,
  EvanFormControlOptions,
} from '@evan.network/ui-vue-core';
import { DAppContainer } from '@evan.network/digital-twin-lib';


// check min / max value configuration for array types
const ajvMinProperties = {
  files: 'minItems',
  number: 'minimum',
  string: 'minLength',
};

@Component
export default class DataSetFormComponent extends mixins(EvanComponent) {
  /**
   * Data set name (entry / list entry)
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
   * Mirror EvanForm props
   * TODO: update to not repeat ourselves
   */
  @Prop({ default: true }) editable: boolean;

  @Prop({ default: true }) shareable: boolean;

  @Prop() handleShare: () => any;

  @Prop() onlyForm: boolean;

  /**
   * Dynamic form definition for the corresponding dataSchema.
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
   * Checks if a control definition can be marked as "required".
   *
   * @param      {EvanFormControlOptions}  controlOpts  control options, including uiSpec
   * @param      {string}                  type         type of the control (string, boolean,
   *                                                    object, ...)
   * @param      {any}                     subSchema    ajv data schema
   */
  static isControlRequired(controlOpts: EvanFormControlOptions, type: string, subSchema: any): boolean {
    // check if min value is set required flag
    return type === 'array' || type === 'object' || type === 'boolean'
      || (ajvMinProperties[type] && !Number.isNaN(subSchema[ajvMinProperties[type]]));
  }

  /**
   * Takes a data schema property and adds it to the form.
   *
   * @param      {string}  name    property name
   * @param      {string}  type    property type
   */
  addPropertyToForm(name: string, type: string, subSchema: any): void {
    const control: EvanFormControlOptions = {
      uiSpecs: {
        attr: {
          id: `dataset-input-${this.name}-${name}`,
          // translate it before, so the formular will use correct fallback translations
          label: this.isPrimitive ? '' : this.$t(`${this.i18nScope}.properties.${name}.label`, name),
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

    // check all available types and configure special form control requirements
    switch (type) {
      case 'array': {
        control.uiSpecs.type = 'json';
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
    control.uiSpecs.attr.required = DataSetFormComponent.isControlRequired(control, type, subSchema);
    control.validate = this.getControlValidate(control, type, subSchema);

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

    const type = DAppContainer.getSchemaType(this.dataSchema);
    switch (type) {
      case 'object': {
        Object.keys(this.dataSchema.properties).forEach((property) => this.addPropertyToForm(
          property,
          DAppContainer.getSchemaType(this.dataSchema.properties[property]),
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
  getFormData(): any {
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
  getControlValidate(controlOpts: EvanFormControlOptions, type: string, subSchema: any): Function {
    return (
      dbcpForm: DataSetFormComponent,
      form: EvanForm,
      control: EvanFormControl,
    ): boolean|string => {
      let controlValue = control.value;
      let validationSchema = subSchema;

      // parse input value to numbers to check for correct number format with ajv
      if (type === 'number') {
        controlValue = parseFloat(controlValue);
      } else if (type === 'files') {
        // define custom validation schema for files to match runtime file values
        validationSchema = {
          items: {
            additionalProperties: true,
            properties: {},
            type: 'object',
          },
          maxItems: subSchema.maxItems,
          minItems: subSchema.minItems,
          type: 'array',
        };
      }

      // run ajv validator and apply ajv-i18n translations
      const validator = new Validator({ schema: validationSchema });
      const validation = validator.validate(controlValue);
      if (validation !== true) {
        const locale = this.$i18n.locale();
        (ajvI18n[locale] || ajvI18n.en)(validation);

        return (validation as any[]).map((error) => error.message).join(', ');
      }
      return true;
    };
  }
}
