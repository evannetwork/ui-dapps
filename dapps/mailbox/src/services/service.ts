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
  getDomainName
} from '@evan.network/ui-dapp-browser';

import {
  Injectable, OnDestroy,    // '@angular/core';
  Platform,                 // ionic-angular
  Observable, Subscription
} from '@evan.network/ui-angular-libs';

import {
  EvanCoreService,
  EvanBCCService,
  EvanDescriptionService,
  EvanRoutingService,
  SingletonService,
  EvanAlertService
} from '@evan.network/ui-angular-core';

/**************************************************************************************************/

@Injectable()
export class MailDispatcherService {
  constructor(
    public bcc: EvanBCCService,
    public singleton: SingletonService
  ) {
    return singleton.create(MailDispatcherService, this);
  }
}