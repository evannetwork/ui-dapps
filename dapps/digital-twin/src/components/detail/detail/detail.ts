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

import * as dispatchers from '../../../dispatchers/registy';


interface DetailFormInterface extends EvanForm {
  description: EvanFormControl;
  imgSquare: EvanFormControl;
  name: EvanFormControl;
}

@Component({ })
export default class GeneralComponent extends mixins(EvanComponent) {
  /**
   * Digital twin that should be used for edition
   */
  uiDT = null;

  /**
   * ref handlers
   */
  reactiveRefs: any = { };

  /**
   * Tabs for top navigation
   */
  tabs: Array<any> = [ ];

  /**
   * Setup the form.
   */
  async created() {
    this.uiDT = this.$store.state.uiDT;

    // easy transform sub navigations to full href and reference id's
    const twinAddress = this.$route.params.digitalTwinAddress;
    this.tabs = [ 'dt-plugins', 'dt-technical', 'dt-permissions', 'dt-changes' ]
      .map(urlKey => ({
        id: `tab-${ urlKey }`,
        href: `${ (<any>this).dapp.fullUrl }/${ twinAddress }/dt-detail/${ urlKey }`,
        text: `_digitaltwins.breadcrumbs.${ urlKey }`
      }));
  }
}
