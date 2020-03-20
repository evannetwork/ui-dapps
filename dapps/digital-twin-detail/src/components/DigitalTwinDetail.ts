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
import { DAppTwin, twinDeleteDispatcher } from '@evan.network/digital-twin-lib';
import { EvanComponent, NavEntryInterface } from '@evan.network/ui-vue-core';


@Component
export default class DigitalTwinDetailComponent extends mixins(EvanComponent) {
  /**
   * Show loading symbol
   */
  loading = true;

  /**
   * Flag for generic errors. Usually for wrong non-DT contracts and deleted DTs
   */
  hasError = false;

  /**
   * Watch for hash updates and load digitaltwin detail, if a digitaltwin was load
   */
  hashChangeWatcher: any;

  /**
   * Watch for delete dispatcher updates, so the search result can be refreshed
   */
  clearTwinDeleteWatcher: Function;

  navItems: NavEntryInterface[] = [];

  /**
   * Clear the hash change watcher
   */
  beforeDestroy(): void {
    this.clearTwinDeleteWatcher();

    // clear listeners
    if (this.hashChangeWatcher) {
      window.removeEventListener('hashchange', this.hashChangeWatcher);
    }

    if (this.$store.state.twin) {
      this.$store.state.twin.stopWatchDispatchers();
    }
  }

  /**
   * Go back to assets dapp.
   */
  close(): void {
    window.location.hash = `/${this.dapp.rootEns}/assets.${this.dapp.domainName}/digitaltwins`;
  }

  /**
   * Setup digital twin functionalities.
   */
  async created(): Promise<void> {
    let beforeTwin;

    // watch for url changes and load different twin data
    this.hashChangeWatcher = async (): Promise<void> => {
      // only load another twin, when address has changed
      if (this.$route.params.twin && beforeTwin !== this.$route.params.twin) {
        beforeTwin = this.$route.params.twin;

        // show loading and remove old watchers
        this.loading = true;
        if (this.$store.state.twin) {
          this.$store.state.twin.stopWatchDispatchers();
        }

        // initialize a new twin, but keep old reference until twin is loaded
        const newTwin = new DAppTwin(this, this.getRuntime(), this.$route.params.twin);

        // if container view should be loaded initially, just load it directly
        if (this.$route.params.container) {
          this.$store.state.containerPreloading = (async (): Promise<void> => {
            const container = await newTwin.setupDAppContainer(this.$route.params.container);
            await container.initialize();
          })();
        }

        // initialize twin structure
        await newTwin.initialize()
          // handle deleted and non-DT contracts
          .catch(() => {
            this.hasError = true;
            // fill empty twin data, so the sidepanel can be displayed, even in error mode
            newTwin.description = { name: '...', description: '', author: '' };
            newTwin.dispatcherStates = { };
            return null;
          });

        newTwin.watchDispatchers();

        // set new reference and hide loading
        this.$set(this.$store.state, 'twin', newTwin);
        this.loading = false;
      }
    };

    await this.hashChangeWatcher();
    // watch for hash changes, so the contract address can be simply replaced within the url
    window.addEventListener('hashchange', this.hashChangeWatcher);

    this.clearTwinDeleteWatcher = twinDeleteDispatcher
      .watch(({ detail: { status } }: CustomEvent) => {
        if (status === 'finished') {
          setTimeout(() => this.close());
        }
      });

    this.navItems = this.getNavItems();
  }

  async deleteTwin(): Promise<void> {
    (this.$refs.deleteModal as any).hide();

    await twinDeleteDispatcher.start(this.getRuntime(), {
      address: this.$store.state.twin.contractAddress,
    });
  }

  /**
   * Retrieves the array for populating navigation items.
   * Removes sharing if current user is not the twin owner.
   */
  getNavItems(): NavEntryInterface[] {
    return [
      {
        text: '_twin-detail.nav-items.overview',
        icon: 'mdi mdi-view-dashboard-outline',
        to: { name: 'overview' },
        disabled: this.hasError,
      },
      {
        text: '_twin-detail.nav-items.data',
        icon: 'mdi mdi-file-document-box-outline',
        to: { name: 'data' },
        disabled: this.hasError,
      },
      {
        text: '_twin-detail.nav-items.verifications',
        icon: 'mdi mdi-checkbox-marked-circle-outline',
        to: { name: 'verifications' },
        disabled: !this.$store.state.twin?.isOwner || this.hasError,
      },
      ...(this.$store.state.twin.isOwner ? [{
        text: '_twin-detail.nav-items.sharings',
        icon: 'mdi mdi-share-variant',
        to: { name: 'sharings' },
        disabled: !this.$store.state.twin?.isOwner || this.hasError,
      }] : []),
      {
        text: '_twin-detail.nav-items.did',
        icon: 'mdi mdi-identifier',
        to: { name: 'did' },
        disabled: this.hasError,
      },
    ];
  }

  /**
   * Truncates the description to a certain amount of characters.
   *
   * @param      {string}  desc    description that should be shortend
   * @param      {number}  maxChars  maximum length of string
   */
  getShortDescription(desc = this.$store.state.twin.description.description, maxChars = 300): string {
    return desc.length > maxChars ? `${desc.slice(0, maxChars)}...` : desc;
  }
}
