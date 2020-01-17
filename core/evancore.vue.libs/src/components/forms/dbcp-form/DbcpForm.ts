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
   * Contract address for the contract that should be saved
   */
  @Prop() contractAddress: string;

  /**
   * Contracts dbcp description
   */
  @Prop() description: any;

  /**
   * Shows the owner input box.
   */
  @Prop() owner: string;

  /**
   * Shows the type input box.
   */
  @Prop() type: string;

  /**
   * Dbcp formular instance
   */
  formInstance: DbcpFormInterface;

  /**
   * New uploaded image
   */
  image = null;

  /**
   * setup form
   */
  created(): void {
    this.formInstance = new EvanForm(this, {
      name: {
        validate: (dbcpForm: DbcpFormComponent, formInstance: DbcpFormInterface): boolean => {
          return formInstance.name.value.length !== 0;
        },
        value: this.description.name,
        uiSpecs: {
          attr: {
            required: true,
          },
          type: 'input',
        }
      },
      description: {
        value: this.description.description,
      },
    }) as DbcpFormInterface;
  }

  /**
   * Return the current description
   */
  getDescription(): any {
    return {
      description: this.formInstance.getFormData(),
      image: this.image,
    }
  }
}