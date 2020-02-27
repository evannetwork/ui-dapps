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
  static async checkOrMigrateProfile(runtime, type = 'user') {
    let description;
    try {
      // try to load the description, if this errors, create a new profile
      description = await runtime.description.getDescription(
        runtime.profile.profileContract.options.address,
      );
    } catch (e) {
      // when the description errors, create a new profile
      await this.migrateProfile(runtime, type);
    }
  }

  /**
   * Load a new profile data scope from a migrated profile.
   *
   * @param      {bcc.Profile}  profile  profile to load the data from
   * @param      {bcc.Runtime}  vueInstance  profile component vue instance
   */
  static async loadProfileData(vueInstance, type) {
    const runtime = vueInstance.getRuntime();
    const { profile } = vueInstance.$store.state.profileDApp;

    const instances = await dispatchers.updateProfileDispatcher.getInstances(runtime, true);
    let scopeData;

    // if dispatcher is running, use this data
    if (instances && instances.length !== 0) {
      const filtered = instances.filter((instance) => instance.data.type === type);
      if (filtered.length !== 0) {
        scopeData = filtered[filtered.length - 1].data.formData;
      }
    }

    // if not dispatcher entry was found for this scope, load it!
    if (!scopeData) {
      scopeData = (await profile.getProfileProperty(type));
    }

    return scopeData;
  }

  /**
   * creates a new profile from the factory and migrates the old one
   *
   * @param      {any}  runtime  The runtime
   */
  static async migrateProfile(runtime, type: string) {
    const profileAddress = runtime.profile.profileContract.options.address;
    const currentAccount = runtime.activeIdentity;

    const oldDataFields = ['addressBook', 'bookmarkedDapps', 'contracts', 'contacts', 'profileOptions', 'publicKey', 'templates'];
    const newDataFields = ['accountDetails', 'contact', 'deviceDetails', 'registration'];

    // get the profile factory
    const factoryAddress = await runtime.nameResolver.getAddress('profile.factory.evan');
    const factory = runtime.contractLoader.loadContract(
      'ProfileDataContractFactoryInterface',
      factoryAddress,
    );

    const description = {
      public: {
        author: '',
        dataSchema: {
          ...runtime.profile.accountTypes.user.template.properties,
          ...runtime.profile.accountTypes[type].template.properties,
        },
        dbcpVersion: 2,
        name: 'Profile Container',
        description: 'Container contract for storing and sharing profile related information '
          + '(account type, company information, device detail, ...)',
        version: '0.1.0',
      },
    };

    // format data schema to remove properties
    Object.keys(description.public.dataSchema)
      .forEach((property) => description.public.dataSchema[property] = description.public.dataSchema[property].dataSchema);

    // calculate correct dbcp description and setup empty profile data properties
    const profileTypeObject = { accountDetails: { profileType: type } };
    Object.keys(runtime.profile.accountTypes[type].template.properties)
      .forEach((key) => profileTypeObject[key] = { });
    const descriptionHash = await runtime.dfs.add(
      'description', Buffer.from(JSON.stringify(description), 'binary'),
    );

    // create a new profile contract from the factory
    const contractId = await runtime.executor.executeContractTransaction(
      factory,
      'createContract',
      {
        from: currentAccount,
        autoGas: 1.1,
        event: { target: 'BaseContractFactoryInterface', eventName: 'ContractCreated' },
        getEventResult: (event, args) => args.newAddress,
      },
      '0x0000000000000000000000000000000000000000',
      currentAccount,
      descriptionHash,
      runtime.nameResolver.config.ensAddress,
      []
        .concat(newDataFields)
        .concat(oldDataFields)
        .map((entry) => runtime.nameResolver.soliditySha3(entry)),
      [],
    );

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
      sharedNew, 'setSharing', { from: currentAccount, autoGas: 1.1 }, sharingHash,
    );

    // register profile for user
    const profileIndexDomain = runtime.nameResolver.getDomainName(
      runtime.nameResolver.config.domains.profile,
    );
    const profileIndexAddress = await runtime.nameResolver.getAddress(profileIndexDomain);
    const profileIndexContract = runtime.contractLoader.loadContract(
      'ProfileIndexInterface', profileIndexAddress,
    );
    await runtime.executor.executeContractTransaction(
      profileIndexContract,
      'setMyProfile',
      { from: currentAccount, autoGas: 1.1 },
      contractId,
    );

    /* reset previous loaded profile contract to be sure to load corrcet profile data after
       migration */
    delete runtime.profile.profileContract;
    await runtime.profile.loadForAccount();
    runtime.profile.profileContract.options.address = contractId;

    // ensure permissions on all new fields
    await runtime.profile.setProfileProperties(profileTypeObject);
  }
}
