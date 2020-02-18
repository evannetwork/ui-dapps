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
import { EvanComponent } from '@evan.network/ui-vue-core';

import { ListSchema } from './DataSchemaInterface';
import DataSetForm from './DataSetForm';


@Component
export default class AddListItemComponent extends mixins(EvanComponent) {
  @Prop() name: string;

  @Prop() schema: ListSchema;

  @Prop() value: any;

  dataSetForm: DataSetForm = null;

  showPanel(): void {
    (this.$refs.addListItemPanel as any).show();
  }

  closePanel(): void {
    (this.$refs.addListItemPanel as any).hide();
  }

  onSave(): void {
    this.$store.state.container.addListEntries(this.name, [this.dataSetForm.getFormData()]);
    this.closePanel();
  }

  isValid(): boolean {
    return this.dataSetForm?.form?.isValid;
  }
}
