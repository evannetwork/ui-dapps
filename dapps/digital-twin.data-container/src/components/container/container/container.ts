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
import { Dispatcher, DispatcherInstance } from '@evan.network/ui';
import { EvanComponent, EvanForm, EvanFormControl } from '@evan.network/ui-vue-core';
import { utils } from '@evan.network/digitaltwin.lib';

import * as dispatchers from '../../../dispatchers/registry';
import ContainerCache from '../../../container-cache';


interface ShareFormInterface extends EvanForm {
  subject: EvanFormControl;
}

@Component({ })
export default class ContainerComponent extends mixins(EvanComponent) {
  /**
   * Current opened container address (save it from routes to this variable, so all beforeDestroy
   * listeners for template-handlers will work correctly and do not uses a new address that is
   * laoding)
   */
  containerAddress = '';

  /**
   * Show loading symbol
   */
  loading = true;

  /**
   * Data container could not be loaded, e.g. no permissions.
   */
  error = false;

  /**
   * digitalTwin address, where the container should be created for
   */
  digitalTwinAddress = '';

  /**
   * Watch for updates and disable current save button
   */
  savingWatcher: Function = null;

  /**
   * Container instance
   */
  container: bcc.Container;

  /**
   * container description
   */
  description: any;

  /**
   * containers template definition
   */
  template: any;

  /**
   * Tabs for top navigation
   */
  tabs: Array<any> = [ ];

  /**
   * Load the container data
   */
  async created() {
    this.containerAddress = this.$route.params.containerAddress;
    this.tabs = [ 'dc-sets', 'dc-technical', 'dc-permissions', 'dc-changes' ]
      .map(urlKey => ({
        id: `tab-${ urlKey }`,
        href: `${ (<any>this).dapp.fullUrl }/${ this.containerAddress }/${ urlKey }`,
        text: `_digitaltwins.breadcrumbs.${ urlKey }`
      }));

    const runtime = utils.getRuntime(this);
    const splitHash = (<any>this).dapp.baseHash.split('/');
    const twinDAppIndex = splitHash.indexOf(`digitaltwin.${ (<any>this).dapp.domainName }`);
    if (twinDAppIndex !== -1) {
      this.digitalTwinAddress = splitHash[twinDAppIndex + 1];
    }

    try {
      // get the container instance and load the template including all values
      this.container = utils.getContainer(<any>runtime, this.containerAddress);
      this.description = await this.container.getDescription();
    } catch (ex) {
      runtime.logger.log(`Could not load DataContainer detail: ${ ex.message }`, 'error');
      this.error = true;
      this.loading = false;

      return;
    }

    // set custom translation
    const customTranslation = { _digitaltwins: { breadcrumbs: { } } };
    customTranslation._digitaltwins.breadcrumbs[this.containerAddress] =
      this.description.name;
    (<any>this).$i18n.add((<any>this).$i18n.locale(), customTranslation);

    this.loading = false;
  }
}
