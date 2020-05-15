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
import { Prop } from 'vue-property-decorator';
import { utils } from '@evan.network/ui-dapp-browser';
import { session, bccHelper, lightwallet } from '@evan.network/ui-session';

import { getDomainName } from '../../utils';
import EvanComponent from '../../component';

/**
 * Handles the password input of a user and checks, if it's correct and it's profile can be
 * encrypted with that password. Used by the dapp-wrapper to login the current user if needed. Will
 * send an `logged-in` event including the users provided password.
 *
 * TODO: Rethink the naming. We have sign-in, sign-up, signed-in and login (this)
 *
 * @class         LoginComponent
 * @selector      evan-login
 */
@Component
export default class LoginComponent extends mixins(EvanComponent) {
  /**
   * preload accountId
   */
  @Prop() accountId: string;

  @Prop({ required: false }) mnemonic: string;

  @Prop({ default: false }) showSignup: boolean;

  alias: string | null;

  checkingPassword = false;

  /**
   * form specific variables
   */
  form = {
    /**
     * current password input
     */
    password: {
      value: window.localStorage['evan-test-password'] || '',
      valid: false,
      dirty: false,
      ref: null,
    },
  };

  created() {
    this.alias = window.localStorage.getItem('evan-alias');
  }

  mounted() {
    // Focus the password input.
    this.form.password.ref = this.$refs.password;
    this.form.password.ref.focus();

    // automatically login when user has specified a dev password
    if (this.form.password.value) {
      this.login();
    }
  }

  /**
   * Check the current password input and send the logged in event to the parent component.
   */
  async login() {
    if (this.form.password.value.length > 7) {
      this.checkingPassword = true;

      // get the current account id
      try {
        this.form.password.valid = await bccHelper.setEncryptionKeyForAccount(
          this.accountId,
          this.form.password.value,
        );
      } catch (ex) {
        utils.log(ex, 'error');
        this.form.password.value = false;
      }

      /* if the password is correct, create the correct active vault in dapp-browser, so other
         applications can access it */
      if (this.form.password.valid) {
        // mnemonic available during onboarding
        if (this.mnemonic) {
          await lightwallet.createVaultAndSetActive(
            this.mnemonic,
            this.form.password.value,
          );
        }

        this.$emit('logged-in', this.form.password.value);

        if (this.dapp.baseHash.endsWith(`onboarding.vue.${getDomainName()}`)
          && !this.$route.query.inviteeAddress) {
          session.provider = 'internal';
          window.location.hash = `/${this.$route.query.origin
            || `dashboard.vue.${getDomainName()}`}`;
        }
      }
      // only enable button when password is invalid
      this.checkingPassword = false;
      this.form.password.dirty = true;
    }
  }
}
