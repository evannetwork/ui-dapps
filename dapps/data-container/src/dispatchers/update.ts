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

import * as dappBrowser from '@evan.network/ui-dapp-browser';
import * as bcc from '@evan.network/api-blockchain-core';
import { EvanComponent, EvanForm, EvanFormControl } from '@evan.network/ui-vue-core';
import { Dispatcher, DispatcherInstance, deepEqual } from '@evan.network/ui';

import * as utils from '../utils';

const dispatcher = new Dispatcher(
  `datacontainer.digitaltwin.${ dappBrowser.getDomainName() }`,
  'updateDispatcher',
  40 * 1000,
  '_datacontainer.dispatcher.update'
);

dispatcher
  .startup(async (instance: DispatcherInstance, data: any) => {
    const runtime = utils.getRuntime(instance.runtime);
    const container = utils.getContainer(runtime, data.address);
    const description = await container.getDescription();
    const template = await container.toTemplate(true);

    // analyse data and check, which data fields must be saved
    data.saveDescription = false;
    data.entriesToSave = [ ];
    data.toShare = { };

    // check for integrity
    Object.keys(data.template.properties).map((propertyKey: string) => {
      const originProp = data.template.properties[propertyKey];
      const newProp: any = template.properties[propertyKey] || { };

      // schema has been changed
      if (!deepEqual(originProp.dataSchema, newProp.dataSchema)) {
        data.saveDescription = true;
      }

      // check for entry value updates
      if (!deepEqual(originProp.value, newProp.value) || newProp.type === 'list') {
        data.entriesToSave.push(propertyKey);
      }

      // TODO: add sharing
    });
  })

  // update description
  .step(async (instance: DispatcherInstance, data: any) => {
    const runtime = utils.getRuntime(instance.runtime);
    const container = utils.getContainer(runtime, data.address);
    const description = await container.getDescription();

    // check for changed data
    if (data.saveDescription ||
        description.name !== data.name ||
        description.description !== data.description ||
        description.imgSquare !== data.img) {
      // set dbcp values
      description.name = data.name;
      description.description = data.description;
      description.imgSquare = data.img;

      // don't forget to update the template schema
      description.dataSchema = { };
      Object.keys(data.template.properties).forEach(property =>
        description.dataSchema[property] = data.template.properties[property].dataSchema
      );

      await container.setDescription(description);
    }
  })

  // update permissions
  .step(async (instance: DispatcherInstance, data: any) => {
    const runtime = utils.getRuntime(instance.runtime);
    const container = utils.getContainer(runtime, data.address);

    // TODO: implement permission management
  })

  // update entries
  .step(async (instance: DispatcherInstance, data: any) => {
    const runtime = utils.getRuntime(instance.runtime);
    const container = utils.getContainer(runtime, data.address);

    // save all values
    await Promise.all(data.entriesToSave.map((entryKey: string) =>
      container.setEntry(entryKey, data.template.properties[entryKey].value)
    ));
  })

  // update list entries
  .step(async (instance: DispatcherInstance, data: any) => {
    // TODO: add list entries
  });

export default dispatcher;
