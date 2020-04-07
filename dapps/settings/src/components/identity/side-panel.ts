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
  PermissionsInterface,
  SwipePanelComponentClass,
} from '@evan.network/ui-vue-core';
import { session, lightwallet } from '@evan.network/ui-session';
import { profileUtils } from '@evan.network/ui';
import { getDomainName } from '@evan.network/ui-dapp-browser';

import { IdentityAccessContact } from '../../interfaces';
import { identityShareDispatcher } from '../../dispatchers';

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
   * Current selected contact. Will be set by the sow function
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
    const owner = await session.identityRuntime.verifications.getOwnerAddressForIdentity(
      session.activeIdentity,
    );
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
    (this.$refs.sidePanel as SwipePanelComponentClass).hide();
  }

  /**
   * Save the current specification
   */
  async save(): Promise<void> {
    const runtime = this.getRuntime();
    const contact = {
      ...this.contact,
      ...this.form.getFormData(),
    };

    // start identity invite dispatcher and pass translated b-mail content
    identityShareDispatcher.start(this.getRuntime(), {
      contact,
      bmail: {
        fromAlias: await profileUtils.getUserAlias(runtime),
        title: this.$t('_settings.identity.share.title'),
        body: this.$t('_settings.identity.share.body', {
          alias: fromAlias,
          identity: runtime.activeIdentity,
          access: this.$t(`_settings.identity.share.type.${contact.hasIdentityAccess}`),
        }).replace(/\n/g, '<br>'),
      },
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
      },
    }) as IdentityForm);
  }

  /**
   * Update the permissions object to match the hasIdentityAccess param.
   */
  setupPermissions(): void {
    this.permissions = {
      identity: {
        read: this.contact.hasIdentityAccess === 'read' || this.contact.hasIdentityAccess === 'write',
        readWrite: this.contact.hasIdentityAccess === 'write',
      },
    };
  }

  /**
   * Move the side-panel in.
   */
  show(contact: IdentityAccessContact): void {
    this.originalContact = contact || { } as IdentityAccessContact;
    this.contact = { ...this.originalContact };
    this.isNew = !contact;
    this.setupForm();
    this.setupPermissions();
    (this.$refs.sidePanel as SwipePanelComponentClass).show();
  }

  /**
   * Write permission changes to current contact
   *
   * @param      {PermissionsInterface}  permissions  latest permission confugration
   */
  updatePermissions({ permissions }: { permissions: PermissionsInterface }): void {
    const idPerm = permissions.identity;
    const originPerm = this.originalContact.hasIdentityAccess;

    // do not allow to remove read permissions
    // eslint-disable-next-line no-nested-ternary
    let resolvedPerm = idPerm.readWrite ? 'write' : idPerm.read ? 'read' : false;
    if (!resolvedPerm && (originPerm === 'read' || originPerm === 'write')) {
      resolvedPerm = 'read';
    }

    this.contact.hasIdentityAccess = resolvedPerm;
    this.setupPermissions();
  }
}
