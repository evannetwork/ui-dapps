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
  Injectable,
  Component, OnInit, Input,            // @angular/core
  Validators, FormBuilder, FormGroup,  // @angular/forms
  DomSanitizer
} from '@evan.network/ui-angular-libs';

import {
  AngularCore,
  QueueSequence,
  QueueDispatcher,
  EvanBookmarkService,
  SingletonService
} from '@evan.network/ui-angular-core';

import {
  translations
} from '../i18n/registry';

/**************************************************************************************************/

@Injectable()
export class BookmarkDispatcherService {
  static providers = [
    EvanBookmarkService,
    SingletonService
  ];

  constructor(
    public bookmarkService: EvanBookmarkService,
    public singleton: SingletonService
  ) {
    return singleton.create(BookmarkDispatcherService, this);
  }
}

export const BookmarkDispatcher = new QueueDispatcher(
  [
    new QueueSequence(
      '_dappdapps.dispatcher.save-bookmarks',
      '_dappdapps.dispatcher.save-bookmarks-description',
      async (service: BookmarkDispatcherService, data: any) => {
        await service.bookmarkService.syncQueueBookmarks();
      }
    )
  ],
  translations
);
