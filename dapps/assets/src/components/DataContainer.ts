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
import { profileUtils } from '@evan.network/ui';
import { EvanComponent } from '@evan.network/ui-vue-core';

import { SearchService, DigitalTwin } from '@evan.network/digital-twin-lib';

@Component
export default class DataContainerComponent extends mixins(EvanComponent) {
  count = 20;

  data = [];

  hasError = false;

  isLoading = true;

  page = 0;

  search = new SearchService(this.getRuntime());

  searchTerm = '';

  total = null;

  @Prop({
    default: 'twins',
  })
  type: string;

  /**
   * Mapping of account addresses to name / alias resolving promises
   */
  aliasMapping: { [ address: string ]: Promise<string> } = { };

  /**
   * Check the search results, if the name / alias of an owner can be loaded
   */
  async ensureOwnerNames(searchResults: DigitalTwin[]): Promise<void> {
    const runtime = this.getRuntime();

    await Promise.all(searchResults.map(async (result): Promise<void> => {
      if (result.owner && runtime.web3.utils.isAddress(result.owner)) {
        if (!this.aliasMapping[result.owner]) {
          this.aliasMapping[result.owner] = profileUtils.getUserAlias(runtime, result.owner);
        }

        // eslint-disable-next-line no-param-reassign
        result.owner = await this.aliasMapping[result.owner];
      }
    }));
  }

  async initialQuery(searchTerm = '', sorting = {}): Promise<void> {
    this.isLoading = true;
    this.page = 0;
    this.data = [];
    this.hasError = false;
    this.searchTerm = searchTerm;

    try {
      const { result, total } = await this.search.query(this.type, {
        searchTerm,
        ...sorting,
      });
      await this.ensureOwnerNames(result);

      this.total = total;
      this.data = result;
    } catch (ex) {
      this.getRuntime().logger.log(ex.message, 'error');
      this.hasError = true;
      this.data = [];
    }

    this.isLoading = false;

    // Necessary for proper routing. Otherwise collision with detail dapp
    if (searchTerm && this.$route.params.query !== searchTerm) {
      this.$router.replace({ name: 'digitaltwins-search', params: { query: searchTerm } });
    } else {
      this.$router.push({ path: 'digitaltwins' });
    }
  }

  async fetchMore(sorting = {}): Promise<void> {
    if (this.isLoading || this.data.length === this.total) {
      return;
    }
    this.isLoading = true;
    this.hasError = false;
    this.page += 1;

    const options = {
      page: this.page,
      count: this.count,
      searchTerm: this.searchTerm,
      ...sorting,
    };

    try {
      const { result } = await this.search.query(this.type, options);
      await this.ensureOwnerNames(result);
      this.data = [...this.data, ...result];
    } catch (ex) {
      this.getRuntime().logger.log(ex.message, 'error');
      this.hasError = true;
      this.data = [];
    }

    this.isLoading = false;
  }
}
