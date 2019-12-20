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
import Vue from 'vue';
import Component, { mixins } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

// evan.network imports
import * as bcc from '@evan.network/api-blockchain-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';
import { Dispatcher, DispatcherInstance } from '@evan.network/ui';
import { dispatchers, } from '@evan.network/digitaltwin';
import { EvanComponent } from '@evan.network/ui-vue-core';
import { EvanUIDigitalTwin, utils, } from '@evan.network/digitaltwin.lib';

@Component({ })
export default class TwinsRootComponent extends mixins(EvanComponent) {
  /**
   * show general loading
   */
  loading = true;

  /**
   * Watch for hash updates and load digitaltwin detail, if a digitaltwin was laod
   */
  hashChangeWatcher: any;

  /**
   * Was the component destroyed, before the hash change event was bind?
   */
  wasDestroyed: boolean;

  /**
   * Tabs for top navigation
   */
  navEntries: any = [ ];

  /**
   * Initialize when the user has logged in.
   */
  async initialize() {
    this.navEntries = [
      {
        href: `${ (<any>this).dapp.fullUrl }/my-twins`,
        icon: 'mdi mdi-cube-outline',
        id: 'dt-overview',
        text: '_digitaltwins.digitaltwins.title',
      },
      {
        href: `${ (<any>this).dapp.fullUrl }/my-plugins`,
        icon: 'mdi mdi-cube-unfolded',
        id: 'dt-plugins',
        text: '_digitaltwins.plugins.title',
      },
    ];
  }
}
