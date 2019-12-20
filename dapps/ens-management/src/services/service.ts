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
  Ipld,
  NameResolver,
  logLog,
  logLogLevel,
} from '@evan.network/api-blockchain-core';

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
export class ENSManagementService {
  /**
   * ens address, when nothing is set
   */
  public nullAddress = '0x0000000000000000000000000000000000000000';

  /**
   * ens domain that should be used for resolving the ens addresses
   */
  public domainName = getDomainName();

  /**
   * nameResolver instance initialized with the latest ens contract address to handle correct payment
   */
  public nameResolver: any;

  constructor(
    public bcc: EvanBCCService,
    public bookmarkService: EvanBookmarkService,
    public core: EvanCoreService,
    public descriptionService: EvanDescriptionService,
    public http: Http,
    public queue: EvanQueue,
    public routingService: EvanRoutingService,
    public singleton: SingletonService,
  ) {
    return singleton.create(ENSManagementService, this, () => {
      const customNameResolver = this.core.utils.deepCopy(this.bcc.config.nameResolver);

      // set the custom ens contract address
      if (this.bcc.coreRuntime.environment === 'testcore') {
        this.domainName = 'payable';
        customNameResolver.ensAddress = '0xE6ed5Ed9CF1a62f88866ef9cE2dF94e996685456';
        customNameResolver.ensResolver = '0xC629135777FDC078dbbBa5b2d244a71835f4a091';
      }

      this.nameResolver = new NameResolver({
        config: customNameResolver,
        contractLoader: this.bcc.contractLoader,
        executor: this.bcc.executor,
        logLog: logLog,
        logLogLevel: logLogLevel,
        web3: this.bcc.web3,
      });
    });
  }

  /**
   * Return the queue id to watch for any action .
   *
   * @param      {string}   dispatcher  optional name of the dispatcher (default is * = watch
   *                                    everything)
   * @param      {string}   id          optional id for the queue id
   * @return     {QueueId}  The handling queue identifier.
   */
  public getQueueId(dispatcher: string = '*', id: string = '*'): QueueId {
    return new QueueId(`ensmanagement.${ getDomainName() }`, dispatcher, id);
  }

  /**
   * Return all ens addresses that were pinned by me and try to laod a dbcp description for this
   * address.
   *
   * @return     {Array<any>}  object including ens address
   */
  public async getPinnedEnsAddresses() {
    const ensAddressObject = (await this.bcc.profile.getBcContracts('evan-ens-management') || { });
    const defaultDescription = await this.descriptionService
      .getDescription(`dashboard.${ getDomainName() }`);

    // purge crypto info
    Ipld.purgeCryptoInfo(ensAddressObject)

    return await Promise.all(Object.keys(ensAddressObject).map(async (ensAddress) => {
      const description = await this.descriptionService.getDescription(ensAddress);

      // prefill empty suqare img
      description.imgSquare = description.imgSquare || defaultDescription.imgSquare;

      return { description, ensAddress, };
    }));
  }

  /**
   * Gets the owner for a specific ens address
   *
   * @param      {string}  ensAddress  the ens address that should be checked
   * @return     {string}  owner or nullAddress
   */
  public async getOwner(ensAddress: string) {
    let owner = this.nullAddress;

    try {
      // load the current owner of the ens address
      const namehash = this.nameResolver.namehash(ensAddress);
      owner = await this.bcc.executor.executeContractCall(
        this.nameResolver.ensContract, 'owner', namehash);
    } catch (ex) {
      this.core.utils.log(ex, 'error');
    }

    return owner;
  }
}