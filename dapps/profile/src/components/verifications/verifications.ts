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
  lightwallet,
  System
} from 'dapp-browser';

import {
  ChangeDetectorRef,
  Component,
  DomSanitizer,
  NavController,
  OnInit,
  TranslateService,
  ViewChild,
} from 'angular-libs';

import {
  AnimationDefinition,
  AsyncComponent,
  createOpacityTransition,
  createRouterTransition,
  createTabSlideTransition,
  EvanAddressBookService,
  EvanAlertService,
  EvanBCCService,
  EvanClaimService,
  EvanCoreService,
  EvanQueue,
  EvanToastService,
  EvanTranslationService,
  QueueId,
} from 'angular-core';

/**************************************************************************************************/

@Component({
  selector: 'evan-profile-verifications',
  templateUrl: 'verifications.html',
  animations: [
    createOpacityTransition(),
    createTabSlideTransition()
  ]
})

/**
 * Shows the current profile information and provides the possibility to set some configurations
 * for the ui
 */
export class EvanProfileVerificationsComponent extends AsyncComponent {
  /**
   * show an loading symbol
   */
  private loading: boolean;

  /**
   * current used active account id
   */
  private activeAccount: string;

  /**
   * claims that should be displayed within the ui components
   */
  private claims: Array<any>;

  /**
   * Function to unsubscribe from queue results.
   */
  private queueWatcher: Function;

  /**
   * is the current queue saving the profile?
   */
  private savingClaims: boolean;

  /**
   * profile queue Id
   */
  private queueId: QueueId;

  /**
   * current formular
   */
  @ViewChild('claimsForm') claimsForm: any;

  constructor(
    private _DomSanitizer: DomSanitizer,
    private addressBookService: EvanAddressBookService,
    private alertService: EvanAlertService,
    private bcc: EvanBCCService,
    private claimsService: EvanClaimService,
    private core: EvanCoreService,
    private queue: EvanQueue,
    private ref: ChangeDetectorRef,
    private toastService: EvanToastService,
    private translateService: EvanTranslationService,
  ) {
    super(ref);
  }

  /**
   * Set initial values and load the profile information
   *
   * @return     {Promise<void>}  resolved when done
   */
  async _ngOnInit() {
    // watch for updates
    this.queueWatcher = await this.queue.onQueueFinish(
      new QueueId(`profile.${ getDomainName() }`, '*'),
      async (reload, results) => {
        await this.core.utils.timeout(0);

        const profileActiveClaims = (await this.claimsService.getProfileActiveClaims(true));
        this.claims = profileActiveClaims.claims.map(claim => {
          return { origin: claim, value: claim };
        });

        this.savingClaims = profileActiveClaims.saving;
        this.ref.detectChanges();
      }
    );
  }

  /**
   * Remove watchers
   */
  _ngOnDestroy() {
    this.queueWatcher();
  }

  /**
   * Checks if a form property is touched and invalid.
   *
   * @param      {any}      form       The form that should be analyzed
   * @param      {string}   paramName  name of the form property that should be checked
   * @return     {boolean}  true if touched and invalid, else false
   */
  showError(form: any, paramName: string) {
    if (form && form.controls[paramName]) {
      return form.controls[paramName].invalid &&
        form.controls[paramName].touched;
    }
  }

  /**
   * Save the current set of claims
   */
  saveClaimTopics() {
    this.queue.addQueueData(
      new QueueId(`profile.${ getDomainName() }`, 'profileClaimsDispatcher'),
      {
        claims: this.claims.map(claim => claim.value)
      }
    );

    this.savingClaims = true;
    this.ref.detectChanges();
  }

  /**
   * Run detectChanges directly and after and timeout again, to update select fields.
   */
  detectTimeout() {
    this.ref.detectChanges();

    setTimeout(() => this.ref.detectChanges());
  }
}
