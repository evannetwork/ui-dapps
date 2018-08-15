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
  Component, OnInit,      // @angular/core
  TranslateService,       // @ngx-translate/core
  NavController,          // ionic-angular
  ActivatedRoute,
  Input, ChangeDetectorRef
} from 'angular-libs';

import {
  AnimationDefinition,
  createRouterTransition,
  createOpacityTransition,
  EvanTranslationService,
  EvanAddressBookService,
  EvanMailboxService,
  createTabSlideTransition,
  EvanCoreService,
  EvanBCCService,
  EvanRoutingService,
  AsyncComponent
} from 'angular-core';

/**************************************************************************************************/

@Component({
  selector: 'mail-detail',
  templateUrl: 'mail-detail.html',
  animations: [
    createOpacityTransition(),
    createTabSlideTransition()
  ]
})

export class MailDetailComponent extends AsyncComponent {
  public answers: any = [];
  public loading: boolean;
  public sending: boolean;
  public showAnswers: boolean;
  public profiles;
  public answer: any;
  public allAnswersCount: any;
  public loadAnswers: any;
  private myAccountId: string;

  @Input() mailId?: string;
  @Input() mail?: any;

  constructor(
    private core: EvanCoreService,
    public translate: EvanTranslationService,
    private mailService: EvanMailboxService,
    private route: ActivatedRoute,
    public addressbookService: EvanAddressBookService,
    private bcc: EvanBCCService,
    private routingService: EvanRoutingService,
    private ref: ChangeDetectorRef
  ) {
    super(ref);
  }

  async _ngOnInit() {
    this.myAccountId = this.core.activeAccount();
    this.mailId = this.mailId || this.routingService.getHashParam('id');
    this.answers = [ ];

    if (this.mail) {
      this.mailId = this.mail.id;
    }

    await this.getMail();

    if (this.myAccountId !== this.mail.content.from) {
      this.mailService.addReadMails(this.mailId);
    }

    this.mailService.syncLastReadCount();
  }

  async getMail() {
    this.loading = true;

    if (!this.mail) {
      this.mail = await this.mailService.getMail(this.mailId);
    }

    // set translation for id
    const i18n = {};
    i18n[this.mailId] = this.mail.content.title;
    this.translate.setTranslationToCurrentLanguage(i18n);

    this.profiles = await this.addressbookService.loadAccounts();

    await this.getInitialAnswers();

    this.loading = false;
  }

  async getInitialAnswers() {
    const answers = await this.getAnswers(0)
    this.answers = answers.sort((a, b) => {
      if (!a.content.sent || !b.content.sent) {
        return -1;
      }
      if (a.content.sent > b.content.sent) {
        return -1;
      }
      if (a.content.sent < b.content.sent) {
        return 1;
      }
    });
  }

  async loadMoreAnswers() {
    this.loadAnswers = true;
    this.ref.detectChanges();
    const newAnswers = await this.getAnswers(this.answers.length);

    this.answers = this.answers.concat(newAnswers).sort((a, b) => {
      if (!a.content.sent || !b.content.sent) {
        return -1;
      }
      if (a.content.sent > b.content.sent) {
        return -1;
      }
      if (a.content.sent < b.content.sent) {
        return 1;
      }
    });

    this.loadAnswers = false;
    this.ref.detectChanges();
  }

  async getAnswers(offset: number) {
    const answersObject = await this.bcc.mailbox.getAnswersForMail(this.mailId, 5, this.answers.length);
    this.allAnswersCount = answersObject.totalResultCount;

    return Object.keys(answersObject.mails)
      .map((key) => {
        const ret = {
          id: key,
          content: {
            sent: null
          }
        };
        if (answersObject.mails[key] == null) {
          return null;
        }
        Object.assign(ret, answersObject.mails[key]);
        return ret;
      })
      .filter((value) => value != null);
  }

  async sendAnswer() {
    this.sending = true;
    this.ref.detectChanges();

    let toAddress = this.mail.content.from;

    // if I send an answer to my own sent mail, switch to address to the other mail partner
    if (toAddress === this.myAccountId) {
      toAddress = this.mail.content.to;
    }

    await this.mailService.sendAnswer({
        parentId: this.mailId,
        content: {
          sent: new Date().getTime(),
          from: this.myAccountId,
          to: this.mail.content.from,
          title: this.mail.content.title,
          body: this.answer,
        }
      },
      this.myAccountId,
      this.mail.content.from
    )
    
    await this.getInitialAnswers();
    this.sending = false;
    this.answer = '';
    
    this.ref.detectChanges();
  }

  getHTMLMailBody(text: string) {
    if (text && text.replace) {
      return text.replace(/\n/g, '<br>');
    } else {
      return '';
    }
  }
}
