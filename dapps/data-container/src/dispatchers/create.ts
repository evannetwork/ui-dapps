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

import * as dappBrowser from '@evan.network/ui-dapp-browser';
import * as bcc from '@evan.network/api-blockchain-core';
import { EvanComponent, EvanForm, EvanFormControl } from '@evan.network/ui-vue-core';
import { Dispatcher, DispatcherInstance } from '@evan.network/ui';

import * as utils from '../utils';

const dispatcher = new Dispatcher(
  `datacontainer.digitaltwin.${ dappBrowser.getDomainName() }`,
  'createDispatcher',
  40 * 1000,
  '_datacontainer.dispatcher.create'
);

dispatcher
  .step(async (instance: DispatcherInstance, data: any) => {
    // set the digital twin instance
    const runtime = utils.getRuntime(instance.runtime);

    // apply formular data to the description
    const description = await utils.getDataContainerBaseDbcp({
      name: data.name,
      description: data.description,
      imgSquare: data.img,
    });

    // create the container
    const container = await bcc.Container.create(<any>runtime, {
      accountId: runtime.activeAccount,
      address: `${ data.name }.${ data.digitalTwinAddress }`,
      description: description,
      factoryAddress: utils.containerFactory,
      template: data.template,
    });

    data.contractAddress = await container.getContractAddress();
  })
  .step(async (instance: DispatcherInstance, data: any) => {
    const runtime = utils.getRuntime(instance.runtime);
    const twinConfig = utils.getDigitalTwinConfig(runtime, data.digitalTwinAddress);
    const digitalTwin = new bcc.DigitalTwin(<any>runtime, twinConfig);

    // save the digital entries
    await digitalTwin.setEntry(data.name, data.contractAddress,
      bcc.DigitalTwinEntryType.ContainerContract);
  });

export default dispatcher;
