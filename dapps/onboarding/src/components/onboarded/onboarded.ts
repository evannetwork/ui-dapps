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
  Component, OnInit, OnDestroy, // @angular/core
  NavController,                // ionic-angular
  DomSanitizer, ChangeDetectorRef, ChangeDetectionStrategy,
} from 'angular-libs';

import {
  createOpacityTransition,
  EvanTranslationService,
  EvanRoutingService,
  createGrowTransition,
  EvanOnboardingService,
  EvanCoreService,
  EvanUtilService,
  AsyncComponent
} from 'angular-core';

import { OnboardingService } from '../../services/onboarding';

/**************************************************************************************************/

@Component({
  selector: 'profile-create-evan',
  templateUrl: 'onboarded.html',
  animations: [
    createOpacityTransition(),
    createGrowTransition()
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class OnboardedComponent extends AsyncComponent {
  public screenSize: number;
  private activeAccount: string;
  private alias: string;
  private loading: boolean;
  private provider: string;
  private balance: number;


  constructor(
    public _DomSanitizer: DomSanitizer,
    private translate: EvanTranslationService,
    public routing: EvanRoutingService,
    private onboarding: OnboardingService,
    private onboardingService: EvanOnboardingService,
    private core: EvanCoreService,
    private utils: EvanUtilService,
    private ref: ChangeDetectorRef
  ) {
    super(ref);
  }

  async _ngOnInit() {
    if (this.onboarding.activeAccount) {
      this.activeAccount = this.onboarding.activeAccount;
      this.provider = 'internal';
    }
    else {
      this.activeAccount = this.core.getExternalAccount();
      this.provider = 'metamask';
    }

    this.alias = this.onboarding.alias;

    this.balance = await this.core.getBalance(this.activeAccount);
  }

  next() {
    this.onboardingService.finishOnboarding();
  }
}
