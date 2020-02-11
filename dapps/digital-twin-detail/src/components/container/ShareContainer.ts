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
import { bccUtils } from '@evan.network/ui';
import { EvanComponent, SwipePanelComponentClass } from '@evan.network/ui-vue-core';
import {
  BmailContent,
  DAppTwin,
  PermissionUtils,
  SharingUtils,
} from '@evan.network/digital-twin-lib';

@Component
export default class ShareContainerComponent extends mixins(EvanComponent) {
  contacts = null;

  onUpdatePermissions = null;

  permissionsEditor = null;

  selectedContact = null;

  hasChange = false;

  bMailContent: BmailContent;

  async created(): Promise<void> {
    this.contacts = await bccUtils.getContacts(this.getRuntime());
    this.bMailContent = await SharingUtils.getTwinShareBMail(this);
    this.onUpdatePermissions = PermissionUtils.updatePermissions.bind(null, this);
  }

  async loadPermissions(userId: string): Promise<any> {
    const { twin }: { twin: DAppTwin } = this.$store.state;
    const runtime = this.getRuntime();

    const permissions = {};
    await Promise.all(twin
      .containerAddresses
      .map(async (containerAddress: string): Promise<void> => {
        permissions[containerAddress] = await PermissionUtils.getContainerPermissionsForUser(
          runtime,
          { containerAddress, label: twin.containerContracts[containerAddress].description.name },
          userId,
        );
      }));

    return permissions;
  }

  /**
   * Open the share side panel and overwrite the selected contact, if wanted.
   *
   * @param      {string}  contact  contact address
   */
  showPanel(contact?: string): void {
    this.selectedContact = contact;
    (this.$refs.shareContainerPanel as SwipePanelComponentClass).show();
  }

  closePanel(): void {
    this.permissionsEditor.cancel();
    (this.$refs.shareContainerPanel as SwipePanelComponentClass).hide();
  }

  async onSave(): Promise<void> {
    await this.permissionsEditor.writePermissions();
  }

  onSelectContact(contact: string): void {
    this.selectedContact = contact;
  }

  get isUpdateDisabled(): boolean {
    return !this.hasChange
      || this.$store.state.dispatcher.curr.running.shareProfileDispatcher
      || !this.selectedContact
      || this.permissionsEditor.isLoading;
  }
}
