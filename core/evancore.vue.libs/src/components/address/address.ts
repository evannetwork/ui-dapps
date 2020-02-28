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
import { bccUtils } from '@evan.network/ui';
import { Prop } from 'vue-property-decorator';
import EvanComponent from '../../component';

/**
 * Displays a account / contract address and applies generalized interactions like copy, open in
 * explorer, ...
 *
 * @class      AddressComponent @selector      evan-address
 */
@Component({ })
export default class AddressComponent extends mixins(EvanComponent) {
  /**
   * Address that should be displayed
   */
  @Prop() address;

  /**
   * Specific custom classes
   */
  @Prop() class;

  did = '';

  /**
   * Should the interactions are shown?
   */
  hover = false;

  async created(): Promise<void> {
    this.did = await bccUtils.getDidFromAddress(this.getRuntime(), this.address);
  }

  /**
   * Copy the current address to the users clipboard
   */
  copyAddress(toCopy: string): void {
    // create temporary element
    const $temp: HTMLInputElement = document.createElement('input');
    document.body.appendChild($temp);
    // apply copy value
    $temp.value = toCopy;
    // trigger copy
    $temp.select();
    document.execCommand('copy');
    // remove element
    document.body.removeChild($temp);
    // show success
    this.$toasted.show(this.$t('_evan.address.copied'));
  }
}
