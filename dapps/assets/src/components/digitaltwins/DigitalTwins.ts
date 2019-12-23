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
import moment from 'moment';

// evan.network imports
import { EvanComponent } from '@evan.network/ui-vue-core';
import { debounce } from 'lodash';
import { Prop, Watch } from 'vue-property-decorator';

interface SortFilter {
  filter?: any;
  sortBy?: string;
  sortDesc?: boolean;
  perPage?: number;
  currentPage?: number;
  apiUrl?: string;
}

@Component
export default class DigitalTwinsComponent extends mixins(EvanComponent) {
  sortBy = 'updated';
  reverse = true;
  selectedFilter = 'all';

  columns = [
    { key: 'icon', label: '' },
    { key: 'name', sortable: true },
    { key: 'owner', sortable: true },
    { key: 'updated', sortable: true },
    { key: 'created', sortable: true },
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

  @Watch('selectedFilter')
  onFilterChanged(newFilter: string, oldFilter: string) {
    if (newFilter !== oldFilter) {
      if (newFilter === 'favorites') {
        // TODO: query by all IDs from favorites

        alert('This function will be available soon.');
        this.selectedFilter = oldFilter;

        return;
      }

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

      if (bottomOfWindow) {
        this.performFetchMore();
      }
    },
    100,
    { trailing: true }
  );

  /**
   * Helper method to keep class this-context for debounced search.
   */
  performSearch() {
    if (typeof this.search === 'function') {
      this.search(this.searchTerm, { sortBy: this.sortBy, reverse: this.reverse, type: this.selectedFilter });
    }
  }

  /**
   * Helper method to keep class this-context for debounced fetch.
   */
  performFetchMore() {
    if (typeof this.fetchMore === 'function') {
      this.fetchMore({ sortBy: this.sortBy, reverse: this.reverse, type: this.selectedFilter });
    }
  }

  /**
   * Debounce the search for 0.25s.
   */
  searchHandlerDebounced = debounce(
    this.performSearch,
    250,
    { trailing: true, leading: false }
  );

  handleSearchBlur() {
    if (this.searchTerm.length === 0) {
      this.isActiveSearch = false;
    }
  }

  sortHandler(ctx: SortFilter) {
    const { sortBy, sortDesc: reverse } = ctx;

    this.sortBy = sortBy;
    this.reverse = reverse;
    this.searchHandlerDebounced();
  }
}
