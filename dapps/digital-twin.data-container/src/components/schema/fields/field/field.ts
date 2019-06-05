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

import Vue from 'vue';
import Component, { mixins } from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';

import * as bcc from '@evan.network/api-blockchain-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';
import { EvanComponent, EvanForm, EvanFormControl } from '@evan.network/ui-vue-core';

import * as fieldUtils from '../../../../fields';


@Component({ })
export default class FieldComponent extends mixins(EvanComponent) {
  /**
   * Dynamic html input element id
   */
  @Prop({ default: 'value' }) id;

  /**
   * schema / edit / vue
   */
  @Prop({ default: 'edit' }) mode;

  /**
   * AJV schema type (files, number, string, ...)
   */
  @Prop() type: string;

  /**
   * If no type is given, check a given schema
   */
  @Prop() schema: any;

  /**
   * Form control of the parent form handler (includes form and validation)
   */
  @Prop() control: EvanFormControl;

  /**
   * should the control label be rendered?
   */
  @Prop({
    default: true
  }) standalone: boolean;

  /**
   * Label and description that should be rendered
   */
  @Prop({ default: `_datacontainer.ajv.value.title` }) label: string;
  @Prop({ default: `_datacontainer.ajv.value.desc` }) description: string;

  /**
   * Calculated type from props type or calucated from schema
   */
  _type = null;

  /**
   * Used to rerender field components
   */
  loading = false;

  @Watch('type')
  onChildChanged(val: string, oldVal: string) {
    // if type has changed and it was already rendered, force rerender
    if (val !== this._type) {
      this._type = this.type || fieldUtils.getType(this.schema);
      this.loading = true;
      this.$nextTick(() => this.loading = false);
    }
  }

  /**
   * Check for the correct type.
   */
  created() {
    this._type = this.type || fieldUtils.getType(this.schema);
  }
}
