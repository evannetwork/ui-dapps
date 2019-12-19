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
import { Prop } from 'vue-property-decorator';

import * as bcc from '@evan.network/api-blockchain-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';
import { EvanComponent, EvanForm, EvanFormControl } from '@evan.network/ui-vue-core';
import { EvanUIDigitalTwink, utils } from '@evan.network/digitaltwin.lib'

import UiContainer from '../../../UiContainer';

@Component({ })
export default class NewDataSetComponent extends mixins(EvanComponent) {
  /**
   * Current opened container address
   */
  containerAddress = '';

  /**
   * Template of the opened container
   */
  template: any = null;

  /**
   * New entry definition
   */
  newEntry: any = null;

  /**
   * ref handlers
   */
  reactiveRefs: any = { };

  /**
   * Show loading symbol
   */
  loading = true;

  async created() {
    this.$emit('init', this);

    const runtime = utils.getRuntime(this);
    this.containerAddress = this.$route.params.containerAddress;
    await UiContainer.watch(this, async (uiContainer: UiContainer) => {
      this.template = uiContainer.template;
    });

    this.loading = false;
  }
}
