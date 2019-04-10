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
import { EvanComponent } from '@evan.network/ui-vue-core';
import * as bcc from '@evan.network/api-blockchain-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';

@Component({ })
export default class EntryComponent extends mixins(EvanComponent) {
  /**
   * Id for the template that is edited (e.g.: create, container address, template type, ...)
   */
  @Prop() address: string;

  /**
   * data container entry (metadata, array, ...)
   */
  @Prop() entry: bcc.ContainerTemplateProperty;

  /**
   * data contract entry name
   */
  @Prop() name: string;

  /**
   * list of available modes (schema / edit / view)
   *
   * @class      Prop (name)
   */
  @Prop({
    default: [ 'schema', 'edit', 'view' ]
  }) modes: Array<string>;

  /**
   * active mode, default is the first of modes
   */
  @Prop({
    default: 'schema'
  }) activeMode;

  /**
   * icons for all the availables modes
   */
  modeIconMapping = {
    schema: 'fas fa-cogs',
    edit: 'fas fa-user-edit',
    view: 'fas fa-eye',
  };

  /**
   * Define presets
   */
  created() { }
}
