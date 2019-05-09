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
import { EvanComponent, EvanForm, EvanFormControl } from '@evan.network/ui-vue-core';
import * as bcc from '@evan.network/api-blockchain-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';
import { getRuntime } from '@evan.network/digitaltwin';
import {
  getMyTemplates,
  templateDispatcher,
  templateShareDispatcher
} from '@evan.network/datacontainer.digitaltwin';

@Component({ })
export default class TemplatesComponent extends mixins(EvanComponent) {
  /**
   * My templates
   */
  templates: any = { };

  /**
   * show loading symbol
   */
  loading = true;

  /**
   * watch for template save opertations
   */
  saveWatcher = Function;


  /**
   * watch for template save opertations
   */
  shareWatcher = Function;

  /**
   * Load my templates
   */
  async created() {
    await this.reloadTemplates();
    this.loading = false;

    this.bindDispatchers();
  }

  /**
   * Clear the contracts cache and load the templates for the current user.
   */
  async reloadTemplates() {
    const runtime = getRuntime(this);

    delete runtime.profile.trees[runtime.profile.treeLabels.contracts];
    this.templates = await getMyTemplates(runtime);
  }

  /**
   * Loads templates.
   */
  async bindDispatchers() {
    const runtime = getRuntime(this);
    let beforeSaving = -1;

    /**
     * Check current dispatcher instances and reload templates if the save process has finished
     */
    const checkTemplates = async () => {
      const saving = await templateDispatcher.getInstances(runtime);
      const sharing = await templateShareDispatcher.getInstances(runtime);
      const savingCount = saving.length + sharing.length;

      // for reload
      if (beforeSaving < savingCount) {
        await this.reloadTemplates();
      }

      beforeSaving = savingCount;
    };

    this.saveWatcher = templateDispatcher.watch(() => checkTemplates());
    this.shareWatcher = templateDispatcher.watch(() => checkTemplates());
  }

  /**
   * Clear the dispatcher watchers.
   */
  beforeDestroy() {
    this.saveWatcher && this.saveWatcher();
    this.shareWatcher && this.shareWatcher();
  }
}
