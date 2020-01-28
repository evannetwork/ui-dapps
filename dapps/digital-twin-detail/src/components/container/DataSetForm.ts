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
import { EvanComponent, EvanForm, EvanFormControlOptions } from '@evan.network/ui-vue-core';

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
   * Return the easy type definition from a ajv schema (e.g. used to detect file fields).
   *
   * @param      {any}      subSchema   ajv sub schema
   * @return     {string}   The type.
   */
  static getSchemaType(subSchema: any): string {
    // check if it's a file
    if (subSchema && subSchema.$comment) {
      let $comment;

      try {
        $comment = JSON.parse(subSchema.$comment);
      } catch (ex) {
        // could not parse comment
      }

      if ($comment && $comment.isEncryptedFile) {
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
  addPropertyToForm(name: string, type: string): void {
    const control: EvanFormControlOptions = {
      uiSpecs: {
        attr: {
          // translate it before, so the formular will use correct fallback translations
          label: this.$t(`${this.i18nScope}.properties.${name}.label`, name),
          placeholder: this.$t(`${this.i18nScope}.properties.${name}.placeholder`, ''),
        },
        type: 'input',
      },
      value: this.value[name],
    };

    switch (type) {
      case 'files': {
        control.uiSpecs.type = 'files';
        break;
      }
      case 'object': {
        control.uiSpecs.type = 'json';
        break;
      }
      case 'array': {
        control.uiSpecs.type = 'json';
        break;
      }
      default: {
        control.uiSpecs.attr.type = type;
        break;
      }
    }

    this.form.addControl(name, control);
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
        ));

        break;
      }
      default: {
        this.addPropertyToForm('__root__', type);

        break;
      }
    }
  }
}
