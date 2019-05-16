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
import { EvanComponent } from '@evan.network/ui-vue-core';
import * as bcc from '@evan.network/api-blockchain-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';
import { getDefaultDAppEns } from '../../utils'; 

@Component({ })
export default class SignIn extends mixins(EvanComponent) {
  // current mnemonic value as text
  mnemonic = '';

  // is the current mnemonic valid?
  validMnemonic = false;

  // is the current mnemonic / password is currently checking?
  checking = false;

  /**
   * formular specific variables
   */
  form = {
    /**
     * current password input
     */
    password: {
      value: window.localStorage['evan-test-password'] || '',
      valid: false,
      touched: false,
      ref: null as any
    },
  };

  // when the mnemonic is valid, set the accountId
  accountId = null as any;

  /**
   * Available steps represented by it's titles
   */
  steps = [
    '_onboarding.sign-in.get-mnemonic',
    '_onboarding.sign-in.get-password',
  ];

  /**
   * steps status configurations
   */
  activeStep = 0;

  /**
   * all steps that were already solved, so the stepper can jump back again
   */
  activeSteps: Array<number> = [ 0 ];

  /**
   * Checks if the user was invited, so enable the 3 tab
   */
  created() {
    if (this.$route.query.inviteeAlias) {
      this.steps.push('_onboarding.sign-in.welcome');
    }
  }

  /**
   * Uses the current mnemonic value and checks, if a profile exists. If yes, navigates to
   * password step, else show alert.
   */
  async setMnemonic() {
    this.checking = true;

    // check if the current mnemonic is valid using an "dummt vault" with wrong password
    const vault = await dappBrowser.lightwallet.getNewVault(this.mnemonic, 'evan');
    const accountId = dappBrowser.lightwallet.getAccounts(vault, 1)[0];

    // check if the current account is onboarded
    const notOnboarded = !(await dappBrowser.bccHelper.isAccountOnboarded(accountId));

    // when it's onboarded, navigte to password dialog
    if (!notOnboarded) {
      this.activeStep = 1;
      this.activeSteps.push(1);
      this.accountId = accountId;

      // set autofocus on password input
      this.$nextTick(() => (this.$refs['password'] as any).focus());
    } else {
      // check if a profile for the entered mnemonic exists, if not, show an error
      (this.$refs['notOnboarded'] as any).show();
    }

    this.checking = false;
  }

  /**
   * Check the current password input.
   */
  async checkPassword() {
    const password = this.form.password;

    if (password.value.length > 7) {
      this.checking = true;

      // get the current account id
      try {
        password.valid = await dappBrowser.bccHelper.isAccountPasswordValid(bcc,
          this.accountId, password.value);
      } catch (ex) {
        password.valid = false;
      }

      // if the password is correct, create the correct active vault in dapp-browser, so other
      // applications can access it
      if (password.valid) {
        await dappBrowser.lightwallet.createVaultAndSetActive(this.mnemonic, password.value);
        dappBrowser.core.setCurrentProvider('internal');

        if (!this.$route.query.inviteeAlias) {
          this.navigateToEvan();
        } else {
          this.activeStep = 2;
          this.activeSteps.push(2);
        }
      }

      this.checking = false;
    }
  }

  /**
   * Opens the signup route using the current mnemonic.
   */
  openSignupWithMnemonic() {
    this.$route.query.mnemonic = this.mnemonic;
    this.$router.push({ name: 'sign-up', query: this.$route.query });
  }

  /**
   * Navigates to the previous opened application or use the default dapp ens.
   */
  navigateToEvan() {
    // do not use $router.push to force navigation triggering!
    window.location.hash = `/${ this.$route.query.origin || getDefaultDAppEns() }`;
  };
}

