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

  You can be released from the requirements of the GNU Affero General Public
  License by purchasing a commercial license.
  Buying such a license is mandatory as soon as you use this software or parts
  of it on other blockchains than evan.network.

  For more information, please contact evan GmbH at this address:
  https://evan.network/license/
*/

// vue imports
import Vue from 'vue';
import Component, { mixins } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

// evan.network imports
import { EvanComponent } from '@evan.network/ui-vue-core';
import * as bcc from '@evan.network/api-blockchain-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';

@Component({ })
export default class EntryComponent extends mixins(EvanComponent) {
  /**
   * Id for the template that is edited (e.g.: create, container address, template type, ...)
   */
  @Prop() address: string;

  /**
   * Permissions for the logged in user and this entry (container.getContainerShareConfigForAccount)
   */
  @Prop() permissions: any;

  /**
   * data container entry (metadata, array, ...)
   */
  @Prop() entry: any;

  /**
   * data contract entry name
   */
  @Prop() name: string;

  /**
   * Available display modes for the current user and it's roles
   */
  modes: Array<string> = null;

  /**
   * Check for permitted modes
   */
  created() {
    // check permissions and set permitted modes
    if (!this.address.startsWith('0x')) {
      this.modes = [ 'view', 'schema', ];
    } else {
      const read = this.permissions.read || [ ];
      const write = this.permissions.readWrite || [ ];
      this.modes = [ ];

      // check for read permissions
      if (this.permissions.isOwner ||
          read.indexOf(this.name) !== -1 ||
          write.indexOf(this.name) !== -1) {
        this.modes.push('view');
      }

      // add schema mode, when the user is the owner
      if (this.permissions.isOwner) {
        this.modes.push('schema');
      // else check for read write permissions
      } else if (write.indexOf(this.name) !== -1) {
        this.modes.push('edit');
      }
    }

    // fill empty mode as default value
    this.$set(this.entry, 'mode', this.entry.mode || this.modes[0]);
  }
}
