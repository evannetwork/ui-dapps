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

// map the original ui path to ui.libs
import * as dappBrowser from '@evan.network/ui-dapp-browser';
dappBrowser.System.map['@evan.network/ui'] = `ui.libs.${ dappBrowser.getDomainName() }!dapp-content`;

import EvanQueue from './Queue';
import { Dispatcher, DispatcherInstance } from './Dispatcher';
import './index.scss';
import * as FileHandler from './Files';
import * as bccUtils from './bccUtils';

export * from './config';
export * from './utils';
export { EvanQueue, Dispatcher, DispatcherInstance, FileHandler, bccUtils, };

/**
 * if the ui.evan dapp is loaded as an normal dapp, show the style preview.
 *
 * @param      {any}  container  html container where the dapp should be rendered to
 * @param      {any}  dbcpName   dbcp name of the dapp
 */
export async function startDApp(container, dbcpName, dappEns, dappBaseUrl) {
  let xmlhttp = (<any>window).XMLHttpRequest ? new XMLHttpRequest() :
    new (<any>window).ActiveXObject('Microsoft.XMLHTTP');

  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
      container.innerHTML = xmlhttp.responseText;
      // remove the loading screen
      dappBrowser.loading.finishDAppLoading();
    }
  };

  xmlhttp.open('GET', `${ dappBaseUrl }/index.html`, false);
  xmlhttp.send();
}
