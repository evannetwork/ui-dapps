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
  ContainerUnshareConfig,
  Runtime,
  ContainerOptions,
  ContainerTemplateProperty,
} from '@evan.network/api-blockchain-core';
import { EvanComponent } from '@evan.network/ui-vue-core';
import { BmailContent } from './SharingUtils';
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
  static getFields({ dataSchema }): any {
    let properties = [];

    if (dataSchema.type === 'object' && dataSchema.properties) {
      properties = Object.keys(dataSchema.properties);
    } else if (dataSchema.type === 'array' && dataSchema.items?.type === 'object'
      && dataSchema.items?.properties) {
      properties = Object.keys(dataSchema.items?.properties);
    }

    return properties;
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
   * Creates permissions mapping based on container properties, sharing configs for each user and the container itself.
   *
   * TODO: How does the return value look like? Seems incompatible with PermissionsContainer interface
   * @param runtime
   * @param param1
   * @param accountId
   */
  static async getContainerPermissionsForUser(
    runtime: Runtime,
    { containerAddress, i18nScope }: { containerAddress: string; i18nScope?: string },
    accountId = runtime.activeAccount,
  ): Promise<any> {
    const container = PermissionUtils.getContainer(
      runtime,
      containerAddress,
      runtime.activeAccount,
    );
    const properties = await PermissionUtils.getContainerProperties(container);
    const containerPermObj = {
      address: containerAddress,
      i18nScope: i18nScope || containerAddress,
      permissions: null,
    };

    try {
      const userPermissions = await container.getContainerShareConfigForAccount(accountId);
      containerPermObj.permissions = PermissionUtils.createPermissionsObject(
        userPermissions,
        properties,
      );
    } catch (ex) {
      // could not load permissions, return pristine
    }

    if (!containerPermObj.permissions) {
      containerPermObj.permissions = PermissionUtils
        .createPermissionsObject({ read: [], readWrite: [] }, properties);
    }

    return containerPermObj;
  }

  /**
   * Creates shareConfig object containing only the updated permissions.
   *
   * @param permissions
   * @param oldPermissions
   * @param accountId
   */
  static createShareConfig(
    permissions: Permissions,
    oldPermissions: Permissions,
    accountId: string,
  ): ContainerUnshareConfig[] {
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

    // only push the new share config into the share configs array when there is anything to share
    if (
      shareConfig.read.length > 0
      || shareConfig.readWrite.length > 0
      || shareConfig.removeListEntries.length > 0
    ) {
      shareConfigs.push(shareConfig);
    }

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

    // only push the new share config into the share configs array when there is anything to unshare
    if (
      unshareConfig.write.length > 0
      || unshareConfig.readWrite.length > 0
      || unshareConfig.removeListEntries.length > 0
    ) {
      unshareConfigs.push(unshareConfig);
    }

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
    bMailContent: BmailContent,
  ): Promise<void> {
    const containerConfigs = [];

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
