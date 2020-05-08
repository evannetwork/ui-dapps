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

import { getDomainName, ipfs, } from '@evan.network/ui-dapp-browser';
import { Dispatcher, DispatcherInstance } from '@evan.network/ui';
import { Ipfs } from '@evan.network/api-blockchain-core';

const dispatcher = new Dispatcher(
  `lib.digital-twin.${ getDomainName() }`,
  'descriptionDispatcher',
  40 * 1000,
  '_digital-twin-lib.dispatchers.description'
);

dispatcher
  // upload image into ipfs
  .step(async (instance: DispatcherInstance, { description, } ) => {
    if (description.imgSquare && typeof description.imgSquare !== 'string') {
      const imageBuffer = Buffer.from(description.imgSquare.file);

      // upload file, build correct ipfs url and build the img url
      const uploaded = await instance.runtime.dfs.add(description.imgSquare.name, imageBuffer);
      const ipfsHash = Ipfs.bytes32ToIpfsHash(uploaded);
      const { host, port, protocol } = ipfs.ipfsConfig;
      description.imgSquare = `${ protocol }://${ host }:${port}/ipfs/${ ipfsHash }`;
    }
  })
  // update description
  .step(async (instance: DispatcherInstance, { address, description }) => {
    await instance.runtime.description.setDescription(
      address,
      { public: description },
      instance.runtime.activeIdentity
    );
  });

export default dispatcher;
