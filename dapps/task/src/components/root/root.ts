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
  Component, OnInit,      // @angular/core
  TranslateService,       // @ngx-translate/core
  NavController,          // ionic-angular
  OnDestroy, ChangeDetectorRef
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
  selector: 'task-root',
  templateUrl: 'root.html',
  animations: [
    createOpacityTransition(),
    createRouterTransition([
      new AnimationDefinition('task-list', '=>', 'task-create', 'right'),
      new AnimationDefinition('task-list', '=>', 'task-detail', 'right'),
      new AnimationDefinition('task-create', '=>', 'task-list', 'left'),
      new AnimationDefinition('task-detail', '=>', 'task-list', 'left'),
    ])
  ]
})

export class TaskRootComponent extends AsyncComponent {
  public loading: boolean;
  private watchRouteChange: Function;

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

  async _ngOnDestroy() {
    this.watchRouteChange && this.watchRouteChange();
  }
}