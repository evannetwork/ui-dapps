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

// evan.network imports
import { Runtime } from '@evan.network/api-blockchain-core';
import { Store } from 'vuex';
import { Dispatcher } from '@evan.network/ui';
import Component from 'vue-class-component';
import { getDomainName } from './utils';
import { StartedDAppInfo } from './interfaces';
import { EvanState, TranslateFunc } from './EvanComponentInterface';

/**
 * Evan.network component wrapper for easily accessing blockchain runtime data and active DApp information.
 *
 * @class      EvanComponent
 */

@Component
export default class EvanComponent extends Vue {
  /**
   * active dapp that was detected by the routing lib (getNextDApp)
   */
  dapp: StartedDAppInfo;

  dispatcher: Dispatcher;

  /**
   * Active dapp browser domain name
   */
  domainName: string;

  /**
   * Declare vue stuff
   */
  $i18n: any;

  $store: Store<EvanState>;

  $t: TranslateFunc;

  $toasted: any;

  /**
   * Are currently automated test running?
   */
  testMode = false;

  constructor() {
    super();

    this.dapp = this.activeDApp();
    this.domainName = getDomainName();
    this.dispatcher = this.$store.state.dispatcher;
    this.testMode = window.localStorage['evan-test-mode'] === 'true';
  }

  created(): void {
    this.$emit('init', this);
  }

  /**
   * Custom navigation method for evan vue projects. Always navigates using window.location.hash to
   * force hash changing on nested DApps.
   *
   * @param      {string}  path      path that should be navigated to
   * @param      {string}  baseHash  navigation base hash (e.g. dashboard.vue.evan, default = this.dapp.baseHash)
   */
  evanNavigate(path: string, baseHash: string = this.activeDApp().baseHash): void {
    window.location.hash = `${baseHash}/${path}`;
  }

  /**
   * Returns the active dapp object, including the current contract address, route base hash and
   * ens address
   *
   * @return     {any}  routing.getNextDApp result
   */
  activeDApp(): StartedDAppInfo {
    return this.$store.state.dapp;
  }

  /**
   * Returns the current runtime from the state or returns an dappBrowser core runtime.
   *
   * @return     {any}  bcc runtime
   */
  getRuntime(): Runtime {
    return this.$store.state.runtime;
  }
}
