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
  getDomainName,
  lightwallet
} from 'dapp-browser';

import {
  Component, OnInit,      // @angular/core
  TranslateService,       // @ngx-translate/core
  NavController,          // ionic-angular
  DomSanitizer, ChangeDetectorRef
} from 'angular-libs';

import {
  AnimationDefinition,
  AsyncComponent,
  createOpacityTransition,
  createRouterTransition,
  createTabSlideTransition,
  EvanAddressBookService,
  EvanAlertService,
  EvanCoreService,
  EvanToastService,
  EvanTranslationService
} from 'angular-core';

/**************************************************************************************************/

@Component({
  selector: 'profile',
  templateUrl: 'profile.html',
  animations: [
    createOpacityTransition(),
    createTabSlideTransition()
  ]
})

/**
 * Shows the current profile informations and provides the possibility to set some configurations
 * for the ui
 */
export class ProfileComponent extends AsyncComponent {
  /**
   * current active shown tabs
   */
  private activeTab: number;

  /**
   * balance of the current user
   */
  private balance: number;

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
  private loading: boolean;

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
   * check if the balance was loaded before, only show toast message on later refreshs
   */
  private balanceWasLoaded: boolean;

  constructor(
    private addressBookService: EvanAddressBookService,
    private _DomSanitizer: DomSanitizer,
    private alertService: EvanAlertService,
    private core: EvanCoreService,
    private toastService: EvanToastService,
    private ref: ChangeDetectorRef,
    private translateService: EvanTranslationService
  ) {
    super(ref);
  }

  /**
   * Set initial values and load the profile informations
   *
   * @return     {Promise<void>}  resolved when done
   */
  async _ngOnInit() {
    this.activeTab = 0;
    this.getDomainName = getDomainName;

    await this.refreshAccount();
  }

  /**
   * Load the current profile and check the current configurations
   *
   * @return     {Promise<void>}  resolved when done
   */
  async refreshAccount() {
    this.loading = true;
    this.ref.detectChanges();

    this.activeAccount = this.core.activeAccount();

    this.myProfile = await this.addressBookService.loadAccount(this.activeAccount);
    this.developerMode = this.core.utils.isDeveloperMode();
    this.notificationsEnabled = this.core.utils.notificationsEnabled();

    await this.loadBalance();

    this.loading = false;
    this.ref.detectChanges();
  }

  /**
   * Load the balance for the current activeAccount and show an toast message.
   *
   * @return     {Promise<void>}  resolved when done
   */
  async loadBalance() {
    this.balance = await this.core.getBalance(this.activeAccount);

    // only show the toast, when the user clicks explicit on the reload button
    if (this.balanceWasLoaded) {
      this.toastService.showToast({
        message: '_dappprofile.balance-updated',
        duration: 2000
      });
    }

    this.balanceWasLoaded = true;
    this.ref.detectChanges();
  }

  /**
   * Ask if the user wants realy a logout and then logout the current user.
   *
   * @return     {Promise<void>}  resolved when done
   */
  async logout() {
    try {
      await this.alertService.showSubmitAlert(
        '_dappprofile.logout',
        '_dappprofile.logout-desc',
        '_dappprofile.cancel',
        '_dappprofile.logout',
      );

      this.core.logout();
    } catch (ex) { }
  }

  /**
   * Load the private key from the current valut and copies it into the clipboard.
   *
   * @return     {Promise<void>}  resolved when done
   */
  async copyPrivateKey() {
    try {
      await this.alertService.showSubmitAlert(
        '_dappprofile.export-privatekey',
        '_dappprofile.export-privatekey-desc',
        '_dappprofile.cancel',
        '_dappprofile.export-privatekey-ok',
      );

      // load the current vault, unlock it and export the privatekey
      const vault = await lightwallet.loadUnlockedVault();  
      const privateKey = lightwallet.getPrivateKey(vault, this.core.activeAccount());

      this.core.copyString(
        privateKey,
        this.translateService.instant('_dappprofile.privatekey-exported')
      );
    } catch (ex) { }
  }

  /**
   * Load the encryption key from the current valut and copies it into the clipboard.
   *
   * @return     {Promise<void>}  resolved when done
   */
  async copyEncryptionKey() {
    try {
      await this.alertService.showSubmitAlert(
        '_dappprofile.export-encryptionkey',
        '_dappprofile.export-encryptionkey-desc',
        '_dappprofile.cancel',
        '_dappprofile.export-encryptionkey-ok',
      );

      // load the current vault, unlock it and export the encryptionkey
      const vault = await lightwallet.loadUnlockedVault();  
      const encryptionKey = await lightwallet.getEncryptionKey();

      this.core.copyString(
        encryptionKey,
        this.translateService.instant('_dappprofile.encryptionkey-exported')
      );
    } catch (ex) { }
  }

  /**
   * Actives the new chosen tab.
   *
   * @param      {number}  index   index of the tab that should be displayed.
   */
  activateTab(index: number) {
    this.activeTab = index;

    this.ref.detectChanges();
    setTimeout(() => this.ref.detectChanges(), 500);
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
}
