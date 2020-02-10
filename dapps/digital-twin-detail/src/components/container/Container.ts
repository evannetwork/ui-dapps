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
import { EvanComponent } from '@evan.network/ui-vue-core';

@Component
export default class ContainerComponent extends mixins(EvanComponent) {
  /**
   * Show loading symbol while loading container
   */
  loading = true;

  /**
   * Clear dispatcher watchers
   */
  beforeDestroy(): void {
    this.$store.state.container.stopWatchDispatchers();
  }

  created(): void {
    this.setupContainer();
  }

  beforeRouteUpdate(): void {
    this.setupContainer();
  }

  /**
   * Returns mapped entries.
   */
  get entries() {
    return this.$store.state.container.entryKeys.map((key: string) => ({
      id: key,
      label: key,
    }));
  }

  /**
   * Setup vuex container and ensure entry data
   */
  async setupContainer(): Promise<void> {
    this.loading = true;

    this.$set(this.$store.state, 'container', this.$store.state.twin
      .containerContracts[this.$route.params.container]);

    /* if container was opened directly on dapp load, the twin detail directly started container
     * loading so skip the initial loading and wait for previous one to be finished */
    if (this.$store.state.containerPreloading) {
      const preloading = this.$store.state.containerPreloading;
      delete this.$store.state.containerPreloading;
      await preloading;
    } else {
      await this.$store.state.container.initialize();
    }

    this.$store.state.container.watchDispatchers();
    this.loading = false;
  }

  /**
   * Return the entry type 'list' / 'entry'.
   *
   * @param      {string}  entryKey  list / entry
   */
  getEntryType(entryKey: string): string {
    return this.$store.state.container.plugin.template.properties[entryKey].type;
  }
}
