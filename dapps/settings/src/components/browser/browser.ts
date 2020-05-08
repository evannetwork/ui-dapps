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
import { EvanComponent } from '@evan.network/ui-vue-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';

@Component
export default class ProfileSettingsComponent extends mixins(EvanComponent) {
  /**
   * dev mode settings
   */
  devMode = false;

  devDomainEnabled = false;

  devDomain = '';

  /**
   * Language settings
   */
  language = '';

  /**
   * Load the mail details
   */
  async created(): void {
    this.devMode = window.localStorage['evan-developer-mode'] === 'true';
    this.devDomainEnabled = !!window.localStorage['evan-dev-dapps-domain'];
    this.devDomain = window.localStorage['evan-dev-dapps-domain']
      || `test.${dappBrowser.getDomainName()}`;
    this.language = window.localStorage['evan-language'] || '';
  }

  /**
   * Current language has changed.
   */
  languageChanged(): void {
    if (this.language) {
      window.localStorage['evan-language'] = this.language;
    } else {
      delete window.localStorage['evan-language'];
    }
  }

  /**
   * Developer mode has changed
   */
  devModeChanged(): void {
    if (this.devMode) {
      window.localStorage['evan-developer-mode'] = this.devMode;
    } else {
      delete window.localStorage['evan-developer-mode'];
    }

    this.devDomainChanged();
  }

  /**
   * Dev domain has changed
   */
  devDomainChanged(): void {
    // only save the input, when the dev domains are enabled
    if (this.devMode && this.devDomainEnabled) {
      window.localStorage['evan-dev-dapps-domain'] = this.devDomain;
    } else {
      // else clear the value
      delete window.localStorage['evan-dev-dapps-domain'];
    }
  }
}
