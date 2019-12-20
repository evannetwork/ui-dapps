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


@Component({ })
export default class FilesComponent extends mixins(EvanComponent) {
  /**
   * Dynamic html input element id
   */
  @Prop({ default: 'value' }) id;

  /**
   * schema / edit / vue
   */
  @Prop({ default: 'edit' }) mode;

  /**
   * Form control of the parent form handler (includes form and validation)
   */
  @Prop() control: EvanFormControl;


  /**
   * Label and description that should be rendered
   */
  @Prop({ default: `_datacontainer.ajv.value.title` }) label: string;
  @Prop({ default: `_datacontainer.ajv.value.desc` }) description: string;

  /**
   * Show Label and input field on the same line, not stacked.
   */
  @Prop() oneLine: boolean;

  /**
   * should the control label be rendered?
   */
  @Prop({
    default: true
  }) standalone: boolean;
}
