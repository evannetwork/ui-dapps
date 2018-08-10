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
  Component, OnInit, // @angular/core
  NavController,     // ionic-angular
  DomSanitizer,
  OnDestroy,
  ChangeDetectorRef
} from 'angular-libs';

import {
  createOpacityTransition,
  EvanAlertService,
  EvanRoutingService,
  EvanCoreService,
  EvanOnboardingService,
  EvanUtilService
} from 'angular-core';

import { OnboardingService } from '../../services/onboarding';

/**************************************************************************************************/

@Component({
  selector: 'onboarding-metamask',
  templateUrl: 'metamask.html',
  animations: [
    createOpacityTransition()
  ]
})

export class MetamaskComponent implements OnInit {
  private checkInterval: any;
  private loading: boolean;

  constructor(
    public _DomSanitizer: DomSanitizer,
    public routing: EvanRoutingService,
    private alertService: EvanAlertService,
    private core: EvanCoreService,
    private onboarding: OnboardingService,
    private onboardingService: EvanOnboardingService,
    private utils: EvanUtilService,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.ref.detach();

    let latestAccount = this.core.getExternalAccount();

    // check if account has changed and metamask is unlocked
    this.checkInterval = setInterval(async () => {
      const activeAccount = this.core.getExternalAccount();

      if (latestAccount !== activeAccount) {
        latestAccount = activeAccount;

        if (activeAccount) {
          this.loading = true;
          this.ref.detectChanges();

          clearInterval(this.checkInterval);

          await this.utils.timeout(0);

          const isOnboarded = await this.onboardingService.isOnboarded(activeAccount);

          if (isOnboarded) {
            this.core.setCurrentProvider('metamask');
            this.onboardingService.finishOnboarding();
          } else {

            // send startupCapital
            /*
            try { this.agentService.handout(activeAccount, 'metamask') }
            catch (e) { }
            return this.routing.navigate('./profile-create/metamask', true, this.routing.getQueryparams());
*/
          }

          this.ref.detectChanges();
          this.loading = false;
        }
      }
    }, 1000);

    this.ref.detectChanges();
  }

  openMetamaskDownload() {
    const browser = this.core.currentBrowser();

    switch (browser) {
      case 'chrome': {
        window.open('https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn', '_blank');

        break;
      }
      case 'opera': {
        window.open('https://addons.opera.com/en/extensions/details/metamask/', '_blank');

        break;
      }
      case 'firefox': {
        window.open('https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/', '_blank');

        break;
      }
      default: {
        this.alertService.showAlert(
          '_dapponboarding.metamask-browser-not-supported',
          '_dapponboarding.metamask-browser-not-supported-desc'
        );
      }
    }
  }

  goBack() {
    this.routing.navigate(`./`, true, this.routing.getQueryparams());
  }
}
