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
  SearchService,
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

  @Prop()
  hasError: boolean;

  // contains list of favorites and their state
  favoriteList: Favorite[] = [];

  loadedFavorites = null;

  /**
   * Used to cancel delayed search, when user already navigated to different page
   */
  delayedLoadingTimeout: number;

  /**
   * Watch for delete dispatcher updates, so the search result can be refreshed
   */
  clearTwinDeleteWatcher: Function;

  /**
   * Flag to disable other favorite buttons.
   * This can be removed once the backend can
   * handle multiple calls at the same time
   */
  get isAnyLoading(): boolean {
    return this.favoriteList.some((fav) => fav.isLoading === true);
  }

  onSearchChange(searchTerm: string): void {
    if (this.searchTerm !== searchTerm) {
      this.searchTerm = searchTerm;
      this.performSearch();
    }
  }

  @Watch('selectedFilter') onFilterChanged(newFilter: string, oldFilter: string): void{
    if (newFilter !== oldFilter) {
      if (newFilter === 'favorites') {
        return;
      }

      this.performSearch();
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
    this.loadFavorites();

    this.clearTwinDeleteWatcher = dispatchers.twinDeleteDispatcher
      .watch(({ detail: { status } }: CustomEvent) => {
        if (status === 'finished') {
          this.delayedSearch();
        }
      });
  }

  delayedSearch(): void {
    this.delayedLoadingTimeout = window.setTimeout(() => {
      this.performSearch();
    }, 2000);
  }

  destroyed(): void {
    window.removeEventListener('keydown', this.handleSearchShortcut);
    this.clearTwinDeleteWatcher();
  }

  /**
   * Activate search when CMD+F or CTRL+F is pressed.
   */
  handleSearchShortcut(e: KeyboardEvent): void {
    if ((e.ctrlKey || e.metaKey) && e.keyCode === 70) {
      e.preventDefault();
      this.$nextTick(() => (this.$refs.searchbox as any).focusInput());
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

  handleRowClicked(twin: DigitalTwin): void {
    window.location.hash = `/${this.dapp.rootEns}/detail.digital-twin.${this.dapp.domainName}/${twin.address}`;
  }

  sortHandler(ctx: SortFilter): void {
    const { sortBy, sortDesc: reverse } = ctx;

    this.sortBy = sortBy;
    this.reverse = reverse;
    this.performSearch();
  }

  async loadFavorites(): Promise<void> {
    const favorites = await bcc.DigitalTwin.getFavorites(this.getRuntime() as any);
    try {
      const search = new SearchService(this.getRuntime());
      this.loadedFavorites = await Promise.all(favorites.map(async (favorite) => (
        await search.query('twins', {
          searchTerm: favorite,
        })).result[0]));
    } catch (ex) {
      this.loadedFavorites = [];
      // ignore
      console.log(ex);
    }
    favorites.forEach((fav) => {
      this.favoriteList.push({
        id: fav,
        isFavorite: true,
        isLoading: false,
      });
    });
  }

  async addFavorite(twin: EvanTableItem<DigitalTwin>): Promise<void> {
    const newFav = {
      id: twin.item.address,
      isFavorite: false,
      isLoading: true,
    };
    this.favoriteList = [...this.favoriteList, newFav];

    const search = new SearchService(this.getRuntime());
    this.loadedFavorites.push((await search.query('twins', {
      searchTerm: twin.item.address,
    })).result[0]);

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
    this.loadedFavorites = this.loadedFavorites.filter(
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
