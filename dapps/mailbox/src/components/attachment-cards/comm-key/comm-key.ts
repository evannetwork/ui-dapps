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
  Profile
} from 'bcc';

import {
  Component, OnInit,      // @angular/core
  TranslateService,       // @ngx-translate/core
  Input, ChangeDetectorRef
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
  selector: 'attachment-comm-key',
  templateUrl: 'comm-key.html'
})

export class CommKeyComponent implements OnInit {
  @Input() attachment: any;
  @Input() mail: any;

  alreadyAddedKey: boolean;
  loading: boolean;
  sharedKeyExchangeQueue: QueueId;
  myAccountId: string;

  constructor(
    private alertService: EvanAlertService,
    private utils: EvanUtilService,
    private queue: EvanQueue,
    private core: EvanCoreService,
    private descriptionService: EvanDescriptionService,
    private bcc: EvanBCCService,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.ref.detach();
    this.myAccountId = this.core.activeAccount();

    this.sharedKeyExchangeQueue = new QueueId(
      this.descriptionService.getEvanENSAddress('mailbox'),
      'KeyExchangeDispatcher',
      'keyExchange'
    );

    this.bcc.profile
      .getContactKey(this.mail.content.from, 'commKey')
      .then(exchangeKey => {
        if (exchangeKey) {
          this.alreadyAddedKey = true;
        }
      });
    
    this.ref.detectChanges();
  }

  async showAlreadyAddedDialog(account: any) {
    return this
      .alertService.showSubmitAlert(
        '_dappmailbox.addAccount.alreadyAddedTitle',
        {
          key: '_dappmailbox.addAccount.alreadyAddedMessage',
          translateOptions: account
        },
        'ok',
      )
      .catch(ex => { });
  }

  async addAccount(): Promise<any> {
    let commKey;

    if (this.alreadyAddedKey) {
      await this.showAlreadyAddedDialog(this.mail.content);
    } else {
      try {
        this.loading = true;
        this.ref.detectChanges();

        const privateKey = await this.bcc.profile.getContactKey(
          this.core.activeAccount(),
          'dataKey'
        );
        const myPubKey = await this.bcc.profile.getPublicKey();
        this.bcc.keyExchange.setPublicKey(myPubKey, privateKey);

        let profile = this.bcc.getProfileForAccount(this.mail.content.from);
        const targetPubKey = await profile.getPublicKey();

        const commSecret = this.bcc.keyExchange.computeSecretKey(targetPubKey);
        if (this.mail.content.fromMail) {
          await this.bcc.profile.removeContact(this.mail.content.fromMail);
        }

        commKey = await this.bcc.keyExchange.decryptCommKey(this.attachment.key, commSecret.toString('hex'));
        await this.bcc.profile.addContactKey(this.mail.content.from, 'commKey', commKey.toString('utf-8'));
        await this.bcc.profile.addProfileKey(this.mail.content.from, 'alias', this.mail.content.fromAlias);
        if(this.mail.content.fromMail) {
          await this.bcc.profile.addProfileKey(this.mail.content.from, 'email', this.mail.content.fromMail);
        }
        this.queue.addQueueData(this.sharedKeyExchangeQueue, {
          type: 'store'
        });

        this.alreadyAddedKey = true;
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
