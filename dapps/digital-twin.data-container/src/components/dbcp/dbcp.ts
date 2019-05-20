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

import * as dispatchers from '../../dispatchers/registry';
import * as utils from '../../utils';
import ContainerCache from '../../container-cache';

interface DBCPForm extends EvanForm {
  description: EvanFormControl;
  imgSquare: EvanFormControl;
  name: EvanFormControl;
}

@Component({ })
export default class DBCPComponent extends mixins(EvanComponent) {
  /**
   * Apply DBCP form from outside to have the full control of validation. If empty, default form is
   * used.
   */
  @Prop() form;

  /**
   * Dbcp definition including predefined values.
   */
  @Prop() dbcp;

  /**
   * Currently used dbcp form instance for getting name, imgSquare, description
   */
  _dbcpForm: DBCPForm;

  /**
   * Setup the form.
   */
  async created() {
    this._dbcpForm = this.form || (<DBCPForm>new EvanForm(this, { }));

    // fill empty name control
    if (!this._dbcpForm.name) {
      this._dbcpForm.addControl('name', {
        value: (this.dbcp && this.dbcp.name) ? this.dbcp.name : '',
        validate: function(vueInstance: DBCPComponent, form: DBCPForm) {
          return this.value.trim().length !== 0;
        }
      });
    }

    // fill empty description control
    if (!this._dbcpForm.description) {
      this._dbcpForm.addControl('description', {
        value: (this.dbcp && this.dbcp.description) ? this.dbcp.description : '',
      });
    }

    // fill empty imgSquare control
    if (!this._dbcpForm.imgSquare) {
      this._dbcpForm.addControl('imgSquare', {
        value: (this.dbcp && this.dbcp.imgSquare) ? this.dbcp.imgSquare : '',
      });
    }

    this.$nextTick(() => (<any>this.$refs.name).focus());
  }
}
