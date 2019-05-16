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

interface ContactFormInterface extends EvanForm {
  alias: EvanFormControl;
  emailInvite: EvanFormControl;
  address: EvanFormControl;
  email: EvanFormControl;
}

@Component({ })
export default class AddComponent extends mixins(EvanComponent) {
  /**
   * formular specific variables
   */
  contactForm: ContactFormInterface = null;

  /**
   * Used for easier building form i18n keys
   */
  formI18nScope = '_addressbook.contact-form';

  /**
   * Setup contact form.
   */
  created() {
    this.contactForm = (<ContactFormInterface>new EvanForm(this, {
      alias: {
        value: '',
        validate: function(vueInstance: AddComponent, form: ContactFormInterface) {
          return this.value.length !== 0;
        }
      },
      emailInvite: {
        value: false,
        validate: function(vueInstance: AddComponent, form: ContactFormInterface) {
          // trigger the validation process for the address and email contorl,
          // when the email invite was changed
          form.address.validate();
          form.email.validate();

          return true;
        }
      },
      address: {
        value: '',
        validate: function(vueInstance: AddComponent, form: ContactFormInterface) {
          return form.emailInvite.value || EvanForm.validEthAddress(this.value);
        }
      },
      email: {
        value: '',
        validate: function(vueInstance: AddComponent, form: ContactFormInterface) {
          return !form.emailInvite.value || EvanForm.validateEmail(this.value);
        }
      },
    }));
  }

  /**
   * Save the new contact using the queue.
   */
  addContact() {
    (<any>this).evanNavigate('');
  }
}
