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

// vue imports
import Component, { mixins } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

// evan.network imports
import { EvanComponent } from '@evan.network/ui-vue-core';
import { FileHandler, profileUtils } from '@evan.network/ui';
import * as bcc from '@evan.network/api-blockchain-core';

import * as dispatchers from '../../../../dispatchers/registry';
import { notarySmartAgentAccountId } from '../notary.lib';

@Component({ })
export default class TopicDisplayComponent extends mixins(EvanComponent) {
  /**
   * label that should be used to be displayed before the verification topic
   */
  @Prop() title;

  /**
   * address for the verification that should be loaded
   */
  @Prop() topic;

  /**
   * address for the contract / account / multi sig for that the verifcations should be checked
   */
  @Prop() address;

  /**
   * ui status flags
   */
  loading = true;

  accepting = false;

  /**
   * verification details
   */
  verification: bcc.VerificationsResultV2 = null;

  /**
   * Company name that was saved within the verification
   */
  companyName = '';

  /**
   * Expiration date of the verification
   */
  expirationDate: number;

  /**
   * flag is verification is expired
   */
  isExpired = true;

  /**
   * translate text for expiration state of verification
   */
  expiredTranslationString = '';

  /**
   * All files that are available for the verifications (e.g.: notary certified documents)
   */
  files: Array<any> = [];

  /**
   * listen for dispatcher updates
   */
  listeners: Array<Function> = [];

  /**
   * Name of the issuer, so it will be more understandable for the user
   */
  issuerName = '';

  issuer = '';

  /**
   * Load verification details.
   */
  async created() {
    this.listeners.push(dispatchers.verificationAcceptDispatcher
      .watch(async ($event) => {
        // if dispatcher has finished loading, reload the data
        if ($event.detail.status === 'finished') {
          await this.loadVerification();
          this.accepting = false;
        }
      }));

    await this.checkLoading();
    await this.loadVerification();

    this.loading = false;
  }

  /**
   * Clear listeners...
   */
  beforeDestroy() {
    this.listeners.forEach((listener) => listener());
  }

  /**
   * check if currently a verification gets accepted.
   */
  async checkLoading() {
    const runtime: bcc.Runtime = (<any> this).getRuntime();
    const instances = await dispatchers.verificationAcceptDispatcher.getInstances(runtime);

    this.accepting = instances.length !== 0;
  }

  /**
   * Load verification details for the current topic, ensuring, they are created by the evan ens
   * root owner.
   */
  async loadVerification() {
    const runtime: bcc.Runtime = (<any> this).getRuntime();

    // reset loaded files
    this.files = [];
    /* load the verification details
       allow only ens root owner and notary smart agent */
    const allowedVerificationAccounts = [
      // ens root owner
      '0x4a6723fC5a926FA150bAeAf04bfD673B056Ba83D',
      // notary smart agent
      notarySmartAgentAccountId,
    ];
    const verificationQuery = JSON.parse(JSON.stringify(runtime.verifications.defaultQueryOptions));
    verificationQuery.validationOptions.issued = bcc.VerificationsStatusV2.Yellow;
    verificationQuery.validationOptions.expired = bcc.VerificationsStatusV2.Red;
    verificationQuery.validationOptions.parentUntrusted = bcc.VerificationsStatusV2.Green;
    verificationQuery.validationOptions.selfIssued = bcc.VerificationsStatusV2.Green;
    verificationQuery.validationOptions.notEnsRootOwner = (verification, pr) => {
      /* trust root verifications issued by root account
         subject does not need to be root account as well */
      if (allowedVerificationAccounts.indexOf(verification.details.issuer) !== -1) {
        return bcc.VerificationsStatusV2.Green;
      }
      return bcc.VerificationsStatusV2.Red;
    };
    // load nested verifications
    this.verification = await runtime.verifications.getNestedVerificationsV2(
      this.address,
      this.topic,
      false,
      verificationQuery,
    );

    await Promise.all(this.verification.verifications.map(async (subVerification) => {
      try {
        const contentKey = await (<any> this).$store.state.profileDApp.profile.getBcContract(
          'contracts',
          runtime.web3.utils.soliditySha3(`verifications,${subVerification.details.id},contentKey`),
        );
        const hashKey = await (<any> this).$store.state.profileDApp.profile.getBcContract(
          'contracts',
          runtime.web3.utils.soliditySha3(`verifications,${subVerification.details.id},hashKey`),
        );
        const fileHash = JSON.parse(subVerification.details.data);

        if (fileHash !== '0x0000000000000000000000000000000000000000000000000000000000000000') {
          if (subVerification.details.topic === '/evan/company') {
            const hashFiles = await (<any>runtime.dfs).get(fileHash);
            const foundFiles = JSON.parse(hashFiles);
            for (const file of foundFiles) {
              file.file = await (<any>runtime.dfs).get(file.file, true);
              file.size = file.file.length;
              this.files.push(await FileHandler.fileToContainerFile(file));
            }
          } else {
            const cryptoAlgorithFiles = 'aesBlob';
            const cryptoAlgorithHashes = 'aesEcb';
            const encodingEncrypted = 'hex';
            const encodingUnencryptedHash = 'hex';
            const hashCryptor = runtime.cryptoProvider.getCryptorByCryptoAlgo('aesEcb');
            const dencryptedHashBuffer = await hashCryptor.decrypt(
              Buffer.from(fileHash.substr(2), encodingUnencryptedHash), { key: hashKey },
            );

            const retrieved = await (<any>runtime.dfs).get(`0x${dencryptedHashBuffer.toString('hex')}`, true);
            const cryptor = runtime.cryptoProvider.getCryptorByCryptoAlgo(cryptoAlgorithFiles);
            const decrypted = await cryptor.decrypt(retrieved, { key: contentKey });

            if (decrypted.companyName) {
              this.companyName = decrypted.companyName;
            }

            if (decrypted) {
              for (const file of decrypted) {
                file.size = file.file.length;
                this.files.push(await FileHandler.fileToContainerFile(file));
              }
            }
          }
        }
      } catch (ex) {
        runtime.logger.log(`Could not decrypt verification files: ${ex.message}`, 'error');
      }
    }));

    // get the issuer info, so it can be displayed
    this.issuer = this.verification.verifications[0].details.issuer;

    // get expiration date and set options depending on it
    this.expirationDate = this.verification.verifications[0].details.expirationDate || undefined;
    this.isExpired = !!this.verification.verifications[0].statusFlags && this.verification.verifications[0].statusFlags.includes('expired');
    if (this.isExpired) {
      this.expiredTranslationString = this.expirationDate
        ? (<any> this).$t('_profile.verifications.notary.verification.expired-on')
        : (<any> this).$t('_profile.verifications.notary.verification.expired');
    } else {
      this.expiredTranslationString = this.expirationDate
        ? (<any> this).$t('_profile.verifications.notary.verification.valid-until')
        : (<any> this).$t('_profile.verifications.notary.verification.valid-indefinitely');
    }

    // check for predefined instances
    if (this.issuer === notarySmartAgentAccountId) {
      this.issuerName = (<any> this).$t('_profile.verifications.notary.notary');
    } else {
      // load from addressbook
      const addressbook = await (<any> this).$store.state.profileDApp.profile.getAddressBook();
      if (addressbook[this.issuer] && addressbook[this.issuer].alias) {
        this.issuerName = addressbook[this.issuer];
      } else {
        this.issuerName = this.issuer;
      }
    }
  }

  /**
   * Start the accept verification dispatcher for the current account.
   */
  acceptVerification() {
    this.accepting = true;

    // just accept the first verification
    dispatchers.verificationAcceptDispatcher.start(
      (<any> this).getRuntime(),
      {
        address: this.address,
        id: this.verification.verifications[0].details.id,
        topic: this.topic,
      },
    );
  }

  /**
   * Open the detail swipe panel for the current topic.
   */
  async showDetail() {
    // try to load company name from profile registration container
    if (!this.companyName) {
      const runtime: bcc.Runtime = (<any> this).getRuntime();
      const { profileDApp } = (this as any).$store.state;
      this.companyName = (await profileUtils.getUserAlias(runtime, profileDApp.address,
        profileDApp.accountDetails)) || runtime.activeAccount;
    }

    (this as any).$store.commit('toggleSidePanel', this.topic);
  }
}
