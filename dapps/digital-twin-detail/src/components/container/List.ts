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
import { DAppContainer } from '@evan.network/digital-twin-lib';
import { ListSchema } from './DataSchemaInterface';


@Component
export default class ContainerListComponent extends mixins(EvanComponent) {
  @Prop() name: string;

  schema: ListSchema;

  value: any;

  container: DAppContainer;

  created(): void {
    this.container = this.$store.state.container;
    const { dispatcherData, plugin, entries } = this.container;
    this.schema = plugin.template.properties[this.name].dataSchema;
    this.value = dispatcherData[this.name] || entries[this.name];

    console.log(this.schema, this.value);
  }

  addDataToContainer() {
    this.$store.state.container.addListEntries();
  }
}
