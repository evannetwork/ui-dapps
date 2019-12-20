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

// evan.network imports
import { EvanComponent, EvanForm, EvanFormControl } from '@evan.network/ui-vue-core';
import * as bcc from '@evan.network/api-blockchain-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';

import * as dispatchers from '../../dispatchers/registry';

interface ContactFormInterface extends EvanForm {
  accountId: EvanFormControl;
  alias: EvanFormControl;
  email: EvanFormControl;
  emailInvite: EvanFormControl;
  eve: EvanFormControl;
  tags: EvanFormControl;
}

interface MailFormInterface extends EvanForm {
  fromAlias: EvanFormControl;
  msgBody: EvanFormControl;
  msgTitle: EvanFormControl;
}

@Component({ })
export default class ContactAddComponent extends mixins(EvanComponent) {
  /**
   * formular specific variables
   */
  contactForm: ContactFormInterface = null;
  mailForm: MailFormInterface = null;

  /**
   * status flags
   */
  loading = true;

  /**
   * Used for easier building form i18n keys
   */
  formI18nScope = '_addressbook.contact-form';

  /**
   * Alias of the current user.
   */
  myAlias = '';

  /**
   * EVE balance of the current user
   */
  balance = 0;

  /**
   * formular step
   */
  activeStep = 0;

  /**
   * Available steps represented by it's titles
   */
  steps: Array<any> = null;

  /**
   * Setup contact form.
   */
  async created() {
    const runtime = (<any>this).getRuntime();
    const [ addressBook, balance ] = await Promise.all([
      runtime.profile.getAddressBook(),
      dappBrowser.core.getBalance(runtime.activeAccount),
    ]);

    this.steps = [
      {
        title: '_addressbook.contact-form.step1',
        disabled: () => false,
      },
      {
        title: '_addressbook.contact-form.step2',
        disabled: () => !this.contactForm.isValid,
      },
    ];

    // apply loaded values to the scope
    this.myAlias = addressBook.profile[runtime.activeAccount].alias;
    this.balance = balance;

    // specify contact form
    this.contactForm = (<ContactFormInterface>new EvanForm(this, {
      alias: {
        value: '',
        validate: function(vueInstance: ContactAddComponent, form: ContactFormInterface) {
          return this.value.length !== 0;
        }
      },
      tags: {
        value: '',
      },
      emailInvite: {
        value: false,
        validate: function(vueInstance: ContactAddComponent, form: ContactFormInterface) {
          // trigger the validation process for the address and email contorl,
          // when the email invite was changed
          form.accountId.validate();
          form.email.validate();

          return true;
        }
      },
      accountId: {
        value: '',
        validate: function(vueInstance: ContactAddComponent, form: ContactFormInterface) {
          if (!form.emailInvite.value) {
            if (!EvanForm.validEthAddress(this.value)) {
              return '_addressbook.contact-form.accountId.error-invalid';
            } else if (addressBook.profile[this.value]) {
              return '_addressbook.contact-form.accountId.error-added';
            }
          }

          return true;
        }
      },
      eve: {
        value: 1,
        validate: function(vueInstance: ContactAddComponent, form: ContactFormInterface) {
          if (form.emailInvite.value && this.value.length > 0) {
            const parsed = parseFloat(this.value);

            if (parsed === NaN) {
              return '_addressbook.contact-form.eve.error-number';
            } else if (balance < (parsed + 0.5)) {
              return (<any>vueInstance).$t('_addressbook.contact-form.eve.error-eve-missing', {
                eve: vueInstance.balance
              });
            } else if (parsed < 1) {
              return '_addressbook.contact-form.eve.error-minimum';
            }
          }

          return true;
        }
      },
      email: {
        value: '',
        validate: function(vueInstance: ContactAddComponent, form: ContactFormInterface) {
          if (form.emailInvite.value) {
            if (!EvanForm.validateEmail(this.value)) {
              return '_addressbook.contact-form.accountId.error-invalid';
            } else if (addressBook.profile[this.value]) {
              return '_addressbook.contact-form.accountId.error-added';
            }
          }

          return true;
        }
      }
    }));

    // specify mail form
    this.mailForm = (<MailFormInterface>new EvanForm(this, {
      fromAlias: {
        value: this.myAlias,
        validate: function(vueInstance: ContactAddComponent, form: MailFormInterface) {
          return this.value.trim().length !== 0;
        }
      },
      msgTitle: {
        value: (<any>this).$t(`${ this.formI18nScope }.bmail.title`),
        validate: function(vueInstance: ContactAddComponent, form: MailFormInterface) {
          return this.value.trim().length !== 0;
        }
      },
      msgBody: {
        value: (<any>this).$t(`${ this.formI18nScope }.bmail.body`, {
          fromName: this.myAlias
        }),
        validate: function(vueInstance: ContactAddComponent, form: MailFormInterface) {
          return this.value.trim().length !== 0;
        }
      }
    }));

    this.loading = false;
  }

  /**
   * Save the new contact using the queue.
   */
  addContact() {
    // data that should be passed to the invite dispatcher
    const formData: any = {
      currLang: (<any>this).$i18nlocale,
      fromAlias: this.myAlias,
    };

    // transform the controls into the correct form data payload
    this.contactForm.controls.forEach(con => formData[con] = this.contactForm[con].value);
    this.mailForm.controls.forEach(con => formData[con] = this.mailForm[con].value);

    // transform tags into the correct format
    formData.tags = formData.tags.trim().trim().replace(/\s{2,}/g, ' ').split(' ');

    // start invite dispatcher
    dispatchers.inviteDispatcher.start((<any>this).getRuntime(), formData);

    // hide modal
    (<any>this.$refs.contactAddModal) && (<any>this.$refs.contactAddModal).hide();
  }

  /**
   * Opens the contacts modal
   */
  show() {
    (<any>this.$refs.contactAddModal).show();
  }

  /**
   * Opens the contacts modal
   */
  close() {
    (<any>this.$refs.contactAddModal).hide();
  }
}
