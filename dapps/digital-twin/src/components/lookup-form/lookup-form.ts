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
import * as utils from '../../utils';

interface LookupFormInterface extends EvanForm {
  address: EvanFormControl;
}

// empty contract address
const nullAddress = '0x0000000000000000000000000000000000000000';

@Component({ })
export default class LookupComponent extends mixins(EvanComponent) {
  /**
   * Address that should be used directly to fill the input field.
   */
  @Prop({ }) address;

  /**
   * do not check for global uiDT instances.
   */
  @Prop({ }) disableGlobal;

  /**
   * Disable twin autocompletion
   */
  @Prop({ }) disableAutocompletion;

  /**
   * Only use the flow until the ens address is valid
   */
  @Prop({ }) disableCreate;

  /**
   * Overwrite input title text
   */
  @Prop({
    default: '_digitaltwins.lookup.address.title'
  }) titleText;

  /**
   * Overwrite button text
   */
  @Prop({
    default: '_digitaltwins.lookup.title'
  }) buttonText;

  /**
   * Show loading symbold
   */
  loading = true;

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
   * Check if the currenrt user is purchasing an ens address
   */
  purchasingInstances: Array<any> = [ ];

  /**
   * Show loading during ens check
   */
  checking = false;

  /**
   * List of my twins, so the user have a preselection of it's twins
   */
  myTwins = null;

  /**
   * Setup the Lookup form.
   */
  async created() {
    this.lookupForm = (<LookupFormInterface>new EvanForm(this, {
      address: {
        value: this.address || '',
        validate: function(vueInstance: LookupComponent, form: LookupFormInterface) {
          return this.value.trim().length !== 0;
        }
      },
    }));

    // load my twins, so we can provide a user selection
    if (!this.disableAutocompletion) {
      const runtime = utils.getRuntime(this);
      this.myTwins = Array.from(new Set([ ].concat(
        await utils.loadFavorites(runtime),
        utils.getLastOpenedTwins()
      )));
    } else {
      this.myTwins = [ ];
    }

    this.loading = false;

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
    const beforeInstances = this.purchasingInstances;
    let beforeAddress = beforeInstances.length > 0 ?
      beforeInstances[0].data.ensAddress : null;

    // load new instances
    this.purchasingInstances = await dispatchers.ensDispatcher
      .getInstances(utils.getRuntime(this));

    // if the synchronisation has finished, check the address again
    if (beforeInstances.length > 0 && this.purchasingInstances.length === 0) {
      this.lookupForm.address.value = beforeAddress || this.lookupForm.address.value;
      this.checkAddress();
    }
  }

  /**
   * Check, if an digitaltwin exists for the address. If not, ask the user to create one. If the user
   * is not the owner of the ens address
   */
  async checkAddress() {
    const runtime: any = utils.getRuntime(this);
    const domainName = utils.getDomainName();
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

    // create digitaltwin instance, so we can check, if the address exists
    const twinValidity = await bcc.DigitalTwin.getValidity(runtime, address);

    // if the digitaltwin is valid, open it!
    if (twinValidity.valid) {
      this.$emit('submit', {
        address: this.lookupForm.address.value,
        status: 'open',
        validity: twinValidity,
      });

      // trigger reload
      !this.disableGlobal && this.$store.state.uiDT && this.$store.state.uiDT.destroy(this);
    } else {
      const errorMsg = twinValidity.error.message;
      if (errorMsg.indexOf('contract does not exist') !== -1) {
        // if no contract exists, check if the user can set something to the address
        let parentOwner = await this.getParentRecursive(address);

        // if no owner exists, show the purchase dialog, else check for permissions
        if (parentOwner === runtime.activeAccount) {
          if (this.disableCreate) {
            this.checking = false;

            return this.$emit('submit', {
              address: this.lookupForm.address.value,
              status: 'open',
              validity: twinValidity,
            });
          } else {
            this.lookupModalScope = 'create';
          }
        } else if (parentOwner === nullAddress && !this.disableCreate) {
          // load the currents users balance
          this.modalParams.balance = await dappBrowser.core.getBalance(runtime.activeAccount);

          // try to load the ens price, if it could not be loaded, it's not buyable
          try {
            // get top level address to check the balance for
            const splitAddr = address.split('.');
            const topLevelAdress = splitAddr.slice(splitAddr.length - 2, splitAddr.length)
              .join('.');

            this.modalParams.ensPrice = runtime.web3.utils.fromWei(
              await runtime.nameResolver.getPrice(topLevelAdress));
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

      this.$refs.lookupModal && (<any>this.$refs.lookupModal).show();
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
    const runtime = utils.getRuntime(this);
    try {
      // load the current owner of the ens address
      const namehash = runtime.nameResolver.namehash(address);

      owner = await runtime.executor.executeContractCall(
        runtime.nameResolver.ensContract, 'owner', namehash);
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
      utils.getRuntime(this),
      { ensAddress: this.lookupForm.address.value }
    );

    // hide modal
    (<any>this.$refs.lookupModal).hide();

    // show loading
    this.$nextTick(() => this.checkPurchasing());
  }

  /**
   * open digitaltwin address
   */
  createDigitalTwin() {
    this.$emit('submit', {
      address: this.lookupForm.address.value,
      status: 'create',
    });

    // trigger reload
    !this.disableGlobal && this.$store.state.uiDT && this.$store.state.uiDT.destroy(this);

    // hide modal
    (<any>this.$refs.lookupModal).hide();
  }
}
