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
export default class DtTreeRootComponent extends mixins(EvanComponent) {
  /**
   * Url that should be opened when clicking on title
   */
  @Prop() url;

  /**
   * Type of content (digital twin, data-container, plugin)
   */
  @Prop() topic;

  /**
   * Name of the content (Cool Vehicle, ...)
   */
  @Prop() title;

  /**
   * Icon before text
   */
  @Prop() icon;

  /**
   * Toggle tree view
   */
  isTreeOpen  = true;

  /**
   * base window url for checking for active urls
   */
  windowLocation = window.location.origin + window.location.pathname;

  /**
   * Sends the hide sidebar event.
   */
  hideSidebar2() {
    window.dispatchEvent(new CustomEvent('dapp-wrapper-sidebar-close'));
  }
}
