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

import {
  ActivatedRoute,
  ChangeDetectorRef,
  Component,
  Input,
  NavController,
  OnInit,
  TranslateService,
  ViewChild,
} from '@evan.network/ui-angular-libs';

import {
  AnimationDefinition,
  AsyncComponent,
  createOpacityTransition,
  createRouterTransition,
  createTabSlideTransition,
  EvanAddressBookService,
  EvanBCCService,
  EvanCoreService,
  EvanMailboxService,
  EvanRoutingService,
  EvanTranslationService,
  QueueId,
  EvanQueue,
} from '@evan.network/ui-angular-core';

/**************************************************************************************************/

@Component({
  selector: 'mail-send',
  templateUrl: 'mail-send.html',
  animations: [
    createOpacityTransition(),
    createTabSlideTransition()
  ]
})

export class MailSendComponent extends AsyncComponent {
  /**
   * The current input data
   */
  private mail: any = {
    title: '',
    body: '',
    to: [ ]
  };

  /**
   * current formular
   */
  @ViewChild('mailForm') mailForm: any;

  /**
   * current contract-members component
   */
  @ViewChild('toComp') toComp: any;

  constructor(
    private addressbookService: EvanAddressBookService,
    private bcc: EvanBCCService,
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

  }

  /**
   * Clear the queue
   */
  async _ngOnDestroy() {

  }

  /**
   * Checks if a form property is touched and invalid.
   *
   * @param      {string}   paramName  name of the form property that should be checked
   * @return     {boolean}  true if touched and invalid, else false
   */
  showError(paramName: string) {
    if (this.mailForm && this.mailForm.controls[paramName]) {
      return this.mailForm.controls[paramName].invalid &&
        this.mailForm.controls[paramName].touched;
    }
  }

  /**
   * Run detectChanges directly and after and timeout again, to update select fields.
   */
  detectTimeout() {
    this.ref.detectChanges();

    setTimeout(() => this.ref.detectChanges());
  }

  /**
   * Sends a mail.
   *
   * @return     {Promise<void>}  resolved when done
   */
  async sendMail() {
    const activeAccount = this.core.activeAccount();

    this.mailService.sendMail(
      {
        content: {
          body: this.mail.body,
          from: activeAccount,
          fromAlias: await this.bcc.profile.getProfileKey('alias', activeAccount),
          sent: new Date().getTime(),
          title: this.mail.title,
          to: this.mail.to[0],
        }
      },
      activeAccount,
      this.mail.to[0]
    );

    this.routingService.goBack();
  }
}
