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
import axios from 'axios';
import Component, { mixins } from 'vue-class-component';
import Vue from 'vue';
import { Prop } from 'vue-property-decorator';

// evan.network imports
import { EvanComponent, getDomainName } from '@evan.network/ui-vue-core';
import * as bcc from '@evan.network/api-blockchain-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';
import { agentUrl } from '@evan.network/ui';

@Component({ })
export default class AcceptContact extends mixins(EvanComponent) {
  /**
   * should the alias for the user should be loaded?
   */
  @Prop({ default: false }) loadAlias;

  // show loading symbol
  loading = true;

  // acount id
  alias = '';

  // currents user name
  accountId = '';

  // was the current user invited by another one?
  inviteeAddress = '' as any;

  // is the current mnemonic / password is currently checking?
  checkingPassword = false;

  // current password input
  password = window.localStorage['evan-test-password'] || '';

  // check if the inserted password is wrong
  invalidPassword = false;

  // current check password function that is bind to the lightwallet.setPasswordFunction
  checkPassword = null as any;

  // is the current user signed in but not unlocked
  notLoadedButSignedIn = false;

  // current bcc runtime
  runtime = null as any;

  // show loading for accepting contact request
  accepting = false;

  // show accepting error
  acceptingError = false as any;

  // was contact adding successful?
  accepted = false;

  async created() {
    if (!this.$store.state.runtime) {
      this.loading = true;

      // unlock the profile directly
      const vault = await dappBrowser.lightwallet.loadUnlockedVault();
      const activeAccount = dappBrowser.lightwallet.getPrimaryAccount(vault);

      // setup runtime and save it to the axios store
      this.$store.state.runtime = await dappBrowser.bccHelper.createDefaultRuntime(
        bcc,
        activeAccount,
        vault.encryptionKey,
        dappBrowser.lightwallet.getPrivateKey(vault, activeAccount),
      );

      this.loading = false;
    }

    this.runtime = this.$store.state.runtime;
    this.accountId = dappBrowser.core.activeAccount();
    this.inviteeAddress = this.$route.query.inviteeAddress;

    if (this.inviteeAddress || this.$props.loadAlias) {
      // load the currents user alias
      const addressBook = (await this.runtime.profile.getAddressBook()) || { profile: { } };
      this.alias = addressBook.profile[this.accountId].alias;
    } else {
      this.notLoadedButSignedIn = true;
    }

    this.loading = false;
  }

  /**
   * Navigates to the previous opened application or use the default dapp ens.
   */
  navigateToEvan() {
    // do not use $router.push to force navigation triggering!
    window.location.hash = `/${this.$route.query.origin || `dashboard.vue.${getDomainName()}`}`;
  }

  /**
   * Accept the contact invitation.
   */
  async acceptContact() {
    const queryParams = this.$route.query;

    // show loading
    this.accepting = true;

    try {
      // trigger smart agent to pay out credit eves
      await axios.post(`${agentUrl}/api/smart-agents/onboarding/accept`, {
        invitationId: this.$route.query.onboardingID,
        accountId: this.runtime.activeAccount,
      });


      // load my address book
      await this.runtime.profile.loadForAccount(this.accountId,
        this.runtime.profile.treeLabels.addressBook);
      // search for the target public key
      const targetProfile = await dappBrowser.bccHelper.getProfileForAccount(bcc,
        queryParams.inviteeAddress);
      const targetPubKey = await targetProfile.getPublicKey();
      if (!targetPubKey) {
        throw new Error(`No public key found for account ${queryParams.inviteeAddress}`);
      }

      // create a new comm key for the contact and save it to my profile
      const commKey = await this.runtime.keyExchange.generateCommKey();
      await this.runtime.profile.addContactKey(
        queryParams.inviteeAddress,
        'commKey',
        commKey,
      );

      // add the new contact to my address book
      await this.runtime.profile.addProfileKey(
        queryParams.inviteeAddress, 'alias', queryParams.inviteeAlias,
      );

      // save my address book
      await this.runtime.profile.storeForAccount(this.runtime.profile.treeLabels.addressBook);

      // generate a new b mail and send it as response to the invitee
      const mail = {
        title: (this as any).$t('_onboarding.mail-invitation-accepted.title'),
        body: (this as any).$t('_onboarding.mail-invitation-accepted.body', {
          userEmail: queryParams.email,
          userAlias: this.alias,
        }),
        fromAlias: this.alias,
        fromMail: queryParams.email,
      };
      await this.runtime.keyExchange.sendInvite(this.inviteeAddress, targetPubKey,
        commKey, mail);

      // show success
      this.accepted = true;
      // navigate to the addressbook
      setTimeout(() => {
        window.location.hash = [
          '',
          `dashboard.vue.${getDomainName()}`,
          `assets.${getDomainName()}`,
          'contacts',
        ].join('/');
      }, 2000);
    } catch (ex) {
      dappBrowser.utils.log(ex.message, 'error');
      (this.$refs.acceptingError as any).show();
    }

    // show loading
    this.accepting = false;
  }
}
