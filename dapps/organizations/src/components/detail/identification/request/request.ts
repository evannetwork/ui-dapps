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

import * as dispatchers from '../../../../dispatchers/registry';

interface RequestFormIndentInterface extends EvanForm {
  company: EvanFormControl;
  regNumber: EvanFormControl;
  address: EvanFormControl;
  zip: EvanFormControl;
  city: EvanFormControl;
  country: EvanFormControl;
}

@Component({ })
export default class IdentRequestComponent extends mixins(EvanComponent) {
  /**
   * Formular for identification requests
   */
  requestForm: RequestFormIndentInterface = null;

  /**
   * Show loading until the request was finished.
   */
  sending = false;

  /**
   * show formular or accept view
   */
  status = 0;

  async created() {
    this.requestForm = (<RequestFormIndentInterface>new EvanForm(this, {
      company: {
        value: '',
        validate: function(vueInstance: IdentRequestComponent, form: RequestFormIndentInterface) {
          return this.value.length !== 0;
        }
      },
      regNumber: {
        value: '',
        validate: function(vueInstance: IdentRequestComponent, form: RequestFormIndentInterface) {
          return this.value.lengt >= 5;
        }
      },
      country: {
        value: '',
        validate: function(vueInstance: IdentRequestComponent, form: RequestFormIndentInterface) {
          return this.value.length !== 0;
        }
      },
      address: {
        value: '',
        validate: function(vueInstance: IdentRequestComponent, form: RequestFormIndentInterface) {
          return this.value.length !== 0;
        }
      },
      zipCode: {
        value: '',
        validate: function(vueInstance: IdentRequestComponent, form: RequestFormIndentInterface) {
          return this.value.match(/^\d{5}$/);
        }
      },
      city: {
        value: '',
        validate: function(vueInstance: IdentRequestComponent, form: RequestFormIndentInterface) {
          return this.value.length !== 0;
        }
      },
      contact: {
        value: '',
        validate: function(vueInstance: IdentRequestComponent, form: RequestFormIndentInterface) {
          return this.value.length !== 0;
        }
      }
    }));
  }

  /**
   * Show the info modal.
   */
  show() {
    (<any>this.$refs).requestModal.show();
  }

  /**
   * Hide the info modal.
   */
  hide() {
    (<any>this.$refs).requestModal.hide();
  }

  requestIdentification() {
    dispatchers.requestIdentificationDispatcher.start((<any>this).getRuntime(), {

    });
  }
}
