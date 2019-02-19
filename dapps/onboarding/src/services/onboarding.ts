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
  lightwallet,
  routing,
  utils,
  evanGlobals,
  getDomainName,
} from 'dapp-browser';

import {
  Profile
} from 'bcc';

import {
  Router,             // '@angular/router';
  OnInit, Injectable, // '@angular/core';
  Observable, CanActivate,
  Http, Response, RequestOptions, Headers       // @angular/http
} from 'angular-libs';

import {
  EvanAddressBookService,
  EvanAlertService,
  EvanBCCService,
  EvanCoreService,
  EvanOnboardingService,
  EvanRoutingService,
  SingletonService,
} from 'angular-core';

/**************************************************************************************************/

let baseUrlFaucet;
let baseUrlOnboarding;

@Injectable()
export class OnboardingService {
  public activeVault: any;
  public activeAccount: string;
  public captchaToken: string;
  public alias: string;

  constructor(
    private addressBookService: EvanAddressBookService,
    private alertService: EvanAlertService,
    private bcc: EvanBCCService,
    private core: EvanCoreService,
    private http: Http,
    private onboardingService: EvanOnboardingService,
    private routingService: EvanRoutingService,
    private singleton: SingletonService,
    private routing: EvanRoutingService,
  ) {
    return singleton.create(OnboardingService, this, () => {
      baseUrlFaucet = this.core.agentUrl + '/api/smart-agents/faucet/';
      baseUrlOnboarding = this.core.agentUrl + '/api/smart-agents/onboarding/';
    });
  }

  setActiveVault(vault, accountId) {
    this.activeVault = vault;
    this.activeAccount = accountId;
  }

  /**
   * Check if currently a user is signed in and redirect him to the onboarded page.
   *
   * @return     {boolean}  true when already logged in
   */
  async checkLoggedInAndOnboarded() {
    let isOnboarded = false;

    if (this.core.getAccountId()) {
      try {
        isOnboarded = await evanGlobals.CoreBundle.isAccountOnboarded(this.core.getAccountId());
      } catch (ex) { }

      if (isOnboarded) {
        this.routing.navigate(`/onboarding.${ getDomainName() }/onboarded`, true,
          this.routing.getQueryparams());
      }
    }

    return isOnboarded;
  }

  async sendCommKey(accountId: string) {
    const queryParams = this.routingService.getQueryparams();

    if (queryParams.onboardingID) {
      await this.bcc.profile.loadForAccount(accountId, this.bcc.profile.treeLabels.addressBook);
      let profile = this.bcc.getProfileForAccount(queryParams.inviteeAddress);
      const targetPubKey = await profile.getPublicKey();

      if (!targetPubKey) {
        throw new Error(`No public key found for account ${queryParams.inviteeAddress}`);
      }
      const commKey = await this.bcc.keyExchange.generateCommKey();
      // add key to profile
      await this.bcc.profile.addContactKey(
        queryParams.inviteeAddress,
        'commKey',
        commKey
      );

      await this.bcc.profile.addProfileKey(
        queryParams.inviteeAddress, 'alias', queryParams.inviteeAlias
      );

      await this.bcc.profile.storeForAccount(this.bcc.profile.treeLabels.addressBook);

      const alias = await this.addressBookService.activeUserName();
      const mail = {
        title: this.core.translate.instant('_dapponboarding.mail-invitation-accepted.title'),
        body: this.core.translate.instant('_dapponboarding.mail-invitation-accepted.body', {
          userEmail: queryParams.email,
          userAlias: alias
        }),
        fromAlias: alias,
        fromMail: queryParams.email
      }
      await this.bcc.keyExchange.sendInvite(queryParams.inviteeAddress, targetPubKey, commKey, mail);
    }
  }

  /**
   * Get mnemonic from dummy vault and use the correct password to decrypt it. And set it active.
   * @param password  password to use
   */
  async updateActiveAccountAndUnlock(password?: string) {
    const mnemonic = this.activeVault
      .getSeed(this.activeVault.pwDerivedKey);

    lightwallet.createVaultAndSetActive(mnemonic, password);
  }

  /**
   * Creates a vault from an mnemonic with an dummy password for onboarding purposes
   *
   * @param mnemonic mnemonic use
   */
  async getDummyVault(mnemonic: string) {
    return await lightwallet.getNewVault(mnemonic, 'evan');
  }

  /**
   * Check if the account id is onboarded.
   * When he is onboarded, set a dummy vault, get the password with global-password input from user.
   * And finish onboarding. Else navigate to onboarding screen.
   *
   * @param dummyVault  an dummy vault with the dummy password
   * @param mnemonic    ogirinal menmonic
   * @param accountId   account id to use from the vault
   * @param provider    current provider (identity-create, identity-import)
   */
  async checkImportedDummyVault(dummyVault: any, mnemonic: string, accountId: string, provider: string) {
    const isOnboarded = await this.onboardingService.isOnboarded(accountId);

    if (isOnboarded) {
      const queryParams = this.routingService.getQueryparams();
      const password = await lightwallet.getPassword(accountId);

      await lightwallet.createVaultAndSetActive(mnemonic, password);

      // send communication key back to the onboarding account
      this.core.setCurrentProvider('internal');
      await this.bcc.updateBCC(accountId, 'internal');
      await this.bcc.updateTermsOfUse(accountId);

      if (queryParams && queryParams.onboardingID) {
        return this.routingService.navigate(`./onboarded`, true,
          this.onboardingService.getOnboardingQueryParams());
      } else {
        this.onboardingService.finishOnboarding();
      }
    } else {
      this.setActiveVault(dummyVault, accountId);

      return this.routingService.navigate(`./terms-of-use/${provider}`, true,
        this.onboardingService.getOnboardingQueryParams());
    }
  }

  signMessageBCC(msg: string, account: string) {
    const signer = account.toLowerCase();
    const pk = '0x' + this.activeVault.exportPrivateKey(signer, this.activeVault.pwDerivedKey);
    return this.bcc.web3.eth.accounts.sign(msg, pk).signature;
  }

  async signMessageMetamask(msg: string, account: string) {
    const signer = account.toLowerCase();

    const msgHex = window['web3'].fromUtf8(msg);
    
    return new Promise((resolve, reject) => {
      window['web3'].currentProvider.sendAsync({
        method: 'personal_sign',
        params: [msgHex, signer],
        from: signer
      }, (err, result) => {
        if (err || result.error) reject();
        else resolve(result.result)
      });
    });
  }

  async signMessage(msg: string, account: string, provider: string) {
    if (provider == 'metamask') {
      return this.signMessageMetamask(msg, account);
    } else {
      return this.signMessageBCC(msg, account);
    }
  }

  /**
    * The faucet smart-agent (ex - etherconsole)
    * gives away EVEs for testcore chain via different channels
    */
  public faucet = {
    // path: 'faucet/',
    path: '',

    /**
     * give EVEs to given account
     *
     * @param account     account ID / externally owned account, string starting with 0x
     * @param provider    'metamask' || 'internal'
     */

    handout: async (account: string, provider = 'internal') => {
      const apiURL = baseUrlFaucet + this.faucet.path + 'handout?apiVersion=1';
      const msgString = 'Gimme Gimme Gimme!';   // needs to be the same as in onboarding smartagent
      const signature = await this.signMessage(msgString, account, provider);
      const result = await this.http.post(apiURL,
        { 'accountId': account, 'signature': signature }).toPromise();
      return result.json()
    }

  };

  public onboarding = {
    path: '',

    /**
     * creates an account and the profile
     *
     * @param account     account ID / externally owned account, string starting with 0x
     * @param alias       profile login name
     * @param password    profile password
     * @param provider    'metamask' || 'internal'
     */
    create: async (account: string, alias: string, password: string, provider: string) => {
      await this.bcc.updateBCC(account, provider, true);

      this.bcc.keyProvider.setKeysForAccount(
        account,
        lightwallet.getEncryptionKeyFromPassword(account, password)
      );

      // set flag to check for profile creation interruption
      window.localStorage['evan-profile-creation'] = true;

      const profile = this.bcc.profile;
      if (provider === 'metamask') {
        this.core.setAccountId(account || this.activeAccount);
      } else {
        this.core.setAccountId(account || this.activeAccount);
        const mnemonic = this.activeVault.getSeed(this.activeVault.pwDerivedKey);
        await lightwallet.createVaultAndSetActive(mnemonic, password);
      }

      // disable pinning while profile files are being created
      profile.ipld.ipfs.disablePin = true;
      // clear hash log
      profile.ipld.hashLog = [];
      const dhKeys = this.bcc.keyExchange.getDiffieHellmanKeys();
      await profile.addContactKey(account, 'dataKey', dhKeys.privateKey.toString('hex'));
      await profile.addProfileKey(account, 'alias', alias);
      this.alias = alias;
      await profile.addPublicKey(dhKeys.publicKey.toString('hex'));
      const sharing = await this.bcc.dataContract.createSharing(account);
      const fileHashes = <any>{};
      fileHashes[profile.treeLabels.addressBook] = await profile.storeToIpld(profile.treeLabels.addressBook);
      fileHashes[profile.treeLabels.publicKey] = await profile.storeToIpld(profile.treeLabels.publicKey);
      fileHashes.sharingsHash = sharing.sharingsHash;
      const cryptor = this.bcc.cryptoProvider.getCryptorByCryptoAlgo('aesEcb');
      fileHashes[profile.treeLabels.addressBook] = await cryptor.encrypt(
        this.bcc.CoreBundle.buffer.from(fileHashes[profile.treeLabels.addressBook].substr(2), 'hex'),
        { key: sharing.hashKey, }
      )
      fileHashes[profile.treeLabels.addressBook] = `0x${fileHashes[profile.treeLabels.addressBook].toString('hex')}`;
      // keep only unique values as ipfs hashes
      fileHashes.ipfsHashes = [...new Set([...profile.ipld.hashLog, ...Object.values(fileHashes)])];
      // clear hash log
      profile.ipld.hashLog = [];
      // re-enable pinning
      profile.ipld.ipfs.disablePin = false;
      const generationResult = await this.onboarding.sendProfileCreationCall(account, fileHashes, provider);
      // temporary execution of setMyProfile
      const profileIndexDomain = this.bcc.nameResolver.getDomainName(this.bcc.nameResolver.config.domains.profile);
      const address = await this.bcc.nameResolver.getAddress(profileIndexDomain);  
      const contract = this.bcc.nameResolver.contractLoader.loadContract('ProfileIndexInterface', address);  

      // finished profile creation successfully
      delete window.localStorage['evan-profile-creation'];
    },

    /**
     * accepts a bmail invitation, creates an account and the profile, and verifications the bmail funds
     * 
     * @param account      account ID / externally owned account, string starting with 0x
     * @param invitation   invitation token from invitation URL in bmail
     */
    accept: async (account: string, invitation: string) => {
      var apiURL = baseUrlOnboarding + this.onboarding.path + `accept?accountId=${account}&invitationId=${invitation}`;

      try { const result = await this.http.get(apiURL).toPromise(); }
      catch (ex) { return false; }

      return true;
    },
    /**
     * sends a profile creation request to the smart agent, which creates a new profile
     *
     * @param accountId      account ID / externally owned account, string starting with 0x
     * @param profileInfo  prefilled Profile details for the creation 
     * @param provider     signing provider (defaults to internal) 
     */
    sendProfileCreationCall: async (accountId: string, profileInfo: any, provider = 'internal') => {
      var apiURL = baseUrlFaucet + this.faucet.path + 'handout?apiVersion=1';
      const msgString = 'Gimme Gimme Gimme!';   // needs to be the same as in onboarding smartagent
      const signature = await this.signMessage(msgString, accountId, provider);
      try { 
        const result = await this.http.post(apiURL,
          { accountId, signature, profileInfo, captchaToken: this.captchaToken }).toPromise();
        return result.json();
      }
      catch (ex) { return false; }
    },
  };
}
