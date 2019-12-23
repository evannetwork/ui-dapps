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

import * as bcc from '@evan.network/api-blockchain-core';
import { EvanUIDigitalTwin } from '@evan.network/digitaltwin.lib';

interface Favorite {
  id: string;
  isFavorite: boolean;
  isLoading: boolean;
}

@Component
export default class DigitalTwinsComponent extends mixins(EvanComponent) {
  columns = [
    { key: 'icon', label: '' },
    { key: 'name', label: this.$t('_assets.digitaltwins.name') },
    { key: 'owner', label: this.$t('_assets.digitaltwins.owner') },
    { key: 'updated', label: this.$t('_assets.digitaltwins.updated') },
    { key: 'created', label: this.$t('_assets.digitaltwins.created') },
    { key: 'isFavorite', label: '' }
  ];
  isActiveSearch = false;

  @Prop({
    default: []
  })
  data: any[];

  @Prop({
    default: ''
  })
  searchTerm: string;

  @Prop({
    default: true
  })
  isLoading: boolean;

  @Prop({
    required: true
  })
  fetchMore: Function;

  @Prop({
    required: true
  })
  search: Function;

  // contains list of favorites and their state
  favoriteList: Favorite[] = [];

  /**
   * Flag to disable other favorite buttons.
   * This can be remove once the backend can
   * handle multiple calls at the same time
   */
  get isAnyLoading(): boolean {
    return !!this.favoriteList.filter(fav => fav.isLoading === true).length;
  }

  @Watch('searchTerm')
  onSearchTermChanged(searchTerm: string, oldSearchTerm: string) {
    if (searchTerm !== oldSearchTerm) {
      this.isActiveSearch = this.isActiveSearch || searchTerm.length > 0;
      this.searchHandlerDebounced();
    }
  }

  async mounted() {
    this.isActiveSearch = this.searchTerm.length > 0;

    window.addEventListener('keydown', this.handleSearchShortcut);

    // initial loading of favorites
    const favorites = await bcc.DigitalTwin.getFavorites(this.getRuntime());
    favorites.forEach(fav => {
      this.favoriteList.push({
        id: fav,
        isFavorite: true,
        isLoading: false
      });
    });
  }

  destroyed() {
    window.removeEventListener('keydown', this.handleSearchShortcut);
  }

  /**
   * Activate search when CMD+F or CTRL+F is pressed.
   */
  handleSearchShortcut(e: KeyboardEvent) {
    if ((e.ctrlKey || e.metaKey) && e.keyCode === 70) {
      e.preventDefault();
      this.isActiveSearch = true;
      this.searchTerm = '';
      this.$nextTick(() =>
        (this.$refs['searchInput'] as HTMLInputElement).focus()
      );
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

  async addFavorite(twin) {
    let newFav = {
      id: twin.item.address,
      isFavorite: false,
      isLoading: true
    };
    this.favoriteList = [...this.favoriteList, newFav];

    await EvanUIDigitalTwin.getDigitalTwin(
      this.getRuntime(),
      twin.item.address
    ).addAsFavorite();

    newFav.isFavorite = true;
    newFav.isLoading = false;
  }

  async removeFavorite(twin) {
    this.favoriteList.find(
      fav => twin.item.address === fav.id
    ).isLoading = true;

    await EvanUIDigitalTwin.getDigitalTwin(
      this.getRuntime(),
      twin.item.address
    ).removeFromFavorites();

    this.favoriteList = this.favoriteList.filter(
      fav => twin.item.address !== fav.id
    );
  }

  private isFavorite(twin) {
    return this.favoriteList.filter(fav => twin.item.address === fav.id).length;
  }

  private isFavoriteLoading(twin) {
    const fav = this.favoriteList.find(item => twin.item.address === item.id);
    return fav ? fav.isLoading : false;
  }
}
