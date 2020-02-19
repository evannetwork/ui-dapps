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

// evan.network imports
import { EvanComponent, SwipePanelComponentClass } from '@evan.network/ui-vue-core';
import { Prop, Watch } from 'vue-property-decorator';
import { Contact } from './ContactInterfaces';

@Component
export default class EditContactComponent extends mixins(EvanComponent) {
  @Prop() contact: Contact;

  canSubmit = false;

  note: string;

  @Watch('contact', { deep: true })
  onContactChange(): void {
    this.note = this.contact.alias;
  }

  onSubmit(): void {
    this.closePanel();
    const updatedContact = { ...this.contact, alias: this.note };
    this.$emit('update-contact', updatedContact);
  }

  onNoteChange(): void {
    this.canSubmit = true;
  }

  removeContact(contact: Contact): void {
    (this.$refs.deleteModal as any).hide();
    this.closePanel();
    this.$emit('delete-contact', contact);
  }

  showPanel(): void {
    (this.$refs.editContactPanel as SwipePanelComponentClass).show();
    this.canSubmit = false;
  }

  closePanel(): void {
    (this.$refs.editContactPanel as SwipePanelComponentClass).hide();
  }
}
