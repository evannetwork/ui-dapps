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
  Validators, FormBuilder, FormGroup, FormControl, // @angular/forms
  //Http, Response, RequestOptions, Headers,       // @angular/http
} from 'angular-libs';

import {
  createOpacityTransition,
  EvanAlertService,
  EvanTranslationService,
  EvanRoutingService,
  createGrowTransition,
  EvanOnboardingService,
  EvanCoreService,
  EvanUtilService,
  EvanBCCService,
  EvanLoggingService,
  AsyncComponent
} from 'angular-core';

import { OnboardingService } from '../../services/onboarding';

/**************************************************************************************************/

@Component({
  selector: 'profile-create-evan',
  templateUrl: 'profile-create.html',
  animations: [
    createOpacityTransition(),
    createGrowTransition()
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ProfileCreateComponent extends AsyncComponent {
  public screenSize: number;
  private alias: string;
  private loading: boolean;
  private ex: any;
  private activeAccount: string;
  private onboardingForm: FormGroup;
  private provider: string;
  private previousPage: string;

  constructor(
    public _DomSanitizer: DomSanitizer,
    private translate: EvanTranslationService,
    public routing: EvanRoutingService,
    private alertService: EvanAlertService,
    private onboarding: OnboardingService,
    private formBuilder: FormBuilder,
    private onboardingService: EvanOnboardingService,
    private core: EvanCoreService,
    private utils: EvanUtilService,
    private bcc: EvanBCCService,
    private ref: ChangeDetectorRef,
    private loggingService: EvanLoggingService
  ) {
    super(ref);
  }

  async _ngOnInit() {
    this.previousPage = this.routing.getHashParam('provider');
    this.provider = this.routing.getHashParam('provider') === 'metamask' ? 'metamask' : 'internal';

    if (this.provider === 'metamask') {
      this.activeAccount = this.core.getExternalAccount();
    } else {
      this.activeAccount = this.onboarding.activeAccount;
    }

    if (!this.activeAccount) {
      return this.goBack();
    }

    this.onboardingForm = this.formBuilder.group({
      'alias': ['', Validators.required],
      'password': ['', this.checkPassword],
      'passwordRepeat': ['', this.checkPassword]
    });

    this.onboardingForm.valueChanges.subscribe((filter: number) => {
      this.ref.detectChanges();
    });
  }

  checkPassword(formControl: FormControl) {
    const value = formControl.value;

    if (value.length < 8) {
      return ['_dapponboarding.password-min-characters'];
    }

    if (value.search(/[a-z]/i) < 0) {
      return ['_dapponboarding.password-one-character'];
    }

    if (value.toLowerCase() === value) {
      return ['_dapponboarding.password-one-uppercase-character'];
    }

    if (value.search(/[0-9]/) < 0) {
      return ['_dapponboarding.password-one-digest-needed'];
    }

    if (formControl.parent) {
      const controls: any = formControl.parent.controls;
      if (controls.passwordRepeat === formControl &&
        controls.password.value !== controls.passwordRepeat.value) {
        return ['_dapponboarding.password-match-repeat'];
      }
    }

    return true;
  }

  /**
   * Start pProfile creation
   */
  async createProfile() {
    // check if alias is filled and passwords are correct
    if (!this.onboardingForm.valid) return;

    this.loading = true;
    this.ref.detectChanges();

    try {
      await this.onboarding.onboarding.create(
        this.activeAccount,
        this.onboardingForm.controls.alias.value,
        this.onboardingForm.controls.password.value,
        this.provider
      );

      if (!await this.onboardingService.isOnboarded(this.activeAccount)) {
        throw new Error('Onboarding has finished, but user isnt onboarded?');
      }

      this.core.setCurrentProvider(this.provider);
      this.routing.navigate('./onboarded', true, this.routing.getQueryparams());
    } catch (ex) {
      if (ex && ex.message) {
        this.utils.log(`${ ex.message } [${ ex.stack }]`, 'error');
      } else {
        this.utils.log(ex, 'error');
      }
      this.ex = ex;
      this.alertService.showSubmitAlert(
        '_dapponboarding.error',
        '_dapponboarding.error-message'
      );
    }

    this.loading = false;
    this.ref.detectChanges();
  }

  /**
   * Navigate back to previous screen.
   */
  goBack() {
    if (this.provider === 'metamask')
      return this.routing.navigate('./', true, this.routing.getQueryparams());

    return this.routing.navigate(`./${this.previousPage}`, true, this.routing.getQueryparams());
  }
}
