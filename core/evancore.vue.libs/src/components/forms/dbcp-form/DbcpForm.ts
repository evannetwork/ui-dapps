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

import Component, { mixins } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import EvanFormComponent from '../form/form';
import EvanFormControl from '../../../formControl';
import EvanForm from '../../../form';

interface DbcpFormInterface extends EvanForm {
  description: EvanFormControl;
  img: EvanFormControl;
  name: EvanFormControl;
  owner: EvanFormControl;
  type: EvanFormControl;
}


@Component
export default class DbcpFormComponent extends mixins(EvanFormComponent) {
  /**
   * Contracts dbcp description
   */
  @Prop({
    default: {
      name: '',
      description: '',
    },
  }) description: any;

  /**
   * Contracts dbcp description
   */
  @Prop({
    default: 300,
  }) maxDescriptionChars: number;

  /**
   * Dbcp formular instance
   */
  dbcpForm: DbcpFormInterface = null;

  /**
   * New uploaded image
   */
  image = null;

  /**
   * setup form
   */
  created(): void {
    this.dbcpForm = new EvanForm(this, {
      name: {
        validate: (dbcpForm: DbcpFormComponent, form: DbcpFormInterface):
          boolean => form.name.value.length !== 0,
        value: this.description.name || '',
        uiSpecs: {
          attr: {
            required: true,
          },
          type: 'input',
        },
      },
      description: {
        validate: (dbcpForm: DbcpFormComponent, form: DbcpFormInterface): boolean => {
          if (form.description.value.length < this.maxDescriptionChars) {
            return true;
          }

          return this.$t('_evan.dbcp-form.description.error', {
            maxDescriptionChars: this.maxDescriptionChars,
          });
        },
        value: this.description.description,
        uiSpecs: {
          attr: {
            hint: this.$t('_evan.dbcp-form.description.hint', {
              maxDescriptionChars: this.maxDescriptionChars,
            }),
            rows: 5,
          },
          type: 'textarea',
        },
      },
    }) as DbcpFormInterface;
  }

  /**
   * Return the current description
   */
  getDescription(): any {
    return {
      ...this.dbcpForm.getFormData(),
      imgSquare: this.image || this.description.imgSquare,
    };
  }
}
