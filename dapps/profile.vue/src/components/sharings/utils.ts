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

import { ContactInterface } from '@evan.network/ui-vue-core/src/interfaces';
import { Container } from '@evan.network/api-blockchain-core';
import { shareDispatcher } from '@evan.network/datacontainer.digitaltwin';
import * as PermissionTypes from './permission-types';
import { async } from 'q';

/**
 * return generell types of permissions
 *
 * @param permissions
 * @param properties
 */
const getPermissionsType = (permissions, properties) => {
  const propertiesKeys = Object.keys(properties);

  // check write permissions
  if (permissions.readWrite) {
    // check full access
    if (propertiesKeys.every(item => permissions.readWrite.includes(item))) {
      return PermissionTypes.FULL_ACCESS;
    }
    // check read and write permissions
    if (propertiesKeys.some(read => permissions.readWrite.includes(read))) {
      return PermissionTypes.READ_WRITE;
    }
  }

  if (permissions.read) {
    // check full read
    if (propertiesKeys.every(item => permissions.read.includes(item))) {
      return PermissionTypes.FULL_READ;
    }
    // check read permissions
    if (propertiesKeys.some(read => permissions.read.includes(read))) {
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
export const getContainer = (runtime, containerAddress, accountId) => {
  return new Container(
    runtime,
    {
      accountId,
      address: containerAddress,
    },
  );
};

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
  let addressBook = (await runtime.profile.getAddressBook()).profile;

  return Object.keys(addressBook).map(key => {
    return {
      'label': addressBook[key].alias,
      'value': key
    };
  });
};


/**
 * get permissions from container address
 * @param runtime
 * @param containerAddress
 * @param accountId
 */
export const getPermissions = async (runtime, containerAddress, accountId = runtime.activeAccount) => {
  const container = getContainer(runtime, containerAddress, accountId);
  const properties = await getContainerProperties(container);
  const shareConfigs = await container.getContainerShareConfigs();

  let configs =  shareConfigs.map(config => {
    // the own account should not take into consideration
    if (config.accountId === accountId) {
       return null;
    }

    return {
      accountId: config.accountId,
      sharedConfig: config,
      permissionType: getPermissionsType(config, properties)
    };
  });

  // return cleared array
  return configs.filter(config => config !== null);
};

/**
 * get permissions from own profile
 * @param runtime
 */
export const getProfilePermissions = async (runtime) => {
  const profileAddress = runtime.profile.profileContract.options.address;

  return getPermissions(runtime, profileAddress);
};

/**
 * remove all permissions of share configs containers.
 *
 * @param runtime: bcc.runtime
 * @param shareConfigs: any - the permissions object
 */
export const removeAllPermissions = (runtime, shareConfigs) => {
  return new Promise((resolve, reject) => {
    try {
        const dataSharing = {
          address: runtime.profile.profileContract.options.address,
          unshareConfigs: [shareConfigs],
          bMailContent: false
        };

        shareDispatcher.start(runtime, [dataSharing]);
    } catch (e) {
      reject(e);
    }

    resolve();
  });
};
