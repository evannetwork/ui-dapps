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
  getDomainName,
  routing,
} from 'dapp-browser';

import {
  Component, OnInit, OnDestroy, // @angular/core
  NavController,                // ionic-angular
  DomSanitizer, ChangeDetectorRef, ChangeDetectionStrategy,
} from 'angular-libs';

import {
  AsyncComponent,
  createGrowTransition,
  createOpacityTransition,
  EvanAddressBookService,
  EvanAlertService,
  EvanCoreService,
  EvanOnboardingService,
  EvanRoutingService,
  EvanTranslationService,
  EvanUtilService,
} from 'angular-core';

import { OnboardingService } from '../../services/onboarding';

/**************************************************************************************************/

@Component({
  selector: 'onboarded-evan',
  templateUrl: 'onboarded.html',
  animations: [
    createOpacityTransition(),
    createGrowTransition()
  ]
})

export class OnboardedComponent extends AsyncComponent {
  /**
   * current logged in user
   */
  private activeAccount: string;

  /**
   * currents users alias
   */
  private alias: string;

  /**
   * currents users balance
   */
  private balance: string;

  /**
   * current attached query params for checking mail inivitation
   */
  private queryParams: any;

  /**
   * accept the onboarding invitation
   */
  private accepting: boolean;

  constructor(
    private addressBookService: EvanAddressBookService,
    private alertService: EvanAlertService,
    private core: EvanCoreService,
    private onboarding: OnboardingService,
    private onboardingService: EvanOnboardingService,
    private ref: ChangeDetectorRef,
    private translate: EvanTranslationService,
    private utils: EvanUtilService,
    public _DomSanitizer: DomSanitizer,
    public routing: EvanRoutingService,
  ) {
    super(ref);
  }

  async _ngOnInit() {
    this.activeAccount = this.core.getAccountId();

    if (this.activeAccount) {
      this.balance = await this.core.getBalance(this.activeAccount);
      this.alias = await this.addressBookService.activeUserName();

      this.queryParams = this.routing.getQueryparams();

      this.core.finishDAppLoading();
    } else {
      this.routing.navigate('./', true, this.routing.getQueryparams());      
    }
  }

  /**
   * Navigates to the default / last opened DApp.
   *
   * @return     {<type>}  { description_of_the_return_value }
   */
  async openDefaultDapp() {
    this.routing.navigate(`/${ this.queryParams.origin || routing.defaultDAppENS }`);
  }

  /**
   * Ask the user, if he wants to logout. If yes, run log out, if not, stay logged in
   *
   * @return     {<type>}  { description_of_the_return_value }
   */
  async logout() {
    try {
      await this.alertService.showSubmitAlert(
        '_angularcore.logout',
        '_angularcore.logout-desc',
        '_angularcore.cancel',
        '_angularcore.logout',
      );

      this.core.logout();
    } catch (ex) { }
  }

  /**
   * Accept the contact invitation.
   */
  async acceptContact() {
    this.accepting = true;
    this.ref.detectChanges();
    
    try {
      await this.onboarding.sendCommKey(this.activeAccount);

      this.routing.navigate([
        '',
        `dashboard.${ getDomainName() }`,
        `addressbook.${ getDomainName() }`,
        this.queryParams.inviteeAddress,
      ].join('/'));
    } catch (ex) {
      this.utils.log(ex, 'error');
      this.alertService.showSubmitAlert(
        '_dapponboarding.error',
        '_dapponboarding.error-message'
      );
    }

    this.accepting = false;
    this.ref.detectChanges();
  }
}
