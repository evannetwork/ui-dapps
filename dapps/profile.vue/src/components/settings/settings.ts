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
import { session, lightwallet } from '@evan.network/ui-session';
import { EvanComponent } from '@evan.network/ui-vue-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';

@Component({ })
export default class ProfileSettingsComponent extends mixins(EvanComponent) {
  /**
   * status flags
   */
  loading = true;

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
  async created() {
    this.devMode = window.localStorage['evan-developer-mode'] === 'true';
    this.devDomainEnabled = !!window.localStorage['evan-dev-dapps-domain'];
    this.devDomain = window.localStorage['evan-dev-dapps-domain']
      || `test.${dappBrowser.getDomainName()}`;
    this.language = window.localStorage['evan-language'] || '';

    this.loading = false;
  }

  /**
   * Current language has changed.
   */
  languageChanged() {
    if (this.language) {
      window.localStorage['evan-language'] = this.language;
    } else {
      delete window.localStorage['evan-language'];
    }
  }

  /**
   * Developer mode has changed
   */
  devModeChanged() {
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
  devDomainChanged() {
    // only save the input, when the dev domains are enabled
    if (this.devMode && this.devDomainEnabled) {
      window.localStorage['evan-dev-dapps-domain'] = this.devDomain;
    } else {
      // else clear the value
      delete window.localStorage['evan-dev-dapps-domain'];
    }
  }

  // TODO refactor to (renderless) vue component
  copyToClipboard(text: string, toastText: string): void {
    const textArea = document.createElement('textarea');

    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);

    this.$toasted.show(
      this.$t(toastText),
      {
        duration: 3000,
        type: 'success',
      },
    );
  }

  /**
   * Export the private key for the current logged in account
   */
  async exportPrivateKey(): Promise<void> {
    const vault = await lightwallet.loadUnlockedVault();
    const privateKey = lightwallet.getPrivateKey(vault, session.activeAccount);

    this.copyToClipboard(privateKey, '_profile.security-info.private-key.exported');
  }

  /**
   * Export the private key for the current logged in account
   */
  async exportEncryptionKey(): Promise<void> {
    const vault = await lightwallet.loadUnlockedVault();
    const encryptionKey = await lightwallet.getEncryptionKey();

    this.copyToClipboard(encryptionKey, '_profile.security-info.encryption-key.exported');
  }
}
