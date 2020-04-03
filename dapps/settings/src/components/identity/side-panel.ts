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
import {
  EvanComponent,
  EvanForm,
  EvanFormControl,
  PermissionsInterface,
} from '@evan.network/ui-vue-core';
import { profileUtils } from '@evan.network/ui';
import { session } from '@evan.network/ui-session';

import { Contact } from './interfaces';
import { identityShareDispatcher } from '../../dispatchers';

interface IdentityForm extends EvanForm {
  address: EvanFormControl;
  note: EvanFormControl;
}

@Component
export default class IdentitySidePanelComponent extends mixins(EvanComponent) {
  /**
   * Check if the current activeIdentity is the owner of the selected identity
   */
  canEdit = false;

  /**
   * Current selected contact. Will be set by the sow function
   */
  contact: Contact = null;

  originalContact: Contact = null;

  /**
   * All available contacts
   */
  contacts = null;

  /**
   * Identity formular specification (address / note)
   */
  form: IdentityForm = null;

  /**
   * permssions to pass into the evan-permissions component
   */
  permissions: PermissionsInterface;

  /**
   * show loading until owner was loaded
   */
  loading = true;

  /**
   * was a contact selected for edit?
   */
  isNew = false;

  /**
   * Load identity specific data
   */
  async created(): Promise<void> {
    // load contacts for user select, load owner for enable / disable edit
    const [contacts, owner] = await Promise.all([
      profileUtils.getContacts(session.identityRuntime),
      session.identityRuntime.verifications.getOwnerAddressForIdentity(session.activeIdentity),
    ]);
    this.contacts = contacts;
    this.canEdit = owner === session.accountRuntime.underlyingAccount;
    this.loading = false;
  }

  /**
   * Move the side-panel out and resets contact and form
   */
  hide(): void {
    this.contact = null;
    this.form = null;
    this.originalContact = null;
    this.$refs.sidePanel.hide();
  }

  /**
   * Save the current specification
   */
  save(): void {
    identityShareDispatcher.start(this.getRuntime(), {
      ...this.contact,
      ...this.form.getFormData(),
    });
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
            disabled: !this.isNew,
            required: true,
            options: this.contacts,
          },
        },
      },
      note: {
        value: this.contact.note || '',
      },
    }) as IdentityForm);
  }

  /**
   * Update the permissions object to match the identityAccess param.
   */
  setupPermissions(): void {
    this.permissions = {
      identity: {
        read: this.contact.identityAccess === 'read' || this.contact.identityAccess === 'write',
        readWrite: this.contact.identityAccess === 'write',
      },
    };
  }

  /**
   * Move the side-panel in.
   */
  show(contact: Contact): void {
    this.originalContact = contact || { };
    this.contact = { ...this.originalContact };
    this.isNew = !contact;
    this.setupForm();
    this.setupPermissions();
    this.$refs.sidePanel.show();
  }

  /**
   * Write permission changes to current contact
   *
   * @param      {PermissionsInterface}  permissions  latest permission confugration
   */
  updatePermissions(event: PermissionsInterface): void {
    const idPerm = event.permissions.identity;
    const originPerm = this.originalContact.identityAccess;

    // do not allow to remove read permissions
    // eslint-disable-next-line no-nested-ternary
    let resolvedPerm = idPerm.readWrite ? 'write' : idPerm.read ? 'read' : false;
    if (!resolvedPerm && (originPerm === 'read' || originPerm === 'write')) {
      resolvedPerm = 'read';
    }

    this.contact.identityAccess = resolvedPerm;
    this.setupPermissions();
  }
}
