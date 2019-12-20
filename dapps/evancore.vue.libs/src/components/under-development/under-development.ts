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

// vue imports
import * as dappBrowser from '@evan.network/ui-dapp-browser';
import Component, { mixins } from 'vue-class-component';
import EvanComponent from '../../component';
import Vue from 'vue';
import { Prop } from 'vue-property-decorator';
import { getDomainName } from '../../utils';

/**
 * Shows a ``under-development`` placeholder for enabling empty routes with maintenance or something
 * else.
 *
 * @class         UnderDevelopment
 * @selector      evan-under-development
 */
@Component({ })
export default class UnderDevelopment extends mixins(EvanComponent) {
  /**
   * ui.libs evan dapp base url
   */
  uiBaseUrl = '';

  async created() {
    const domainName = getDomainName();
    const uiCoreDbcp = await dappBrowser.System.import(`ui.libs.${ domainName }!ens`);
    this.uiBaseUrl = dappBrowser.dapp.getDAppBaseUrl(uiCoreDbcp,
      `${ uiCoreDbcp.name }.${ domainName }`);
  }
}
