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

// vue imports
import Vue from 'vue';
import axios from 'axios';
import Component, { mixins } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

// evan.network imports
import { EvanComponent } from '@evan.network/ui-vue-core';
import { FileHandler, } from '@evan.network/ui';
import * as bcc from '@evan.network/api-blockchain-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';

import * as dispatchers from '../../../../../dispatchers/registry';

@Component({ })
export default class IdentNotaryVerificationComponent extends mixins(EvanComponent) {
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
   * All files that are available for the verifications (e.g.: notary certified documents)
   */
  files: Array<any> = [ ];

  /**
   * listen for dispatcher updates
   */
  listeners: Array<Function> = [ ];

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
    this.listeners.forEach(listener => listener());
  }

  /**
   * check if currently a verification gets accepted.
   */
  async checkLoading() {
    const runtime: bcc.Runtime = (<any>this).getRuntime();
    const instances = await dispatchers.verificationAcceptDispatcher.getInstances(runtime);

    this.accepting = instances.length !== 0;
  }

  /**
   * Load verification details for the current topic, ensuring, they are created by the evan ens
   * root owner.
   */
  async loadVerification() {
    const runtime: bcc.Runtime = (<any>this).getRuntime();

    // load the verification details
    // TODO: add use correct ens root owner
    const rootVerificationAccount = '0x74479766e4997F397942cc607dc59f7cE5AC70b2';
    const verificationQuery = JSON.parse(JSON.stringify(runtime.verifications.defaultQueryOptions));
    verificationQuery.validationOptions.issued = bcc.VerificationsStatusV2.Yellow;
    verificationQuery.validationOptions.parentUntrusted = bcc.VerificationsStatusV2.Green;
    verificationQuery.validationOptions.selfIssued = bcc.VerificationsStatusV2.Green;

    // load nested verifications
    this.verification = await runtime.verifications.getNestedVerificationsV2(
      this.address,
      this.topic,
      false,
      verificationQuery,
    );

    // TODO: add correct file handling
    // https://api-blockchain-core.readthedocs.io/en/latest/profile/verification-usage-examples.html
    // ?highlight=verifications#encrypted-data-in-verifications
    const unencrypted = { foo: 'bar' };
    const cryptoInfo = await runtime.encryptionWrapper.getCryptoInfo('test', <any>'custom');
    const key = await runtime.encryptionWrapper.generateKey(cryptoInfo);
    this.verification.verifications
      .forEach(async (subVerification) => {
        try {

          const contentKey = 'f88922ba42628642a029922a2b8512d93f3d277ca3e129943c612d9a8bf67969'
          const hashKey = 'bdf85cdde8854f3017a2996015fc3c326c396be4e9362827cc3641201bd7361f'
          const fileHash = JSON.parse(subVerification.details.data);

          if (fileHash !== '0x0000000000000000000000000000000000000000000000000000000000000000') {
            const cryptoAlgorithFiles = 'aesBlob'
            const cryptoAlgorithHashes = 'aesEcb'
            const encodingEncrypted = 'hex'
            const encodingUnencryptedHash = 'hex'
            const hashCryptor = runtime.cryptoProvider.getCryptorByCryptoAlgo('aesEcb')
            const dencryptedHashBuffer = await hashCryptor.decrypt(
              Buffer.from(fileHash.substr(2), encodingUnencryptedHash), { key: hashKey })

            const retrieved = await (<any>runtime.dfs).get('0x' + dencryptedHashBuffer.toString('hex'), true);
            const cryptor = runtime.cryptoProvider.getCryptorByCryptoAlgo(cryptoAlgorithFiles)
            const decrypted = await cryptor.decrypt(retrieved, { key: contentKey });

            if (decrypted) {
              for (let file of decrypted) {
                file.size = file.file.length;
                this.files.push(await FileHandler.fileToContainerFile(file));
              }
            }
          }

        } catch (ex) {
          runtime.logger.log(`Could not decrypt verification files: ${ ex.message }`, 'error');
        }
      });
  }

  /**
   * Start the accept verification dispatcher for the current account.
   */
  acceptVerification() {
    this.accepting = true;

    // just accept the first verification
    dispatchers.verificationAcceptDispatcher.start(
      (<any>this).getRuntime(),
      {
        address: this.address,
        id: this.verification.verifications[0].details.id,
        topic: this.topic,
      }
    );
  }
}
