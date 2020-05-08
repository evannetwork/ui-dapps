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
  System, ipfs, loading,
} from '@evan.network/ui-dapp-browser';
import * as CoreBundle from '@evan.network/api-blockchain-core';
import * as SmartContracts from '@evan.network/smart-contracts-core';
import { lightwallet } from '@evan.network/ui-session';

import * as bccHelper from './bcc/bcc';
import * as core from './core';
import * as dapp from './dapp';
import * as notifications from './notifications';
import * as queue from './queue';
import * as solc from './solc';
import * as utils from './utils';
import * as routing from './routing';
import * as web3Helper from './web3';
import { AccountStore } from './bcc/AccountStore';
import { config } from './config';
import { KeyProvider, getLatestKeyProvider } from './bcc/KeyProvider';
import { Solc } from './solc';
import { startWatchers } from './watchers';
import { updateCoreRuntime, getCoreOptions } from './bcc/bcc';
import evanGlobals from './evanGlobals';
import './core-js.client.shim.js';

/**
 * add page load performance tracking
 */
window.evanloadTime = Date.now();

/** *********************************************************************************************** */
/**
 * Keep orignal Promise from ZoneJS and restore it after bcc browserified was loaded, which
 * is overwriting the ZoneJS Promise
 *
 * bcc:23126 Unhandled promise rejection Error: Zone.js has detected that ZoneAwarePromise
 * `(window|global).Promise` has been overwritten.
 */
// TODO: when bcc is loaded multiple times, zoneJS should also be saved
const { getDomainName } = utils;
let web3;
let CoreRuntime;
let definition;
let nameResolver;

// prefill bcc for systemjs plugin usage
evanGlobals.core = core;
evanGlobals.ipfsCatPromise = ipfs.ipfsCatPromise;
evanGlobals.lightwallet = lightwallet;
evanGlobals.restIpfs = ipfs.restIpfs;
evanGlobals.System = System;
evanGlobals.queryParams = routing.getQueryParameters();

evanGlobals.System.map['dapp-browser'] = `olddappbrowser.${getDomainName()}!dapp-content`;
evanGlobals.System.map['old-dapp-browser'] = `olddappbrowser.${getDomainName()}!dapp-content`;
evanGlobals.System.map.bcc = `bcc.${getDomainName()}!dapp-content`;
evanGlobals.System.map['bcc-profile'] = `bcc.${getDomainName()}!dapp-content`;
evanGlobals.System.map['bcc-bc'] = `bcc.${getDomainName()}!dapp-content`;
evanGlobals.System.map['@evan.network/api-blockchain-core'] = `bcc.${getDomainName()}!dapp-content`;
evanGlobals.System.map['@evan.network/dbcp'] = `bcc.${getDomainName()}!dapp-content`;
evanGlobals.System.map['smart-contracts'] = `smartcontracts.${getDomainName()}!dapp-content`;
evanGlobals.System.map['@evan.network/smart-contracts-core'] = `smartcontracts.${getDomainName()}!dapp-content`;
evanGlobals.System.map['@evan.network/ui-angular-libs'] = 'angularlibs.evan!dapp-content';
evanGlobals.System.map['angular-libs'] = 'angularlibs.evan!dapp-content';
evanGlobals.System.map['@evan.network/ui-angular-core'] = 'angularcore.evan!dapp-content';
evanGlobals.System.map['angular-core'] = 'angularcore.evan!dapp-content';

let initializing;
/**
 * Starts the whole dapp-browser.
 *
 * @param      {boolean}  enableRouting  dapp-browser watch for url changes and automatically starts
 *                                       dapps with ens addresses that were passed to the location
 *                                       hash
 */
export async function initializeEvanNetworkStructure(enableRouting = true): Promise<void> {
  if (!initializing) {
    let finished;
    initializing = new Promise((resolve) => {
      finished = resolve;
    });
    // activate color themes
    utils.activateColorTheme(utils.getColorTheme());

    // check if we are running in dev mode, load dev mode available modules
    await Promise.all([
      utils.setUpDevMode(),
      utils.getBrowserName(),
      utils.getIsPrivateMode(),
    ]);

    // ensure, that agent executor was loaded, before anything else was done
    await core.getAgentExecutor();

    // load smart-contracts and blockchain-core minimal setup for accessing ens from ipfs
    try {
      // setup initial "mocked" CoreRuntime, to directly start the routing while creating the bcc
      // runtime
      evanGlobals.CoreRuntime = {
        web3: {
          utils: {
            toChecksumAddress: (address: string) => address,
          },
        },
      };

      // use initial route to handle initially clicked notifications
      let initialRoute;
      if ((<any>window).cordova) {
        // initialize notifications and try to load notifications that the user has clicked, while
        // the app was closed
        const initialNotification = await notifications.initialize();

        // if an initialNotification could be loaded, get the url from the notification that
        // should be opened
        if (initialNotification) {
          initialNotification.evanNotificationOpened = true;
          initialRoute = await notifications.getDAppUrlFromNotification(initialNotification);
        }
      }
      // initialize dynamic routing and apply eventually clicked notification initial route
      if (enableRouting) {
        routing.initialize(initialRoute);
      }

      // make it global available without loading it twice
      evanGlobals.CoreBundle = CoreBundle;
      evanGlobals.SmartContracts = SmartContracts;

      // initialize bcc and make it globally available
      CoreRuntime = await updateCoreRuntime(CoreBundle, SmartContracts);
      evanGlobals.CoreRuntime = CoreRuntime;

      // tell everyone, that bcc was loaded and initialized
      utils.setBccReady();

      // set variables to export to dapps
      definition = CoreRuntime.definition;
      nameResolver = CoreRuntime.nameResolver;
      web3 = CoreRuntime.web3;

      // wait for device ready event so we can load notifications
      await utils.onDeviceReady();

      // initialize queue
      queue.updateQueue();

      // update build number to enable ens cache
      if ((window as any).dappBrowserBuild) {
        window.localStorage['evan-dapp-browser-build'] = (window as any).dappBrowserBuild || '';
      }

      if (utils.devMode) {
        window.evanGlobals = evanGlobals;
      }
    } catch (ex) {
      console.error(ex);

      utils.showError();
    }
    finished();
  }

  await initializing;
}

export {
  AccountStore,
  bccHelper,
  config,
  core,
  CoreRuntime,
  dapp,
  definition,
  evanGlobals,
  getCoreOptions,
  getDomainName,
  getLatestKeyProvider,
  ipfs,
  KeyProvider,
  lightwallet,
  loading,
  nameResolver,
  notifications,
  queue,
  routing,
  solc,
  Solc,
  System,
  utils,
  web3,
  web3Helper,
};
