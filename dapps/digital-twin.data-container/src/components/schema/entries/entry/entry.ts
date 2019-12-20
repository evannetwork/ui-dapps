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

import Vue from 'vue';
import Component, { mixins } from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';

import * as bcc from '@evan.network/api-blockchain-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';
import { EvanComponent } from '@evan.network/ui-vue-core';

import * as fieldUtils from '../../../../fields';
import * as entryUtils from '../../../../entries';


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
  @Prop() entryName: string;

  /**
   * Disable schema edit and show only formular with input boxes
   */
  @Prop({ default: true }) schemaEdit: boolean;

  /**
   * Optional try to force mode (works only, when correct permissions are set, e.g. applying mode
   * 'view' on permission for edit, will display view, applying mode 'schema' on permissions for
   * view, will display also view)
   */
  @Prop() mode: string;

  /**
   * Active display mode (schema, edit, view)
   */
  activeMode = 'loading';

  /**
   * Calculated entry type (check special type definitions)
   */
  type: string = null;
  itemType: string = null;

  /**
   * Watch if mode has changed
   */
  @Watch('mode')
  onChildChanged(val: string, oldVal: string) {
    // if type has changed and it was already rendered, force rerender
    val !== oldVal && this.initialize();
  }

  /**
   * Check for permitted modes
   */
  created() {
    this.$emit('init', this);
    this.initialize();
  }

  /**
   * Check permissions and active mode.
   */
  initialize() {
    this.type = fieldUtils.getType(this.entry.dataSchema);

    if (this.type === 'array') {
      this.itemType = fieldUtils.getType(this.entry.dataSchema.items);
    }

    // check permissions and set permitted modes
    if (!this.address.startsWith('0x')) {
      this.activeMode = 'schema';
    } else {
      const read = this.permissions.read || [ ];
      const write = this.permissions.readWrite || [ ];

      // add schema mode, when the user is the owner
      if (this.permissions.isOwner) {
        this.activeMode = 'schema';
      // else check for read write permissions
      } else if (write.indexOf(this.entryName) !== -1) {
        this.activeMode = 'edit';
      // check for read permissions
      } else if (this.permissions.isOwner ||
        read.indexOf(this.entryName) !== -1 ||
        write.indexOf(this.entryName) !== -1) {
        this.activeMode = 'view';
      } else {
        this.activeMode = '';
      }
    }

    // manually force a specific mode
    if ((this.activeMode === 'schema' && (this.mode === 'edit' || this.mode === 'view')) ||
        (this.activeMode === 'edit' && this.mode === 'view')) {
      this.activeMode = this.mode;
    }
  }

  /**
   * Cache latest values
   */
  async saveAsCache() {
    return await (<any>this.$refs.entryComp).saveAsCache();
  }

  /**
   * Triggers the sub component save function.
   */
  async save() {
    return await (<any>this.$refs.entryComp).save();
  }

  /**
   * Triggers the sub component reset function.
   */
  async reset() {
    return await (<any>this.$refs.entryComp).reset();
  }

  /**
   * Is the sub component forms valid?.
   */
  isValid() {
    return this.$refs.entryComp && (<any>this.$refs.entryComp).isValid();
  }
}
