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
import { Prop, Watch } from 'vue-property-decorator';

// evan.network imports
import { EvanComponent, EvanForm, EvanFormControl } from '@evan.network/ui-vue-core';
import * as bcc from '@evan.network/api-blockchain-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';

// internal
import * as dispatchers from '../../../../../dispatchers/registry';
import * as notaryLib from '../../notary.lib';
import ProfileMigrationLibrary from '../../../../../lib/profileMigration';


interface RequestFormIdentInterface extends EvanForm {
  contact: EvanFormControl;
  department: EvanFormControl;
}

interface LabeledEntry {
  label: string,
  value: string
}

interface CompanyData {
  registration: {
    company: string,
    court: string,
    register: string,
    registerNumber: string,
    salesTaxID: string,
  },
  contact: {
    city: string,
    country: string,
    postalCode: number,
    streetAndNumber: string,
    website: string,
  }
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
  listeners: Array<Function> = [ ];

  /**
   * List of missing company information.
   */
  requiredCompanyFields = {
    contact: [ 'city', 'country', 'postalCode', 'streetAndNumber', ],
    registration: [ 'company', 'court', 'register', 'registerNumber', 'salesTaxID' ],
  };
  missingCompanyFields = { contact: [ ], registration: [ ], };

  /**
   * Show loading until the request was finished.
   */
  sending = false;

  /**
   * show formular or accept view
   */
  status = -1;


  /**
   * Steps for requesting notary verification.
   */
  steps = [
    {
      title: (<any>this).$i18n.translate('_profile.verifications.notary.step.your_data'),
      disabled: false
    },
    {
      title: (<any>this).$i18n.translate('_profile.verifications.notary.step.summary'),
      disabled: true
    },
    {
      title: (<any>this).$i18n.translate('_profile.verifications.notary.step.costs'),
      disabled: true
    },
  ];

  /**
   * minimum value of the verification costs (200 EVE)
   */
  verificationCost = '200000000000000000000';

  /**
   * Watch if form validity changed and update steps accordingly
   */
  @Watch('requestForm.isValid')
  onValidate(valid: boolean, oldValid: boolean) {
    if (valid !== oldValid) {
      this.steps[1].disabled = !valid
      this.steps[2].disabled = !valid
    }
  }

  async created() {
    this.requestForm = (<RequestFormIdentInterface>new EvanForm(this, {
      contact: {
        value: '',
        validate: function(vueInstance: IdentNotaryRequestComponent, form: RequestFormIdentInterface) {
          return this.value.length !== 0;
        }
      },
      department: {
        value: '',
        validate: function(vueInstance: IdentNotaryRequestComponent, form: RequestFormIdentInterface) {
          return true;
        }
      }
    }));

    await this.loadCompanyData();
    await this.loadFunds();

    this.checkSending();
    this.listeners.push(dispatchers.requestIdentificationDispatcher
      .watch(async ($event) => {
        // if dispatcher has finished loading, reload the data
        if ($event.detail.status === 'finished') {
          this.status = 3;
          this.sending = false;
          notaryLib.triggerRequestReload(this.address, {
            status: 'requested',
          });
        }
      })
    );

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
    this.listeners.forEach(listener => listener());
  }

  /**
   * Takes the users information and pass them into the apporve objects, so it can be displayed
   * using the key-value component.
   */
  setupSummary() {
    this.approveData = [
      {
        label: (<any>this).$i18n.translate('_profile.company.registration.company.label'),
        value: this.companyData.registration.company
      },
      {
        label: (<any>this).$i18n.translate('_profile.company.contact.country.label'),
        value: (<any>this).$i18n.translate(
          `_countries.${ this.companyData.contact.country }`),
      },
      {
        label: (<any>this).$i18n.translate('_profile.company.registration.court.label'),
        value: this.companyData.registration.court
      },
      {
        label: (<any>this).$i18n.translate('_profile.company.registration.registerNumber.label'),
        value: `${this.companyData.registration.register} ${this.companyData.registration.registerNumber}`
      }
    ]

    this.approveAddress = [
      {
        label: (<any>this).$i18n.translate('_profile.verifications.notary.request.contact.label'),
        value: this.requestForm.contact.value
      }, {
        label: (<any>this).$i18n.translate('_profile.verifications.notary.request.department.label'),
        value: this.requestForm.department.value
      }, {
        label: (<any>this).$i18n.translate('_profile.company.contact.address.label'),
        value: this.companyData.contact.streetAndNumber,
      }, {
        label: (<any>this).$i18n.translate('_profile.company.contact.city.label'),
        value: `${this.companyData.contact.postalCode} ${this.companyData.contact.city}`
      }
    ];
  }

  /**
   * check if currently a verification gets accepted.
   */
  async checkSending() {
    const runtime: bcc.Runtime = (<any>this).getRuntime();
    const instances = await dispatchers.requestIdentificationDispatcher.getInstances(runtime);

    this.sending = instances.length !== 0;
  }

  /**
   * Show the info modal.
   */
  show() {
    (<any>this.$refs).requestModal.show();
  }

  /**
   * Hide the info modal.
   */
  hide() {
    (<any>this.$refs).requestModal.hide();
  }

  /**
   * Load the current funds of the user and check, if they are enough for requesting a notary
   * verification.
   */
  async loadFunds() {
    const runtime: bcc.Runtime = (<any>this).getRuntime();
    const fundsAvailable = await runtime.web3.eth.getBalance(runtime.activeAccount);
    this.activeAccount = runtime.activeAccount;
    this.readableFunds = parseFloat(runtime.web3.utils.fromWei(fundsAvailable)).toFixed(2);
    this.enoughFunds = runtime.web3.utils
      .toBN(fundsAvailable)
      .gt(runtime.web3.utils.toBN(this.verificationCost));
  }

  /**
   * Load currents users company data and checks, if some information are missing.
   */
  async loadCompanyData() {
    const runtime: bcc.Runtime = (<any>this).getRuntime();
    const [ registration, contact, ] = await Promise.all([
      ProfileMigrationLibrary.loadProfileData(runtime, 'registration'),
      ProfileMigrationLibrary.loadProfileData(runtime, 'contact'),
    ]);

    this.companyData = { registration, contact, };

    // detect empty values, that are required
    Object.keys(this.requiredCompanyFields).forEach(category => {
      this.missingCompanyFields[category] = [ ];
      this.requiredCompanyFields[category].forEach((field: string) => {
        if (!this.companyData[category][field]) {
          this.missingCompanyFields[category].push(field);
        }
      })
    })

    // ensure that germany is selected
    if (this.companyData.contact.country && this.companyData.contact.country !== 'DE') {
      this.missingCompanyFields.contact.push('country');
    }
  }

  /**
   * Move to next status tab.
   */
  nextStatus() {
    this.status += 1;

    // setup summary data
    if (this.status === 1) {
      this.setupSummary();
    }
  }

  /**
   * Send the request verification b-mail, so the process will be triggered.
   */
  requestIdentification() {
    this.sending = true;

    // define the request data, so we can append it into the attachment and as payload in the body
    const requestData = {
      organizationCity: this.companyData.contact.city,
      organizationContact: this.requestForm.contact.value,
      organizationCountry: this.companyData.contact.country,
      organizationEvanId: (<any>this).getRuntime().activeAccount,
      court: this.companyData.registration.court,
      organizationRegistration: `${this.companyData.registration.register} ${this.companyData.registration.registerNumber}`,
      organizationName: this.companyData.registration.company,
      organizationStreetAddress: this.companyData.contact.streetAndNumber,
      organizationZipCode: this.companyData.contact.postalCode,
    };

    // send the verification request
    dispatchers.requestIdentificationDispatcher.start((<any>this).getRuntime(), {
      mail: {
        title: (<any>this).$i18n.translate('_profile.verifications.notary.request.mail.title'),
        body: (<any>this).$i18n.translate('_profile.verifications.notary.request.mail.body', requestData),
      },
      requestData,
    });
  }
}
