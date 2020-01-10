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
import * as dappBrowser from '@evan.network/ui-dapp-browser';

@Component
export default class DigitalTwinDetailComponent extends mixins(EvanComponent) {
  async mounted() {
    await this.startDetailDApp();
  }

  async startDetailDApp() {
    this.$el.innerHTML = `
      <div class="evan-loading w-100 h-100 pt-5 pb-5 text-center">
        <div class="spinner-border text-primary"></div>
      </div>
    `;
    // save loading el, so it can be removed after the dapp was started
    const loadingEl = this.$el.children[0];

    const containerEl = document.createElement('div');
    this.$el.appendChild(containerEl);

    // startup the dapp
    await dappBrowser.dapp.startDApp('evan-twin-detail.evan', containerEl);

    // remove loading element
    if (loadingEl.parentElement) {
      loadingEl.parentElement.removeChild(loadingEl);
    }
  }
}
