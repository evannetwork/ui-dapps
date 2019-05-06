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
import axios from 'axios';

// evan.network imports
import { EvanComponent, EvanForm, EvanFormControl, getDomainName } from '@evan.network/ui-vue-core';
import * as bcc from '@evan.network/api-blockchain-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';
import * as evanUi from '@evan.network/ui';

interface ProfileFormInterface extends EvanForm {
  userName: EvanFormControl;
  password0: EvanFormControl;
  password1: EvanFormControl;
}

@Component({ })
export default class SignUp extends mixins(EvanComponent) {
  // current mnemonic value as text
  mnemonic = '';

  // use to cancel riddle
  originalMnemonic = '';

  // is the current mnemonic valid?
  validMnemonic = false;

  // mnemonicRiddle
  mnemonicRiddle = false as any;

  // was the riddle already solved and only the tab was switched?
  mnemonicRiddleSolved = false;

  // is the current mnemonic / password is currently checking?
  checking = false;

  // recaptcha value
  recaptchaToken = null as any;

  // check if the recaptcha is initialzing
  initialzing = true;

  /**
   * formular specific variables
   */
  profileForm: ProfileFormInterface = null;

  /**
   * Available steps represented by it's titles
   */
  steps: Array<any> = [ ];

  /**
   * steps status configurations
   */
  activeStep = 0;

  // currently creating the profile
  creatingProfile = 0 as any;

  // track the time that the profile took to be created
  creationTime = -1;

  // timeout to show next profile creation img
  timeoutCreationStatus = null as any;

  /**
   * Terms of use for the current environment and the language
   */
  termsOfUse = '';

  /**
   * Is the component currently loading?
   */
  loading = true;

  async created() {
    this.profileForm = (<ProfileFormInterface>new EvanForm(this, {
      userName: {
        value: '',
        validate: function(vueInstance: SignUp, form: ProfileFormInterface) {
          return this.value.length !== 0;
        }
      },
      password0: {
        value: '',
        validate: function(vueInstance: SignUp, form: ProfileFormInterface) {
          return vueInstance.getPasswordError(0, this.form) || true;
        }
      },
      password1: {
        value: '',
        validate: function(vueInstance: SignUp, form: ProfileFormInterface) {
          return vueInstance.getPasswordError(1, this.form) || true;
        }
      },
    }));
    // use this for debugginb
    // this.mnemonicRiddleSolved = true;
    // this.profileForm.userName.value = 'Test';
    // this.profileForm.password0.value = 'Evan1234';
    // this.profileForm.password1.value = 'Evan1234';

    // set if from the created function to keep the correct disabled function context
    this.steps = [
      {
        title: '_onboarding.sign-up.profile-informations',
        disabled: () => {
          return this.mnemonicRiddle ||
            this.creatingProfile || this.activeStep > 2;
        }
      },
      {
        title: '_onboarding.sign-up.get-mnemonic',
        disabled: () => {
          return !this.profileForm.isValid ||
            this.creatingProfile || this.activeStep > 2;
        }
      },
      {
        title: '_onboarding.sign-up.create-profile.title',
        disabled: () => {
          return !this.mnemonicRiddleSolved || !this.profileForm.isValid ||
            this.mnemonicRiddle || this.creatingProfile || this.activeStep > 2;
        }
      },
    ];

    // if the user was inivted, show the welcome page
    if (this.$route.query.inviteeAlias) {
      this.steps.push({
        title: '_onboarding.sign-up.welcome',
        disabled: () => {
          return this.activeStep !== 3;
        }
      });
    }

    // set initial mnemonic from query params or use an generated one
    this.mnemonic = this.mnemonic || this.$route.query.mnemonic ||
      dappBrowser.lightwallet.generateMnemonic();
    this.originalMnemonic = this.mnemonic;

    // include the google recaptcha
    const scriptElement = document.createElement('script');
    scriptElement.src = `https://www.google.com/recaptcha/api.js?onload=vueRecaptchaApiLoaded&
      render=explicit&hl=${ (this as any).$i18n.locale() }`;
    document.head.appendChild(scriptElement);

    // wait for recaptcha to be loaded
    (window as any).vueRecaptchaApiLoaded = () => {
      this.initialzing = false;
    };

    // load the terms of use origin url
    const runtime = dappBrowser.bccHelper.getCoreRuntime();
    const termsOfUseEns = `termsofuse.${ getDomainName() }`;
    const termsOfUseDbcp = await runtime.description.getDescription(termsOfUseEns);
    const termsOfUseOrigin = dappBrowser.dapp.getDAppBaseUrl(
      Object.assign(termsOfUseDbcp.public, termsOfUseDbcp.private),
      termsOfUseEns
    );
    const ipfsHost = dappBrowser.ipfs.ipfsConfig.host;

    // multiple url's that can be requested one after another to fallback current runtime configurations
    const fallbacks = [
      // load from current ipfs host the current language, else fallback to english
      `${ termsOfUseOrigin }/${ ipfsHost }/${ (<any>this).$i18n.locale() }.html`,
      `${ termsOfUseOrigin }/${ ipfsHost }/en.html`,
      // if a not registered ipfs host is requested, load the current language for mainnet, else
      // fallback to en
      `${ termsOfUseOrigin }/storage.evan.network/${ (<any>this).$i18n.locale() }.html`,
      `${ termsOfUseOrigin }/storage.evan.network/en.html`,
    ];

    // try to load the terms of use for the current language, if this is not available, load the
    // next fallback
    for (let i = 0; i < fallbacks.length; i++) {
      try {
        const result = await axios.get(fallbacks[i]);
        this.termsOfUse = result.data;
        break;
      } catch (ex) { }
    }

    this.loading = false;
    setTimeout(() => this.profileForm.userName.$ref.focus());
  }

  destroyed() {
    // clear the interval for showing up the next profile creation img
    window.clearTimeout(this.timeoutCreationStatus);
  }

  /**
   * When the captcha is verified, enable the accept terms of use button.
   */
  onCaptchaVerified(recaptchaToken) {
    this.recaptchaToken = recaptchaToken;
  }

  /**
   * When the recaptcha token gets expired, reset it and force refresh.
   */
  onCaptchaExpired() {
    (this.$refs.recaptcha as any).execute();
    this.recaptchaToken = null;
  }

  /**
   * Check the password inputs, if the values are valid.
   *
   * @param      {number}  index   index of the password
   * @return     {string}  the password error
   */
  getPasswordError(index, form) {
    const passwordControl = form[`password${ index }`];

    // min 8 characters
    if (passwordControl.value.length < 8) {
      return '_onboarding.sign-up.errors.password-min-characters';
    }

    // min one character
    if (passwordControl.value.search(/[a-z]/i) < 0) {
      return '_onboarding.sign-up.errors.password-one-character';
    }

    // min one upper case letter
    if (passwordControl.value.toLowerCase() === passwordControl.value) {
      return '_onboarding.sign-up.errors.password-one-uppercase-character';
    }

    // min one digest
    if (passwordControl.value.search(/[0-9]/) < 0) {
      return '_onboarding.sign-up.errors.password-one-digest-needed';
    }

    // must be the same password
    if (index === 1 && passwordControl.value !== this.profileForm.password0.value) {
      return '_onboarding.sign-up.errors.password-match-repeat';
    }

    return false;
  }

  /**
   * Check if the form is valid and navigate to the next page.
   */
  useProfile() {
    if (this.profileForm.isValid) {
      this.activeStep = 1;
    }
  }

  /**
   * Check if the current mnemonic is valid, if yes, use it and navigate to profile create page,
   * else start the mnemonic riddle.
   */
  useMnemonic() {
    if (this.validMnemonic) {
      // if no riddle was started before, start it!
      if (!this.mnemonicRiddle && !this.mnemonicRiddleSolved) {
        this.mnemonicRiddle = true;
        (this.$refs.mnemonic as any).startRiddle(
          parseInt(window.localStorage['evan-mnemonic-riddle'] || '3', 10));
      } else {
        this.mnemonicRiddle = false;
        this.mnemonicRiddleSolved = true;
        this.activeStep = 2;
      }
    }
  }

  /**
   * Cancels the current active riddle
   */
  cancelRiddle() {
    this.mnemonicRiddle = false;
    (this.$refs.mnemonic as any).cancelRiddle();
  }

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
  }

  /**
   * Starts the profile creation.
   */
  async createProfile() {
    if (this.recaptchaToken) {
      const baseHost = evanUi.agentUrl;
      const baseUrlFaucet = baseHost + '/api/smart-agents/faucet/';
      const baseUrlOnboarding = baseHost + '/api/smart-agents/onboarding/';

      // start profile creation animation and status display
      this.nextCreationStatus();

      try {
        const password = this.profileForm.password0.value;
        // load the vault using the current inputs and create a bcc profile runtime
        const vault = await dappBrowser.lightwallet.getNewVault(this.mnemonic, password);
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
        await profile.addProfileKey(accountId, 'alias', this.profileForm.userName.value);
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

            if (!rejected) {
              resolve();
            }
          } catch (ex) {
            if (!rejected) {
              reject(ex);
            }
          }
        });

        dappBrowser.utils.log(result, 'info');

        // check if onboarded, else throw it!
        if (!(await dappBrowser.bccHelper.isAccountOnboarded(accountId))) {
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
            this.activeStep = 3;
          }
        }, 2000);
      } catch (ex) {
        // reset all steps of proile creation
        dappBrowser.utils.log(ex.message, 'error');
        this.creatingProfile = 0;
        this.creationTime = -1;
        this.recaptchaToken = null;
        (<any>this.$refs.creatingProfileError).show();
      }

      // stop ui status updates
      window.clearTimeout(this.timeoutCreationStatus);
    }
  }

  /**
   * Navigates to the previous opened application or use the default dapp ens.
   */
  navigateToEvan() {
    // do not use $router.push to force navigation triggering!
    window.location.hash = `/${ this.$route.query.origin || dappBrowser.routing.defaultDAppENS }`;
  }
}

