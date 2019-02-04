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
  EvanVerificationService,
  EvanCoreService,
  EvanQueue,
  EvanRoutingService,
  EvanToastService,
  EvanTranslationService,
  QueueId,
} from 'angular-core';

/**************************************************************************************************/

@Component({
  selector: 'evan-profile-container',
  templateUrl: 'container.html',
  animations: [
    createOpacityTransition(),
    createTabSlideTransition(),
    createRouterTransition([
      new AnimationDefinition('detail', '=>', '*', 'right'),
      new AnimationDefinition('verifications', '=>', 'detail', 'left'),
      new AnimationDefinition('verifications', '=>', '*', 'right'),
      new AnimationDefinition('settings', '=>', 'detail', 'left'),
      new AnimationDefinition('settings', '=>', 'verifications', 'left'),
      new AnimationDefinition('settings', '=>', 'payments', 'right'),
      new AnimationDefinition('payments', '=>', '*', 'left'),
    ])
  ]
})

/**
 * Shows the current profile information and provides the possibility to set some configurations
 * for the ui
 */
export class EvanProfileContainerComponent extends AsyncComponent {
  /**
   * current active shown tabs
   */
  private activeTab: number;

  /**
   * watch for route change to be stateful
   */
  private watchRouteChange: Function;

  /**
   * tab order to map them to an url.
   */
  private tabLabels = [ 'account', 'verifications', 'settings', 'payment' ];

  constructor(
    private _DomSanitizer: DomSanitizer,
    private addressBookService: EvanAddressBookService,
    private alertService: EvanAlertService,
    private bcc: EvanBCCService,
    private verificationService: EvanVerificationService,
    private core: EvanCoreService,
    private queue: EvanQueue,
    private ref: ChangeDetectorRef,
    private toastService: EvanToastService,
    private translateService: EvanTranslationService,
    private routingService: EvanRoutingService,
  ) {
    super(ref);
  }

  /**
   * Set initial values and load the profile information
   *
   * @return     {Promise<void>}  resolved when done
   */
  async _ngOnInit() {
    this.activeTab = 0;
    this.watchRouteChange = this.routingService.subscribeRouteChange(() => this.ref.detectChanges());
  }

  /**
   * Remove route watcher.
   */
  async _ngOnDestroy() {
    this.watchRouteChange();
  }

  /**
   * Actives the new chosen tab.
   *
   * @param      {string}   route   route name to check
   * @return     {boolean}  True if active, False otherwise
   */
  isActive(route: string) {
    return window.location.hash.indexOf(route) !== -1;
  }
}
