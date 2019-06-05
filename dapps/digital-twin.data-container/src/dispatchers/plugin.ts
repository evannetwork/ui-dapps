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
import { Dispatcher, DispatcherInstance } from '@evan.network/ui';
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

    // load latest contracts to be up to date
    await profile.loadForAccount(profile.treeLabels.contracts);

    // on an update and when the name has changed, remove the previous template
    if (data.beforeName && data.description.name !== data.beforeName) {
      await runtime.profile.removeBcContract(bcc.Container.profilePluginsKey, data.beforeName);
    }

    // copy original template and clear runtime propert variables
    const allowedProperties = [ 'dataSchema', 'type', '$comment', 'permissions' ];
    data.template = JSON.parse(JSON.stringify(data.template));
    Object.keys(data.template.properties).forEach(property => {
      Object.keys(data.template.properties[property]).forEach(key => {
        if (allowedProperties.indexOf(key) === -1) {
          delete data.template.properties[property][key];
        }
      });
    });

    // save the new template
    await profile.addBcContract(bcc.Container.profilePluginsKey, data.description.name, {
      description: data.description,
      template: data.template,
    });

    // save the profile
    await profile.storeForAccount(profile.treeLabels.contracts);
  });

export default dispatcher;
