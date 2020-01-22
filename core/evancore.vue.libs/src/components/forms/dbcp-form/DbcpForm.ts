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
import { Prop, Watch } from 'vue-property-decorator';

import EvanFormComponent from '../form/form';
import { EvanForm, EvanFormControl } from '../../../forms';

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
        validate: (dbcpForm: DbcpFormComponent, form: DbcpFormInterface):
          boolean => form.description.value.length < 300,
        value: this.description.description,
        uiSpecs: {
          attr: {
            hint: true,
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
