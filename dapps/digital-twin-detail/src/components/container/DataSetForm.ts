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
import { EvanComponent, EvanForm } from '@evan.network/ui-vue-core';

@Component
export default class DataSetFormComponent extends mixins(EvanComponent) {
  /**
   * DBCP entry data schema
   */
  @Prop() dataSchema: { properties: { [param: string]: { type: 'string' }}};

  /**
   * Current data set value.
   */
  @Prop() value: any;

  /**
   * Dynamic formular definition for the corresponding dataSchema.
   */
  form: EvanForm;

  /**
   * Return the easy type definition from a ajv schema (e.g. used to detect file fields).
   *
   * @param      {any}      subSchema   ajv sub schema
   * @return     {string}   The type.
   */
  static getSchemaType(subSchema: any): string {
    let type;

    // subSchema could be empty by trying to access array items schema on object or field schema
    if (subSchema) {
      // check if it's a file
      if (subSchema.$comment) {
        let $comment;

        try {
          $comment = JSON.parse(subSchema.$comment);
        } catch (ex) {
          // could not parse comment
        }

        if ($comment && $comment.isEncryptedFile) {
          type = 'files';
        }
      } else {
        type = subSchema.type;
      }
    }

    return type;
  }

  /**
   * Takes a data schema property and add's it to the formular.
   *
   * @param      {string}  name    property name
   * @param      {string}  type    property type ()
   */
  addPropertyToForm(name: string, type: string): void {
    switch (type) {
      case 'files': {
        this.form.addControl(name, {
          value: this.value[name],
          uiSpecs: {
            type: 'files',
          },
        });

        break;
      }
      case 'object': {
        this.form.addControl(name, {
          value: this.value[name],
          uiSpecs: {
            attr: {
              rows: 5,
            },
            type: 'textarea',
          },
        });

        break;
      }
      default: {
        this.form.addControl(name, {
          value: this.value[name],
          uiSpecs: {
            attr: { type },
            type: 'input',
          },
        });

        break;
      }
    }
  }

  created(): void {
    this.form = new EvanForm(this, { });

    const type = DataSetFormComponent.getSchemaType(this.dataSchema);
    switch (type) {
      case 'object': {
        Object.keys(this.dataSchema.properties).forEach((property) => this.addPropertyToForm(
          property, this.dataSchema.properties[property].type,
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
