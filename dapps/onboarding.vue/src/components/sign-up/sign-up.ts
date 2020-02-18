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
import { EvanComponent, EvanForm, EvanFormControl } from '@evan.network/ui-vue-core';
import * as bcc from '@evan.network/api-blockchain-core';
import { getDomainName, utils } from '@evan.network/ui-dapp-browser';
import { bccHelper, session, lightwallet } from '@evan.network/ui-session';

interface ProfileFormInterface extends EvanForm {
  accountType: EvanFormControl;
  alias: EvanFormControl;
  isValid?: boolean;
  password0: EvanFormControl;
  password1: EvanFormControl;
  termsAccepted: EvanFormControl;
}

@Component({ })
export default class SignUp extends mixins(EvanComponent) {
  /**
   * current mnemonic value as text
   */
  mnemonic = '';

  /**
   * use to cancel riddle
   */
  originalMnemonic = '';

  /**
   * is the current mnemonic valid?
   */
  validMnemonic = false;

  /**
   * is the current mnemonic / password is currently checking?
   */
  checking = false;

  /**
   * recaptcha value
   */
  recaptchaToken = null as any;

  /**
   * check if the recaptcha is initialzing
   */
  initialzing = true;

  /**
   * formular specific variables
   */
  profileForm: ProfileFormInterface = null;

  /**
   * steps status configurations
   */
  activeStep = 0;

  /**
   * currently creating the profile
   */
  creatingProfile = 0;

  /**
   * track the time that the profile took to be created
   */
  creationTime = -1;

  /**
   * timeout to show next profile creation img
   */
  timeoutCreationStatus = null as any;

  /**
   * Is the component currently loading?
   */
  loading = true;

  /**
   * Show onboarded dialog with optional contact accept dialog
   */
  onboardedDialog = false;

  /**
   * override custom recaptcha ID
   */
  recaptchaId = window.localStorage['evan-test-recaptchaId'] || '6LfoK1IUAAAAAOK0EbTv-IqtBq2NS-bvKWcUbm8r';

  /**
   * Latest user information, saved before creating profile, so it could be recovered, when an error
   * occures.
   */
  userData: any = {
    accountDetails: {
      accountType: 'company',
    },
    contact: {
      country: 'DE',
    },
  };

  /**
   * has the user accepted the terms of use?
   */
  termsAccepted = null;

  /**
   * Return the steps for the selected profile type and if it's a company, the
   * selected country.
   */
  get steps() {
    const creatingOrOnboarded = () => this.onboardedDialog;

    // set if from the created function to keep the correct disabled function context
    const steps = [
      {
        title: '_onboarding.sign-up.steps.base.title',
        disabled: () => creatingOrOnboarded(),
      },
    ];

    if (this.profileForm && this.profileForm.accountType.value === 'company') {
      // data company specific steps
      steps.push({
        title: '_onboarding.sign-up.steps.company.contact.title',
        disabled: () => creatingOrOnboarded() || !this.profileForm.isValid,
      });
      if (this.userData.contact.country === 'DE') {
        steps.push({
          title: '_onboarding.sign-up.steps.company.registration.title',
          disabled: () => creatingOrOnboarded()
            || this.$refs.companyContact && !this.$refs.companyContact.form.isValid,
        });
      }
    }

    // add finishing step
    steps.push({
      title: '_onboarding.sign-up.steps.captcha.title',
      disabled: () => {
        if (creatingOrOnboarded()) {
          return true;
        }

        switch (this.profileForm.accountType.value) {
          case 'company': {
            return this.$refs.companyRegistration && !this.$refs.companyRegistration.form.isValid;
          }
          default: {
            return !this.profileForm.isValid;
          }
        }
      },
    });

    return steps;
  }

  created() {
    const uiSpecs = { attr: { required: true } };
    this.profileForm = (<ProfileFormInterface> new EvanForm(this, {
      accountType: {
        value: 'company',
        uiSpecs: {
          attr: {
            required: true,
            options: [
              { label: '_onboarding.sign-up.account-types.user', value: 'user' },
              { label: '_onboarding.sign-up.account-types.company', value: 'company' },
            ],
          },
          type: 'select',
        },
      },
      alias: {
        value: '',
        validate(vueInstance: SignUp, form: ProfileFormInterface) {
          return this.value.length !== 0;
        },
        uiSpecs: {
          attr: {
            hint: () => (this as any).$t(`_onboarding.sign-up.alias.hint-${this.profileForm.accountType.value}`),
            required: true,
          },
          label: () => (this as any).$t(`_onboarding.sign-up.alias.${this.profileForm.accountType.value}`),
        },
      },
      password0: {
        value: '',
        validate(vueInstance: SignUp, form: ProfileFormInterface) {
          return vueInstance.getPasswordError(0, this.form) || true;
        },
        uiSpecs: { attr: { hint: true, required: true, type: 'password' } },
      },
      password1: {
        value: '',
        validate(vueInstance: SignUp, form: ProfileFormInterface) {
          return vueInstance.getPasswordError(1, this.form) || true;
        },
        uiSpecs: { attr: { hint: true, required: true, type: 'password' } },
      },
    }));

    this.termsAccepted = new EvanFormControl('termsAccepted', false, this);

    // if the user was inivted, show the welcome page
    if (this.$route.query.inviteeAlias) {
      this.steps.push({
        title: '_onboarding.sign-up.welcome',
        disabled: () => this.activeStep !== 3,
      });
    }

    // set initial mnemonic from query params or use an generated one
    this.mnemonic = this.mnemonic || this.$route.query.mnemonic
      || lightwallet.generateMnemonic();
    this.originalMnemonic = this.mnemonic;

    // include the google recaptcha
    const scriptElement = document.createElement('script');
    scriptElement.src = `https://www.google.com/recaptcha/api.js?onload=vueRecaptchaApiLoaded&
      render=explicit&hl=${(this as any).$i18n.locale()}`;
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
    const passwordControl = form[`password${index}`];

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
   * Return the profile creation information.
   */
  async getProfileCreationData() {
    const password = this.profileForm.password0.value;
    // load the vault using the current inputs and create a bcc profile runtime
    const vault = await lightwallet.getNewVault(this.mnemonic, password);
    const provider = 'internal';
    const accountId = lightwallet.getAccounts(vault, 1)[0];
    const privateKey = lightwallet.getPrivateKey(vault, accountId);

    const runtime = await bccHelper.createRuntime(
      accountId, vault.encryptionKey, privateKey,
    );

    return {
      password, vault, provider, accountId, privateKey, runtime,
    };
  }

  /**
   * Starts the profile creation.
   */
  async createProfile() {
    if (this.recaptchaToken) {
      // save user inputs, so it can be restored on error
      this.userData = this.getUserData();

      // start profile creation animation and status display
      this.nextCreationStatus();

      try {
        const {
          password, accountId, privateKey, runtime, vault,
        } = await this.getProfileCreationData();

        await bcc.Onboarding.createOfflineProfile(
          runtime,
          this.userData,
          accountId,
          privateKey,
          this.recaptchaToken,
          runtime.environment,
        );

        await this.finishOnboarding(runtime, vault, accountId, password);

        // show done animation and navigate to signed in page
        this.creatingProfile = 5;
        setTimeout(() => {
          /* if the user were invited, show the sign in step, else navigate directly to the root
             page. */
          if (!this.$route.query.inviteeAlias) {
            this.navigateToEvan();
          } else {
            this.creatingProfile = 0;
            this.onboardedDialog = true;
          }
        }, 2000);
      } catch (ex) {
        // reset all steps of proile creation
        utils.devLog(ex.message, 'error');
        this.creatingProfile = 0;
        this.creationTime = -1;
        this.recaptchaToken = null;
        (this.$refs.creatingProfileError as any).show();
        window.clearTimeout(this.timeoutCreationStatus);
      }

      // stop ui status updates
      window.clearTimeout(this.timeoutCreationStatus);
    }
  }

  /**
   * Finish the onboarding process and sets the current mnemonic active.
   *
   * @param      {bccRuntime}  runtime    runtime
   * @param      {any}         vault      created vault
   * @param      {string}      accountId  account id
   * @param      {string}      password   password
   */
  async finishOnboarding(runtime: bcc.Runtime, vault: any, accountId: string, password: string) {
    // check if onboarded, else throw it!
    if (!runtime.profile) {
      throw new Error('Onboarding has finished, but user isnt onboarded?');
    }

    // profile is setup!
    await lightwallet.createVaultAndSetActive(this.mnemonic, password);
    session.setCurrentProvider('internal');

    // set encrypted mnemonic for temporary usage
    this.persistMnemonic(runtime, vault);
  }

  /**
   * Writes encrypted mnemonic to local storage.
   *
   * @param runtime
   * @param { encryptionKey }
   */
  async persistMnemonic(runtime, { encryptionKey }): Promise<void> {
    const cryptor = runtime.sharing.options.cryptoProvider
      .getCryptorByCryptoAlgo(runtime.sharing.options.defaultCryptoAlgo);
    const encryptedMnemonic = await cryptor.encrypt(this.mnemonic, { key: encryptionKey });

    window.localStorage['evan-mnemonic'] = encryptedMnemonic.toString('hex');
  }

  /**
   * Navigates to the previous opened application or use the default dapp ens.
   */
  navigateToEvan() {
    const domainName = getDomainName();
    // do not use $router.push to force navigation triggering!
    window.location.hash = `/${this.$route.query.origin
      || `dashboard.vue.${domainName}/profile.vue.${domainName}`}`;
  }

  /**
   * returns the current users profile information from the displayed formulars and steps.
   */
  getUserData() {
    const userData: any = {
      accountDetails: {
        accountName: this.profileForm.alias.value,
        profileType: this.profileForm.accountType.value,
      },
    };

    switch (userData.accountDetails.profileType) {
      case 'company': {
        userData.registration = this.$refs.companyRegistration.form.getFormData();
        userData.contact = this.$refs.companyContact.form.getFormData();

        break;
      }
    }

    return userData;
  }

  /**
   * return the list of images, that should be displayed within the left panel for which step.
   */
  getLeftPanelImages() {
    switch (this.profileForm.accountType.value) {
      case 'company': {
        return ['7.svg', '8.svg', '9.svg', '13.svg'];
      }
      case 'user': {
        return ['7.svg', '4.svg'];
      }
    }
  }
}
