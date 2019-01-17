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
  Component,     // @angular/core
  DomSanitizer,
  ElementRef,
  NavigationEnd,
  RouterEvent,
  ViewChild,
} from 'angular-libs';

import {
  AnimationDefinition,
  AsyncComponent,
  createOpacityTransition,
  createRouterTransition,
  EvanAlertService,
  EvanBCCService,
  EvanCoreService,
  EvanQrCodeService,
  EvanRoutingService,
  EvanUtilService,
  EvanDescriptionService,
  EvanTranslationService,
} from 'angular-core';

import { ExplorerService } from '../../services/explorer.service';

/**************************************************************************************************/

@Component({
  selector: 'explorer-root',
  templateUrl: 'root.html',
  animations: [
    createRouterTransition([ ]),
    createOpacityTransition()
  ]
})

/**
 * Detail wrapper for the whole application when an id was opened
 */
export class RootComponent extends AsyncComponent {
  /**
   * value of the current selected id
   */
  private id: string;

  /**
   * should the frontend be displayed using raw mode?
   */
  private rawMode: boolean;

  /**
   * input value: new abi definition
   */
  private abi: string;

  /**
   * input value: new dataSchema definition
   */
  private dataSchema: string;

  /**
   * input value: new time travel value
   */
  private timeTravel: boolean;

  /**
   * input value: new blocknumber value
   */
  private blockNumber: string;

  /**
   * sections for the current opened id
   */
  private sections: Array<string>;

  /**
   * event handler for route changes
   */
  private routerChange: any;

  /**
   * Show the detail box for time travel and abi configuration
   */
  private showConfiguration: boolean;

  /**
   * name of the current openend DApp
   */
  private activeDApp: string;

  /**
   * hide and display the router again to reload the inner data
   */
  private reloadRouter: boolean;

  /**
   * current splitpane instance
   */
  @ViewChild('splitPane') splitPane: ElementRef;

  /**
   * the order of the sections that should be displayed
   */
  private sectionOrder: Array<string> = [
    'general',
    'dbcp',
    'transactionhistory',
    'verifications',
    'basecontract',
    'datacontract',
    'datacontract-detail',
    'contractinteraction',
  ];

  constructor(
    private core: EvanCoreService,
    private bcc: EvanBCCService,
    private alertService: EvanAlertService,
    private qrCodeService: EvanQrCodeService,
    private ref: ChangeDetectorRef,
    private explorerService: ExplorerService,
    private routingService: EvanRoutingService,
    private _DomSanitizer: DomSanitizer,
    private utils: EvanUtilService,
    private translateService: EvanTranslationService
  ) {
    super(ref);
  }

  /**
   * Load all sections that should be displayed and sort them using the sections order.
   */
  async _ngOnInit() {
    await this.bcc.initialize((accountId) => this.bcc.globalPasswordDialog(accountId));

    // map nameResolver for quick access
    this.explorerService.nameResolver = this.bcc.nameResolver;

    this.routerChange = this.routingService.router.events.subscribe((event: RouterEvent) => {
      if (event instanceof NavigationEnd) {
        this.loadIDInformation();
      }
    });

    await this.loadIDInformation();
    this.core.finishDAppLoading();
  }

  /**
   * remove route watchers
   */
  async _ngOnDestroy() {
    this.routerChange.unsubscribe();
  }

  /**
   * Load the information about the current route to automatically toggle the top bar
   *
   * @return     {Promise<void>}  Resolved when done
   */
  async loadIDInformation() {
    this.id = this.routingService.getHashParam('id');

    // check active dapp
    this.activeDApp = this.routingService.getDataParam('state');
    this.showConfiguration = false;

    if (this.id) {
      this.translateService.addSingleTranslation(
        this.activeDApp,
        `${ this.id } - ${ this.translateService.instant('_explorer.section.' + this.activeDApp) }`
      );

      // load sections for the current id
      this.sections = await this.explorerService.getExplorerSections(this.id, this.explorerService.abi);
      this.sections.sort((sectionA, sectionB) =>
        this.sectionOrder.indexOf(sectionA) - this.sectionOrder.indexOf(sectionB)
      );

      // check if id is valid and abi was loaded
      await this.explorerService.openID(this.id, this.alertService, this.explorerService.abi,
        this.explorerService.dataSchema);

      // set id translation to genereal information
      this.translateService.addSingleTranslation(
        this.id,
        this.translateService.instant('_explorer.general-infos')
      );

      // set form values
      this.abi = JSON.stringify(this.explorerService.abi, null, 2);
      this.dataSchema = JSON.stringify(this.explorerService.dataSchema, null, 2);
      this.timeTravel = this.explorerService.timeTravel;
      this.blockNumber = this.explorerService.blockNumber;
      this.rawMode = this.explorerService.rawMode;
    }

    this.ref.detectChanges();
  }

  /**
   * Change abi definition, timetravel, blockNumber and reload sections
   *
   * @return     {Promise<void>}  resolved when done
   */
  async useConfiguration() {
    if (this.abi) {
      try {
        this.explorerService.abi = JSON.parse(this.abi);
      } catch (ex) {
        try {
          await this.alertService.showAlert(
            '_explorer.invalid-abi',
            '_explorer.invalid-abi-desc',
          );
        } catch (ex) { }

        return;
      }
    }

    this.explorerService.timeTravel = this.timeTravel;
    this.explorerService.blockNumber = this.blockNumber;
    this.explorerService.rawMode = this.rawMode;

    this.sections = await this.explorerService.getExplorerSections(this.id, this.explorerService.abi);
    this.sections.sort((sectionA, sectionB) =>
      this.sectionOrder.indexOf(sectionA) - this.sectionOrder.indexOf(sectionB)
    );

    if (this.activeDApp !== 'detail' && this.sections.indexOf(this.activeDApp) === -1) {
      this.routingService.navigate('../');
    }

    // set localstorage properties
    window.localStorage['evan-explorer-rawMode'] = this.explorerService.rawMode;

    this.showConfiguration = false;
    this.reloadRouter = true;

    this.ref.detectChanges();

    setTimeout(() => {
      this.reloadRouter = false;

      this.ref.detectChanges();
    }, 500);
  }

  /**
   * Overwrite the splitpane root dapp open function to handle correct relative navigation
   *
   * @param      {any}     dapp    dbcp descript of the dapp that should be opened
   */
  rootDAppOpen(dapp) {
    if (dapp.dapp.standalone) {
      this.routingService.navigate(`/${ dapp.ensAddress }`);
    } else {
      this.routingService.navigate(`./${ this.id }/${ dapp.ensAddress }`, true);
    }
  }

  /**
   * Navigate to explorer root domain.
   */
  goToRoot() {
    this.routingService.navigate(`/explorer.${ getDomainName() }`, true);
  }

  /**
   * Handle backdrop click. Close the configuration box, but only if its not visible
   */
  configurationBackdrop() {
    if (this.showConfiguration) {
      this.showConfiguration = false;

      this.ref.detectChanges();
    }
  }

  /**
   * Choose an abi from the bcc.contracts.
   *
   * @return     {Promise<void>}  resolved when done
   */
  async chooseABIFromContracts() {
    let abi;

    try {
      // ask user to select an contract
      abi = await this.alertService.showSubmitAlert(
        '_explorer.choose-abi-contracts',
        '_explorer.choose-abi-contracts-desc',
        '_explorer.cancel',
        '_explorer.ok',

        // build radio buttons foreach contract
        Object
          .keys(this.bcc.contracts)
          // map them to correct keys
          .map(key => {
            return {
              type: 'radio',
              label: key,
              placeholder: key,
              value: key
            }
          })
          // sort them
          .sort((a, b) => {
            if (a.label.toLowerCase() < b.label.toLowerCase()) return -1;
            if (a.label.toLowerCase() > b.label.toLowerCase()) return 1;
          })
      );
    } catch (ex) {
      return;
    }

    if (abi) {
      this.explorerService.abi = JSON.parse(this.bcc.contracts[abi].interface);
      this.abi = JSON.stringify(this.explorerService.abi, null, 2);
    }

    this.ref.detectChanges();
  }
}
