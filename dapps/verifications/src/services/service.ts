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
import * as SmartContracts from '@evan.network/smart-contracts-core';

import {
  bccHelper,
  core,
  getDomainName,
  lightwallet,
} from '@evan.network/ui-dapp-browser';

import {
  Http,
  Injectable,
  Observable,
  OnDestroy,
  Platform,
  Subscription,
} from '@evan.network/ui-angular-libs';

import {
  EvanAlertService,
  EvanBCCService,
  EvanBookmarkService,
  EvanVerificationService,
  EvanCoreService,
  EvanDescriptionService,
  EvanQueue,
  EvanRoutingService,
  QueueId,
  SingletonService,
} from '@evan.network/ui-angular-core';

/**************************************************************************************************/
/**
 * Utility service for the verification view DApp.
 */
@Injectable()
export class VerificationService {
  constructor(
    public bcc: EvanBCCService,
    public bookmarkService: EvanBookmarkService,
    public verifications: EvanVerificationService,
    public core: EvanCoreService,
    public descriptionService: EvanDescriptionService,
    public http: Http,
    public queue: EvanQueue,
    public routingService: EvanRoutingService,
    public singleton: SingletonService,
  ) {
    return singleton.create(VerificationService, this, () => {

    });
  }
}
