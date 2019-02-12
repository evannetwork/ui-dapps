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
  getDomainName
} from 'dapp-browser';

import {
  ActivatedRoute,
  ChangeDetectorRef,
  Component,
  Input,
  NavController,
  OnInit,
  TranslateService,
  ViewChild,
} from 'angular-libs';

import {
  AnimationDefinition,
  AsyncComponent,
  createOpacityTransition,
  createRouterTransition,
  createTabSlideTransition,
  EvanAddressBookService,
  EvanBCCService,
  EvanVerificationService,
  EvanCoreService,
  EvanMailboxService,
  EvanQueue,
  EvanRoutingService,
  EvanTranslationService,
  QueueId,
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
  private answers: any = [];
  private sending: boolean;
  private showAnswers: boolean;
  private addressbook;

  /**
   * amount of total answers
   */
  private totalAnswerCount: number;

  /**
   * amount of answers that could not be loaded
   */
  private invalidAnswerCount: number;

  /**
   * current active account
   */
  private activeAccount: string;

  /**
   * The current answer.
   */
  private answer: any;
  
  /**
   * { item_description }
   */
  private loadingAnswers: any;

  /**
   * watch for queue updates
   */
  private queueWatch: QueueId;

  /**
   * Function to unsubscribe from queue results.
   */
  private queueWatcher: Function;

  /**
   * for the current profile activated verifications
   */
  private verifications: Array<string> = [ ];

  /**
   * Function to unsubscribe from profile verifications watcher queue results.
   */
  private profileVerificationsWatcher: Function;

  /**
   * given mailId
   */
  @Input() mailId?: string;

  /**
   * already loaded mail detail
   */
  @Input() mail?: any;

  /**
   * current formular
   */
  @ViewChild('answerForm') answerForm: any;

  constructor(
    private addressbookService: EvanAddressBookService,
    private bcc: EvanBCCService,
    private verificationsService: EvanVerificationService,
    private core: EvanCoreService,
    private mailService: EvanMailboxService,
    private queueService: EvanQueue,
    private ref: ChangeDetectorRef,
    private route: ActivatedRoute,
    private routingService: EvanRoutingService,
    private translate: EvanTranslationService,
  ) {
    super(ref);
  }

  async _ngOnInit() {
    this.activeAccount = this.core.activeAccount();
    this.mailId = this.mailId || this.routingService.getHashParam('id');
    this.answers = [ ];

    if (this.mail) {
      this.mailId = this.mail.id;
    }

    this.queueWatcher = await this.queueService.onQueueFinish(
      this.mailService.answerMailQueueId,
      async (reload) => {
        // if the function was called by finishing the queue, everything is fine.
        if (reload) {
          // reset loading
          this.sending = false;

          await this.getMail();
        }
      }
    );

    // load profile active verifications
    this.profileVerificationsWatcher = await this.queueService.onQueueFinish(
      new QueueId(`profile.${ getDomainName() }`, '*'),
      async (reload, results) => {
        reload && await this.core.utils.timeout(0);
        this.verifications = await this.verificationsService.getProfileActiveVerifications();
        this.ref.detectChanges();
      }
    );

    // load the mail details
    await this.getMail();

    // add the mail to the read mail storage
    if (this.activeAccount !== this.mail.content.from) {
      this.mailService.addReadMails(this.mailId);
    }
    this.mailService.syncLastReadCount();
  }

  /**
   * Clear the queue
   */
  async _ngOnDestroy() {
    this.queueWatcher();
  }

  /**
   * Load the current mail details
   *
   * @return     {<type>}  The mail.
   */
  async getMail() {
    this.core.utils.showLoading(this);

    // load the mail detail
    this.mail = await this.mailService.getMail(this.mailId);

    // set translation for id
    this.translate.addSingleTranslation(this.mailId, this.mail.content.title);

    // load current address to access aliases
    this.addressbook = await this.addressbookService.loadAccounts();

    // reset answers and load them
    this.answers = [ ];
    this.invalidAnswerCount = 0;
    this.totalAnswerCount = 0;
    await this.loadAnswers();

    this.core.utils.hideLoading(this);
  }

  /**
   * Load answers for the current mail and sort them.
   *
   * @return     {Promise<void>}  resolved when done
   */
  async loadAnswers() {
    this.loadingAnswers = true;
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

    this.loadingAnswers = false;
    this.ref.detectChanges();
  }

  /**
   * Load answers from a specific offset.
   *
   * @param      {number}  offset  offset to start answers.
   * @return     {Array<any>}  loaded answers
   */
  async getAnswers(offset: number) {
    const answersObject = await this.bcc.mailbox.getAnswersForMail(this.mailId, 10, this.answers.length);
    this.totalAnswerCount = answersObject.totalResultCount - this.invalidAnswerCount;

    return Object.keys(answersObject.mails)
      .map((key) => {
        const ret = {
          id: key,
          content: {
            sent: null
          }
        };
        if (answersObject.mails[key] == null) {
          this.invalidAnswerCount++;
          this.totalAnswerCount--;

          return null;
        }
        Object.assign(ret, answersObject.mails[key]);
        return ret;
      })
      .filter((value) => value != null);
  }

  /**
   * Send a new answer.
   *
   * @return     {Promise<void>}  resolved when done
   */
  async sendAnswer() {
    // if I send an answer to my own sent mail, switch to address to the other mail partner
    let toAddress = this.mail.content.from === this.activeAccount ? this.mail.content.to : 
      this.mail.content.from;

    this.mailService.sendAnswer(
      {
        parentId: this.mailId,
        content: {
          body: this.answer,
          from: this.activeAccount,
          fromAlias: await this.bcc.profile.getProfileKey('alias', this.activeAccount),
          sent: new Date().getTime(),
          title: this.mail.content.title,
          to: toAddress,
        }
      },
      this.activeAccount,
      toAddress
    );

    this.answer = '';
    this.sending = true;
    this.ref.detectChanges();
  }

  /**
   * Parse the correct mail body.
   *
   * @param      {string}  text    parse the body text to use correct line breaks
   * @return     {string}  correct html
   */
  getHTMLMailBody(text: string) {
    if (text && text.replace) {
      return text.replace(/\n/g, '<br>');
    } else {
      return '';
    }
  }

  /**
   * Checks if a form property is touched and invalid.
   *
   * @param      {string}   paramName  name of the form property that should be checked
   * @return     {boolean}  true if touched and invalid, else false
   */
  showAnswerError(paramName: string) {
    if (this.answerForm && this.answerForm.controls[paramName]) {
      return this.answerForm.controls[paramName].invalid &&
        this.answerForm.controls[paramName].touched;
    }
  }

  /**
   * Run detectChanges directly and after and timeout again, to update select fields.
   */
  detectTimeout() {
    this.ref.detectChanges();

    setTimeout(() => this.ref.detectChanges());
  }
}
