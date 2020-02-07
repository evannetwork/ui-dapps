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
import { EvanComponent, SwipePanelComponentClass } from '@evan.network/ui-vue-core';
import { bccUtils } from '@evan.network/ui';
import { PermissionUtils, BmailContent, SharingUtils } from '@evan.network/digital-twin-lib';

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
    const { container } = this.$store.state;
    const runtime = this.getRuntime();
    const permissions = await PermissionUtils.createContainerPermissions(
      runtime,
      { containerAddress: container.contractAddress, label: container.description.name },
    );
    if (!permissions[userId]) {
      return permissions.new;
    }

    return permissions[userId];
  }

  showPanel(): void {
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
