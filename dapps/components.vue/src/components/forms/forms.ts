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
import { EvanComponent } from '@evan.network/ui-vue-core';

@Component({ })
export default class Forms extends mixins(EvanComponent) {
  isPublic = true
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
