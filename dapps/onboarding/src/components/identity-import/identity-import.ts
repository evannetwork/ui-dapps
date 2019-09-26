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
  selector: 'onboarding-identity-import',
  templateUrl: 'identity-import.html',
  animations: [
    createOpacityTransition()
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class IdentityImportComponent implements OnInit {
  @ViewChild('mnemonicDisplay') mnemonicDisplay: any;

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
  
    this.ref.detectChanges();
  }

  async submit() {
    if (this.mnemonicDisplay.isValid()) {
      this.loading = true;
      this.ref.detectChanges();

      try {
        await this.utils.timeout(0);

        const mnemonic = this.mnemonicDisplay.getMnemonic();

        // open vault with dummy password to retrieve first password
        const vault = await this.onboarding.getDummyVault(mnemonic);
        const accounts = await lightwallet.getAccounts(vault, 1);

        await this.onboarding.checkImportedDummyVault(vault, mnemonic, accounts[0], 'identity-import');
      } catch (ex) { }

      this.loading = false;
      this.ref.detectChanges();
    }
  }

  goBack() {
    this.routing.navigate(`./`, true, this.routing.getQueryparams());
  }
}
