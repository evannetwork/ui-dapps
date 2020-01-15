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
import * as dappBrowser from '@evan.network/ui-dapp-browser';
import { Dispatcher, DispatcherInstance } from '@evan.network/ui';

const dispatcher = new Dispatcher(
  `assets.${ dappBrowser.getDomainName() }`,  // TODO: verify if its correct
  'createTwinDispatcher',
  1000000, // depends propably on plugins etc.
  'assets.digital-twins.create-twin-dispatcher'
);

dispatcher
  // upload image into ipfs
  .step(async (instance: DispatcherInstance, { twinImage, twinTemplate } ) => {
    if (twinImage) {
      const imageBuffer = Buffer.from(twinImage.file);

      // add ipfs to template
      twinTemplate.imgSquare = await instance.runtime.dfs.add(twinImage.name, imageBuffer);
      console.log(twinTemplate.imgSquare);
    }
  })
  // create the twin
  .step(async (instance: DispatcherInstance, { twinTemplate }) => {
    const newTwin = await DigitalTwin.create(instance.runtime as DigitalTwinOptions, {
      accountId: instance.runtime.activeAccount,
      containerConfig: { accountId: instance.runtime.activeAccount },
      ...twinTemplate
    });
  });

export default dispatcher;
