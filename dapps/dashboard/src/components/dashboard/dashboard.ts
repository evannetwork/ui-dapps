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
  getDomainName
} from 'dapp-browser';

import {
  ChangeDetectorRef,
  Component,
  DomSanitizer,
  OnDestroy,
  OnInit,
  ViewChild,
} from 'angular-libs';

import {
  AsyncComponent,
  createOpacityTransition,
  createRouterTransition,
  EvanBCCService,
  EvanCoreService,
  EvanDescriptionService,
  EvanMailboxService,
  EvanRoutingService,
  EvanUtilService,
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
  watchRouteChange: Function;
  mailUpdate: Function;

  /**
   * dashboard.evan dbcp description
   */
  private dashboardDbcp: any;

  /**
   * copy from original split-pane to display colors for dark and light them
   */
  private smallToolbar: boolean;

  /**
   * list of all dapps that should be displayed always
   */
  private defaultDApps: Array<any>;

  /**
   * all dapps, that should be displayed, when dev mode is enabled
   */
  private devDApps: Array<any>;

  /**
   * splitpane component
   */
  @ViewChild('splitPane') splitPane: any;

  constructor(
    private _DomSanitizer: DomSanitizer,
    private bcc: EvanBCCService,
    private core: EvanCoreService,
    private descriptionService: EvanDescriptionService,
    private mailboxService: EvanMailboxService,
    private ref: ChangeDetectorRef,
    private routingService: EvanRoutingService,
    private utils: EvanUtilService,
  ) {
    super(ref);
  }

  async _ngOnInit() {
    await this.bcc.initialize((accountId) => this.bcc.globalPasswordDialog(accountId));

    // load dashboard dbcp to overwrite original split-pane icons for dark and light mode
    this.dashboardDbcp = await this.descriptionService.getDescription(`dashboard.${ getDomainName() }`);

    // load predefine dapps that should be available as suggestion
    this.defaultDApps = await this.descriptionService.getMultipleDescriptions([
      'favorites',
      'addressbook',
      'claims',
      'mailbox',
      'profile'
    ]);
    this.watchRouteChange = this.routingService.subscribeRouteChange(() => this.ref.detectChanges());
    this.mailUpdate = this.core.utils.onEvent('check-new-mail-update', () => this.ref.detectChanges());
    this.smallToolbar = window.localStorage['evan-small-toolbar'] === 'true';

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
      if (!this.devDApps) {
        this.devDApps = await this.descriptionService.getMultipleDescriptions([
          'logging',
          'explorer',
          'bccdocs',
          'uidocs',
        ]);
      }

      this.dapps = [ ].concat(this.defaultDApps, this.devDApps);
    } else {
      this.dapps = this.defaultDApps;
    }

    if (!this.developerModeSwitch) {
      this.developerModeSwitch = this.core.utils
        .onEvent('evan-developer-mode', () => this.checkDevelopmentMode());
    }
    
    this.ref.detectChanges();
  }

  /**
   * toggle toolbar small / big
   */
  toggleSmallToolbar() {
    this.smallToolbar = !this.smallToolbar;

    window.localStorage['evan-small-toolbar'] = this.smallToolbar;

    this.splitPane.smallToolbar = this.smallToolbar;

    this.ref.detectChanges();
    this.splitPane.ref.detectChanges();
  }
}
