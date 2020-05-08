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

import Component, { mixins } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import {
  EvanComponent,
  EvanForm,
  EvanFormControl,
  SwipePanelComponentClass,
} from '@evan.network/ui-vue-core';
import { session } from '@evan.network/ui-session';
import { profileUtils } from '@evan.network/ui';
import { lodash } from '@evan.network/api-blockchain-core';

import { IdentityAccessContact } from '../../interfaces';
import { identityAccessDispatcher, identityAccessRemoveDispatcher } from '../../dispatchers';

interface IdentityForm extends EvanForm {
  address: EvanFormControl;
  note: EvanFormControl;
}

@Component
export default class IdentitySidePanelComponent extends mixins(EvanComponent) {
  @Prop() contacts: IdentityAccessContact[];

  /**
   * Check if the current activeIdentity is the owner of the selected identity
   */
  canEdit = false;

  /**
   * Current selected contact. Will be set by the show function
   */
  contact: IdentityAccessContact = null;

  originalContact: IdentityAccessContact = null;

  /**
   * Identity formular specification (address / note)
   */
  form: IdentityForm = null;

  /**
   * permssions to pass into the evan-permissions component
   */
  permissions = { read: false, readWrite: false };

  /**
   * show loading until owner was loaded
   */
  loading = true;

  /**
   * was a contact selected for edit?
   */
  isNew = false;

  /**
   * Disable save button until dispatcher is started
   */
  startingDispatcher = false;

  /**
   * Load identity specific data
   */
  async created(): Promise<void> {
    const runtime = this.getRuntime();
    // apply the identity as key to the keyHolder contract
    const sha3Account = runtime.nameResolver.soliditySha3(session.accountRuntime.underlyingAccount);
    const keyHolderContract = await runtime.contractLoader.loadContract(
      'KeyHolder',
      session.activeIdentity,
    );
    // load contacts for user select, load owner for enable / disable edit
    this.canEdit = await runtime.executor.executeContractCall(
      keyHolderContract,
      'keyHasPurpose',
      sha3Account,
      '1',
    );
    this.loading = false;
  }

  /**
   * Check if something in the ui was changed
   *
   * @return     {boolean}  True if changed, False otherwise.
   */
  hasChanged(): boolean {
    return !lodash.isEqual({
      ...this.contact,
      ...this.form.getFormData(),
    }, this.originalContact);
  }

  /**
   * Move the side-panel out and resets contact and form
   */
  hide(): void {
    this.contact = null;
    this.form = null;
    this.originalContact = null;
    this.startingDispatcher = false;
    (this.$refs.sidePanel as SwipePanelComponentClass).hide();
  }

  /**
   * Remove the access for a specific user.
   */
  async removeAccess(): Promise<void> {
    const runtime = this.getRuntime();
    this.startingDispatcher = true;
    const fromAlias = await profileUtils.getUserAlias(runtime);

    // start identity remove dispatcher and pass translated b-mail content
    identityAccessRemoveDispatcher.start(runtime, {
      address: this.contact.address,
      bmail: {
        fromAlias,
        title: this.$t('_settings.identity.remove-access.title'),
        body: this.$t('_settings.identity.remove-access.body', {
          alias: fromAlias,
          identity: runtime.activeIdentity,
        }).replace(/\n/g, '<br>'),
      },
    });

    this.hide();
  }

  /**
   * Save the current specification
   */
  async save(): Promise<void> {
    const runtime = this.getRuntime();
    this.startingDispatcher = true;
    const fromAlias = await profileUtils.getUserAlias(runtime);

    // start identity invite dispatcher and pass translated b-mail content
    identityAccessDispatcher.start(runtime, {
      contact: {
        ...this.contact,
        ...this.form.getFormData(),
      },
      bmail: {
        fromAlias,
        title: this.$t('_settings.identity.grant-access.title'),
        body: this.$t('_settings.identity.grant-access.body', {
          alias: fromAlias,
          identity: runtime.activeIdentity,
          access: this.$t(`_settings.identity.grant-access.type.${this.contact.hasIdentityAccess}`),
        }).replace(/\n/g, '<br>'),
      },
    });

    this.hide();
  }

  /**
   * Setup the edit formular.
   */
  setupForm(): void {
    this.form = (new EvanForm(this, {
      address: {
        value: this.contact.address || '',
        validate: (vueInstance, form, control: EvanFormControl): boolean|string => session
          .identityRuntime.web3.utils.isAddress(control.value),
        uiSpecs: {
          type: 'v-select',
          attr: {
            id: 'identity-contact-select',
            required: true,
            options: this.contacts.map((contact: IdentityAccessContact) => ({
              value: contact.address,
              label: contact.displayName || contact.address,
            })),
          },
          input: (address: string) => {
            if (address) {
              this.show(this.contacts.find((contact) => contact.address === address));
            }
          },
        },
      },
      note: {
        value: this.contact.note || '',
        uiSpecs: {
          type: 'v-select',
          attr: {
            id: 'identity-contact-note',
          },
        },
      },
    }) as IdentityForm);
  }

  /**
   * Update the permissions object to match the hasIdentityAccess param.
   */
  setupPermissions(): void {
    this.permissions = {
      read: this.contact.hasIdentityAccess === 'read' || this.contact.hasIdentityAccess === 'readWrite',
      readWrite: this.contact.hasIdentityAccess === 'readWrite',
    };
  }

  /**
   * Move the side-panel in.
   */
  show(contact: IdentityAccessContact): void {
    this.originalContact = contact || { } as IdentityAccessContact;
    this.contact = { ...this.originalContact };
    this.isNew = !this.contact.hasIdentityAccess;
    this.setupForm();
    this.setupPermissions();
    (this.$refs.sidePanel as SwipePanelComponentClass).show();
  }

  /**
   * Write permission changes to current contact
   */
  updatePermissions(read: boolean, write: boolean): void {
    const beforeRead = this.permissions.read;

    if (beforeRead && !read) {
      this.permissions.read = false;
      this.permissions.readWrite = false;
    } else {
      this.permissions.read = read || write;
      this.permissions.readWrite = write;
    }

    if (this.permissions.readWrite) {
      this.contact.hasIdentityAccess = 'readWrite';
    } else if (this.permissions.read) {
      this.contact.hasIdentityAccess = 'read';
    } else {
      this.contact.hasIdentityAccess = false;
    }
  }
}
