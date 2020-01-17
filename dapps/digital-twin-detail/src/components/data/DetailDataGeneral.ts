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
import { EvanComponent, DbcpFormComponentClass } from '@evan.network/ui-vue-core';
import { dispatchers } from '@evan.network/digital-twin-lib';

@Component
export default class DigitalTwinDetailDataGeneralComponent extends mixins(EvanComponent) {
  /**
   * When duplicate twin modal is opened, this form will be available.
   */
  dbcpForm: DbcpFormComponentClass;

  /**
   * Save the current description definition.
   */
  async setDescription(): Promise<void> {
    const { name, description, }: any = this.dbcpForm.formInstance.getFormData();
    await dispatchers.descriptionDispatcher.start(this.getRuntime(), {
      address: this.$store.state.twin.contractAddress,
      description: {
        ...this.$store.state.twin.description,
        ...{ name, description },
      }
    });
  }
}
