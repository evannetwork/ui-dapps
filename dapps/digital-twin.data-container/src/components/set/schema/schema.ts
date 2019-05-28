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
import { Prop } from 'vue-property-decorator';

import * as bcc from '@evan.network/api-blockchain-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';
import { EvanComponent, EvanForm, EvanFormControl } from '@evan.network/ui-vue-core';
import { EvanUIDigitalTwink, utils } from '@evan.network/digitaltwin.lib'

import * as dcUtils from '../../../utils';
import * as entryUtils from '../../../entries';

@Component({ })
export default class SetSchemaComponent extends mixins(EvanComponent) {
  /**
   * Current opened container address
   */
  containerAddress = '';

  /**
   * selected entry name
   */
   entryName = '';

  /**
   * Show loading symbol
   */
  loading = true;

  /**
   * Data container could not be loaded, e.g. no permissions.
   */
  error = false;

  /**
   * Currents container template definition.
   */
  templateEntry: any = null;

  /**
   * Active data container entry
   */
  selectedEntry = 'string';

  /**
   * Data container permission specifications
   */
  permissions: any = null;

  /**
   * ref handlers
   */
  reactiveRefs: any = { };

  /**
   * Set button classes
   */
  async created() {
    this.containerAddress = this.$route.params.containerAddress;
    this.entryName = this.$route.params.entryName;
    const runtime = utils.getRuntime(this);

    try {
      const plugin = await dcUtils.getContainerOrPlugin(runtime, this.containerAddress, false);
      this.templateEntry = plugin.template.properties[this.entryName];

      if (this.containerAddress.startsWith('0x')) {
        const container = utils.getContainer(<any>runtime, this.containerAddress);

        // load only the value, when it wasn't cached before
        if (!this.templateEntry.value) {
          this.templateEntry.value = await container.getEntry(this.entryName);
        }

        // map loaded values to scope
        this.permissions = await container.getContainerShareConfigForAccount(runtime.activeAccount);
      } else {
        // map loaded values to scope
        this.permissions = plugin.permissions || { readWrite: [ this.entryName ] };
      }

      // if it's a new value, apply full readWrite permissions
      if (this.templateEntry.isNew) {
        this.permissions.readWrite.push(this.entryName);
      }

      // ensure edit values for schema component
      entryUtils.ensureValues(this.templateEntry);
    } catch (ex) {
      runtime.logger.log(`Could not load DataContainer detail: ${ ex.message }`, 'error');
      this.error = true;

      return;
    }

    this.loading = false;
  }
}
