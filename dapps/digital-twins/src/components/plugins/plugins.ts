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

  You can be released from the requirements of the GNU Affero General Public
  License by purchasing a commercial license.
  Buying such a license is mandatory as soon as you use this software or parts
  of it on other blockchains than evan.network.

  For more information, please contact evan GmbH at this address:
  https://evan.network/license/
*/

// vue imports
import Vue from 'vue';
import Component, { mixins } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

// evan.network imports
import * as bcc from '@evan.network/api-blockchain-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';
import { EvanComponent, EvanForm, EvanFormControl } from '@evan.network/ui-vue-core';
import { utils } from '@evan.network/digitaltwin.lib';

@Component({ })
export default class PluginsComponent extends mixins(EvanComponent) {
  /**
   * My plugins
   */
  plugins: any = { };

  /**
   * show loading symbol
   */
  loading = true;

  /**
   * watch for plugin save opertations
   */
  saveWatcher = Function;


  /**
   * watch for plugin save opertations
   */
  shareWatcher = Function;

  /**
   * Load my plugins
   */
  async created() {
    await this.reloadPlugins();
    this.loading = false;

    this.bindDispatchers();
  }

  /**
   * Clear the contracts cache and load the plugins for the current user.
   */
  async reloadPlugins() {
    const runtime = utils.getRuntime(this);

    delete runtime.profile.trees[runtime.profile.treeLabels.contracts];
    this.plugins = await utils.getMyPlugins(runtime);
  }

  /**
   * Loads plugins.
   */
  async bindDispatchers() {
    const runtime = utils.getRuntime(this);
    let beforeSaving = -1;

    /**
     * Check current dispatcher instances and reload plugins if the save process has finished
     */
    const checkPlugins = async () => {
      const saving = await utils.pluginDispatcher.getInstances(runtime);
      const sharing = await utils.pluginShareDispatcher.getInstances(runtime);
      const savingCount = saving.length + sharing.length;

      // for reload
      if (beforeSaving < savingCount) {
        await this.reloadPlugins();
      }

      beforeSaving = savingCount;
    };

    this.saveWatcher = utils.pluginDispatcher.watch(() => checkPlugins());
    this.shareWatcher = utils.pluginDispatcher.watch(() => checkPlugins());
  }

  /**
   * Clear the dispatcher watchers.
   */
  beforeDestroy() {
    this.saveWatcher && this.saveWatcher();
    this.shareWatcher && this.shareWatcher();
  }
}
