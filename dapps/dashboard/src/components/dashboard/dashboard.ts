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
  Component, OnInit,     // @angular/core
  DomSanitizer, ChangeDetectorRef, OnDestroy
} from 'angular-libs';

import {
  EvanCoreService,
  EvanDescriptionService,
  EvanRoutingService,
  createOpacityTransition,
  EvanMailboxService,
  EvanBCCService,
  createRouterTransition,
  AsyncComponent
} from 'angular-core';

/**************************************************************************************************/

@Component({
  selector: 'dashboard-component',
  templateUrl: 'dashboard.html',
  animations: [
    createOpacityTransition(),
    createRouterTransition([])
  ]
})

export class DashboardComponent extends AsyncComponent {
  dapps: Array<any>;
  developerModeSwitch: Function;
  loading: boolean;
  loggingDApp: any;
  watchRouteChange: Function;
  mailUpdate: Function;

  constructor(
    private core: EvanCoreService,
    private bcc: EvanBCCService,
    private descriptionService: EvanDescriptionService,
    private mailboxService: EvanMailboxService,
    private _DomSanitizer: DomSanitizer,
    private ref: ChangeDetectorRef,
    private routingService: EvanRoutingService
  ) {
    super(ref);
  }

  async _ngOnInit() {
    await this.bcc.initialize((accountId) => this.bcc.globalPasswordDialog(accountId));

    // load predefine dapps that should be available as suggestion
    this.dapps = await this.descriptionService.getMultipleDescriptions([
      'favorites',
      'addressbook',
      'mailbox',
      'profile'
    ]);
    this.watchRouteChange = this.routingService.subscribeRouteChange(() => this.ref.detectChanges());
    this.mailUpdate = this.core.utils.onEvent('check-new-mail-update', () => this.ref.detectChanges());

    this.checkDevelopmentMode();
    this.core.finishDAppLoading();
  }

  async _ngOnDestroy() {
    this.watchRouteChange();
    this.developerModeSwitch();
    this.mailUpdate();
  }

  /**
   * Check if developer mode is enabled and add the logging dapp to dashboard apps
   */
  async checkDevelopmentMode(): Promise<any> {
    if (this.core.utils.isDeveloperMode()) {
      if (!this.loggingDApp) {
        this.loggingDApp = await this.descriptionService.getDescription(
          this.descriptionService.getEvanENSAddress('logging')
        );
      }

      if (this.dapps[this.dapps.length - 1].name !== 'logging') {
        this.dapps.push(this.loggingDApp);
      }
    } else if (this.loggingDApp) {
      this.dapps.pop();
    }

    if (!this.developerModeSwitch) {
      this.developerModeSwitch = this.core.utils
        .onEvent('evan-developer-mode', () => this.checkDevelopmentMode());
    }
    
    this.ref.detectChanges();
  }
}
