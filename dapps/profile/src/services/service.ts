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
  /**
   * account address of the payment agent.
   */
  public agentAddress: string = '0xAF176885bD81D5f6C76eeD23fadb1eb0e5Fe1b1F';

  /**
   * Manager of the payment channel.
   */
  public channelManagerAddress: string = '0x0A0D9dddEba35Ca0D235A4086086AC704bbc8C2b'

  /**
   * Url to the payment agent server.
   */
  public ipfsPaymentBase: string = `https://payments.evan.network/api/ipfs-payments`

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
    return singleton.create(ProfileService, this, () => {

    });
  }

  /**
   * Send an rest get request to the payment agent using the corresponding new build headers.
   *
   * @param      {string}        endPoint  endpoint that should be called using this.agentEndpoint
   * @return     {Promise<any>}  json result of the request
   */
  public async requestPaymentAgent(endPoint: string): Promise<any> {
    const activeAccount = this.core.activeAccount();
    const toSignedMessage = this.bcc.web3.utils
      .soliditySha3(new Date().getTime() + activeAccount)
      .replace('0x', '');
    const hexMessage = this.bcc.web3.utils.utf8ToHex(toSignedMessage);
    const signature = await this.signMessage(toSignedMessage, activeAccount);
    const headers = {
      authorization: `EvanAuth ${ activeAccount },EvanMessage ${ hexMessage },EvanSignedMessage ${ signature }`
    };

    return (await this.http
      .get(`${ this.ipfsPaymentBase }/${ endPoint }`, {headers})
      .toPromise()
    ).json();
  }

  /**
   * Sign a message for a specific account
   *
   * @param      {string}  msg      message that should be signed
   * @param      {string}  account  account id to sign the message with (default = activeAccount)
   * @return     {string}  signed message signature
   */
  public async signMessage(msg: string, account: string = this.core.activeAccount()): Promise<string> {
    const signer = account.toLowerCase();
    const pk = await this.bcc.executor.signer.accountStore.getPrivateKey(account);

    return this.bcc.web3.eth.accounts.sign(msg, '0x' + pk).signature;
  }
}
