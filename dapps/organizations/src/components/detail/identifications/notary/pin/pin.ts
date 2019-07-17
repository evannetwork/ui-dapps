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

import { getIdentificationDetails, getAnswer, triggerRequestReload } from '../notary.identifications';

interface PinFormInterface extends EvanForm {
  pin: EvanFormControl;
}

@Component({ })
export default class IdentNotaryPinComponent extends mixins(EvanComponent) {
  /**
   * Request id for that the detail should be displayed
   */
  @Prop() requestId;
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

  /**
   * stored blob url for pdf
   */
  pdfUrl = '';

  /**
   * private iframe for printing pdf directly
   */
  _printIframe;


  /**
   * show formular or accept view
   */
  status = 0;

  async created() {
    this.pinForm = (<PinFormInterface>new EvanForm(this, {
      pin: {
        value: '',
        validate: function(vueInstance: IdentNotaryPinComponent, form: PinFormInterface) {
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

    try {
      const runtime: bcc.Runtime = (<any>this).getRuntime();
      const answerResponse = await getAnswer(runtime, this.pinForm.pin.value.trim(), this.requestId)
      const url = window.URL.createObjectURL(answerResponse);
      this.answer = 'NICE CODE';
      this.pdfUrl = url;

      triggerRequestReload(this.$route.params.address);
      this.status = 1;
    } catch (ex) {
      console.dir(ex)
      this.pinForm.pin.error = 'error2';
    }

    this.checkingPin = false;
  }

  /**
   * prints a given blob pdf url with the dialog
   */
  printPdf() {
    if (!this._printIframe) {
      this._printIframe = document.createElement('iframe');
      document.body.appendChild(this._printIframe);

      this._printIframe.style.display = 'none';
      this._printIframe.onload = () => {
        setTimeout(() => {
          this._printIframe.focus();
          this._printIframe.contentWindow.print();
        }, 1);
      };
    }
    this._printIframe.src = this.pdfUrl;
  }
}
