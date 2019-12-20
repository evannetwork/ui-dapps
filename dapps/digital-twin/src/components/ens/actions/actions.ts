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
import { utils } from '@evan.network/digitaltwin.lib';

import * as dispatchers from '../../../dispatchers/registy';

// empty contract address
const nullAddress = '0x0000000000000000000000000000000000000000';

@Component({ })
export default class ENSFieldComponent extends mixins(EvanComponent) {
  /**
   * Address that should be used directly to fill the input field.
   */
  @Prop({ }) address;

  /**
   * Disable ens purchase dialog
   */
  @Prop({ }) purchaseEnsAddress;

  /**
   * Shows a dialog, before triggering the create event
   */
  @Prop({ }) askForCreate;

  /**
   * Shows a error dialog, instead of opening a contract
   */
  @Prop({ }) disableOpen;

  /**
   * Show loading symbold
   */
  loading = false;

  /**
   * is a ens address in purchasing process?
   */
  purchasing = false;

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
   * List of my twins, so the user have a preselection of it's twins
   */
  myTwins = null;

  /**
   * Setup the Lookup form.
   */
  async created() {
    this.$emit('init', this);

    /**
     * watch for ens purchase changes
     */
    this.checkPurchasing();
    dispatchers.ensDispatcher.watch(() => this.checkPurchasing());
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
    this.purchasing = this.purchasingInstances.length !== 0;

    // if the synchronisation has finished, check the address again
    if (beforeInstances.length > 0 && !this.purchasing) {
      this.address = beforeAddress || this.address;
      await this.checkAddress();
    }
  }

  /**
   * Check, if an digitaltwin exists for the address. If not, ask the user to create one. If the
   * user is not the owner of the ens address
   *
   * @param      {string}   address      optional address to overwrite scopes address
   * @param      {boolean}  forceCreate  do not ask for create
   */
  async checkAddress(address = this.address, forceCreate = false) {
    const runtime: any = utils.getRuntime(this);
    const domainName = utils.getDomainName();
    address = address.replace(/\.\./g, '.');

    this.loading = true;

    // reset lookup modal scope
    this.lookupModalScope = '';

    // create digitaltwin instance, so we can check, if the address exists
    const twinValidity = await bcc.DigitalTwin.getValidity(runtime, address);

    /**
     * Sends a event to the parent component using the current twin validity. Optional, show an
     * specific modal.
     *
     * @param      {string}  eventName   $emit event name
     * @param      {string}  modalScope  i18n subscope and show modal
     */
    const sendEvent = (eventName: string, showModal = false) => {
      const eventArgs = { type: eventName, address: address, validity: twinValidity, };
      this.loading = false;
      this.$emit('submit', eventArgs);
      this.$emit(eventName, eventArgs);

      if (showModal) {
        this.lookupModalScope = eventName;
      }
    };

    // if the digitaltwin is valid, open it!
    if (twinValidity.valid) {
      if (this.disableOpen) {
        this.lookupModalScope = 'already-registered';
      } else {
        return sendEvent('open');
      }
    } else {
      const errorMsg = twinValidity.error.message;
      if (errorMsg.indexOf('contract does not exist') !== -1) {
        // if no contract exists, check if the user can set something to the address
        let parentOwner = await this.getParentRecursive(address);

        // if no owner exists, show the purchase dialog, else check for permissions
        if (parentOwner === runtime.activeAccount) {
          if (this.askForCreate && !forceCreate) {
            this.lookupModalScope = 'create';
          } else {
            return sendEvent('create');
          }
        } else if (parentOwner === nullAddress && this.purchaseEnsAddress) {
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
            sendEvent('error', true);
          }

          // when it's not buyable, check if the user has enough funds
          if (this.lookupModalScope !== 'not-buyable') {
            // check for users balance
            if (this.modalParams.balance < this.modalParams.ensPrice) {
              sendEvent('missing-balance', true);
            } else {
              sendEvent('purchase', true);
            }
          }
        } else {
          sendEvent('already-registered', true);
        }
      } else {
        sendEvent('error', true);
      }
    }

    this.lookupModalScope && this.$refs.lookupModal && (<any>this.$refs.lookupModal).show();
    this.loading = false;
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
      const domainName = utils.getDomainName();
      const addressToCheck = address.replace(new RegExp(`.${ domainName }$`), '');
      const splitAddress = addressToCheck.split('.');

      if (splitAddress.length > 1) {
        return this.getParentRecursive(
          `${ splitAddress.splice(1, splitAddress.length).join('.') }.${ domainName }`,
          owner
        );
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
      { ensAddress: this.address }
    );

    // hide modal
    (<any>this.$refs.lookupModal).hide();

    // show loading
    this.$nextTick(() => this.checkPurchasing());
  }
}
