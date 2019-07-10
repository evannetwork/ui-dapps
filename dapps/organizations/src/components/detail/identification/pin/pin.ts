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

import { getOrganization } from '../../../../identification';

interface PinFormInterface extends EvanForm {
  pin: EvanFormControl;
}

@Component({ })
export default class IdentPinComponent extends mixins(EvanComponent) {
  /**
   * ui status flags
   */
  checkingPin = false;

  /**
   * pin form declaration for entering the pin
   */
  pinForm: PinFormInterface = null;

  /**
   * received answer for the provided pin
   */
  answer: string = null;
  pdfUrl = '';

  async created() {
    this.pinForm = (<PinFormInterface>new EvanForm(this, {
      pin: {
        value: '',
        validate: function(vueInstance: IdentPinComponent, form: PinFormInterface) {
          return this.value.trim().length === 0 ? 'error' : true;
        }
      }
    }));
  }

  /**
   * Show the info modal.
   */
  show() {
    (<any>this.$refs).pinModal.show();
  }

  /**
   * Hide the info modal.
   */
  hide() {
    (<any>this.$refs).pinModal.hide();
  }

  /**
   * Use the current pin input, check for the correct pin and try to receive the answer.
   */
  async generateAnswer() {
    // TODO: add correct generate answer request
    this.checkingPin = true;
    await (new Promise(resolve => setTimeout(resolve, 3000)));

    try {
      this.answer = 'NICE CODE';
      this.pdfUrl = 'http://www.africau.edu/images/default/sample.pdf';
    } catch (ex) {
      this.pinForm.pin.error = 'error2';
    }

    this.checkingPin = false;
  }
}
