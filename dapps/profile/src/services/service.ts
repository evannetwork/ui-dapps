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

import {
  bccHelper,
  core,
  getDomainName,
  lightwallet,
} from 'dapp-browser';

import {
  Http,
  Injectable,
  Observable,
  OnDestroy,
  Platform, 
  Subscription,
} from 'angular-libs';

import {
  EvanAlertService,
  EvanBCCService,
  EvanBookmarkService,
  EvanCoreService,
  EvanDescriptionService,
  EvanPaymentService,
  EvanQueue,
  EvanRoutingService,
  QueueId,
  SingletonService,
} from 'angular-core';

/**************************************************************************************************/
/**
 * Utility service for the claim view DApp.
 */
@Injectable()
export class ProfileService implements OnDestroy {
  constructor(
    public bcc: EvanBCCService,
    public bookmarkService: EvanBookmarkService,
    public core: EvanCoreService,
    public descriptionService: EvanDescriptionService,
    public http: Http,
    public paymentService: EvanPaymentService,
    public queue: EvanQueue,
    public routingService: EvanRoutingService,
    public singleton: SingletonService,
  ) {
    return singleton.create(ProfileService, this, () => {

    });
  }
}
