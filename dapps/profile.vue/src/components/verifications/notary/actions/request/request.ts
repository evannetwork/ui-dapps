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
import { Prop, Watch } from 'vue-property-decorator';

// evan.network imports
import { EvanComponent, EvanForm, EvanFormControl } from '@evan.network/ui-vue-core';
import * as bcc from '@evan.network/api-blockchain-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';

// internal
import * as dispatchers from '../../../../../dispatchers/registry';
import * as notaryLib from '../../notary.lib';

interface RequestFormIdentInterface extends EvanForm {
  address: EvanFormControl;
  city: EvanFormControl;
  organization: EvanFormControl;
  contact: EvanFormControl;
  country: EvanFormControl;
  registerNumber: EvanFormControl;
  zipCode: EvanFormControl;
  court: EvanFormControl;
  register: EvanFormControl;
  department: EvanFormControl;
}

interface LabeledEntry {
  label: string,
  value: string
}

@Component({ })
export default class IdentNotaryRequestComponent extends mixins(EvanComponent) {
  /**
   * Address for that the notary verifications should be loaded
   */
  @Prop() address;

  /**
   * minimum value of the verification costs (200 EVE)
   */
  verificationCost = '200000000000000000000';

  /**
   * Formular for verification requests
   */
  requestForm: RequestFormIdentInterface = null;

  /**
   * Show loading until the request was finished.
   */
  sending = false;

  /**
   * show formular or accept view
   */
  status = -1;

  /**
   * Whether the user approved the costs hint.
   */
  approvedCosts = false;

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

  approveData: LabeledEntry[] = [];
  approveAddress: LabeledEntry[] = [];

  /**
   * listen for dispatcher updates
   */
  listeners: Array<Function> = [ ];

  /**
   * Fund information of the current user
   */
  readableFunds: string = null;
  enoughFunds: boolean = null;

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
      country: {
        value: 'germany', // TODO: should we use ISO 3166-1 alpha-2 country codes system wide, to avoid any confusions?
        validate: function(vueInstance: IdentNotaryRequestComponent, form: RequestFormIdentInterface) {
          return this.value.length !== 0;
        }
      },
      organization: {
        value: '',
        validate: function(vueInstance: IdentNotaryRequestComponent, form: RequestFormIdentInterface) {
          return this.value.length !== 0;
        }
      },
      address: {
        value: '',
        validate: function(vueInstance: IdentNotaryRequestComponent, form: RequestFormIdentInterface) {
          return this.value.length !== 0;
        }
      },
      zipCode: {
        value: '',
        validate: function(vueInstance: IdentNotaryRequestComponent, form: RequestFormIdentInterface) {
          return !!this.value.match(/^\d{5}$/);
        }
      },
      city: {
        value: '',
        validate: function(vueInstance: IdentNotaryRequestComponent, form: RequestFormIdentInterface) {
          return this.value.length !== 0;
        }
      },
      contact: {
        value: '',
        validate: function(vueInstance: IdentNotaryRequestComponent, form: RequestFormIdentInterface) {
          return this.value.length !== 0;
        }
      },
      court: {
        value: '',
        validate: function(vueInstance: IdentNotaryRequestComponent, form: RequestFormIdentInterface) {
          return this.value.length !== 0;
        }
      },
      registerNumber: {
        validate: function(vueInstance: IdentNotaryRequestComponent, form: RequestFormIdentInterface) {
          switch (form.country.value) {
            case 'germany':
              return /^(\d)+$/i.test(this.value)
            default:
              return false // foreign countries not supported yet
          }
        }
      },
      register: {
        value: 'HRB',
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

    this.requestForm.organization.value = '';
    this.requestForm.registerNumber.value = '';
    this.requestForm.country.value = 'germany';
    this.requestForm.address.value = '';
    this.requestForm.zipCode.value = '';
    this.requestForm.city.value = '';
    this.requestForm.contact.value = '';
    this.requestForm.department.value = '';


    const runtime: bcc.Runtime = (<any>this).getRuntime();
    const fundsAvailable = await runtime.web3.eth.getBalance(runtime.activeAccount);
    this.readableFunds = parseFloat(runtime.web3.utils.fromWei(fundsAvailable)).toFixed(2);
    this.enoughFunds = runtime.web3.utils.toBN(fundsAvailable)
      .gt(runtime.web3.utils.toBN(this.verificationCost));

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
  }

  updated () {
    this.approveData = [
      {
        label: (<any>this).$i18n.translate('_profile.verifications.notary.request.organization.title'),
        value: this.requestForm.organization.value
      },
      {
        label: (<any>this).$i18n.translate('_profile.verifications.notary.request.country.title'),
        value: (<any>this).$i18n.translate(
          `_profile.verifications.notary.request.countries.${ this.requestForm.country.value }`),
      },
      {
        label: (<any>this).$i18n.translate('_profile.verifications.notary.request.court.title'),
        value: this.requestForm.court.value
      },
      {
        label: (<any>this).$i18n.translate('_profile.verifications.notary.request.registerNumber.title'),
        value: `${this.requestForm.register.value} ${this.requestForm.registerNumber.value}`
      }
    ]

    this.approveAddress = [
      {
        label: (<any>this).$i18n.translate('_profile.verifications.notary.request.contact.title'),
        value: this.requestForm.contact.value
      }, {
        label: (<any>this).$i18n.translate('_profile.verifications.notary.request.department.title'),
        value: this.requestForm.department.value
      }, {
        label: (<any>this).$i18n.translate('_profile.verifications.notary.request.address.title'),
        value: this.requestForm.address.value
      }, {
        label: (<any>this).$i18n.translate('_profile.verifications.notary.request.city.title'),
        value: `${this.requestForm.zipCode.value} ${this.requestForm.city.value}`
      }
    ];
  }

  /**
   * Clear listeners...
   */
  beforeDestroy() {
    this.listeners.forEach(listener => listener());
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
   * Send the request verification b-mail, so the process will be triggered.
   */
  requestIdentification() {
    this.sending = true;

    // define the request data, so we can append it into the attachment and as payload in the body
    const requestData = {
      organizationCity: this.requestForm.city.value,
      organizationContact: this.requestForm.contact.value,
      organizationCountry: this.requestForm.country.value,
      organizationEvanId: (<any>this).getRuntime().activeAccount,
      court: this.requestForm.court.value,
      organizationRegistration: `${this.requestForm.register.value} ${this.requestForm.registerNumber.value}`,
      organizationName: this.requestForm.organization.value,
      organizationStreetAddress: this.requestForm.address.value,
      organizationZipCode: this.requestForm.zipCode.value,
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