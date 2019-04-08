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
import EvanUIDigitalTwin from '../../digitaltwin';
import { getDigitalTwinBaseDbcp } from '../../utils';
import { getRuntime, getDomainName } from '../../utils';

interface GeneralFormInterface extends EvanForm {
  description: EvanFormControl;
  img: EvanFormControl;
  name: EvanFormControl;
  type: EvanFormControl;
}

@Component({ })
export default class GeneralComponent extends mixins(EvanComponent) {
  /**
   * formular specific variables
   */
  generalForm: GeneralFormInterface = null;

  /**
   * Setup the form.
   */
  created() {
    const uiDT = this.$store.state.uiDT;

    this.generalForm = (<GeneralFormInterface>new EvanForm(this, {
      name: {
        value: uiDT.dbcp.name,
        validate: function(vueInstance: GeneralComponent, form: GeneralFormInterface) {
          vueInstance.$store.state.uiDT.setData('dbcp.name', this.value);

          return this.value.length !== 0;
        }
      },
      description: {
        value: uiDT.dbcp.description,
        validate: function(vueInstance: GeneralComponent, form: GeneralFormInterface) {
          vueInstance.$store.state.uiDT.setData('dbcp.description', this.value);

          // update digitaltwin dbcp and return true, i's not required
          return true;
        }
      },
      img: {
        value: '',
      },
    }));

    this.$nextTick(() => this.generalForm.name.$ref.focus());
  }

  /**
   * Create the new digitaltwin
   */
  createDigitalTwin() {
    if (!this.$store.state.uiDT.exists) {
      dispatchers.digitaltwinCreateDispatcher.start(getRuntime(this), {
        address: this.$store.state.uiDT.address,
        dbcp: this.$store.state.uiDT.dbcp
      });
    }
  }
}
