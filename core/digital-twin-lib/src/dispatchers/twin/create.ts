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

import { DigitalTwin, DigitalTwinOptions, Ipfs } from '@evan.network/api-blockchain-core';
import { Dispatcher, DispatcherInstance } from '@evan.network/ui';
import { getDomainName, ipfs } from '@evan.network/ui-dapp-browser';

const dispatcher = new Dispatcher(
  `lib.digital-twin.${getDomainName()}`,
  'twinCreateDispatcher',
  1000000, // depends probably on plugins etc.
  '_digital-twin-lib.dispatchers.twin.create',
);

/* eslint-disable no-param-reassign */
dispatcher
  .step(async (instance: DispatcherInstance, data: any) => {
    // check if template should be loaded from contract
    if (typeof data.twinTemplate === 'string' && data.twinTemplate.startsWith('0x')) {
      const twinInstance = new DigitalTwin(
        instance.runtime as DigitalTwinOptions,
        {
          accountId: instance.runtime.activeAccount,
          address: data.twinTemplate,
        },
      );

      data.twinTemplate = await twinInstance.exportAsTemplate(true);
      await instance.save();
    }

    // merge passed description with twin template description
    if (data.description) {
      data.twinTemplate.description = {
        ...data.twinTemplate.description,
        ...data.description,
      };
    }
  })
  // upload image into ipfs
  .step(async (instance: DispatcherInstance, { twinTemplate, twinImage }) => {
    if (twinImage && typeof twinImage !== 'string') {
      const imageBuffer = Buffer.from(twinImage.file);

      // upload file, build correct ipfs url and build the img url
      const uploaded = await instance.runtime.dfs.add(twinImage.name, imageBuffer);
      const ipfsHash = Ipfs.bytes32ToIpfsHash(uploaded);
      const { host, port, protocol } = ipfs.ipfsConfig;
      twinTemplate.description.imgSquare = `${protocol}://${host}:${port}/ipfs/${ipfsHash}`;
    }
  })
  // create the twin
  .step(async (instance: DispatcherInstance, data) => {
    const twin = await DigitalTwin.create(instance.runtime as DigitalTwinOptions, {
      accountId: instance.runtime.activeAccount,
      containerConfig: { accountId: instance.runtime.activeAccount },
      ...data.twinTemplate,
    });

    const domainName = getDomainName();
    const contractAddress = await twin.getContractAddress();
    data.callbackUrl = `/dashboard.vue.${domainName}/detail.digital-twin.${domainName}/${
      contractAddress}`;
  });
/* eslint-enable no-param-reassign */

export default dispatcher;
