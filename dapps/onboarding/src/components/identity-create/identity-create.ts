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
  lightwallet
} from '@evan.network/ui-dapp-browser';

import {
  Component, OnInit, // @angular/core
  NavController,     // ionic-angular
  DomSanitizer,
  ViewChild, ElementRef,
  ChangeDetectionStrategy, ChangeDetectorRef
} from '@evan.network/ui-angular-libs';

import {
  createOpacityTransition,
  EvanAlertService,
  EvanRoutingService,
  EvanOnboardingService,
  EvanUtilService
} from '@evan.network/ui-angular-core';

import { OnboardingService } from '../../services/onboarding';

/**************************************************************************************************/

@Component({
  selector: 'onboarding-identity-create',
  templateUrl: 'identity-create.html',
  animations: [
    createOpacityTransition()
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class IdentityCreateComponent implements OnInit {
  @ViewChild('mnemonicDisplay') mnemonicDisplay: any;

  private questionMnemonic: boolean;
  public loading: boolean;

  constructor(
    public routing: EvanRoutingService,
    private alertService: EvanAlertService,
    private onboarding: OnboardingService,
    private onboardingService: EvanOnboardingService,
    private utils: EvanUtilService,
    private ref: ChangeDetectorRef
  ) { }

  async ngOnInit() {
    await this.onboarding.checkLoggedInAndOnboarded();
  }

  askWrittenDown() {
    return this.alertService.showSubmitAlert(
      '_dapponboarding.ask-writte-down.title',
      '_dapponboarding.ask-writte-down.message',
      '_dapponboarding.ask-writte-down.cancel',
      '_dapponboarding.ask-writte-down.ok',
    );
  }

  askForMissingCards() {
    this.mnemonicDisplay.startRiddle();
  }

  async submit() {
    try {
      if (!this.questionMnemonic) {
        await this.askWrittenDown();

        this.questionMnemonic = true;

        this.askForMissingCards();
      } else {
        this.loading = true;
        this.ref.detectChanges();

        await this.utils.timeout(0);

        const mnemonic = this.mnemonicDisplay.getMnemonic();

        // open vault with dummy password to retrieve first password
        const vault = await this.onboarding.getDummyVault(mnemonic);
        const accounts = await lightwallet.getAccounts(vault, 1);

        await this.onboarding.checkImportedDummyVault(vault, mnemonic, accounts[0], 'identity-create');
      }
    } catch (ex) { }

    this.loading = false;
    this.ref.detectChanges();
  }

  cancel() {
    this.questionMnemonic = false;

    this.mnemonicDisplay.cancelRiddle();
    this.ref.detectChanges();
  }

  goBack() {
    this.routing.navigate(`./`, true, this.routing.getQueryparams());
  }
}
