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
export default class DetailComponent extends mixins(EvanComponent) {
  /**
   * mail detail of the opened mail address
   */
  mail: any;

  /**
   * show loading symbol
   */
  loading = true;

  /**
   * Currents users contacts
   */
  addressBook: any;

  /**
   * When an attachment gets accepted, show an loading animation and disable the buttons
   */
  acceptingAttachment: boolean;

  /**
   * Load the mail details
   */
  async created() {
    const runtime = (<any>this).getRuntime();

    this.mail = (await runtime.mailbox
      .getMail((<any>this).$route.params.mailAddress)).content;
    this.addressBook = (await runtime.profile.getAddressBook()).profile;

    this.loading = false;
  }
}
