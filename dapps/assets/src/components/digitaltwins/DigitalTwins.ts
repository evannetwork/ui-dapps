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
import * as bcc from '@evan.network/api-blockchain-core';
import { debounce } from 'lodash';
import {
  dispatchers,
  DigitalTwin,
} from '@evan.network/digital-twin-lib';
import { EvanComponent, EvanTableItem } from '@evan.network/ui-vue-core';
import { Prop, Watch } from 'vue-property-decorator';

interface SortFilter {
  filter?: any;
  sortBy?: string;
  sortDesc?: boolean;
  perPage?: number;
  currentPage?: number;
  apiUrl?: string;
}

interface Favorite {
  id: string;
  isFavorite: boolean;
  isLoading: boolean;
}

@Component
export default class DigitalTwinsComponent extends mixins(EvanComponent) {
  sortBy = 'updated';

  reverse = true;

  selectedFilter = 'all';

  columns = [
    { key: 'icon', label: '', thClass: 'th-icon' },
    {
      key: 'name',
      label: this.$t('_assets.digitaltwins.name'),
      sortable: true,
      tdClass: 'truncate',
    },
    {
      key: 'owner',
      label: this.$t('_assets.digitaltwins.owner'),
      sortable: true,
      thClass: 'th-important',
      tdClass: 'truncate',
    },
    {
      key: 'updated',
      label: this.$t('_assets.digitaltwins.updated'),
      sortable: true,
      thClass: 'th-date',
    },
    {
      key: 'created',
      label: this.$t('_assets.digitaltwins.created'),
      sortable: true,
      thClass: 'th-date',
    },
    { key: 'isFavorite', label: '', thClass: 'th-icon' },
  ];

  searchTerm = '';

  @Prop({
    default: [],
  })
  data: any[];

  @Prop({
    default: true,
  })
  isLoading: boolean;

  @Prop({
    required: true,
  })
  fetchMore: Function;

  @Prop({
    required: true,
  })
  search: Function;

  // contains list of favorites and their state
  favoriteList: Favorite[] = [];

  /**
   * Used to cancel delayed search, when user already navigated to different page
   */
  delayedLoadingTimeout: number;

  /**
   * Flag to disable other favorite buttons.
   * This can be removed once the backend can
   * handle multiple calls at the same time
   */
  get isAnyLoading(): boolean {
    return this.favoriteList.some((fav) => fav.isLoading === true);
  }

  onSearchChange(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.searchHandlerDebounced();
  }

  @Watch('selectedFilter') onFilterChanged(newFilter: string, oldFilter: string): void{
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

  beforeDestroy(): void {
    // cancel delayed search, when user is already leaving the page
    if (this.delayedLoadingTimeout) {
      window.clearTimeout(this.delayedLoadingTimeout);
    }
  }

  async mounted(): Promise<void> {
    this.searchTerm = this.$route.params.query || '';
    this.search(this.searchTerm);

    window.addEventListener('keydown', this.handleSearchShortcut);

    // initial loading of favorites
    const favorites = await bcc.DigitalTwin.getFavorites(this.getRuntime() as any);
    favorites.forEach((fav) => {
      this.favoriteList.push({
        id: fav,
        isFavorite: true,
        isLoading: false,
      });
    });
  }

  delayedSearch(): void {
    this.delayedLoadingTimeout = window.setTimeout(() => {
      this.performSearch();
    }, 5000);
  }

  destroyed(): void {
    window.removeEventListener('keydown', this.handleSearchShortcut);
  }

  /**
   * Activate search when CMD+F or CTRL+F is pressed.
   */
  handleSearchShortcut(e: KeyboardEvent): void {
    if ((e.ctrlKey || e.metaKey) && e.keyCode === 70) {
      e.preventDefault();
      this.searchTerm = '';
      this.$nextTick(() => (this.$refs.searchInput as HTMLInputElement).focus());
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
      const bottomOfWindow = clientHeight + scrollTop >= scrollHeight - offset;

      if (bottomOfWindow) {
        this.performFetchMore();
      }
    },
    100,
    { trailing: true },
  );

  /**
   * Helper method to keep class this-context for debounced search.
   */
  performSearch(): void {
    if (typeof this.search === 'function') {
      this.search(this.searchTerm, {
        sortBy: this.sortBy,
        reverse: this.reverse,
        type: this.selectedFilter,
      });
    }
  }

  /**
   * Helper method to keep class this-context for debounced fetch.
   */
  performFetchMore(): void {
    if (typeof this.fetchMore === 'function') {
      this.fetchMore({
        sortBy: this.sortBy,
        reverse: this.reverse,
        type: this.selectedFilter,
      });
    }
  }

  /**
   * Debounce the search.
   */
  searchHandlerDebounced = debounce(this.performSearch, 250, {
    trailing: true,
    leading: false,
  });

  handleRowClicked(twin: DigitalTwin): void {
    window.location.hash = `/${this.dapp.rootEns}/detail.digital-twin.${this.dapp.domainName}/${twin.address}`;
  }

  sortHandler(ctx: SortFilter): void {
    const { sortBy, sortDesc: reverse } = ctx;

    this.sortBy = sortBy;
    this.reverse = reverse;
    this.searchHandlerDebounced();
  }

  async addFavorite(twin: EvanTableItem<DigitalTwin>): Promise<void> {
    const newFav = {
      id: twin.item.address,
      isFavorite: false,
      isLoading: true,
    };
    this.favoriteList = [...this.favoriteList, newFav];

    await dispatchers.twinFavoriteAddDispatcher.start(this.getRuntime(), {
      address: twin.item.address,
    });

    newFav.isFavorite = true;
    newFav.isLoading = false;
  }

  async removeFavorite(twin: EvanTableItem<DigitalTwin>): Promise<void> {
    this.favoriteList.find(
      (fav) => twin.item.address === fav.id,
    ).isLoading = true;

    await dispatchers.twinFavoriteRemoveDispatcher.start(this.getRuntime(), {
      address: twin.item.address,
    });

    this.favoriteList = this.favoriteList.filter(
      (fav) => twin.item.address !== fav.id,
    );
  }

  isFavorite(twin: EvanTableItem<DigitalTwin>): boolean {
    return this.favoriteList.some((fav) => twin.item.address === fav.id);
  }

  /**
   * Check if specific twin is loading favorite
   * @param twin Digital Twin
   */
  isFavoriteLoading(twin: EvanTableItem<DigitalTwin>): boolean {
    const fav = this.favoriteList.find((item) => twin.item.address === item.id);
    return fav ? fav.isLoading : false;
  }
}
