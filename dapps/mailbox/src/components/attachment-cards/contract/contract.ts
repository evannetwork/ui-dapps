/*
  Copyright (C) 2018-present evan GmbH. 
  
  This program is free software: you can redistribute it and/or modify it
  under the terms of the GNU Affero General Public License, version 3, 
  as published by the Free Software Foundation. 
  
  This program is distributed in the hope that it will be useful, 
  but WITHOUT ANY WARRANTY; without even the implied warranty of 
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
  See the GNU Affero General Public License for more details. 
  
  You should have received a copy of the GNU Affero General Public License along with this program.
  If not, see http://www.gnu.org/licenses/ or write to the
  
  Free Software Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA, 02110-1301 USA,
  
  or download the license from the following URL: https://evan.network/license/ 
  
  You can be released from the requirements of the GNU Affero General Public License
  by purchasing a commercial license.
  Buying such a license is mandatory as soon as you use this software or parts of it
  on other blockchains than evan.network. 
  
  For more information, please contact evan GmbH at this address: https://evan.network/license/ 
*/

import {
  Profile
} from 'bcc';

import {
  Component, OnInit,      // @angular/core
  TranslateService,       // @ngx-translate/core
  Input, Router,
  ChangeDetectorRef
} from 'angular-libs';

import {
  EvanAlertService,
  EvanUtilService,
  QueueId,
  EvanQueue,
  EvanCoreService,
  EvanDescriptionService,
  EvanBCCService
} from 'angular-core';

@Component({
  selector: 'attachment-contract',
  templateUrl: 'contract.html'
})

export class ContractComponent implements OnInit {
  @Input() attachment: any;
  @Input() mail: any;

  alreadyAdded: boolean;
  loading: boolean;
  sharedKeyExchangeQueue: QueueId;
  myAccountId: string;
  commKeyAttachment: any;

  constructor(
    private alertService: EvanAlertService,
    private utils: EvanUtilService,
    private queue: EvanQueue,
    private core: EvanCoreService,
    private descriptionService: EvanDescriptionService,
    private bcc: EvanBCCService,
    private router: Router,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.ref.detach();

    this.myAccountId = this.core.activeAccount();

    if (this.mail.content.attachments.length > 1) {
      const tempAttachments = [this.attachment];
      // check if there's a comm key twice
      this.mail.content.attachments.forEach((attachment) => {
        if (attachment.type === 'commKey') {
          this.commKeyAttachment = attachment;
        }
      });

      if (this.commKeyAttachment) {
        // found commKey, dont show the commKey button
        this.mail.content.attachments = tempAttachments;
      }
    }

    this.sharedKeyExchangeQueue = new QueueId(
      this.descriptionService.getEvanENSAddress('mailbox'),
      'KeyExchangeDispatcher',
      'keyExchange'
    );

    this.bcc.profile
      .getBcContract(this.attachment.bc, this.attachment.address)
      .then(contract => {
        if (contract) {
          this.alreadyAdded = true;
        }
      });

    this.ref.detectChanges();
  }

 /**
   * Show dialog to check if the user wants to add this account.
   *
   * @param dapp   Param object
   */
  async showAddContract(account: any): Promise<any> {
    return this
      .alertService.showSubmitAlert(
        '_dappmailbox.addContract.title',
        {
          key: '_dappmailbox.addContract.message',
          translateOptions: account
        },
        'cancel',
        'submit'
      );
  }

  async showAlreadyAddedDialog(account: any) {
    return this
      .alertService.showSubmitAlert(
        '_dappmailbox.addContract.alreadyAddedTitle',
        {
          key: '_dappmailbox.addContract.alreadyAddedMessage',
          translateOptions: account
        },
        'ok',
      )
      .catch(ex => { });
  }

  async addContract(): Promise<any> {
    if (this.alreadyAdded) {
      window.location.hash = `#/${ this.attachment.bc }/${ this.attachment.address }`;
    } else {
      try {
        await this.showAddContract(this.mail.content);
      } catch (ex) {
        return;
      }

      try {
        this.loading = true;
        this.ref.detectChanges();

        const contractDefinition = await this.bcc.description.getDescriptionFromContract(
          this.attachment.address,
          this.core.activeAccount()
        );
        const bcContract = contractDefinition.public;
        await this.bcc.profile.addBcContract(this.attachment.bc, this.attachment.address, bcContract);

        if (this.commKeyAttachment) {
          const privateKey = await this.bcc.profile.getContactKey(
            this.core.activeAccount(),
            'dataKey'
          );
          const myPubKey = await this.bcc.profile.getPublicKey();
          this.bcc.keyExchange.setPublicKey(myPubKey, privateKey);

          let profile = this.bcc.getProfileForAccount(this.mail.content.from);
          const targetPubKey = await profile.getPublicKey();

          const commSecret = this.bcc.keyExchange.computeSecretKey(targetPubKey);

          const commKey = await this.bcc.keyExchange.decryptCommKey(this.commKeyAttachment.key, commSecret.toString('hex'));
          await this.bcc.profile.addContactKey(this.mail.content.from, 'commKey', commKey.toString('utf-8'));
          await this.bcc.profile.addProfileKey(this.mail.content.from, 'alias', this.mail.content.fromAlias);
        }
        this.queue.addQueueData(this.sharedKeyExchangeQueue, {
          type: 'storeContracts'
        });
        
        window.location.hash = `#/${ this.attachment.bc }/${ this.attachment.address }`;
        this.alreadyAdded = true;
      } catch (ex) {
        return this
          .alertService.showSubmitAlert(
            '_dappmailbox.comm-key',
            '_dappmailbox.comm-key-error',
            'ok',
          )
          .catch(ex => { });
      }

      this.loading = false;
      this.ref.detectChanges();
    }
  }
}
