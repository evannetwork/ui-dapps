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

import {
  Container,
  ContainerShareConfig,
  Profile,
  ContainerUnshareConfig,
  Runtime,
  lodash,
  ProfileOptions,
} from '@evan.network/api-blockchain-core';
import { cloneDeep } from '@evan.network/ui';
import EvanComponent from '../component';
import SharingUtils from './SharingUtils';

/*
  Helper functions for permission handling.

  TODO:
    - merge with other permissions helper functions to one module
    - Currently it's only possible to extend permissions, implement the remove permissions API.
    - implement some caching
    - resolve `any` types
*/

interface ShareConfigEntry {
  accountId: string;
  readWrite: string[];
  read: string[];
}

export default class PermissionUtils {
  /**
   * Get a container from container address.
   *
   * @param runtime
   * @param containerAddress
   * @param accountId
   */
  static getContainer(runtime, containerAddress, accountId): Container {
    return new Container(runtime, {
      accountId,
      address: containerAddress,
    });
  }

  /**
   * Extract field names from container properties.
   */
  static getFields({ dataSchema: { properties } }): any {
    if (!properties) {
      return [];
    }

    return Object.keys(properties);
  }

  /**
   * TODO: docbloc
   *
   * @param param0
   * @param properties
   */
  static createPermissionsObject(
    { read = [], readWrite = [] },
    properties: any,
  ): any {
    const permissions = {};

    Object.keys(properties).forEach((property) => {
      const canWrite = readWrite.includes(property);
      const canRead = canWrite || read.includes(property);
      const fields = PermissionUtils.getFields(properties[property]);

      permissions[property] = {
        read: canRead,
        readWrite: canWrite,
        fields,
      };
    });

    return permissions;
  }

  /**
   * Get all properties from container.
   *
   * @param Container container
   */
  static async getContainerProperties(container: Container): Promise<any> {
    const plugin = await container.toPlugin();

    return plugin.template.properties;
  }

  /**
   * Converts { permissions } to deny read and readWrite.
   * Keeps the fields values.
   *
   * @param permissions
   * - [property]
   * -- read: boolean
   * -- readWrite: boolean
   * -- fields: string[]
   */
  static convertToPristinePermissions(values): any {
    const permissions = values;
    Object.keys(permissions).forEach((property) => {
      permissions[property].read = false;
      permissions[property].readWrite = false;
    });

    return permissions;
  }

  /**
   * Clones whole permissions Object and removes all access rights.
   *
   * @param containerPermissionsEntry - Object
   * - permissions
   */
  static convertToPristine(userPermissions): any {
    const pristinePermissions = cloneDeep(lodash, userPermissions);

    pristinePermissions.keys().foreach((key) => {
      if (Object.prototype.hasOwnProperty.call(pristinePermissions, key)) {
        if (
          Object.prototype.hasOwnProperty.call(
            pristinePermissions[key],
            'permissions',
          )
        ) {
          pristinePermissions[key].permissions = PermissionUtils.convertToPristinePermissions(
            pristinePermissions[key].permissions,
          );
        }
      }
    });

    return pristinePermissions;
  }

  /**
   * Creates permissions mapping based on container properties, sharing configs for each user and the container itself.
   *
   * @param runtime
   * @param param1
   * @param accountId
   */
  static async createContainerPermissions(
    runtime: Runtime,
    { containerAddress, label },
    accountId = runtime.activeAccount,
  ): Promise<any> {
    const container = PermissionUtils.getContainer(runtime, containerAddress, accountId);
    const properties = await PermissionUtils.getContainerProperties(container);
    const shareConfigs = await container.getContainerShareConfigs();
    const containerPermissions: any = {};

    shareConfigs.forEach((entry: ShareConfigEntry) => {
      containerPermissions[entry.accountId] = {
        [containerAddress]: {
          label,
          permissions: PermissionUtils.createPermissionsObject(entry, properties),
        },
      };
    });

    // Add pristine permissions map for new users:
    containerPermissions.new = PermissionUtils.convertToPristine(
      containerPermissions[accountId],
    );

    return containerPermissions;
  }

  /**
   * get permissions for own profile
   * @param runtime
   */
  static async getProfilePermissionDetails(
    runtime: Runtime,
    accountId: string,
    label = 'Profile Data',
  ): Promise<any> {
    let profileAddress = runtime.profile.profileContract.options.address;

    if (runtime.activeAccount !== accountId) {
      const profile = new Profile({
        accountId: runtime.activeAccount,
        profileOwner: accountId,
        ...runtime as ProfileOptions,
      });

      await profile.loadForAccount();
      profileAddress = profile.profileContract.options.address;
    }

    return PermissionUtils.createContainerPermissions(
      runtime,
      { containerAddress: profileAddress, label },
      accountId,
    );
  }

  /**
   * Creates shareConfig object containing only the updated permissions.
   *
   * @param permissions
   * @param oldPermissions
   * @param accountId
   */
  static async createShareConfig(
    permissions,
    oldPermissions,
    accountId: string,
  ): Promise<any> {
    const shareConfigs = [];
    const shareConfig: ContainerShareConfig = {
      accountId,
      read: [],
      readWrite: [],
      removeListEntries: [],
    };

    // iterate through properties and get new read / readWrite permissions
    Object.keys(permissions).forEach((property) => {
      if (permissions[property].read && !oldPermissions[property].read) {
        shareConfig.read.push(property);
      }
      if (
        permissions[property].readWrite
        && !oldPermissions[property].readWrite
      ) {
        shareConfig.readWrite.push(property);

        /* TODO: handle remove permission on lists
          if (this.plugin.template.properties[property].type === 'list') {
            shareConfig.removeListEntries.push(property);
          } */
      }
    });

    // push the new share config into the share configs array
    shareConfigs.push(shareConfig);

    return shareConfigs;
  }

  /**
   * Creates an unshareConfig object containing only the permissions to be removed.
   *
   * @param permissions
   * @param oldPermissions
   * @param accountId
   */
  static createUnshareConfig(
    permissions,
    oldPermissions,
    accountId: string,
  ): any {
    const unshareConfigs = [];
    const unshareConfig: ContainerUnshareConfig = {
      accountId,
      write: [],
      readWrite: [],
      removeListEntries: [],
    };

    // iterate through properties and get removing read / readWrite permissions
    Object.keys(oldPermissions).forEach((property) => {
      if (oldPermissions[property].read && !permissions[property].read) {
        unshareConfig.readWrite.push(property);
      }
      if (
        oldPermissions[property].readWrite
        && !permissions[property].readWrite
      ) {
        unshareConfig.write.push(property);

        /* TODO: handle remove permission on lists
          if (this.plugin.template.properties[property].type === 'list') {
            shareConfig.removeListEntries.push(property);
          } */
      }
    });

    // push the new share config into the share configs array
    unshareConfigs.push(unshareConfig);

    return unshareConfigs;
  }

  /**
   * Update all permissions of containers for user with accountId.
   *
   * @param runtime: bcc.runtime
   * @param accountId: string - the account to be shared with.
   * @param containerPermissions: any - the new permissions object
   * @param oldContainerPermissions: any - the old permissions object
   */
  static async updatePermissions(
    vueInstance: EvanComponent,
    runtime: Runtime,
    accountId: string,
    containerPermissions,
    oldContainerPermissions,
  ): Promise<any> {
    const containerConfigs = [];
    const bMailContent = await SharingUtils.getProfileShareBMail(vueInstance);

    Object.keys(containerPermissions).forEach((containerAddress: string) => {
      const shareConfigs = PermissionUtils.createShareConfig(
        containerPermissions[containerAddress].permissions,
        oldContainerPermissions[containerAddress].permissions,
        accountId,
      );

      const dataSharing = {
        address: containerAddress,
        shareConfigs,
        bMailContent,
      };

      containerConfigs.push(dataSharing);
    });

    Object.keys(oldContainerPermissions).forEach((containerAddress: string) => {
      const unshareConfigs = PermissionUtils.createUnshareConfig(
        containerPermissions[containerAddress].permissions,
        oldContainerPermissions[containerAddress].permissions,
        accountId,
      );

      const dataSharing = {
        address: containerAddress,
        unshareConfigs,
        bMailContent: false,
      };

      containerConfigs.push(dataSharing);
    });
  }
}
