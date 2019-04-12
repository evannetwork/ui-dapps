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
  evanGlobals,
  lightwallet,
  routing,
} from '@evan.network/ui-dapp-browser';

import {
  Component, OnInit, // @angular/core
  NavController,     // ionic-angular
  DomSanitizer,
  ViewChild, Slides, AfterViewInit,
  ChangeDetectorRef
} from '@evan.network/ui-angular-libs';

import {
  createOpacityTransition,
  EvanAlertService,
  EvanRoutingService,
  EvanSlidesService,
  EvanCoreService,
  EvanOnboardingService,
  createGrowTransition,
  EvanUtilService,
  AsyncComponent,
  EvanBCCService
} from '@evan.network/ui-angular-core';

import { OnboardingService } from '../../services/onboarding';

/**************************************************************************************************/

@Component({
  selector: 'onboarding-welcome',
  templateUrl: 'welcome.html',
  animations: [
    createOpacityTransition(),
    createGrowTransition()
  ]
})

export class WelcomeComponent extends AsyncComponent {
  @ViewChild('slider') slide: Slides;

  private showInfo: boolean;
  public params: any;

  constructor(
    private _DomSanitizer: DomSanitizer,
    private routing: EvanRoutingService,
    private core: EvanCoreService,
    private alertService: EvanAlertService,
    private slidesService: EvanSlidesService,
    private onboarding: OnboardingService,
    private onboardingService: EvanOnboardingService,
    private utils: EvanUtilService,
    private ref: ChangeDetectorRef,
    private bcc: EvanBCCService
  ) {
    super(ref);
  }

  async _ngOnInit() {
    if (!(await this.onboarding.checkLoggedInAndOnboarded())) {
      lightwallet.deleteActiveVault();

      this.core.setAccountId('');
      this.core.setCurrentProvider('');
      this.params = this.routing.getQueryparams();
    }
  }

  async setCurrentProvider(provider: string) {
    if (provider !== 'metamask') {
      this.routing.navigate(`./${provider}`, true, this.routing.getQueryparams());

      this.ref.detectChanges();
    } else {
      const activeAccount = this.core.getExternalAccount();
      if (!activeAccount) {
        return;
      }

      if (!await this.onboardingService.isOnboarded(activeAccount)) {
        return this.routing.navigate('./terms-of-use/metamask', true, this.routing.getQueryparams());
      }

      this.core.setCurrentProvider('metamask');

      // send communication key back to the onboarding account
      await this.onboarding.sendCommKey(activeAccount);
      await this.bcc.initialize((accountId) => this.bcc.globalPasswordDialog(accountId));
      this.onboardingService.finishOnboarding();
    }
  }

  //return this.routing.navigate(`./terms-of-use/${ provider }`, true, this.routing.getQueryparams());

  async _ngAfterViewInit() {
    this.slidesService.afterViewInit(this.slide);
  }
}
