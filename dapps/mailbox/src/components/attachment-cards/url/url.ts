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
  Profile
} from '@evan.network/api-blockchain-core';

import {
  Component, OnInit,      // @angular/core
  TranslateService,       // @ngx-translate/core
  Input, Router,
  ChangeDetectorRef
} from '@evan.network/ui-angular-libs';

import {
  EvanAlertService,
  EvanBCCService,
  EvanCoreService,
  EvanDescriptionService,
  EvanQueue,
  EvanRoutingService,
  EvanUtilService,
  QueueId,
} from '@evan.network/ui-angular-core';

@Component({
  selector: 'attachment-url',
  templateUrl: 'url.html'
})

export class UrlAttachmentComponent implements OnInit {
  /**
   * Attachment that should be displayed
   */
  @Input() attachment: any;

  /**
   * Mail where the attachment is from
   */
  @Input() mail: any;

  /**
   * Mail id to attach it to the url
   */
  @Input() mailId: any;

  constructor(
    private ref: ChangeDetectorRef,
    private routing: EvanRoutingService,
    private utils: EvanUtilService,
  ) { }

  ngOnInit() {
    this.ref.detach();

    this.ref.detectChanges();
  }

  /**
   * Open attachment url.
   */
  async openUrl(): Promise<any> {
    this.routing.navigate([
      `${ this.attachment.fullPath }?mailId=${ this.mail.id }`,
      `attachment=${ this.mail.content.attachments.indexOf(this.attachment) }`
    ].join('&'));
  }
}
