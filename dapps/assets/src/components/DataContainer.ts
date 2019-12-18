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
import { Prop, Watch } from 'vue-property-decorator';
import { Route } from 'vue-router';

// evan.network imports
import { EvanComponent } from '@evan.network/ui-vue-core';

import SearchService from './SearchService';

@Component
export default class DataContainerComponent extends mixins(EvanComponent) {
  searchTerm = '';
  search = new SearchService((this as any).getRuntime());
  data = [];
  isLoading = false;
  page = 0;
  count = 20;
  total = null;

  @Prop({
    default: 'twins'
  }) type: string;

  /**
   * Watch for changes in the search query
   */
  @Watch('$route', { immediate: true, deep: true })
  onRouteChange (to: Route) {
    this.searchTerm = to.params.query;

    this.initialQuery();
  }

  async initialQuery() {
    this.isLoading = true;
    this.page = 0;
    this.data = [];
    const { result, total } = await this.search.query(this.type, { searchTerm: this.searchTerm });

    this.total = total;
    this.data = result;

    this.isLoading = false;
  }

  async fetchMore() {
    if (this.isLoading || this.data.length === this.total) {
      return;
    }
    this.isLoading = true;
    this.page += 1;

    const options = {
      page: this.page,
      count: this.count,
      searchTerm: this.searchTerm
    };

    const { result } = await this.search.query(this.type, options);

    this.data = [...this.data, ...result];
    this.isLoading = false;
  }
}
