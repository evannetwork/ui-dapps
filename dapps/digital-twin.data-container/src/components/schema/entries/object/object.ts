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

import Vue from 'vue';
import Component, { mixins } from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';

import * as bcc from '@evan.network/api-blockchain-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';
import { EvanComponent, EvanForm, EvanFormControl } from '@evan.network/ui-vue-core';
import { utils } from '@evan.network/digitaltwin.lib';

import { UIContainerTemplateProperty } from '../../../../interfaces';
import * as entryUtils from '../../../../entries';


@Component({ })
export default class EntryObjectComponent extends mixins(EvanComponent) {
  /**
   * Container property template definition
   */
  @Prop() entry: UIContainerTemplateProperty;

  /**
   * data contract listentries name, used for loading entries
   */
  @Prop() entryName: string;

  /**
   * list of available modes (schema / edit / view)
   */
  @Prop() modes: Array<string>;

  /**
   * Almost highest available mode
   */
  @Prop() mode: string;

  /**
   * Force loading of ajv component
   */
  loading = false;

  /**
   * ref handlers
   */
  reactiveRefs: any = { };

  /**
   * Reset the current edit values.
   */
  reset() {
    // for ajv component rerender
    this.loading = true;
    this.$nextTick(() => {
      // reset specific values
      entryUtils.resetValue(this, this.entry);

      // display the components
      this.loading = false;
    });
  }

  /**
   * If the mode is schema, force the edit mode, so all values matches the correct field type.
   */
  async save() {
    // trigger saving
    this.reactiveRefs.ajv.save();
    // update entry backup to the latest value
    entryUtils.saveValue(this, this.entry);
  }

  /**
   * Determines if valid.
   */
  isValid() {
    return this.reactiveRefs.ajv.isValid;
  }
}
