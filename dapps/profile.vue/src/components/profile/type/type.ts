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
import Vue from 'vue';
import Component, { mixins } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

// evan.network imports
import { EvanComponent } from '@evan.network/ui-vue-core';
import * as bcc from '@evan.network/api-blockchain-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';

// internal
import * as dispatchers from '../../../dispatchers/registry';

@Component({ })
export default class ProfileTypeComponent extends mixins(EvanComponent) {
  /**
   * Current profile type
   */
  @Prop() type;

  /**
   * All selectable types
   */
  types = [
    'company',
    'device'
  ];

  /**
   * Initially passed type, to check if another one was selected
   */
  initialType = '';

  /**
   * Load profile type
   */
  async created() {
    this.initialType = this.type;
  }

  /**
   * Trigger profile type change
   *
   * @param      {string}  type    The type
   */
  typeChanged(type: string) {
    if (this.type !== 'unspecified') {
      this.$emit('typeChanged', this.type);
      dispatchers.updateProfileDispatcher.start((<any>this).getRuntime(), {
        formData: {
          profileType: this.type
        },
        type: 'accountDetails'
      });
      (this.$refs.modal as any).hide();
    }
  }

  /**
   * Show the info modal.
   */
  show() {
    (<any>this.$refs).modal.show();
  }

  /**
   * Hide the info modal.
   */
  hide() {
    (<any>this.$refs).modal.hide();
  }
}
