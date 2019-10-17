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
import * as dispatchers from '../dispatchers/registry';

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
  }

  /**
   * Load a new profile data scope from a migrated profile.
   *
   * @param      {bcc.Runtime}  runtime  blockchain-core runtime
   * @param      {string}       type     the scope type
   */
  static async loadProfileData(runtime, type) {
    const instances = await dispatchers.updateProfileDispatcher.getInstances(runtime, true);
    let scopeData;

    // if dispatcher is running, use this data
    if (instances && instances.length !== 0) {
      const filtered = instances.filter(instance => instance.data.type === type);
      if (filtered.length !== 0) {
        scopeData = filtered[filtered.length - 1].data.formData;
      }
    }

    // if not dispatcher entry was found for this scope, load it!
    if (!scopeData) {
      scopeData = (await runtime.profile.getProfileProperty(type));
    }

    return scopeData;
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

    // reset previous loaded profile contract to be sure to load corrcet profile data after
    // migration
    delete runtime.profile.profileContract;
    await runtime.profile.loadForAccount();
    runtime.profile.profileContract.options.address = contractId;
  }
}
