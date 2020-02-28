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

import { profileUtils } from '@evan.network/ui';
import { ContactInterface } from '@evan.network/ui-vue-core/src/interfaces';
import { Container } from '@evan.network/api-blockchain-core';
import { getDomainName } from '@evan.network/ui-dapp-browser';
import * as PermissionTypes from './permission-types';
import * as dispatchers from '../../dispatchers/registry';

/**
 * return generell types of permissions
 *
 * @param permissions
 * @param properties
 */
export const getPermissionsType = (permissions, propertiesKeys) => {
  // check write permissions
  if (permissions.readWrite) {
    // check full access
    if (propertiesKeys.every((item) => permissions.readWrite.includes(item))) {
      return PermissionTypes.FULL_ACCESS;
    }
    // check read and write permissions
    if (propertiesKeys.some((read) => permissions.readWrite.includes(read))) {
      return PermissionTypes.READ_WRITE;
    }
  }

  if (permissions.read) {
    // check full read
    if (propertiesKeys.every((item) => permissions.read.includes(item))) {
      return PermissionTypes.FULL_READ;
    }
    // check read permissions
    if (propertiesKeys.some((read) => permissions.read.includes(read))) {
      return PermissionTypes.READ;
    }
  }

  return PermissionTypes.NONE;
};

/**
 * get container from container address
 * @param runtime
 * @param containerAddress
 * @param accountId
 */
export const getContainer = (runtime, containerAddress, accountId) => new Container(
  runtime,
  {
    accountId,
    address: containerAddress,
  },
);

/**
 * get all properties from container
 * @param Container container
 */
export const getContainerProperties = async (container: Container) => {
  const plugin = await container.toPlugin();

  return plugin.template.properties;
};

/**
 * load the contacts for the current user, so we can display correct contact alias
 * @param runtime current runtime
 */
export const getContacts = async (runtime): Promise<ContactInterface[]> => {
  delete runtime.profile.trees[runtime.profile.treeLabels.addressBook]; // why?
  const addressBook = (await runtime.profile.getAddressBook()).profile;

  return Object.keys(addressBook).map((key) => ({
    label: addressBook[key].alias,
    value: key,
  }));
};


/**
 * get permissions from container address
 * @param runtime
 * @param containerAddress
 * @param accountId
 */
export const getPermissions = async (vueInstance, containerAddress,
  accountId = vueInstance.getRuntime().activeAccount) => {
  const container = getContainer(vueInstance.getRuntime(), containerAddress, accountId);
  const shareConfigs = await container.getContainerShareConfigs();

  const configs = shareConfigs.map((config) => {
    // the own account should not take into consideration
    if (config.accountId === accountId) {
      return null;
    }

    return {
      accountId: config.accountId,
      permissionType: getPermissionsType(config, vueInstance.$store.state.profileDApp.sharingFilter),
      sharedConfig: config,
    };
  });

  // return cleared array
  return configs.filter((config) => config !== null);
};

/**
 * get permissions from own profile
 * @param vueInstance
 */
export const getProfilePermissions = async (vueInstance) => getPermissions(
  vueInstance,
  vueInstance.$store.state.profileDApp.profile.profileContract.options.address,
);

/**
 * Return bmail object for sharing profile container sets with others.
 *
 * @return     {any}  The profile share b mail
 */
export const getProfileShareBMail = async (vueInstance) => {
  const runtime = vueInstance.getRuntime();
  const alias = await profileUtils.getUserAlias(runtime);
  // ensure profile container is setup
  await profile.loadForAccount();

  return {
    content: {
      from: vueInstance.getRuntime().activeAccount,
      fromAlias: alias,
      title: vueInstance.$t('_profile.bmail.share.title'),
      body: vueInstance.$t('_profile.bmail.share.body', { alias }).replace(/\n/g, '<br>'),
      attachments: [
        {
          fullPath: [
            `/${vueInstance.dapp.rootEns}`,
            `profile.vue.${getDomainName()}`,
            vueInstance.getRuntime().activeAccount,
          ].join('/'),
          type: 'url',
        },
        {
          containerAddress: profile.profileContainer.config.address,
          type: 'container',
        },
      ],
    },
  };
};

/**
 * remove all permissions of share configs containers.
 *
 * @param runtime: bcc.runtime
 * @param shareConfigs: any - the permissions object
 */
export const removeAllPermissions = async (vueInstance, shareConfigs) => {
  // push all permissions to remove into the readWrite object
  if (!shareConfigs.readWrite) {
    shareConfigs.readWrite = [];
  }

  if (shareConfigs.read) {
    shareConfigs.readWrite.push(...shareConfigs.read);
    delete shareConfigs.read;
  }

  const runtime = vueInstance.getRuntime();
  const dataSharing = {
    address: runtime.profile.profileContract.options.address,
    unshareConfigs: [shareConfigs], // TODO: convert to unshare configs havin only write and readWrite properties
    bMailContent: false,
  };

  await dispatchers.shareProfileDispatcher.start(runtime, [dataSharing]);
};

export const findAllByKey = (obj, keyToFind) => Object.entries(obj)
  .reduce((acc, [key, value]) => ((key === keyToFind)
    ? acc.concat(value)
    : (typeof value === 'object')
      ? acc.concat(findAllByKey(value, keyToFind))
      : acc),
  []);
