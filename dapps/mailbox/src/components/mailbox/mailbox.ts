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
  Component, OnInit,      // @angular/core
  TranslateService,       // @ngx-translate/core
  NavController,          // ionic-angular
  ActivatedRoute, Router, RouterEvent, NavigationEnd,
  DomSanitizer, OnDestroy,
  ChangeDetectorRef
} from 'angular-libs';

import {
  AnimationDefinition,
  createOpacityTransition,
  EvanRoutingService,
  EvanMailboxService,
  createTabSlideTransition,
  EvanCoreService,
  EvanUtilService,
  EvanQueue,
  EvanAddressBookService,
  EvanTranslationService,
  AsyncComponent
} from 'angular-core';

/**************************************************************************************************/

@Component({
  selector: 'mailbox',
  templateUrl: 'mailbox.html',
  animations: [
    createOpacityTransition(),
    createTabSlideTransition()
  ]
})

export class MailboxComponent extends AsyncComponent {
  private loading: boolean;
  private addressBook: any;
  private groupedMails: Array<any>;
  private reloadOutlet: boolean;
  private loadMore: boolean;
  private activeMail: string;
  private screenSize: number;
  private accountId: string;
  private showFromMe: boolean;
  private showOthers: boolean;
  private filterString: string;
  private showFilters: boolean;
  private addressBookLoaded: boolean;
  public showSent: boolean;
  private clearSendMailQueue: Function;
  private clearAddressBookQueue: Function;
  private watchRouteChange: Function;

  private watchWindowSize: Function;

  constructor(
    private core: EvanCoreService,
    private mailService: EvanMailboxService,
    private routingService: EvanRoutingService,
    private router: Router,
    private route: ActivatedRoute,
    private _DomSanitizer: DomSanitizer,
    private utils: EvanUtilService,
    private queueService: EvanQueue,
    private addressBookService: EvanAddressBookService,
    private translate: EvanTranslationService,
    private ref: ChangeDetectorRef
  ) {
    super(ref);
  }

  async _ngOnInit() {
    this.accountId = this.core.activeAccount();
    this.addressBook = { };
    this.groupedMails = [];

    this.showFromMe = true;
    this.showOthers = true;
    this.loading = false;
    this.watchWindowSize = await this.utils.windowSize(async (width) => {
      this.screenSize = width;

      await this.initialLoad();
    });

    this.clearSendMailQueue = await this.queueService
      .onQueueFinish(this.mailService.sendMailQueueId, async (reload) => {
        await this.initialLoad(reload);
      });

    this.clearAddressBookQueue = await this.queueService
      .onQueueFinish(this.addressBookService.queueId, async (reload) => {
        await this.initialLoad(reload);
      });
    
    this.watchRouteChange = this.routingService.subscribeRouteChange(() => this.initialLoad());
    this.mailService.syncLastReadCount();
  }

  async _ngOnDestroy() {
    this.clearSendMailQueue();
    this.clearAddressBookQueue();
    this.watchRouteChange();
    this.watchWindowSize();
  }

  async initialLoad(reload?: boolean) {
    if (!this.loading &&
      (!this.addressBookLoaded || reload) &&
      (!this.getActiveMailId() || this.screenSize > 1100)) {
      this.addressBookLoaded = true;

      this.loading = true;
      this.ref.detectChanges();

      this.addressBook = await this.addressBookService.loadAccounts();
      await this.mailService.getMails();

      this.filter();

      this.loading = false;
      this.ref.detectChanges();
    } else {
      this.ref.detectChanges();
    }
  }

  getActiveMailId(): string {
    if (this.route.children.length > 0) {
      return this.route.children[0].snapshot.params['id'];
    } else {
      return this.route.snapshot.params['id'];
    }
  }

  getDayDateTime(date: number) {
    date = date || (new Date(0)).getTime();

    const formattedDate = new Date(date);

    return new Date(
      formattedDate.getFullYear(),
      formattedDate.getMonth(),
      formattedDate.getDate()
    ).getTime();
  }

  filter($event?: any) {
    let mails = [ ];
    let value = this.filterString || '';

    if ($event) {
      value = $event.value || '';
    }
    if (this.showSent) {
      mails = this.mailService.sentMails;
    } else {
      mails = this.mailService.receivedMails;
    }

    mails = mails
      .filter(mail => {
        return JSON.stringify(mail)
          .toLowerCase()
          .includes(value.toLowerCase());
      })
      .filter((mail: any) => {
        if (!mail.content) {
          return false;
        }

        if (!this.showFromMe && mail.content.from === this.accountId) {
          return false;
        }

        if (!this.showOthers && mail.content.from !== this.accountId) {
          return false;
        }

        return true;
      });

    this.groupedMails = [ ];
    for (let i = 0; i < mails.length; i++) {
      mails[i].content.sent = mails[i].content.sent || (new Date(0));

      const sent = this.getDayDateTime(mails[i].content.sent);
      let found = false;

      for (let x = 0;  x < this.groupedMails.length; x++) {
        if (this.groupedMails[x].sent === this.getDayDateTime(mails[i].content.sent)) {
          found = true;

          this.groupedMails[x].mails.push(mails[i]);
        }
      }

      if (!found) {
        this.groupedMails.push({
          sent: sent,
          mails: [ mails[i] ]
        });
      }
    }

    for (let i = 0; i < this.groupedMails.length; i++) {
      this.groupedMails[i].mails.sort((a, b) => {
        return b.sent - a.sent;
      });
    }

    this.groupedMails.sort((a, b) => {
      return b.sent - a.sent;
    });

    this.ref.detectChanges();
  }

  async activateMail(mail) {
    this.reloadOutlet = true;
    this.ref.detectChanges();

    const mailBefore = this.routingService.getHashParam('id');

    if (this.accountId !== mail.content.from) {
      this.mailService.addReadMails(mail.id);
    }

    if (mailBefore) {
      this.routingService.navigate(`../`);

      await this.utils.timeout(0);
    }

    this.routingService.navigate(`./${ mail.id }`);

    await this.utils.timeout(0);
    
    this.reloadOutlet = false;
    this.ref.detectChanges();
  }

  async loadMoreAnswers() {
    this.loadMore = true;

    this.mailService.raiseMailLoadCount(10, this.showSent ? 'sent' : 'received');
    await this.mailService.getMails();

    this.filter();

    this.loadMore = false;
    this.ref.detectChanges();
  }
}
