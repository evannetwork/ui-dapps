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

// internal imports
import TwinDAppComponent from '../../TwinDAppComponent';

@Component
export default class TestContainerComponent extends mixins(TwinDAppComponent) {
  /**
   * Show loading symbol while loading container
   */
  loading = true;

  /**
   * Clear dispatcher watchers
   */
  beforeDestroy() {
    this.$store.state.container.stopWatchDispatchers();
  }

  /**
   * Setup vuex container and ensure entry data
   */
  async created() {
    this.$store.state.container = this.$store.state.twin
      .containerContracts[this.$route.params.container];

    // ensure loaded entries and start dispatcher watching
    await this.$store.state.container.ensureEntries();
    this.$store.state.container.watchDispatchers();

    this.loading = false;
  }
}
