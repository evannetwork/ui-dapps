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

// evan.network imports
import { EvanComponent } from '@evan.network/ui-vue-core';
import { debounce } from 'lodash';
import { Prop, Watch } from 'vue-property-decorator';

@Component
export default class DigitalTwinsComponent extends mixins(EvanComponent) {
  columns = [
    { key: 'icon', label: '' },
    'name',
    'owner',
    'updated',
    'created',
    { key: 'actions', label: '' }
  ];
  isActiveSearch = false;

  @Prop({
    default: [],
  }) data: any[];

  @Prop({
    default: '',
  }) searchTerm: string;

  @Prop({
    default: true,
  }) isLoading: boolean;

  @Prop({
    required: true
  }) fetchMore: Function;

  @Prop({
    required: true
  }) search: Function;

  @Watch('searchTerm')
  onSearchTermChanged(searchTerm: string, oldSearchTerm: string) {
    if (searchTerm !== oldSearchTerm) {
      this.isActiveSearch = this.isActiveSearch || searchTerm.length > 0;
      this.searchHandlerDebounced();
    }
  }

  mounted() {
    this.isActiveSearch = this.searchTerm.length > 0;

    window.addEventListener('keydown', this.handleSearchShortcut);
  }

  destroyed() {
    window.removeEventListener('keydown', this.handleSearchShortcut);
  }

  /**
   * Activiate search when CMD+F or CTRL+F is pressed.
   */
  handleSearchShortcut(e: KeyboardEvent) {
    if ((e.ctrlKey || e.metaKey) && e.keyCode === 70) {
      e.preventDefault();
      this.isActiveSearch = true;
      this.searchTerm = '';
      this.$nextTick(() => (this.$refs['searchInput'] as HTMLInputElement).focus());
    }
  }

  /**
   * Watch if user scrolled down and load more twins when necessary
   */
  scrollHandler = debounce(
    async ({ target: { clientHeight, scrollTop, scrollHeight } }) => {
      if (this.isLoading) {
        return;
      }

      const offset = 200;
      let bottomOfWindow = clientHeight + scrollTop >= scrollHeight - offset;

      if (bottomOfWindow && typeof this.fetchMore === 'function') {
        this.fetchMore();
      }
    },
    100,
    { trailing: true }
  );

  /**
   * Debounce the search for 0.25s.
   */
  searchHandlerDebounced = debounce(
    () => {
      if (typeof this.search === 'function') {
        this.search(this.searchTerm);
      }
    },
    250,
    { trailing: true, leading: false }
  );

  handleSearchBlur() {
    if (this.searchTerm.length === 0) {
      this.isActiveSearch = false;
    }
  }
}
