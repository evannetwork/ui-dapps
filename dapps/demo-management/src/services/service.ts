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
  EvanCoreService,
  EvanDescriptionService,
  EvanQueue,
  EvanRoutingService,
  QueueId,
  SingletonService,
} from '@evan.network/ui-angular-core';

/**************************************************************************************************/
/**
 * Utility service for the demo generatior DApp.
 */
@Injectable()
export class DemoManagementService {
  /**
   * address for storing demo instances
   */
  public demoStorage: string = `demomanagement.${ getDomainName() }`;
  
  /**
   * all demos and it's specific data
   */
  public demos: any = {
    rental: {
      imgSquare: 'data:image/png;base64,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',
      primaryColor: '#2d4e47',
      secondaryColor: '#ffffff',
    }
  };

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
    return singleton.create(DemoManagementService, this, () => {

    });
  }

  /**
   * Return the queue id to watch for any action for a demo.
   *
   * @param      {any}      demo    demo to use
   * @return     {QueueId}  The handling queue identifier.
   */
  public getWatchQueueId(demo?: any): QueueId {
    return new QueueId(
      `demomanagement.${ getDomainName() }`,
      '*',
      demo && demo.address ? demo.address : undefined
    );
  }

  /**
   * Return the queue id for the handling dispatcher to add or remove demos.
   *
   * @param      {any}      demo    demo to use
   * @return     {QueueId}  The handling queue identifier.
   */
  public getHandlingQueueId(demo: any): QueueId {
    return new QueueId(
      `demomanagement.${ getDomainName() }`,
      'handlingDispatcher',
      demo.address
    );
  }

  /**
   * Return the queue id for the profile dispatcher to create profiles that corresponds to a demo.
   *
   * @param      {any}      demo    demo to use
   * @return     {QueueId}  The handling queue identifier.
   */
  public getProfilesQueueId(demo?: any): QueueId {
    return new QueueId(
      `demomanagement.${ getDomainName() }`,
      'profilesDispatcher',
      demo.address
    );
  }

  /**
   * Return the queue id for the contract structure creation dispatcher.
   *
   * @param      {any}   demo    demo to use
   * @return     {QueueId}  The handling queue identifier.
   */
  public getContractStructureQueueId(demo?: any): QueueId {
    return new QueueId(
      `demomanagement.${ getDomainName() }`,
      `${ demo.type }Dispatcher`,
      demo.address
    );
  }

  /**
   * Load all available demos for the current user.
   *
   * @return     {Array<any>}  all the demos.
   */
  public async getDemos(): Promise<Array<any>> {
    // load all demos from profile storage
    let demos = (await this.bcc.profile.getBcContracts(this.demoStorage)) || { };

    // remove crypto stuff
    bcc.Ipld.purgeCryptoInfo(demos);

    // load details
    const demoKeys = Object.keys(demos);
    if (demoKeys.length > 0) {
      await bcc.prottle(10, demoKeys.map(demoKey => async () => {
        demos[demoKey] = await this.bcc.profile.getBcContract(this.demoStorage, demoKey)
      }));
    }

    // load queue entries
    this.core.utils.deepCopy(
      this.queue.getQueueEntry(this.getWatchQueueId(), true).data
    ).forEach(entry => {
      if (entry.type === 'delete') {
        delete demos[entry.address];
      } else {
        demos[entry.address] = entry;
        entry.loading = true;         
      }
    });

    return Object.keys(demos).map(demoKey => demos[demoKey]);
  }

  /**
   * Load one demo detail
   *
   * @param      {string}      address  address of the demo that should be loaded.
   * @return     {Array<any>}  all the demos.
   */
  public async getDemo(address: string): Promise<Array<any>> {
    // load all demos from profile storage
    let demo = await this.bcc.profile.getBcContract(this.demoStorage, address);
    
    // load queue entries
    this.core.utils.deepCopy(
      this.queue.getQueueEntry(this.getWatchQueueId({ address }), true).data
    ).forEach(entry => {
      if (entry.address === address) {
        demo = entry;
        entry.loading = true;
      }
    });

    return demo;
  }

  /**
   * Remove all not needed data from a user.
   *
   * @param      {any}  user    a user object
   * @return     {any}  cleaned user object.
   */
  getClearUser(user: any) {
    const allowedProperties = [ 'mnemonic', 'password', 'alias', 'role', 'accountId' ];

    Object.keys(user).forEach(key => {
      if (allowedProperties.indexOf(key) === -1) {
        delete user[key];
      }
    });

    return user;
  }

  /**
   * Checks if a user is valid.
   *
   * @param      {any}      user            the user object that should be checked
   * @param      {boolean}  disableTimeout  use timeout or not?
   * @return     {boolean}  true if touched and invalid, else false
   */
  async checkUserStatus(context: any, user: any, disableTimeout?: boolean) {
    // only run the check all 1 seconds after the user changed something to reduce heavy data checks
    if (!disableTimeout) {
      if (user.checkTimeout) {
        window.clearTimeout(user.checkTimeout);
      }

      await new Promise((resolve) => {
        user.checkTimeout = setTimeout(() => resolve(), 1000)
      });
    }

    // finish the check, set an error, remove the laoding and 
    const finishCheck = (error: string) => {
      user.error = error;
      user.loading = false;
      context && context.ref.detectChanges();

      return user;
    };

    const activeElement: any = document.activeElement;
    user.loading = true;
    context && context.ref.detectChanges();

    const properties = [ 'alias', 'role', 'mnemonic', 'password' ];

    // check if anything is empty?
    for (let property of properties) {
      if (!user[property]) {
        return finishCheck(`_dm.user-data.${ property }.error`);
      }
    }

    // check if a valid mnemonic was entered
    if (!lightwallet.isValidMnemonic(user.mnemonic)) {
      return finishCheck(`_dm.user-data.mnemonic.error`);
    }

    // check minimum length of password
    if (user.password.length < 8) {
      return finishCheck(`_dm.user-data.password.error`);
    }

    // check if profile exists
    user.vault = await lightwallet.getNewVault(user.mnemonic, user.password);
    user.accountId = lightwallet.getAccounts(user.vault, 1)[0];
    user.isOnboared = await bccHelper.isAccountOnboarded(user.accountId);

    // if the user is onboarded, check if the password is correct
    if (user.isOnboared) {
      // is the password valid?
      user.isValidPassword = await bccHelper.isAccountPasswordValid(bcc, user.accountId,
        user.password);

      if (!user.isValidPassword) {
        return finishCheck(`_dm.user-data.password-wrong.error`);
      }
    }

    return finishCheck('');
  }

 /**
   * Load a new bcc profile instance for a given user.
   *
   * @param      {<type>}  user    The user
   * @return     {<type>}  The bcc profile for user.
   */
  public async getRuntimeForUser(user: any) {
    // load user status information
    await this.checkUserStatus(null, user);

    // create a new runtime
    return await bccHelper.createDefaultRuntime(
      bcc,
      user.accountId,
      user.vault.encryptionKey,
      lightwallet.getPrivateKey(user.vault, user.accountId),
    );
  }
}