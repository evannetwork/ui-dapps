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

import * as bcc from '@evan.network/api-blockchain-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';
import { Dispatcher, DispatcherInstance } from '@evan.network/ui';
import { EvanComponent, EvanForm, EvanFormControl } from '@evan.network/ui-vue-core';
import { EvanUIDigitalTwin, utils } from '@evan.network/digitaltwin.lib'

const dispatcher = new Dispatcher(
  `digitaltwin.${ dappBrowser.getDomainName() }`,
  'favoriteRemoveDispatcher',
  40 * 1000,
  '_digitaltwins.dispatcher.favorite.remove'
);

dispatcher
  .step(async (instance: DispatcherInstance, data: any) => {
    await EvanUIDigitalTwin
      .getDigitalTwin(instance.runtime, data.address)
      .removeFromFavorites();
  });

export default dispatcher;
