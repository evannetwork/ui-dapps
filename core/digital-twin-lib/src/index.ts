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

import { getDomainName } from '@evan.network/ui-vue-core';
import { System } from '@evan.network/ui-dapp-browser';

import * as dispatchers from './dispatchers';
import DAppContainer from './DAppContainer';
import DAppTwin from './DAppTwin';
import translations from './i18n';
import { DBCPDescriptionInterface } from './DAppContract';
import { DigitalTwinResponse, DigitalTwin } from './interfaces/DigitaltwinResponse';
import {
  TransactionsResponse,
  TwinTransaction,
} from './interfaces/DigitalTwinTransaction';
import {
  ValidationErrorInterface,
  TemplateErrorInterface,
} from './interfaces/TemplateValidationErrors';
import { SearchService } from './SearchService';
import PermissionUtils from './utils/PermissionUtils';
import SharingUtils, { BmailContent } from './utils/SharingUtils';
import { Permissions, PermissionsContainer } from './interfaces/Permissions';

export * from './dispatchers';
export {
  DAppContainer,
  DAppTwin,
  DBCPDescriptionInterface,
  dispatchers,
  translations,
  ValidationErrorInterface,
  TemplateErrorInterface,
  DigitalTwinResponse,
  TransactionsResponse,
  TwinTransaction,
  DigitalTwin,
  SearchService,
  PermissionUtils,
  SharingUtils,
  Permissions,
  PermissionsContainer,
  BmailContent,
};

System.map[
  '@evan.network/digital-twin-lib'
] = `lib.digital-twin.${getDomainName()}!dapp-content`;
