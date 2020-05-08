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
import { Prop, Watch } from 'vue-property-decorator';

// evan.network imports
import { EvanComponent, EvanForm, EvanFormControl } from '@evan.network/ui-vue-core';
import { profileUtils, bccUtils } from '@evan.network/ui';
import { Runtime } from '@evan.network/api-blockchain-core';


// internal
import * as dispatchers from '../../../../../dispatchers/registry';
import * as notaryLib from '../../notary.lib';


interface RequestFormIdentInterface extends EvanForm {
  contact: EvanFormControl;
  department: EvanFormControl;
}

interface LabeledEntry {
  label: string;
  value: string;
}

interface CompanyData {
  accountDetails: {
    accountName: string;
    profileType: string;
  };
  registration: {
    company: string;
    court: string;
    register: string;
    registerNumber: string;
    salesTaxID: string;
  };
  contact: {
    city: string;
    country: string;
    postalCode: number;
    streetAndNumber: string;
    website: string;
  };
}

@Component({ })
export default class IdentNotaryRequestComponent extends mixins(EvanComponent) {
  /**
   * Address for that the notary verifications should be loaded
   */
  @Prop() address;

  /**
   * Currents user active account that must be passed into the info-content component
   */
  activeAccount = '';

  identity = '';

  /**
   * Whether the user approved the costs hint.
   */
  approvedCosts = false;

  /**
   * Used to create the summary page.
   */
  approveData: LabeledEntry[] = [];

  approveAddress: LabeledEntry[] = [];

  /**
   * Currents users company information.
   */
  companyData: CompanyData = null;

  /**
   * Formular for verification requests
   */
  requestForm: RequestFormIdentInterface = null;

  /**
   * Fund information of the current user
   */
  readableFunds: string = null;

  enoughFunds: boolean = null;

  /**
   * listen for dispatcher updates
   */
  listeners: Array<Function> = [];

  /**
   * List of missing company information.
   */
  requiredCompanyFields = {
    contact: ['city', 'country', 'postalCode', 'streetAndNumber'],
    registration: ['court', 'register', 'registerNumber'],
  };

  missingCompanyFields = { contact: [], registration: [] };

  /**
   * Show loading until the request was finished.
   */
  sending = false;

  /**
   * Show a loading symbol, until profile data was loaded
   */
  loadingCompanyData = false;

  /**
   * show formular or accept view
   */
  status = -1;

  /**
   * Steps for requesting notary verification.
   */
  steps = [
    {
      title: this.$i18n.translate('_profile.verifications.notary.step.your_data'),
      disabled: false,
    },
    {
      title: this.$i18n.translate('_profile.verifications.notary.step.summary'),
      disabled: true,
    },
    {
      title: this.$i18n.translate('_profile.verifications.notary.step.costs'),
      disabled: true,
    },
  ];

  /**
   * minimum value of the verification costs (200 EVE)
   */
  verificationCost = notaryLib.verificationCost;

  /**
   * Watch if form validity changed and update steps accordingly
   */
  @Watch('requestForm.isValid')
  onValidate(valid: boolean, oldValid: boolean): void {
    if (valid !== oldValid) {
      this.steps[1].disabled = !valid;
      this.steps[2].disabled = !valid;
    }
  }

  async created(): Promise<void> {
    this.requestForm = (new EvanForm(this, {
      contact: {
        value: '',
        validate(vueInstance: IdentNotaryRequestComponent, form: RequestFormIdentInterface) {
          return this.value.length !== 0;
        },
        uiSpecs: {
          attr: {
            required: true,
          },
        },
      },
      department: {
        value: '',
        validate(vueInstance: IdentNotaryRequestComponent, form: RequestFormIdentInterface) {
          return true;
        },
      },
    }) as RequestFormIdentInterface);

    await this.loadCompanyData();
    await this.loadFunds();

    this.checkSending();
    this.listeners.push(dispatchers.requestIdentificationDispatcher
      .watch(async ($event) => {
        // if dispatcher has finished loading, reload the data
        if ($event.detail.status === 'finished') {
          this.status = 3;
          this.sending = false;
        }
      }));

    // watch for company data updates
    this.listeners.push(dispatchers.updateProfileDispatcher.watch(($event: any) => {
      if ($event.detail.status === 'finished' || $event.detail.status === 'deleted') {
        this.loadCompanyData();
      }
    }));
  }

  /**
   * Clear listeners...
   */
  beforeDestroy() {
    this.listeners.forEach((listener) => listener());
  }

  /**
   * Takes the users information and pass them into the apporve objects, so it can be displayed
   * using the key-value component.
   */
  async setupSummary(): Promise<void> {
    const { profileDApp } = this.$store.state;
    this.approveData = [
      {
        label: this.$i18n.translate('_profile.company.registration.company.label'),
        value: await profileUtils.getUserAlias(
          this.getRuntime(),
          profileDApp.address,
          profileDApp.accountDetails,
        ),
      },
      {
        label: this.$i18n.translate('_profile.company.contact.country.label'),
        value: this.$i18n.translate(
          `_countries.${this.companyData.contact.country}`,
        ),
      },
      {
        label: this.$i18n.translate('_profile.company.registration.court.label'),
        value: this.companyData.registration.court,
      },
      {
        label: this.$i18n.translate('_profile.company.registration.registerNumber.label'),
        value: `${this.companyData.registration.register} ${this.companyData.registration.registerNumber}`,
      },
    ];

    this.approveAddress = [
      {
        label: this.$i18n.translate('_profile.verifications.notary.request.contact.label'),
        value: this.requestForm.contact.value,
      }, {
        label: this.$i18n.translate('_profile.verifications.notary.request.department.label'),
        value: this.requestForm.department.value,
      }, {
        label: this.$i18n.translate('_profile.company.contact.address.label'),
        value: this.companyData.contact.streetAndNumber,
      }, {
        label: this.$i18n.translate('_profile.company.contact.city.label'),
        value: `${this.companyData.contact.postalCode} ${this.companyData.contact.city}`,
      },
    ];
  }

  /**
   * check if currently a verification gets accepted.
   */
  async checkSending(): Promise<void> {
    const runtime: Runtime = this.getRuntime();
    const instances = await dispatchers.requestIdentificationDispatcher.getInstances(runtime);

    this.sending = instances.length !== 0;
  }

  /**
   * Show the info modal.
   */
  show(): void {
    (this.$refs.requestModal as any).show();
  }

  /**
   * Hide the info modal.
   */
  hide(): void {
    (this.$refs.requestModal as any).hide();
  }

  /**
   * Load the current funds of the user and check, if they are enough for requesting a notary
   * verification.
   */
  async loadFunds(): Promise<void> {
    const runtime: Runtime = this.getRuntime();
    const fundsAvailable = await runtime.web3.eth.getBalance(runtime.activeAccount);
    this.activeAccount = runtime.activeAccount;
    this.identity = await runtime.verifications.getIdentityForAccount(this.activeAccount, true);
    this.readableFunds = parseFloat(runtime.web3.utils.fromWei(fundsAvailable)).toFixed(2);
    this.enoughFunds = runtime.web3.utils
      .toBN(fundsAvailable)
      .gt(runtime.web3.utils.toBN(this.verificationCost));
  }

  /**
   * Load currents users company data and checks, if some information are missing.
   */
  async loadCompanyData(): Promise<void> {
    this.loadingCompanyData = true;
    const { $store } = this as any;
    // wait until profile was reloaded
    await $store.state.loadingProfile;

    this.companyData = {
      accountDetails: $store.state.profileDApp.data.accountDetails,
      contact: $store.state.profileDApp.data.contact,
      registration: $store.state.profileDApp.data.registration,
    };

    // detect empty values, that are required
    Object.keys(this.requiredCompanyFields).forEach((category) => {
      this.missingCompanyFields[category] = [];
      this.requiredCompanyFields[category].forEach((field: string) => {
        if (this.companyData[category] && !this.companyData[category][field]) {
          this.missingCompanyFields[category].push(field);
        }
      });
    });
    this.loadingCompanyData = false;
  }

  /**
   * Move to next status tab.
   */
  async nextStatus(): Promise<void> {
    this.status += 1;

    // setup summary data
    if (this.status === 1) {
      await this.setupSummary();
    }
  }

  /**
   * Send the request verification b-mail, so the process will be triggered.
   */
  async requestIdentification(): Promise<void> {
    this.sending = true;
    const runtime: Runtime = this.getRuntime();

    // define the request data, so we can append it into the attachment and as payload in the body
    const { profileDApp } = this.$store.state;
    const requestData = {
      organizationCity: this.companyData.contact.city,
      organizationContact: this.requestForm.contact.value,
      organizationCountry: this.companyData.contact.country,
      organizationEvanId: await bccUtils.getDidFromAddress(runtime, runtime.activeIdentity),
      accountId: runtime.activeIdentity,
      court: this.companyData.registration.court,
      organizationRegistration: `${this.companyData.registration.register} ${this.companyData.registration.registerNumber}`,
      organizationName: await profileUtils.getUserAlias(
        runtime,
        profileDApp.address,
        profileDApp.accountDetails,
      ),
      organizationStreetAddress: this.companyData.contact.streetAndNumber,
      organizationZipCode: this.companyData.contact.postalCode,
    };

    // send the verification request
    dispatchers.requestIdentificationDispatcher.start(this.getRuntime(), {
      mail: {
        title: this.$i18n.translate('_profile.verifications.notary.request.mail.title'),
        body: this.$i18n.translate('_profile.verifications.notary.request.mail.body', requestData),
      },
      requestData,
    });
  }

  /**
   * Trigger reloading of verification requests, when a new one was successfully requested.
   */
  modalClosed(): void {
    if (this.status === 3) {
      notaryLib.triggerRequestReload(this.address, {
        status: 'requested',
      });
    }
  }
}
