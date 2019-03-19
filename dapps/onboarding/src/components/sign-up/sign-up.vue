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
  <div class="evan-onboarding-signup md-layout md-gutter md-alignment-center-center">
    <div class="md-layout-item md-size-60 md-medium-size-80 md-small-size-100">
      <md-toolbar class="md-accent" md-elevation="0">
        <md-button class="md-icon-button" 
          v-on:click="$router.push({ name: 'welcome', query: $route.query })">
          <md-icon>chevron_left</md-icon>
        </md-button>
        <h3>{{ '_onboarding.sign-up.title' | translate }}</h3>
      </md-toolbar>

      <md-steppers md-vertical md-linear
        :md-active-step.sync="steps.active">
        <md-step id="profile"
          :md-done.sync="steps.profile"
          :md-editable="!creatingProfile"
          :md-label="'_onboarding.sign-up.profile-informations' | translate"
          :md-description="'_onboarding.sign-up.profile-informations-desc' | translate">
          <div class="evan-content evan-padding">
            <md-field
              :class="profileForm.errors.userName ? 'md-invalid' : ''">
              <label>{{ '_onboarding.sign-up.user-name' | translate }}</label>
              <md-input required
                ref="userName"
                v-model="profileForm.userName"
                @keyup.enter.native="useProfile()"
                @input="userNameChanged()">
              </md-input>
              <span class="md-error" v-if="profileForm.errors.userName">
                {{ '_onboarding.sign-up.errors.user-name' | translate }}
              </span>
            </md-field>
            <md-field
              v-for="(password, index) in profileForm.passwords"
              :class="profileForm.errors.passwords[index] ? 'md-invalid' : ''">
              <label>{{ ('_onboarding.sign-up.password' + index) | translate }}</label>
              <md-input required type="password" 
                v-model="profileForm.passwords[index]"
                @keyup.enter.native="useProfile()"
                @input="passwordChanged(index)">
              </md-input>
              <span class="md-error" v-if="profileForm.errors.passwords[index]">
                {{ profileForm.errors.passwords[index] | translate }}
              </span>
            </md-field>
          </div>
          <div class="md-layout md-gutter md-alignment-center-center evan-margin-top">
            <md-button class="md-raised evan-round evan-primary"
              :disabled="!profileForm.isValid"
              @click="useProfile()">
              {{ '_onboarding.continue' | translate }}
            </md-button>
          </div>
        </md-step>

        <md-step id="mnemonic"
          :md-done.sync="steps.mnemonic"
          :md-editable="!creatingProfile"
          :md-label="'_onboarding.sign-up.get-mnemonic' | translate"
          :md-description="'_onboarding.sign-up.get-mnemonic-desc' | translate">
          <div class="md-layout-item evan-content evan-warn evan-padding"
            v-html="$t('_onboarding.sign-up.get-mnemonic-desc-long')">
          </div>

          <md-content class="evan-padding evan-margin-top">
            <evan-onboarding-mnemonic
              ref="mnemonic"
              :mnemonic.sync="mnemonic"
              :valid.sync="validMnemonic"
              :disabled="true"
              v-on:submit="useMnemonic()">
            </evan-onboarding-mnemonic>
          </md-content>
          <div class="md-layout md-gutter md-alignment-center-center evan-margin-top">
            <md-button class="md-raised evan-round evan-primary"
              v-if="mnemonicRiddle"
              @click="cancelRiddle()">
              {{ '_onboarding.sign-up.cancel-riddle' | translate }}
            </md-button>
            <md-button class="md-raised evan-round evan-primary"
              :disabled="!validMnemonic"
              @click="useMnemonic()">
              {{ '_onboarding.continue' | translate }}
            </md-button>
          </div>
        </md-step>

        <md-step id="createProfile"
          :md-done.sync="steps.createProfile"
          :md-editable="!creatingProfile"
          :md-label="'_onboarding.sign-up.create-profile.title' | translate"
          :md-description="'_onboarding.sign-up.create-profile.desc' | translate">
          <md-content class="evan-padding" v-if="!creatingProfile">
            <p v-html="$t('_onboarding.sign-up.create-profile.long')"></p>

            <md-content class="md-layout md-gutter md-alignment-left-left">
              <p v-html="$t('_onboarding.sign-up.terms-of-use.full')"></p>
            </md-content>

            <vue-recaptcha class="evan-recaptcha"
              v-if="!initialzing"
              ref="recaptcha"
              sitekey="6LfoK1IUAAAAAOK0EbTv-IqtBq2NS-bvKWcUbm8r"
              theme="light"
              @verify="onCaptchaVerified"
              @expired="onCaptchaExpired">
            </vue-recaptcha>

            <md-dialog-alert
              :md-active.sync="creatingProfileError"
              :md-content="'_onboarding.sign-up.profile-create-error.desc' | translate"
              :md-confirm-text="'_onboarding.sign-up.profile-create-error.ok' | translate">
            </md-dialog-alert>
          </md-content>

          <md-content class="evan-padding profile-creation-container"
            v-if="creatingProfile">
            <md-progress-spinner
              v-if="creatingProfile !== 5"
              :md-diameter="30"
              :md-stroke="3"
              md-mode="indeterminate">
            </md-progress-spinner>
            <h3>
              {{ ('_onboarding.sign-up.create-profile.status-' + creatingProfile) | translate }}
            </h3>
            <p v-if="creatingProfile !== 5">
              {{ $t('_onboarding.sign-up.create-profile.creation-time', { creationTime: creationTime }) }}
            </p>
            <img v-if="creatingProfile !== 5"
              :src="$store.state.dappBaseUrl + '/assets/creating_' + creatingProfile + '.png'">
            <evan-success v-if="creatingProfile === 5"></evan-success>
          </md-content>

          <div class="md-layout md-gutter md-alignment-center-center evan-margin-top"
            v-if="!creatingProfile">
            <md-button class="md-raised evan-round evan-primary"
              :disabled="!recaptchaToken"
              @click="createProfile()">
              {{ '_onboarding.sign-up.create-profile.title' | translate }}
            </md-button>
          </div>
        </md-step>

        <md-step id="signedIn"
          v-if="$route.query.inviteeAlias"
          :md-done.sync="steps.signedIn"
          :md-editable="false"
          :md-label="'_onboarding.sign-up.welcome' | translate"
          :md-description="'_onboarding.sign-up.welcome-desc' | translate">
          <evan-onboarding-accept-contact
            :loadAlias="true"
            v-if="steps.active === 'signedIn'">
          </evan-onboarding-accept-contact>
        </md-step>
      </md-steppers>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import * as bcc from 'bcc';
  import * as dappBrowser from 'dapp-browser';
  import MnemonicComponent from './mnemonic.vue';
  import axios from 'axios';

  export default Vue.extend({
    data: function () {
      return {
        // current mnemonic value as text
        mnemonic: '',
        // use to cancel riddle
        originalMnemonic: '',
        // is the current mnemonic valid?
        validMnemonic: false,
        // mnemonicRiddle
        mnemonicRiddle: false as any,
        // is the current mnemonic / password is currently checking?
        checking: false,
        // recaptcha value
        recaptchaToken: null as any,
        // check if the recaptcha is initialzing
        initialzing: true,
        profileForm: {
          // current userName input
          userName: '',
          // current password input
          passwords: [ '', '' ],
          // valid when no error is available
          isValid: false,
          errors: {
            // user name error
            userName: null as any,
            // current password input
            passwords: [ null, null ] as Array<any>
          }
        },
        // steps status configurations
        steps: {
          active: 'profile',
          profile: false,
          mnemonic: false,
          createProfile: false,
          signedIn: false
        },
        // currently creating the profile
        creatingProfile: 0 as any,
        // track the time that the profile took to be created
        creationTime: -1,
        // set the creating profile error, if it fails
        creatingProfileError: false,
        // timeout to show next profile creation img
        timeoutCreationStatus: null as any
      }
    },
    created() {
      // set initial mnemonic from query params or use an generated one
      this.mnemonic = this.mnemonic || this.$route.query.mnemonic ||
        dappBrowser.lightwallet.generateMnemonic();
      this.originalMnemonic = this.mnemonic;

      // include the google recaptcha
      var scriptElement = document.createElement('script');
      scriptElement.src = `https://www.google.com/recaptcha/api.js?onload=vueRecaptchaApiLoaded&
        render=explicit&hl=${ (this as any).$i18n.locale() }`;
      document.head.appendChild(scriptElement);

      // wait for recaptcha to be loaded
      (window as any).vueRecaptchaApiLoaded = () => {
        this.initialzing = false;
      };

      this.$nextTick(() => (this.$refs['userName'] as any).$el.focus());
    },
    destroyed() {
      // clear the interval for showing up the next profile creation img
      window.clearTimeout(this.timeoutCreationStatus);
    },
    methods: {
      /**
       * When the captcha is verified, enable the accept terms of use button.
       */
      onCaptchaVerified(recaptchaToken) {
        this.recaptchaToken = recaptchaToken;
      },
      /**
       * When the recaptcha token gets expired, reset it and force refresh.
       */
      onCaptchaExpired() {
        (this.$refs.recaptcha as any).execute();
        this.recaptchaToken = null;
      },
      /**
       * Check valid profile form.
       */
      setValidProfile() {
        const errors = this.profileForm.errors;
        // check if no error exists, invalidate also, when no check was runned for this field
        this.profileForm.isValid = [
          errors.userName,
          errors.passwords[0],
          errors.passwords[1],
        ].filter(error => error || error === null).length === 0;
      },
      /**
       * User name has changed.
       */
      userNameChanged() {
        this.profileForm.errors.userName = !this.profileForm.userName;
        this.setValidProfile();
      },
      /**
       * Check the password inputs, if the values are valid.
       *
       * @param      {number}  index   index of the password
       * @return     {string}  the password error
       */
      getPasswordError(index) {
        const passwords = this.profileForm.passwords;

        // min 8 characters
        if (passwords[index].length < 8) {
          return '_onboarding.sign-up.errors.password-min-characters';
        }

        // min one character
        if (passwords[index].search(/[a-z]/i) < 0) {
          return '_onboarding.sign-up.errors.password-one-character';
        }

        // min one upper case letter
        if (passwords[index].toLowerCase() === passwords[index]) {
          return '_onboarding.sign-up.errors.password-one-uppercase-character';
        }

        // min one digest
        if (passwords[index].search(/[0-9]/) < 0) {
          return '_onboarding.sign-up.errors.password-one-digest-needed';
        }
        
        // must be the same password
        if (index === 1 && passwords[0] !== passwords[1]) {
          return '_onboarding.sign-up.errors.password-match-repeat';
        }

        return false;
      },
      /**
       * Password has changed, check for errors.
       */
      passwordChanged(index) {
        const errors = this.profileForm.errors.passwords;

        // set the new error values, set the error for the changed index if already an error was set
        // before, set it always for the other input, to remove password match repeat errors
        errors[0] = (index === 0 || errors[0] !== null) ? this.getPasswordError(0) : errors[0];
        errors[1] = (index === 1 || errors[1] !== null) ? this.getPasswordError(1) : errors[1];

        this.setValidProfile();
      },
      /**
       * Check if the form is valid and navigate to the next page.
       */
      useProfile() {
        if (this.profileForm.isValid) {
          this.steps.profile = true;
          this.steps.active = 'mnemonic';
        }
      },
      /**
       * Check if the current mnemonic is valid, if yes, use it and navigate to profile create page,
       * else start the mnemonic riddle.
       */
      useMnemonic() {
        if (this.validMnemonic) {
          // if no riddle was started before, start it!
          if (!this.mnemonicRiddle) {
            this.mnemonicRiddle = true;
            (this.$refs.mnemonic as any).startRiddle(
              parseInt(window.localStorage['evan-mnemonic-riddle'] || 3));
          } else {
            this.steps.mnemonic = true;
            this.steps.active = 'createProfile';
          }
        }
      },
      /**
       * Cancels the current active riddle
       */
      cancelRiddle() {
        this.mnemonicRiddle = false;
        (this.$refs.mnemonic as any).cancelRiddle();
      },
      /**
       * Show the next status img and text for the profile creation.
       */
      nextCreationStatus() {
        if (this.creationTime !== 30) {
          this.creationTime++;
          this.timeoutCreationStatus = setTimeout(() => this.nextCreationStatus(), 1000);
        }

        if (this.creationTime % 8 === 0) {
          this.creatingProfile += 1;
        }
      },
      /**
       * Starts the profile creation.
       */
      async createProfile() {
        if (this.recaptchaToken) {
          const baseHost = 'https://agents.evan.network';
          const baseUrlFaucet = baseHost + '/api/smart-agents/faucet/';
          const baseUrlOnboarding = baseHost + '/api/smart-agents/onboarding/';

          // start profile creation animation and status display
          this.nextCreationStatus();

          try {
            // load the vault using the current inputs and create a bcc profile runtime
            const vault = await dappBrowser.lightwallet.getNewVault(this.mnemonic,
              this.profileForm.passwords[0]);
            const password = this.profileForm.passwords[0];
            const provider = 'internal';
            const accountId = dappBrowser.lightwallet.getAccounts(vault, 1)[0];
            const privateKey = dappBrowser.lightwallet.getPrivateKey(vault, accountId);

            // create runtime for blockchain interaction
            const runtime = await dappBrowser.bccHelper.createDefaultRuntime(
              bcc, accountId, vault.encryptionKey, privateKey);
            const profile = runtime.profile;

            // use the frontend keyProvider and apply it to every runtime instance
            runtime.keyProvider = new dappBrowser.KeyProvider({ }, accountId);
            for (let key of Object.keys(runtime)) {
              if (runtime[key].keyProvider) {
                runtime[key].keyProvider = runtime.keyProvider;
              } else if (runtime[key].options && runtime[key].options.keyProvider) {
                runtime[key].options.keyProvider = runtime.keyProvider;
              }
            }

            // set current keys within the keyProvider
            runtime.keyProvider.setKeysForAccount(accountId, vault.encryptionKey);
            // set my private and public keys to my addressbook
            const dhKeys = runtime.keyExchange.getDiffieHellmanKeys();
            await profile.addContactKey(accountId, 'dataKey', dhKeys.privateKey.toString('hex'));
            await profile.addProfileKey(accountId, 'alias', this.profileForm.userName);
            await profile.addPublicKey(dhKeys.publicKey.toString('hex'));

            // set initial structure by creating addressbook structure and saving it to ipfs
            const cryptor = runtime.cryptoProvider.getCryptorByCryptoAlgo('aesEcb');
            const fileHashes = <any>{};
            const sharing = await runtime.dataContract.createSharing(accountId);
            const treeLabels = profile.treeLabels;
            fileHashes.sharingsHash = sharing.sharingsHash;
            fileHashes[treeLabels.addressBook] = await profile.storeToIpld(treeLabels.addressBook);
            fileHashes[treeLabels.publicKey] = await profile.storeToIpld(treeLabels.publicKey);
            fileHashes[treeLabels.addressBook] = await cryptor.encrypt(
              bcc.buffer.from(fileHashes[treeLabels.addressBook].substr(2), 'hex'),
              { key: sharing.hashKey, });
            fileHashes[treeLabels.addressBook] = `0x${ fileHashes[treeLabels.addressBook]
              .toString('hex') }`;

            // construct profile creation call values
            const msgString = 'Gimme Gimme Gimme!';
            const signer = accountId.toLowerCase();
            const pk = '0x' + vault.exportPrivateKey(signer, vault.pwDerivedKey);
            const signature = await runtime.web3.eth.accounts.sign(msgString, pk).signature;

            // trigger the profile creation using an maximum timeout of 60 seconds
            const result = await new Promise(async (resolve, reject) => {
              let rejected;
              const creationTimeout = setTimeout(() => {
                reject(new Error('Profile creation took longer than 60 seconds, request was canceld.'));
              }, 60 * 1000);

              // trigger smart agent to create the profile
              try {
                await axios.post(`${ baseUrlFaucet }handout?apiVersion=1`, {
                  accountId: accountId,
                  signature: signature,
                  profileInfo: fileHashes,
                  captchaToken: this.recaptchaToken
                });
                !rejected && resolve();
              } catch (ex) {
                !rejected && reject(ex);
              }
            });

            dappBrowser.utils.log(result, 'info');

            // check if onboarded, else throw it!
            if (!(await bcc.isAccountOnboarded(accountId))) {
              throw new Error('Onboarding has finished, but user isnt onboarded?');
            }

            // profile is setup!
            await dappBrowser.lightwallet.createVaultAndSetActive(this.mnemonic, password);
            dappBrowser.core.setCurrentProvider('internal');

            // show done animation and navigate to signed in page
            this.creatingProfile = 5;
            setTimeout(() => {
              // if the user were invited, show the sign in step, else navigate directly to the root
              // page.
              if (!this.$route.query.inviteeAlias) {
                this.navigateToEvan();
              } else {
                this.steps.createProfile = true;
                this.steps.active = 'signedIn';
              }
            }, 2000);
          } catch (ex) {
            // reset all steps of proile creation
            dappBrowser.utils.log(ex.message, 'error');
            this.creatingProfile = 0;
            this.creatingProfileError = true;
            this.creationTime = -1; 
            this.recaptchaToken = null;
          }

          // stop ui status updates
          window.clearTimeout(this.timeoutCreationStatus);
        }
      },
      /**
       * Navigates to the previous opened application or use the default dapp ens.
       */
      navigateToEvan() {
        // do not use $router.push to force navigation triggering!
        window.location.hash = `/${ this.$route.query.origin || dappBrowser.routing.defaultDAppENS }`;
      },
    }
  });
</script>

<style lang="scss" scoped>
  .evan-onboarding-signup {
    height: 100%;
  }

  .profile-creation-container {
    width: 100%;
    text-align: center;

    img {
      max-height: 600px;
      max-width: 600px;
    }
  }
</style>

