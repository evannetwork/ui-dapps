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
import { DigitalTwinTemplate } from '@evan.network/api-blockchain-core';
import { DAppTwin, dispatchers } from '@evan.network/digital-twin-lib';
import { downloadObject } from '@evan.network/ui';
import { EvanComponent } from '@evan.network/ui-vue-core';


@Component
export default class DigitalTwinDetailComponent extends mixins(EvanComponent) {
  /**
   * Show loading symbol
   */
  loading = true;
  exporting = false;

  get isFavorite(): boolean {
    return this.$store.state.twin.favorite;
  }

  set isFavorite(flag: boolean) {
    console.log('New flag', flag);
    
    this.$store.state.twin.favorite = flag;
    console.log('store', this.$store.state.twin.favorite);
    
  }

  /**
   * Watch for hash updates and load digitaltwin detail, if a digitaltwin was load
   */
  hashChangeWatcher: any;

  /**
   * Template definition of the current twin.
   */
  exportedTemplate: DigitalTwinTemplate;

  navItems = [
    {
      key: 'overview',
      icon: 'mdi mdi-view-dashboard-outline'
    },
    {
      key: 'data',
      icon: 'mdi mdi-file-document-box-outline'
    },
    {
      key: 'verifications',
      icon: 'mdi mdi-checkbox-marked-circle-outline'
    },
    {
      key: 'sharings',
      icon: 'mdi mdi-share-variant'
    },
    {
      key: 'did',
      icon: 'mdi mdi-identifier'
    }
  ].map(entry => {
    return {
      label: `_twin-detail.${entry.key}.${entry.key}-title`,
      icon: entry.icon,
      to: { name: entry.key }
    };
  });

  mounted() {
    setInterval(() => {
      console.log(this.$store.state.twin.favorite);
    }, 1000)
    // console.log(this);
    
  }

  /**
   * Clear the hash change watcher
   */
  beforeDestroy() {
    // clear listeners
    this.hashChangeWatcher && window.removeEventListener('hashchange', this.hashChangeWatcher);
    this.$store.state.twin && this.$store.state.twin.stopWatchDispatchers();
  }

  close() {
    window.location.hash = `/${this.dapp.rootEns}/assets.${this.dapp.domainName}/digitaltwins`;
  }

  /**
   * Setup digital twin functionalities.
   */
  async initialize(): Promise<void> {
    let beforeTwin;

    // watch for url changes and load different twin data
    this.hashChangeWatcher = async () => {
      // only load another twin, when address has changed
      if (beforeTwin !== this.$route.params.twin) {
        this.loading = true;
        this.$store.state.twin && this.$store.state.twin.stopWatchDispatchers();
        this.$store.state.twin = new DAppTwin(this, this.getRuntime(), this.$route.params.twin);

        await this.$store.state.twin.initialize();

        beforeTwin = this.$store.state.twin.contractAddress;
        this.loading = false;
      }
    };

    await this.hashChangeWatcher();
    // watch for hash changes, so the contract address can be simply replaced within the url
    window.addEventListener('hashchange', this.hashChangeWatcher);
  }

  async addFavorite(): Promise<void> {
    console.log('Fav?', this.isFavorite);
    await dispatchers.twinFavoriteAddDispatcher
      .start(this.getRuntime(), { address: this.$store.state.twin.contractAddress });
    this.isFavorite = true;
    console.log('Fav?', this.isFavorite);
  }

  async removeFavorite(): Promise<void> {
    console.log('Fav?', this.isFavorite);
    await dispatchers.twinFavoriteRemoveDispatcher
      .start(this.getRuntime(), { address: this.$store.state.twin.contractAddress });
      this.isFavorite = false;
    console.log('Fav?', this.isFavorite);
  }

  /**
   * Exports the current opened twin as templated and downloads it as a json file.
   */
  async exportTwinTemplate(): Promise<void> {
    (this.$refs.exportModal as any).show();

    if (!this.exportedTemplate) {
      this.exporting = true;
      this.exportedTemplate = await this.$store.state.twin.exportAsTemplate();
      this.exporting = false;
    }
  }

  /**
   * Triggers the previously exported twin template.
   */
  downloadTwinTemplate() {
    downloadObject(this.$store.state.twin.description.name, this.exportedTemplate);
    (this.$refs.exportModal as any).hide();
  }
}
