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
  Component, OnInit, OnDestroy, // @angular/core
  TranslateService,             // @ngx-translate/core
  NavController,                // ionic-angular
  ChangeDetectorRef
} from '@evan.network/ui-angular-libs';

import {
  AnimationDefinition,
  createRouterTransition,
  EvanCoreService,
  EvanBCCService,
  createOpacityTransition,
  EvanRoutingService,
  AsyncComponent
} from '@evan.network/ui-angular-core';

/**************************************************************************************************/

@Component({
  selector: 'contacts-root',
  templateUrl: 'root.html',
  animations: [
    createOpacityTransition(),
    createRouterTransition([
      new AnimationDefinition('*', '=>', 'account-detail', 'right'),
      new AnimationDefinition('account-detail', '=>', '*', 'left'),
      new AnimationDefinition('account-list', '=>', 'profile-root', 'left'),

      new AnimationDefinition('account-list', '=>', 'add-via-mail', 'right'),
      new AnimationDefinition('account-list', '=>', 'add-via-accountid', 'right'),
      new AnimationDefinition('account-list', '=>', 'add-via-qrcode', 'right'),

      new AnimationDefinition('add-via-mail', '=>', '*', 'left'),
      new AnimationDefinition('add-via-accountid', '=>', '*', 'left'),
      new AnimationDefinition('add-via-qrcode', '=>', '*', 'left'),
    ])
  ]
})

export class ContactsRootComponent extends AsyncComponent {
  private watchRouteChange: Function;
  public loading: boolean;

  constructor(
    private core: EvanCoreService,
    private bcc: EvanBCCService,
    private ref: ChangeDetectorRef,
    private routingService: EvanRoutingService
  ) {
    super(ref);
  }

  async _ngOnInit() {
    await this.bcc.initialize((accountId) => this.bcc.globalPasswordDialog(accountId));
    this.watchRouteChange = this.routingService.subscribeRouteChange(() => this.ref.detectChanges());
    this.core.finishDAppLoading();
  }

  /**
   * Hide and show the current router-outlet.
   */
  async refresh() {
    this.loading = true;
    this.ref.detectChanges();

    setTimeout(() => {
      this.loading = false
      this.ref.detectChanges();
    });
  }

  async _ngOnDestroy() {
    this.watchRouteChange();
  }
}
