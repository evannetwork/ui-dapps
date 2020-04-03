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
import { EvanComponent, EvanForm, EvanFormControl } from '@evan.network/ui-session';
import { session } from '@evan.network/ui-vue-core';

import { Contact } from './interfaces';
import { identityShareDispatcher } from '../../dispatchers';

interface IdentityForm extends EvanForm {
  address: EvanFormControl;
  note: EvanFormControl;
}

@Component
export default class IdentitySidePanelComponent extends mixins(EvanComponent) {
  /**
   * Current selected contact. Will be set by the sow function
   */
  contact: Contact = null;

  /**
   * All available contacts
   */
  contacts: [] = null;

  /**
   * Identity formular specification (address / note)
   */
  form: IdentityForm = null;

  /**
   * show loading until owner was loaded
   */
  loading = true;

  /**
   * Check if the current activeIdentity is the owner of the selected identity
   */
  canEdit: string = null;

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
    this.canEdit = owner === session.accountRuntime.activeIdentity;
    this.loading = false;
  }

  /**
   * Move the side-panel out and resets contact and form
   */
  hide(): void {
    this.contact = null;
    this.form = null;
    this.sidePanel.hide();
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
        uiSpecs: {
          type: 'v-select',
          attr: {
            disabled: !this.isNew,
            required: true,
            options: contacts,
          },
        },
      },
      note: {
        value: this.contact.note || '',
      },
    }) as IdentityForm);
  }

  /**
   * Move the side-panel in.
   */
  show(contact: Contact): void {
    this.contact = contact || { };
    this.isNew = !contact;
    this.setupForm();
    this.sidePanel.show();
  }
}
