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


import * as bcc from '@evan.network/api-blockchain-core';

export default class ProfileMigrationLibrary {


  static async checkOrMigrateProfile(runtime) {
    let description;
    try {
      // try to load the description, if this errors, create a new profile
      description = await runtime.description.getDescription(
        runtime.profile.profileContract.options.address
      );
    } catch (e) {
      // when the description errors, create a new profile
      await this.migrateProfile(runtime);
    }

    // check if the initial description exists, if not. create new fields and set initial description
    if (!description) {
      await this.setNewFieldsToProfile(runtime);
    }
  }

  /**
   * Sets the new profile fields to the current account
   *
   * @param      {any}  runtime  runtime object
   */
  static async setNewFieldsToProfile(runtime) {

    const profileAddress = runtime.profile.profileContract.options.address;
    const currentAccount = runtime.activeAccount;

    const newDataFields = ['accountDetails', 'registration', 'contact', 'deviceDetails'];
    // create a new description for the profile
    const description = {
      'public': {
        'name': 'Profile Contract',
        'description': 'Profile Contract',
        'author': 'evan.network',
        'tags': [
          'profile'
        ],
        'version': '1.0.0',
        'dbcpVersion': 2
      }
    };

    const shared = runtime.contractLoader.loadContract('Shared', profileAddress);
    const sharings = await runtime.sharing.getSharingsFromContract(shared);

    // create unique keys for the new fields
    await Promise.all(newDataFields.map(async (key) => {
      const cryptor = runtime.cryptoProvider.getCryptorByCryptoAlgo('aes');
      const [contentKey, blockNr] = await Promise.all(
        [cryptor.generateKey(), runtime.web3.eth.getBlockNumber()])
      await runtime.sharing.extendSharings(sharings, currentAccount, currentAccount, key, blockNr, contentKey);

      await runtime.rightsAndRoles.setOperationPermission(
        profileAddress,                 // contract to be updated
        currentAccount,           // account, that can change permissions
        0,                           // role id, uint8 value
        key,                  // name of the object
        bcc.PropertyType.Entry,          // what type of element is modified
        bcc.ModificationType.Set,        // type of the modification
        true,                        // grant this capability
      );

    }));

    await runtime.sharing.saveSharingsToContract(profileAddress, sharings, currentAccount);

    const sharingsNew = await runtime.sharing.getSharings(profileAddress);

    // set the description to the contract
    await runtime.description.setDescription(profileAddress, description, runtime.activeAccount);
  }

  /**
   * creates a new profile from the factory and migrates the old one
   *
   * @param      {any}  runtime  The runtime
   */
  static async migrateProfile(runtime) {

    const profileAddress = runtime.profile.profileContract.options.address;
    const currentAccount = runtime.activeAccount;

    // get the profile factory
    const factoryAddress = await runtime.nameResolver.getAddress('profile.factory.evan');
    const factory = runtime.contractLoader.loadContract(
      'BaseContractFactoryInterface',
      factoryAddress
    );
    // create a new profile contract from the factory
    const contractId = await runtime.executor.executeContractTransaction(
      factory,
      'createContract', {
        from: currentAccount,
        autoGas: 1.1,
        event: { target: 'BaseContractFactoryInterface', eventName: 'ContractCreated', },
        getEventResult: (event, args) => args.newAddress,
      },
      '0x0000000000000000000000000000000000000000',
      currentAccount,
      '0x0000000000000000000000000000000000000000000000000000000000000000',
      runtime.nameResolver.config.ensAddress,
    );

    const oldDataFields = ['addressBook', 'bookmarkedDapps', 'contracts', 'contacts', 'profileOptions', 'publicKey', 'templates'];
    // migrate the old fields from the profile
    await Promise.all(oldDataFields.map(async (oldDataField) => {
      const oldHash = await runtime.dataContract.getEntry(profileAddress, oldDataField, currentAccount, false, false);
      if (oldHash !== '0x0000000000000000000000000000000000000000000000000000000000000000') {
        await runtime.dataContract.setEntry(contractId, oldDataField, oldHash, currentAccount, false, false);
      }
    }));

    // get and migrate the sharings hash
    const shared = runtime.contractLoader.loadContract('Shared', profileAddress);
    const sharedNew = runtime.contractLoader.loadContract('Shared', contractId);
    const sharingHash = await runtime.executor.executeContractCall(shared, 'sharing');
    await runtime.executor.executeContractTransaction(
            sharedNew, 'setSharing', { from: currentAccount, autoGas: 1.1, }, sharingHash);

    // register profile for user
    const profileIndexDomain = runtime.nameResolver.getDomainName(
      runtime.nameResolver.config.domains.profile);
    const profileIndexAddress = await runtime.nameResolver.getAddress(profileIndexDomain);
    const profileIndexContract = runtime.contractLoader.loadContract(
      'ProfileIndexInterface', profileIndexAddress);
    await runtime.executor.executeContractTransaction(
      profileIndexContract,
      'setMyProfile',
      { from: currentAccount, autoGas: 1.1, },
      contractId
    );

    runtime.profile.profileContract.options.address = contractId;

  }
}
