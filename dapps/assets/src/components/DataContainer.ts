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
import { Prop } from 'vue-property-decorator';

// evan.network imports
import { EvanComponent } from '@core/evancore.vue.libs/dist';
// import { EvanComponent } from '@evan.network/ui-vue-core';

import SearchService from './SearchService';

@Component
export default class DataContainerComponent extends mixins(EvanComponent) {
  searchTerm = '';
  search = new SearchService(this.getRuntime());
  data = [];
  isLoading = false;
  page = 0;
  count = 20;
  total = null;

  @Prop({
    default: 'twins'
  }) type: string;

  mounted() {
    this.searchTerm = this.$route.params.query || '';

    this.initialQuery(this.searchTerm);
  }

  async initialQuery(searchTerm = '', sorting = {}) {
    this.isLoading = true;
    this.page = 0;
    this.data = [];
    this.searchTerm = searchTerm;

    this.$router.push({ path: `digitaltwins/${searchTerm}` });

    const { result, total } = await this.search.query(this.type, { searchTerm, ...sorting });

    this.total = total;
    this.data = result;

    this.isLoading = false;
  }

  async fetchMore(sorting = {}) {
    if (this.isLoading || this.data.length === this.total) {
      return;
    }
    this.isLoading = true;
    this.page += 1;

    const options = {
      page: this.page,
      count: this.count,
      searchTerm: this.searchTerm,
      ...sorting
    };

    const { result } = await this.search.query(this.type, options);

    this.data = [...this.data, ...result];
    this.isLoading = false;
  }
}
