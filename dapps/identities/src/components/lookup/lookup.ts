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
import { EvanComponent, EvanForm, EvanFormControl } from '@evan.network/ui-vue-core';
import * as bcc from '@evan.network/api-blockchain-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';

import * as dispatchers from '../../dispatchers/registy';
import * as identitityUtils from '../../utils';

interface LookupFormInterface extends EvanForm {
  address: EvanFormControl;
}

// empty contract address
const nullAddress = '0x0000000000000000000000000000000000000000';

@Component({ })
export default class LookupComponent extends mixins(EvanComponent) {
  /**
   * formular specific variables
   */
  lookupForm: LookupFormInterface = null;

  /**
   * Switch the texts for the current lookup modal.
   */
  lookupModalScope = '';

  /**
   * params for the modal display
   */
  modalParams: any = {
    /**
     * currents users balance
     */
    balance: 0,
    /** when the user has entered an ens address, that is not selled, load the ens price and provide
      * the functionallity to purchase it
      */
    ensPrice: 0,
  };

  /**
   * Custom nameresolve for payable adresses.
   */
  payableNameResolver: any;

  /**
   * Check if the currenrt user is purchasing an ens address
   */
  purchasingInstances = { };

  /**
   * Show loading during ens check
   */
  checking = false;

  /**
   * Setup the Lookup form.
   */
  created() {
    this.lookupForm = (<LookupFormInterface>new EvanForm(this, {
      address: {
        value: '',
        validate: function(vueInstance: LookupComponent, form: LookupFormInterface) {
          return this.value.length !== 0;
        }
      },
    }));

    // create a custom nameresolve for payable adresses
    this.payableNameResolver = identitityUtils.getPayableNameResolver((<any>this).getRuntime());

    /**
     * watch for ens purchase changes
     */
    this.checkPurchasing();
    dispatchers.ensDispatcher.watch(() => this.checkPurchasing());

    // auto focus
    this.$nextTick(() => this.lookupForm.address.$ref.focus());
  }

  /**
   * Check if the user is currently buyin an ens address.
   */
  async checkPurchasing() {
    // tracking before instances, to directly open the modal after purchasing has finished
    const beforeKeys = Object.keys(this.purchasingInstances);
    let beforeAddress = beforeKeys.length > 0 ?
      this.purchasingInstances[beforeKeys[0]].data.ensAddress : null;

    // load new instances
    this.purchasingInstances = await dispatchers.ensDispatcher.getInstances((<any>this).getRuntime());

    // if the synchronisation has finished, check the address again
    if (beforeKeys.length > 0 && Object.keys(this.purchasingInstances).length === 0) {
      this.lookupForm.address.value = beforeAddress || this.lookupForm.address.value;
      this.checkAddress();
    }
  }

  /**
   * Check, if an identity exists for the address. If not, ask the user to create one. If the user
   * is not the owner of the ens address
   */
  async checkAddress() {
    const runtime = (<any>this).getRuntime();
    const domainName = identitityUtils.getDomainName();
    let address = this.lookupForm.address.value;

    this.checking = true;

    // reset lookup modal scope
    this.lookupModalScope = '';

    // replace duplicated dots
    address = address.replace(/\.\./g, '.');

    // add root domain, if it was not applied and it is not an contract
    if (address.indexOf('0x') !== 0 &&
        address.indexOf(domainName, address.length - domainName.length) === -1) {
      this.lookupForm.address.value = address = `${ address }.${ domainName }`;
    }

    // create identity instance, so we can check, if the address exists
    const isValidIdentity = await bcc.DigitalIdentity.getValidity(runtime, address);

    // if the identity is valid, open it!
    if (isValidIdentity.valid) {
      (<any>this).evanNavigate(address);
    } else {
      const errorMsg = isValidIdentity.error.message;
      if (errorMsg.indexOf('contract does not exists') !== -1) {
        // if no contract exists, check if the user can set something to the address
        let parentOwner = await this.getParentRecursive(address);

        // if no owner exists, show the purchase dialog, else check for permissions
        if (parentOwner === runtime.activeAccount) {
          this.lookupModalScope = 'create';
        } else if (parentOwner === nullAddress) {
          // load the currents users balance
          this.modalParams.balance = await dappBrowser.core.getBalance(runtime.activeAccount);

          // try to load the ens price, if it could not be loaded, it's not buyable
          try {
            // get top level address to check the balance for
            const splitAddr = address.split('.');
            const topLevelAdress = splitAddr.slice(splitAddr.length - 2, splitAddr.length)
              .join('.');

            this.modalParams.ensPrice = runtime.web3.utils.fromWei(
              await this.payableNameResolver.getPrice(topLevelAdress));
          } catch (ex) {
            runtime.logger.log(ex, 'error');
            this.lookupModalScope = 'not-buyable';
          }

          // when it's not buyable, check if the user has enough funds
          if (this.lookupModalScope !== 'not-buyable') {
            // check for users balance
            if (this.modalParams.balance < this.modalParams.ensPrice) {
              this.lookupModalScope = 'missing-balance';
            } else {
              this.lookupModalScope = 'purchase';
            }
          }
        } else {
          this.lookupModalScope = 'already-registered';
        }
      } else {
        this.lookupModalScope = 'error';
      }

      (<any>this.$refs.lookupModal).show();
    }

    this.checking = false;
  }

  /**
   * Gets the parent owner.
   *
   * @param      {any}     runtime  bcc runtime
   * @param      {string}  address  ens address
   */
  async getParentRecursive(address: string, owner: string = nullAddress) {
    const runtime = (<any>this).getRuntime();
    try {
      // load the current owner of the ens address
      const namehash = this.payableNameResolver.namehash(address);

      owner = await runtime.executor.executeContractCall(
        this.payableNameResolver.ensContract, 'owner', namehash);
    } catch (ex) { }

    if (owner === runtime.activeAccount) {
      return owner;
    } else {
      const splitAddress = address.split('.');

      if (splitAddress.length > 2) {
        return this.getParentRecursive(splitAddress.splice(1, splitAddress.length).join('.'),
          owner);
      } else {
        return owner;
      }
    }
  }

  /**
   * Buy the current address.
   */
  purchaseAdress() {
    // start the dispatcher
    dispatchers.ensDispatcher.start(
      (<any>this).getRuntime(),
      { ensAddress: this.lookupForm.address.value }
    );

    // hide modal
    (<any>this.$refs.lookupModal).hide();

    // show loading
    this.$nextTick(() => this.checkPurchasing());
  }
}
