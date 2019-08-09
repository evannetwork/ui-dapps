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
import { stringify } from 'querystring';

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

  /**
   * Keeps track of the printing state
   */
  printStatus = 'initial';

  steps = [
    {
      title: (<any>this).$i18n.translate('_org.ident.notary.pin.step.pin'),
      disabled: false
    },
    {
      title: (<any>this).$i18n.translate('_org.ident.notary.pin.step.print'),
      disabled: true
    },
    {
      title: (<any>this).$i18n.translate('_org.ident.notary.pin.step.send'),
      disabled: true
    },
  ];

  async created() {
    this.pinForm = (<PinFormInterface>new EvanForm(this, {
      pin: {
        value: '',
        validate: function(vueInstance: IdentNotaryPinComponent, form: PinFormInterface) {
          return /^\d{6}$/.test(this.value) ? true : 'error';
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
    this.checkingPin = true;

    const runtime: bcc.Runtime = (<any>this).getRuntime();
    try {
      const answerResponse = await getAnswer(runtime, this.pinForm.pin.value.trim(), this.requestId)
      const url = window.URL.createObjectURL(answerResponse);
      this.pdfUrl = url;
      this.status = 1;
    } catch (ex) {
      runtime.logger.log(ex, 'error');
      this.pinForm.pin.error = 'error2';
    }

    this.checkingPin = false;
  }

  /**
   * prints a given blob pdf url with the dialog
   */
  printPdfOrNext() {
    const nextStatus = 2;

    if (this.printStatus !== 'initial') {
      this.status = nextStatus;

      return;
    }

    if (!this._printIframe) {
      this._printIframe = document.createElement('iframe');
      this._printIframe.src = this.pdfUrl;
      this._printIframe.style.display = 'none';

      document.body.appendChild(this._printIframe);

      const print = (): Promise<any> => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            try {
              this._printIframe.focus();
              this._printIframe.contentWindow.print();

              resolve('success');
            } catch (ex) {
              reject('failed');
            }
          }, 1);
        })
      };

      this._printIframe.onload = async () => {
        this.printStatus = await print().catch(() => {
          window.open(this.pdfUrl);

          this.printStatus = 'failed';
        })

        if (this.printStatus === 'success') {
          this.status = nextStatus;
        }
      };
    }
  }

  /**
   * Trigger the request reloading.
   */
  triggerRequestReload() {
    triggerRequestReload(this.$route.params.address, {
      status: 'confirming',
      requestId: this.requestId
    });
  }
}
