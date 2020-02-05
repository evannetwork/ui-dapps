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
  ContainerOptions,
  ContainerTemplateProperty,
} from '@evan.network/api-blockchain-core';
import { cloneDeep } from '@evan.network/ui';
import { EvanComponent } from '@evan.network/ui-vue-core';
import SharingUtils from './SharingUtils';
import { Permissions, PermissionsContainer } from '../interfaces/Permissions';
import { containerShareDispatcher } from '../dispatchers';

/*
  Helper functions for permission handling.

  TODO:
    - Currently it's only possible to extend permissions, implement the remove permissions API.
    - implement some caching
    - resolve `any` types
*/

interface ShareConfigEntry {
  accountId: string;
  readWrite: string[];
  read: string[];
}

interface Properties {
  [id: string]: ContainerTemplateProperty;
}

export default class PermissionUtils {
  /**
   * Get a container from container address.
   *
   * @param runtime
   * @param containerAddress
   * @param accountId
   */
  static getContainer(
    runtime: Runtime,
    containerAddress: string,
    accountId: string,
  ): Container {
    return new Container(runtime as ContainerOptions, {
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
    properties: Properties,
  ): Permissions {
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
  static async getContainerProperties(
    container: Container,
  ): Promise<Properties> {
    const plugin = await container.toPlugin();

    return plugin.template.properties;
  }

  /**
   * Converts { permissions } to deny read and readWrite.
   * Keeps the fields values.
   *
   * @param permissions
   */
  static convertToPristinePermissions(permissions: Permissions): Permissions {
    const perms = permissions;
    Object.keys(perms).forEach((property) => {
      perms[property].read = false;
      perms[property].readWrite = false;
    });

    return perms;
  }

  /**
   * Clones whole permissions Object and removes all access rights.
   *
   * @param userPermissions
   * - permissions
   */
  static convertToPristine(userPermissions: Permissions): Permissions {
    const pristinePermissions = cloneDeep(lodash, userPermissions);

    pristinePermissions.keys().foreach((key) => {
      if (Object.prototype.hasOwnProperty.call(pristinePermissions, key)) {
        if (
          Object.prototype.hasOwnProperty.call(
            pristinePermissions[key],
            'permissions',
          )
        ) {
          pristinePermissions[
            key
          ].permissions = PermissionUtils.convertToPristinePermissions(
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
   * TODO: How does the return value look like? Seems incompatible with PermissionsContainer interface
   * @param runtime
   * @param param1
   * @param accountId
   */
  static async createContainerPermissions(
    runtime: Runtime,
    { containerAddress, label },
    accountId = runtime.activeAccount,
  ): Promise<any> {
    const container = PermissionUtils.getContainer(
      runtime,
      containerAddress,
      accountId,
    );
    const properties = await PermissionUtils.getContainerProperties(container);
    const shareConfigs = await container.getContainerShareConfigs();
    const containerPermissions = {} as any;

    shareConfigs.forEach((entry: ShareConfigEntry) => {
      containerPermissions[entry.accountId] = {
        [containerAddress]: {
          label,
          permissions: PermissionUtils.createPermissionsObject(
            entry,
            properties,
          ),
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
        ...(runtime as ProfileOptions),
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
    permissions: Permissions,
    oldPermissions: Permissions,
    accountId: string,
  ): Promise<ContainerUnshareConfig[]> {
    const shareConfigs: ContainerShareConfig[] = [];
    const shareConfig: ContainerShareConfig = {
      accountId,
      read: [],
      readWrite: [],
      removeListEntries: [],
    };

    // iterate through properties and get new read / readWrite permissions
    Object.keys(permissions).forEach((property: string) => {
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
    permissions: Permissions,
    oldPermissions: Permissions,
    accountId: string,
  ): ContainerUnshareConfig[] {
    const unshareConfigs: ContainerUnshareConfig[] = [];
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
   * @param vueInstance
   * @param runtime: bcc.runtime
   * @param accountId: string - the account to be shared with.
   * @param containerPermissions: the new permissions object
   * @param oldContainerPermissions: the old permissions object
   */
  static async updatePermissions(
    vueInstance: EvanComponent,
    runtime: Runtime,
    accountId: string,
    containerPermissions: PermissionsContainer,
    oldContainerPermissions: PermissionsContainer,
  ): Promise<void> {
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

    await containerShareDispatcher.start(runtime, containerConfigs);
  }
}
