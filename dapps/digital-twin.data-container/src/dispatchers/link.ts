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

import * as dappBrowser from '@evan.network/ui-dapp-browser';
import * as bcc from '@evan.network/api-blockchain-core';
import { EvanComponent, EvanForm, EvanFormControl } from '@evan.network/ui-vue-core';
import { Dispatcher, DispatcherInstance } from '@evan.network/ui';
import { utils } from '@evan.network/digitaltwin.lib';


const dispatcher = new Dispatcher(
  `datacontainer.digitaltwin.${ dappBrowser.getDomainName() }`,
  'linkDispatcher',
  40 * 1000,
  '_datacontainer.dispatcher.link'
);

dispatcher
  .step(async (instance: DispatcherInstance, data: any) => {
    // set the digital twin instance
    const runtime = utils.getRuntime(instance.runtime);
    const container = utils.getContainer(runtime, data.containerAddress);

    const digitalTwin = new bcc.DigitalTwin(
      <any>runtime,
      {
        accountId: runtime.activeAccount,
        address: data.digitalTwinAddress,
        containerConfig: { accountId: runtime.activeAccount, },
      }
    );

    // map the entry into the digital twin under the new name
    await digitalTwin.setEntry(data.name, data.containerAddress, bcc.DigitalTwinEntryType.Container);
  });

export default dispatcher;
