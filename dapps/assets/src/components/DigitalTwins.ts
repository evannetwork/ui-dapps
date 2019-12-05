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
import { EvanComponent } from '@evan.network/ui-vue-core';
import { DigitalTwinService } from './DigitalTwinService';

@Component
export default class DigitalTwinsComponent extends mixins(EvanComponent) {
  twinService: DigitalTwinService = new DigitalTwinService();

  columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      scopedSlots: { customRender: 'name' },
      sorter: (a, b) => ('' + a.name.first).localeCompare(b.name.first)
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      sorter: (a, b) => ('' + a.email).localeCompare(b.email)
    },
    {
      title: 'Owner',
      dataIndex: 'owner',
    },
    {
      title: 'Uploaded at',
      dataIndex: 'uploaded',
    },
    {
      title: 'Created at',
      dataIndex: 'created',
    },
  ];

  data = [];

  async mounted() {
    await this.fetch();
  }

  async fetch() {
    this.data = await this.twinService.getTwins();
    console.log(this.data);
    
  }

  private onChange(pagination, filters, sorter) {
    console.log('params', pagination, filters, sorter);
  }
}
