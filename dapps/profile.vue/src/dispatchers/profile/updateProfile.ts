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
import ProfileMigrationLibrary from '../../lib/profileMigration';

const dispatcher = new Dispatcher(
  `profile.vue.${ dappBrowser.getDomainName() }`,
  'updateProfileDispatcher',
  60000,
  '_profile.dispatchers.profile-update'
);

dispatcher
  .step(async (instance: DispatcherInstance, data: any) => {
    const runtime = instance.runtime;
    const profileContract = runtime.profile.profileContract;
    const profileAddress = profileContract.options.address;
    const fileFields = ['settings', 'type'];

    // check, if profile was migrated before, else migrate it
    await ProfileMigrationLibrary.checkOrMigrateProfile(runtime);

    const previousValue = await runtime.dataContract.getEntry(
      profileContract,
      data.type,
      runtime.activeAccount
    );

    await Promise.all(fileFields.map(async (field) => {
      const blobs = [];
      if (data.formData[field] && data.formData[field].length) {
        data.formData[field].forEach((control: any) =>
          blobs.push({
            // apply correct streamlined name for files
            name: control.name,
            fileType: control.fileType,
            file: control.file
          })
        );
        // generate new keys
        const cryptor = runtime.cryptoProvider.getCryptorByCryptoAlgo('aesBlob')
        const hashCryptor = runtime.cryptoProvider.getCryptorByCryptoAlgo('aesEcb')
        const hashKey = await runtime.sharing.getHashKey(profileAddress, runtime.activeAccount);
        const contentKey = await runtime.sharing.getKey(profileAddress, runtime.activeAccount,
          data.type);

        const encryptedFileBuffer = await cryptor.encrypt(blobs, { key: contentKey })
        const stateMd5 = bcc.crypto.createHash('md5').update(encryptedFileBuffer).digest('hex')
        const fileHash = await runtime.dfs.add(stateMd5, encryptedFileBuffer)
        const encryptedHashBuffer = await hashCryptor.encrypt(
          Buffer.from(fileHash.substr(2), 'hex'), { key: hashKey })
        const encryptedHashString = `0x${encryptedHashBuffer.toString('hex')}`
        data.formData[field] = encryptedHashString;
      }
    }));

    await runtime.dataContract.setEntry(
      profileContract,
      data.type,
      Object.assign({}, previousValue || {}, data.formData),
      runtime.activeAccount
    );
  });

export default dispatcher;
