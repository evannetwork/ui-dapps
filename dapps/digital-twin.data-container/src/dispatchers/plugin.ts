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
import { deepEqual, cloneDeep } from '@evan.network/ui';
import { Dispatcher, DispatcherInstance } from '@evan.network/ui';
import { EvanComponent, EvanForm, EvanFormControl } from '@evan.network/ui-vue-core';
import { utils } from '@evan.network/digitaltwin.lib';


const dispatcher = new Dispatcher(
  `datacontainer.digitaltwin.${ dappBrowser.getDomainName() }`,
  'pluginDispatcher',
  40 * 1000,
  '_datacontainer.dispatcher.plugin'
);

dispatcher
  .step(async (instance: DispatcherInstance, data: any) => {
    // set the digital twin instance
    const runtime = utils.getRuntime(instance.runtime);
    const profile = runtime.profile;

    // apply the possibility to only save the description, without touching the template.
    data.template = data.template || (await bcc.Container
      .getContainerPlugin(profile, data.beforeName)).template;

    // copy original template and clear runtime propert variables
    const allowedProperties = [ 'dataSchema', 'type', '$comment', 'permissions' ];
    data.template = cloneDeep(bcc.lodash, data.template, true);
    Object.keys(data.template.properties).forEach(property => {
      Object.keys(data.template.properties[property]).forEach(key => {
        if (allowedProperties.indexOf(key) === -1) {
          delete data.template.properties[property][key];
        }
      });
    });

    await bcc.Container.saveContainerPlugin(profile, data.description.name, {
      description: data.description,
      template: data.template,
    }, data.beforeName);
  });

export default dispatcher;
