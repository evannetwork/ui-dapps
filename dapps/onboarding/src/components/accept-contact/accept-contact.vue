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

<template>
  <div>
    <div v-if="!loading">
      <md-content class="evan-padding" v-if="checkPassword">
        <p v-html="$t('_onboarding.signed-in.unlock-for-accept', $route.query)"></p>
        <md-field>
          <label>{{ '_onboarding.password' | translate }}</label>
          <md-input type="password" ref="password"
            v-model="password"
            @keyup.enter.native="checkPassword()">
          </md-input>
        </md-field>

        <div class="md-layout md-gutter md-alignment-space-between-center"
          v-if="invalidPassword">
          <span class="md-error">
            {{ '_onboarding.sign-in.invalid-password' | translate }}
          </span>
        </div>
        <div class="md-layout md-gutter md-alignment-center-center evan-margin-top">
          <md-button class="md-raised evan-round evan-primary"
            v-if="!checkingPassword"
            :disabled="password.length < 8"
            @click="checkPassword()">
            {{ '_onboarding.sign-in.decrypt' | translate }}
          </md-button>
          <md-progress-spinner
            v-if="checkingPassword"
            :md-diameter="30"
            :md-stroke="3"
            md-mode="indeterminate">
          </md-progress-spinner>
        </div>
      </md-content>
      <div v-if="!checkPassword">
        <div v-if="!notLoadedButSignedIn">
          <md-content class="evan-content evan-padding"
            v-if="!inviteeAddress"
            v-html="$t('_onboarding.signed-in.welcome-unlocked', { 'alias': alias, 'accountId': accountId })">
          </md-content>
          <md-content class="evan-content evan-padding"
            v-if="inviteeAddress">
            <p v-html="$t('_onboarding.signed-in.invited', {
              'alias': alias,
              'accountId': accountId,
              'inviteeAlias': $route.query.inviteeAlias,
              'eveAmount': $route.query.eveAmount
            })"></p>
          </md-content>

          <md-dialog-alert
            :md-active.sync="acceptingError"
            :md-content="'_onboarding.sign-up.profile-create-error.desc' | translate"
            :md-confirm-text="'_onboarding.sign-up.profile-create-error.ok' | translate">
          </md-dialog-alert>

          <div class="evan-margin-top md-layout md-gutter md-alignment-center-center">
            <evan-success v-if="accepted"></evan-success>
            <div v-if="!accepted">
              <md-progress-spinner
                v-if="accepting"
                :md-diameter="30"
                :md-stroke="3"
                md-mode="indeterminate">
              </md-progress-spinner>
              <md-button class="md-raised evan-round evan-primary"
                v-if="!accepting"
                :class="inviteeAddress ? 'evan-button evan-cancel' : ''"
                @click="navigateToEvan()">
                {{ '_onboarding.signed-in.go-to-evan' | translate }}
              </md-button>
              <md-button class="md-raised evan-round evan-primary"
                v-if="!accepting && inviteeAddress"
                @click="acceptContact()">
                {{ '_onboarding.signed-in.accept-contact' | translate }}
              </md-button>
            </div>
          </div>
        </div>
        <md-content class="evan-content evan-padding"
          v-if="notLoadedButSignedIn"
          v-html="$t('_onboarding.signed-in.welcome-signed-in', { 'accountId': accountId })">
        </md-content>
      </div>
    </div>

    <div class="md-layout md-gutter md-alignment-center-center" v-if="loading">
      <md-progress-spinner
        :md-diameter="30"
        :md-stroke="3"
        md-mode="indeterminate">
      </md-progress-spinner>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import * as bcc from 'bcc';
  import * as dappBrowser from 'dapp-browser';

  export default Vue.extend({
    props: {
      loadAlias: Boolean
    },
    data () {
      return {
        // show loading symbol
        loading: true,
        // acount id
        alias: '',
        // currents user name
        accountId: '',
        // was the current user invited by another one?
        inviteeAddress: '' as any,
        // is the current mnemonic / password is currently checking?
        checkingPassword: false,
        // current password input
        password: window.localStorage['evan-test-password'] || '',
        // check if the inserted password is wrong
        invalidPassword: false,
        // current check password function that is bind to the lightwallet.setPasswordFunction
        checkPassword: null as any,
        // is the current user signed in but not unlocked
        notLoadedButSignedIn: false,
        // current bcc runtime
        runtime: null as any,
        // show loading for accepting contact request
        accepting: false,
        // show accepting error
        acceptingError: false as any,
        // was contact adding successful?
        accepted: false
      }
    },
    async created() {
      this.accountId = dappBrowser.core.activeAccount();
      this.inviteeAddress = this.$route.query.inviteeAddress;

      if (this.inviteeAddress || this.$props.loadAlias) {
        // it could be possible, that the user isn't logged in, we need to set the setPasswordFunction
        dappBrowser.lightwallet.setPasswordFunction(() => {
          this.loading = false;

          return new Promise((resolve) => {
            // set autofocus on password input
            this.$nextTick(() => (this.$refs['password'] as any).$el.focus());
            this.checkPassword = async () => {
              if (this.password.length > 7) {
                this.checkingPassword = true;

                // get the current account id
                try {
                  this.invalidPassword = !(await dappBrowser.bccHelper.isAccountPasswordValid(bcc,
                    this.accountId, this.password));
                } catch (ex) {
                  this.invalidPassword = true;
                }

                // if the password is correct, create the correct active vault in dapp-browser, so other
                // applications can access it
                if (!this.invalidPassword) {
                  this.checkPassword = null;
                  resolve(this.password);
                }

                this.checkingPassword = false;
              }
            };
          })
        });

        // create runtime for blockchain interaction
        const vault = await dappBrowser.lightwallet.loadUnlockedVault();
        this.runtime = await dappBrowser.bccHelper.createDefaultRuntime(
          bcc,
          this.accountId,
          vault.encryptionKey,
          dappBrowser.lightwallet.getPrivateKey(vault, this.accountId)
        );

        // load the currents user alias
        const addressBook = (await this.runtime.profile.getAddressBook()) || {profile: { }};
        this.alias = addressBook.profile[this.accountId].alias;
      } else {
        this.notLoadedButSignedIn = true;
      }

      this.loading = false;
    },
    methods: {
      /**
       * Navigates to the previous opened application or use the default dapp ens.
       */
      navigateToEvan() {
        // do not use $router.push to force navigation triggering!
        window.location.hash = `/${ this.$route.query.origin || dappBrowser.routing.defaultDAppENS }`;
      },
      /**
       * Accept the contact invitation.
       */
      async acceptContact() {
        const queryParams = this.$route.query;

        // show loading
        this.accepting = true;
        try {
          // load my address book
          await this.runtime.profile.loadForAccount(this.accountId,
            this.runtime.profile.treeLabels.addressBook);
          // search for the target public key
          let targetProfile = await dappBrowser.bccHelper.getProfileForAccount(bcc,
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
            commKey
          );

          // add the new contact to my address book
          await this.runtime.profile.addProfileKey(
            queryParams.inviteeAddress, 'alias', queryParams.inviteeAlias
          );

          // save my address book
          await this.runtime.profile.storeForAccount(this.runtime.profile.treeLabels.addressBook);

          // generate a new b mail and send it as response to the invitee
          const mail = {
            title: (this as any).$t('_onboarding.mail-invitation-accepted.title'),
            body: (this as any).$t('_onboarding.mail-invitation-accepted.body', {
              userEmail: queryParams.email,
              userAlias: this.alias
            }),
            fromAlias: this.alias,
            fromMail: queryParams.email
          };
          await this.runtime.keyExchange.sendInvite(this.inviteeAddress, targetPubKey,
            commKey, mail);

          // show success
          this.accepted = true;
          // navigate to the addressbook
          setTimeout(() => {
            window.location.hash = [
              '',
              `dashboard.${ dappBrowser.getDomainName() }`,
              `addressbook.${ dappBrowser.getDomainName() }`,
              this.inviteeAddress,
            ].join('/');
          }, 2000);
        } catch (ex) {
          dappBrowser.utils.log(ex.message, 'error');
          this.acceptingError = true;
        }

        // show loading
        this.accepting = false;
      }
    }
  });
</script>

<style lang="scss" scoped>
</style>

