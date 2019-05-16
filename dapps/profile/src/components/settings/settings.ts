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
} from '@evan.network/ui-dapp-browser';

import {
  ChangeDetectorRef,
  Component,
  DomSanitizer,
  NavController,
  OnInit,
  TranslateService,
  ViewChild,
} from '@evan.network/ui-angular-libs';

import {
  AnimationDefinition,
  AsyncComponent,
  createOpacityTransition,
  createRouterTransition,
  createTabSlideTransition,
  EvanAddressBookService,
  EvanAlertService,
  EvanBCCService,
  EvanVerificationService,
  EvanCoreService,
  EvanQueue,
  EvanToastService,
  EvanTranslationService,
  QueueId,
} from '@evan.network/ui-angular-core';

/**************************************************************************************************/

@Component({
  selector: 'evan-profile-settings',
  templateUrl: 'settings.html',
  animations: [
    createOpacityTransition(),
    createTabSlideTransition()
  ]
})

/**
 * Shows the current profile information and provides the possibility to set some configurations
 * for the ui
 */
export class EvanProfileSettingsComponent extends AsyncComponent {
  /**
   * is the developer mode active?
   */
  private developerMode: boolean;

  /**
   * bind getDomainName function to use it within the template
   */
  private getDomainName: Function;

  /**
   * show an loading symbol
   */
  public loading: boolean;

  /**
   * current used active account id
   */
  private activeAccount: string;

  /**
   * my loaded profile instance
   */
  private myProfile: any;

  /**
   * are notifications enbaled?
   */
  private notificationsEnabled: boolean;

  /**
   * ist the dev domain enabled?
   */
  private devDomainLoading: boolean;

  /**
   * the current dev domain
   */
  private devDomain: string;

  /**
   * use to prevent double popups by clicking the toggle dev domain button
   */
  private devDomainPopupTimeout: any;

  /**
   * current color theme
   */
  private colorTheme: string;

  /**
   * profile queue Id
   */
  private queueId: QueueId;

  constructor(
    private _DomSanitizer: DomSanitizer,
    private addressBookService: EvanAddressBookService,
    private alertService: EvanAlertService,
    private bcc: EvanBCCService,
    private verificationsService: EvanVerificationService,
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
    this.getDomainName = getDomainName;

    this.activeAccount = this.core.activeAccount();
    this.developerMode = this.core.utils.isDeveloperMode();
    this.colorTheme = this.core.utils.getColorTheme();
    this.notificationsEnabled = this.core.utils.notificationsEnabled();
    this.devDomain = this.core.utils.getDevDomain();
    this.devDomainLoading = !!this.devDomain;

    if (!this.devDomain) {
      this.devDomain = `test.${ getDomainName() }`;
    }

    this.detectTimeout();
  }

  /**
   * Enables / Disables the developer mode for ui switches and sends an evan-developer-mode event,
   * so other applications like the dashboard can action.
   */
  setDeveloperMode() {
    window.localStorage['evan-developer-mode'] = this.developerMode;

    this.ref.detectChanges();
    this.core.utils.sendEvent('evan-developer-mode');
  }

  /**
   * Sets the notifications and triggers an event so other dapps can listen on it, when the
   * notifications are toggled
   */
  setNotifications() {
    window.localStorage['evan-notifications'] = this.notificationsEnabled;

    this.ref.detectChanges();
    this.core.utils.sendEvent('evan-notifications-toggled');
  }

  /**
   * Overwrite the browser language and use the localStorage.
   */
  async setLanguageMode() {
    window.localStorage['evan-language'] = this.translateService.translate.currentLang;

    this.ref.detectChanges();

    // ask the user to reload the application
    try {
      await this.alertService.showSubmitAlert(
        '_dappprofile.language-changed',
        '_dappprofile.language-changed-desc',
        '_dappprofile.cancel',
        '_dappprofile.language-changed-ok',
      );

      window.location.reload();
    } catch (ex) { }
  }

  /**
   * If the dev domain value was toggled, prefill it with test.evan.
   */
  devDomainToggled() {
    if (this.devDomainLoading) {
      window.localStorage['evan-dev-dapps-domain'] = window.localStorage['evan-dev-dapps-domain'] ||
        `test.${ getDomainName() }`;
    } else {
      delete window.localStorage['evan-dev-dapps-domain'];
    }

    this.devModePopup(0);
    this.ref.detectChanges();
  }

  /**
   * Updates the dev domain the current selected one.
   */
  setDevDomain() {
    window.localStorage['evan-dev-dapps-domain'] = this.devDomain;

    this.devModePopup(1000);
  }

  /**
   * Ask the user if the page should be reloaded, to use the latest configured evan-dapps-domain
   *
   * @param      {number}         timeout  timeout until the popup should be displayed
   * @return     {Promise<void>}  resolved when done
   */
  async devModePopup(timeout: number) {
    if (this.devDomainPopupTimeout) {
      window.clearTimeout(this.devDomainPopupTimeout);
    }

    this.devDomainPopupTimeout = setTimeout(async () => {
      // ask the user to reload the application
      try {
        await this.alertService.showSubmitAlert(
          '_dappprofile.evan-dev-dapps-domain-changed',
          '_dappprofile.evan-dev-dapps-domain-changed-desc',
          '_dappprofile.cancel',
          '_dappprofile.evan-dev-dapps-domain-changed-ok',
        );

        window.location.reload();
      } catch (ex) { }
    }, timeout);
  }

  /**
   * Update the color theme, if it's changed.
   */
  setColorTheme() {
    window.localStorage['evan-color-theme'] = this.colorTheme;

    this.core.utils.activateColorTheme(this.colorTheme);
    this.ref.detectChanges();
    setTimeout(() => this.ref.detectChanges());
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
   * Run detectChanges directly and after and timeout again, to update select fields.
   */
  detectTimeout() {
    this.ref.detectChanges();

    setTimeout(() => this.ref.detectChanges());
  }
}
