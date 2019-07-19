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

// evan.network imports
import { EvanComponent, EvanForm, EvanFormControl } from '@evan.network/ui-vue-core';
import * as bcc from '@evan.network/api-blockchain-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';

import * as dispatchers from '../../../../../dispatchers/registry';

import { triggerRequestReload } from '../notary.identifications';

interface RequestFormIdentInterface extends EvanForm {
  address: EvanFormControl;
  city: EvanFormControl;
  organization: EvanFormControl;
  contact: EvanFormControl;
  country: EvanFormControl;
  regNumber: EvanFormControl;
  zipCode: EvanFormControl;
}

@Component({ })
export default class IdentNotaryRequestComponent extends mixins(EvanComponent) {
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
  status = 0;

  steps = [
    {
      title: "Überblick",
      disabled: false
    },
    {
      title: "Ihre Daten",
      disabled: false
    },
    {
      title: "Zusammenfassung",
      disabled: true
    },
  ];

  /**
   * listen for dispatcher updates
   */
  listeners: Array<Function> = [ ];

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
      regNumber: {
        value: '',
        validate: function(vueInstance: IdentNotaryRequestComponent, form: RequestFormIdentInterface) {
          switch (form.country.value) {
            case 'germany':
              return /^HR(A|B)(\s|-)?(\d)+$/i.test(this.value)
            default:
              return false // foreign countries not supported yet
          }
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
      }
    }));

    this.requestForm.organization.value = '';
    this.requestForm.regNumber.value = '';
    this.requestForm.country.value = 'germany';
    this.requestForm.address.value = '';
    this.requestForm.zipCode.value = '';
    this.requestForm.city.value = '';
    this.requestForm.contact.value = '';

    this.checkSending();
    this.listeners.push(dispatchers.requestIdentificationDispatcher
      .watch(async ($event) => {
        // if dispatcher has finished loading, reload the data
        if ($event.detail.status === 'finished') {
          this.status = 2;
          this.sending = false;
          triggerRequestReload(this.$route.params.address);
        }
      }));
  }

  /**
   * Update status, when clicked in step component
   *
   * @param step
   */
  updatestep(step: number) {
    this.status = step;
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
      organizationRegistration: this.requestForm.regNumber.value,
      registrationNumber: this.requestForm.regNumber.value,
      organizationName: this.requestForm.organization.value,
      organizationStreetAddress: this.requestForm.address.value,
      organizationZipCode: this.requestForm.zipCode.value,
    };

    // send the verification request
    dispatchers.requestIdentificationDispatcher.start((<any>this).getRuntime(), {
      mail: {
        title: (<any>this).$i18n.translate('_org.ident.notary.request.mail.title'),
        body: (<any>this).$i18n.translate('_org.ident.notary.request.mail.body', requestData),
      },
      requestData,
    });
  }
}
