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

  You can be released from the requirements of the GNU Affero General Public
  License by purchasing a commercial license.
  Buying such a license is mandatory as soon as you use this software or parts
  of it on other blockchains than evan.network.

  For more information, please contact evan GmbH at this address:
  https://evan.network/license/
*/

// vue imports
import Component, { mixins } from 'vue-class-component';
import Vue from 'vue';
import { Prop, Watch } from 'vue-property-decorator';

// evan.network imports
import { EvanComponent, EvanForm, EvanFormControl } from '@evan.network/ui-vue-core';

interface SampleFormInterface extends EvanForm {
  field1: string;
  field2: string;
  field3: number;
  select: string;
  files: any;
}

@Component({ })
export default class Forms extends mixins(EvanComponent) {
  /**
   * formular flags
   */
  isPublic = true;
  stacked = false;
  onlyForm = false;

  /**
   * Rerender everything
   */
  showForms = true;

  wurstAmount1 = ''
  wurstAmount2 = 'a'
  wurstAmount3 = 0
  wurstAmount4 = 0

  options = [
    {label: 'Bockwurst', value: 'bocki'},
    {label: 'Knacker', value: 'knacki'},
    'Wienerwurst',
    'Mett',
    'Hanns Wurst'
  ]

  sampleForm: SampleFormInterface = null;

  created() {
    this.sampleForm = new EvanForm(this, {
      field1: {
        value: '',
      },
      field2: {
        value: '',
        validate: function(vueInstance: Forms, form: SampleFormInterface) {
          return this.value.length !== 0;
        },
      },
      field3: {
        value: '',
        validate: function(vueInstance: Forms, form: SampleFormInterface) {
          return this.value.length !== 0;
        },
        uiSpecs: {
          type: 'input',
          attr: {
            error: 'custom error',
            label: 'custom label',
            placeholder: 'custom placeholder',
            type: 'number',
            size: 6
          }
        }
      },
      select: {
        value: '',
        validate: function(vueInstance: Forms, form: SampleFormInterface) {
          return this.value.length !== 0;
        },
        uiSpecs: {
          type: 'select',
          attr: {
            options: this.options,
            size: 6,
          }
        }
      },
      files: {
        value: [ ],
        validate: function(vueInstance: Forms, form: SampleFormInterface) {
          return this.value.length !== 0;
        }
      },
    }) as SampleFormInterface;
  }

  handleSubmit(ev: Event): Promise<any> {
    console.log(ev)

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('resolved')

        resolve('saved')
      }, 1000)
    })
  }
}
