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

import { EvanComponent, EvanForm, EvanFormControl } from '@evan.network/ui-vue-core';
import * as bcc from '@evan.network/api-blockchain-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';
import { utils } from '@evan.network/digitaltwin.lib';

import * as dispatchers from '../../../dispatchers/registy';

interface EnsFieldFormInterface extends EvanForm {
  address: EvanFormControl;
}

// empty contract address
const nullAddress = '0x0000000000000000000000000000000000000000';

@Component({ })
export default class EnsFieldComponent extends mixins(EvanComponent) {
  /**
   * Address that should be used directly to fill the input field.
   */
  @Prop({ }) address;

  /**
   * Disable twin autocompletion
   */
  @Prop({ }) autocomplete;

  /**
   * formular specific variables
   */
  @Prop({ }) form: EnsFieldFormInterface;

  /**
   * Show loading symbold
   */
  loading = true;

  /**
   * formular specific variables
   */
  lookupForm: EnsFieldFormInterface = null;

  /**
   * Check if the currenrt user is purchasing an ens address
   */
  purchasingInstances: Array<any> = [ ];

  /**
   * List of my twins, so the user have a preselection of it's twins
   */
  myTwins = [ ];

  /**
   * Setup the Lookup form.
   */
  async created() {
    this.$emit('init', this);

    this.lookupForm = this.form || (<EnsFieldFormInterface>new EvanForm(this, {
      address: {
        value: this.address || '',
        validate: function(vueInstance: EnsFieldComponent, form: EnsFieldFormInterface) {
          return this.value.trim().length !== 0;
        }
      },
    }));

    // load my twins, so we can provide a user selection
    if (this.autocomplete) {
      const runtime = utils.getRuntime(this);
      this.myTwins = Array.from(new Set([ ].concat(
        await utils.loadTwinFavorites(runtime),
        utils.getLastOpenedTwins()
      )));
    } else {
      this.myTwins = [ ];
    }

    this.loading = false;
  }

  /**
   * Ensure domain name in current ens input.
   */
  checkAddressEnsDomain() {
    // used to fill ens domain
    const domainName = utils.getDomainName();
    let address = this.lookupForm.address.value;

    // replace duplicated dots
    address = address.replace(/\.\./g, '.');

    // add root domain, if it was not applied and it is not an contract
    if (address.indexOf('0x') !== 0 &&
        address.indexOf(domainName, address.length - domainName.length) === -1) {
      this.lookupForm.address.value = address = `${ address }.${ domainName }`;
    }
  }
}
