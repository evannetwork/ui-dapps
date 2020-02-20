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
import EvanComponent from '../../component';

/**
 * Search input with a placeholder label, that can be used as a normal text
 * element such as heading.
 */
@Component
export default class SearchBoxComponent extends mixins(EvanComponent) {
  @Prop() id: string;

  isActiveSearch = false;

  searchTerm = '';

  onBlur(): void {
    if (this.searchTerm.length === 0) {
      this.isActiveSearch = false;
    }
  }

  async focusInput(): Promise<void> {
    this.isActiveSearch = true;
    this.searchTerm = '';
    await this.$nextTick();
    (this.$refs.searchInput as HTMLInputElement).focus();
  }
}
