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
  evanGlobals,
  routing
} from '@evan.network/ui-dapp-browser';

import {
  Component, OnInit,      // @angular/core
  TranslateService,       // @ngx-translate/core
  NavController,          // ionic-angular
  Observable, OnDestroy,
  ChangeDetectorRef
} from '@evan.network/ui-angular-libs';

import {
  AnimationDefinition,
  createRouterTransition,
  EvanRoutingService,
  EvanCoreService,
  EvanBCCService,
  createOpacityTransition,
  AsyncComponent
} from '@evan.network/ui-angular-core';

/**************************************************************************************************/

@Component({
  selector: 'onboarding-root',
  templateUrl: 'root.html',
  animations: [
    createOpacityTransition(),
    createRouterTransition([
      new AnimationDefinition('welcome', '=>', '*', 'right'),
      new AnimationDefinition('welcome', '=>', 'metamask', 'left'),
      new AnimationDefinition('welcome', '=>', 'identity-create', 'left'),
      new AnimationDefinition('welcome', '=>', 'identity-import', 'left'),
      
      new AnimationDefinition('metamask', '=>', 'welcome', 'left'),
      new AnimationDefinition('metamask', '=>', 'terms-of-use', 'right'),
      
      new AnimationDefinition('identity-create', '=>', 'welcome', 'left'),
      new AnimationDefinition('identity-create', '=>', 'terms-of-use', 'right'),
      
      new AnimationDefinition('identity-import', '=>', 'welcome', 'left'),
      new AnimationDefinition('identity-import', '=>', 'terms-of-use', 'right'),

      new AnimationDefinition('terms-of-use', '=>', 'welcome', 'left'),
      new AnimationDefinition('terms-of-use', '=>', 'metamask', 'left'),
      new AnimationDefinition('terms-of-use', '=>', 'identity-create', 'left'),
      new AnimationDefinition('terms-of-use', '=>', 'identity-import', 'left'),
      new AnimationDefinition('terms-of-use', '=>', 'profile-create', 'right'),

      new AnimationDefinition('profile-create', '=>', 'metamask', 'left'),
      new AnimationDefinition('profile-create', '=>', 'identity-create', 'left'),
      new AnimationDefinition('profile-create', '=>', 'identity-import', 'left'),
    ])
  ]
})

export class OnboardingRootComponent extends AsyncComponent {
  private activeDApp: Observable<string>;
  private canNavigateBack: Observable<boolean>;
  public loading: boolean;
  private watchRouteChange: Function;

  constructor(
    private routing: EvanRoutingService,
    private core: EvanCoreService,
    private bcc: EvanBCCService,
    private ref: ChangeDetectorRef
  ) {
    super(ref);
  }

  async _ngOnInit() {
    await this.bcc.initialize((accountId) => this.bcc.globalPasswordDialog(accountId));

    this.activeDApp = this.routing.activeRouteName().pipe();
    this.canNavigateBack = this.routing.canNavigateBack().pipe();

    this.watchRouteChange = this.routing.subscribeRouteChange(() => this.ref.detectChanges());
    this.core.finishDAppLoading();
  }

  async _ngOnDestroy() {
    this.watchRouteChange();
  }

  goBack() {
    this.routing.goBack();
  }
}
