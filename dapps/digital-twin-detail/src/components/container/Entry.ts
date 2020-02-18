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
import { Prop } from 'vue-property-decorator';
import { EvanComponent } from '@evan.network/ui-vue-core';
import { ObjectSchema } from './DataSchemaInterface';

@Component
export default class ContainerEntryComponent extends mixins(EvanComponent) {
  @Prop() name: string;

  /**
   * Current entry definition from container dbcp schema
   */
  entrySchema: ObjectSchema;

  get isEditable(): boolean {
    return this.$store.state.container.permissions[this.name]?.readWrite || false;
  }

  getValue(): any {
    const { dispatcherData, entries } = this.$store.state.container;
    return dispatcherData[this.name] || entries[this.name];
  }

  created(): void {
    const { plugin } = this.$store.state.container;
    this.entrySchema = plugin.template.properties[this.name].dataSchema;
  }

  /**
   * Handle on save event from form.
   */
  onSave(formData: any): void {
    this.$store.state.container.setEntry(this.name, formData);
  }

  onShare(): void {
    (this.$refs.shareContainer as any).showPanel();
  }

  isProhibited(): boolean {
    if (this.$store.state.container.permissions[this.name]?.read === true) {
      return false;
    }

    if (this.$store.state.container.permissions[this.name]?.readWrite === true) {
      return false;
    }

    return true;
  }
}
