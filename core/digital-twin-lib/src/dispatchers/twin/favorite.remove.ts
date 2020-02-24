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

import { DigitalTwin, DigitalTwinOptions } from '@evan.network/api-blockchain-core';
import { getDomainName } from '@evan.network/ui-dapp-browser';
import { Dispatcher, DispatcherInstance } from '@evan.network/ui';

const dispatcher = new Dispatcher(
  `lib.digital-twin.${ getDomainName() }`,
  'twinFavoriteRemoveDispatcher',
  40 * 1000,
  '_digital-twin-lib.dispatchers.twin.favorite.remove'
);

dispatcher
  .step(async (instance: DispatcherInstance, data: any) => {
    const twin = new DigitalTwin(instance.runtime as DigitalTwinOptions, {
      accountId: instance.runtime.activeIdentity,
      address: data.address,
    });
    await twin.removeFromFavorites();
  });

export default dispatcher;
