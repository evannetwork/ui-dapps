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

import { EvanComponent, EvanForm, EvanFormControl } from '@evan.network/ui-vue-core';
import * as bcc from '@evan.network/api-blockchain-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';

interface LookupFormInterface extends EvanForm {
  address: EvanFormControl;
}

@Component({ })
export default class EnsOpenComponent extends mixins(EvanComponent) {
  /**
   * ref handlers
   */
  reactiveRefs: any = { };

  /**
   * Ensure ens domain address and trigger the address check
   */
  checkAddress() {
    if (this.reactiveRefs.ensField) {
      if (this.reactiveRefs.ensField.lookupForm.isValid) {
        this.reactiveRefs.ensField.checkAddressEnsDomain();
        this.reactiveRefs.ensActions.checkAddress();
      }
    }
  }

  /**
   * Takes the twin address from the lookup form component and opens it.
   *
   * @param      {any}  eventResult  twin address that should be opened
   */
  openTwin(eventResult: any) {
    (<any>this).evanNavigate([
      `digitaltwin.${ (<any>this).dapp.domainName }`,
      eventResult.address
    ].join('/'));
  }

  /**
   * Shows the create modal.
   */
  showModal() {
    (<any>this).$refs.twinOpen.show();
  }

  /**
   * Hide the create modal.
   */
  hideModal() {
    (<any>this).$refs.twinOpen.hide();
  }
}
