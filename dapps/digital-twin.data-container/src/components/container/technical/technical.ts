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
import { EvanUIDigitalTwink, utils } from '@evan.network/digitaltwin.lib';

import UiContainer from '../../../UiContainer';

@Component({ })
export default class ContainerTechnicalComponent extends mixins(EvanComponent) {
  /**
   * Current opened container address
   */
  @Prop() address;

  /**
   * Current opened container address
   */
  containerAddress = '';

  /**
   * status information
   */
  loading = true;

  /**
   * container data
   */
  owner = '';

  /**
   * Setup the form.
   */
  async created() {
    this.containerAddress = this.address || this.$route.params.containerAddress;

    await UiContainer.watch(this, async (uiContainer: UiContainer) => {
      this.owner = uiContainer.owner;

      this.loading = false;
    });
  }
}
