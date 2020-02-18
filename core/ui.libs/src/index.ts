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

import './index.scss';
import * as bccUtils from './utils/bccUtils';
import * as FileHandler from './utils/Files';
import * as profileUtils from './utils/profileUtils';
import EvanQueue from './utils/Queue';
import Dispatcher from './utils/Dispatcher';
import DispatcherInstance from './utils/DispatcherInstance';
import { UIContainerFile } from './interfaces/UIContainerFile';

dappBrowser.System.map['@evan.network/ui'] = `ui.libs.${dappBrowser.getDomainName()}!dapp-content`;

export * from './config';
export * from './utils/utils';
export {
  bccUtils,
  Dispatcher,
  DispatcherInstance,
  EvanQueue,
  FileHandler,
  profileUtils,
  UIContainerFile,
};
