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
import axios from 'axios';

// evan.network imports
import { EvanComponent, EvanForm, EvanFormControl, getDomainName } from '@evan.network/ui-vue-core';
import * as bcc from '@evan.network/api-blockchain-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';
import * as evanUi from '@evan.network/ui';

import { getDefaultDAppEns } from '../../utils';

interface ProfileFormInterface extends EvanForm {
  alias: EvanFormControl;
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
  creatingProfile = 0;

  // track the time that the profile took to be created
  creationTime = -1;

  // timeout to show next profile creation img
  timeoutCreationStatus = null as any;

  /**
   * Is the component currently loading?
   */
  loading = true;

  /**
   * override custom recaptcha ID
   */
  recaptchaId = window.localStorage['evan-test-recaptchaId'] || '6LfoK1IUAAAAAOK0EbTv-IqtBq2NS-bvKWcUbm8r'

  async created() {
    this.profileForm = (<ProfileFormInterface>new EvanForm(this, {
      accountType: {
        value: 'unspecified',
      },
      alias: {
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
      termsAccepted: {
        value: false,
      }
    }));
    // use this for debugginb
    // this.mnemonicRiddleSolved = true;
    // this.profileForm.alias.value = 'Test';
    // this.profileForm.password0.value = 'Evan1234';
    // this.profileForm.password1.value = 'Evan1234';

    // set if from the created function to keep the correct disabled function context
    this.steps = [
      {
        title: '_onboarding.sign-up.profile-informations',
        disabled: () => {
          return this.creatingProfile || this.activeStep > 2;
        }
      },
      {
        title: '_onboarding.sign-up.get-mnemonic',
        disabled: () => {
          return !this.profileForm.isValid ||
            this.creatingProfile || this.activeStep > 2;
        }
      }
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

    this.loading = false;
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
   * Show the next status img and text for the profile creation.
   */
  nextCreationStatus() {
    if (this.creationTime !== 16) {
      this.creationTime++;
      this.timeoutCreationStatus = setTimeout(() => this.nextCreationStatus(), 1000);
    }

    if (this.creationTime % 5 === 0) {
      this.creatingProfile += 1;
    }
  }

  /**
   * Starts the profile creation.
   */
  async createProfile() {
    if (this.recaptchaToken) {
      // start profile creation animation and status display
      this.nextCreationStatus();

      try {
        const password = this.profileForm.password0.value;
        // load the vault using the current inputs and create a bcc profile runtime
        const vault = await dappBrowser.lightwallet.getNewVault(this.mnemonic, password);
        const provider = 'internal';
        const accountId = dappBrowser.lightwallet.getAccounts(vault, 1)[0];
        const privateKey = dappBrowser.lightwallet.getPrivateKey(vault, accountId);

        const runtime = await dappBrowser.bccHelper.createDefaultRuntime(
          bcc, accountId, vault.encryptionKey, privateKey);

        await bcc.Onboarding.createOfflineProfile(
          runtime,
          this.profileForm.alias.value,
          accountId,
          privateKey,
          this.recaptchaToken,
          runtime.environment
        );

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
            this.showMnemnonicModal();
          } else {
            this.creatingProfile = 0;
            this.activeStep = 3;
          }
        }, 2000);
      } catch (ex) {
        // reset all steps of proile creation
        dappBrowser.utils.log(ex.message, 'error');
        this.creatingProfile = 0;
        this.creationTime = -1;
        this.recaptchaToken = null;
        (this.$refs.creatingProfileError as any).show();
      }

      // stop ui status updates
      window.clearTimeout(this.timeoutCreationStatus);
    }
  }

  showMnemnonicModal() {
    (this.$refs.modal as any).show();
  }
  /**
   * Navigates to the previous opened application or use the default dapp ens.
   */
  navigateToEvan() {
    // do not use $router.push to force navigation triggering!
    window.location.hash = `/${ this.$route.query.origin || getDefaultDAppEns() }`;
  }
}

