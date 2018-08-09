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
  Component,     // @angular/core
  DomSanitizer,
  ChangeDetectorRef,
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
} from 'angular-core';

import {
  prottle
} from 'bcc';

import { ExplorerService } from '../../services/explorer.service';

/**************************************************************************************************/

@Component({
  selector: 'explorer-datacontract',
  templateUrl: 'datacontract.html',
  animations: [ ]
})

/**
 * Detail wrapper for the whole application when an id was opened
 */
export class ExplorerDataContractComponent extends AsyncComponent {
  /**
   * value of the current selected id
   */
  private id: string;

  /**
   * id corresponding contract id 
   */
  private contractAddress: string;

  /**
   * current logged in users account id
   */
  private activeAccount: string;

  /**
   * disable UI elements if some values are changing
   */
  private updating: boolean;

  /**
   * list of all entries that are available via abi definition
   */
  private entries: any;

  /**
   * start route watching
   */
  private watchRouteChange: Function;

  /**
   * Check if an entry is currently selected, else show hint page
   */
  private entryKey: string;

  /**
   * Used to add new custom entries
   */
  private entryName: string;

  /**
   * reload the router-outlet
   */
  private reloadRouter: boolean;

  /**
   * window size watcher
   */
  private watchWindowSize: Function;

  /**
   * current screen size
   */
  private screenSize: number;

  constructor(
    private core: EvanCoreService,
    private bcc: EvanBCCService,
    private alertService: EvanAlertService,
    private qrCodeService: EvanQrCodeService,
    private ref: ChangeDetectorRef,
    private explorerService: ExplorerService,
    private routingService: EvanRoutingService,
    private _DomSanitizer: DomSanitizer,
  ) {
    super(ref);
  }

  /**
   * Load all entries from dbcp dataSchema
   */
  async _ngOnInit() {
    this.id = this.routingService.getHashParam('id');
    this.activeAccount = this.core.activeAccount();
    this.entryKey = this.routingService.getHashParam('entryKey');

    if (this.explorerService.dataSchema) {
      this.entries = Object.keys(this.explorerService.dataSchema);
    } else {
      this.entries = [ ];
    }

    // if we reload the page on a custom entry, add it to the left panel
    if (this.entryKey && this.entries.indexOf(this.entryKey) === -1) {
      this.entries.push(this.entryKey);
    }

    if (!this.entryKey && this.entries.length > 0) {
      this.routingService.navigate(`./${ this.entries[0] }`);
    }

    this.watchRouteChange = this.routingService.subscribeRouteChange(() => {
      this.entryKey = this.routingService.getHashParam('entryKey');
      this.reloadRouter = true;

      this.ref.detectChanges();

      setTimeout(() => {
        this.reloadRouter = false;
        this.ref.detectChanges();
      });
    });

    this.watchWindowSize = await this.core.utils.windowSize((width) => {
      this.screenSize = width;

      this.ref.detectChanges();
    });
  }

  /**
   * Clear watchers.
   */
  async _ngOnDestroy() {
    this.watchRouteChange();
    this.watchWindowSize();
  }

  /**
   * Add the new custom entry name in to the entries list and navigates to it.
   */
  addEntry() {
    if (this.entryName) {
      // open the new entry
      this.routingService.navigate(`${ this.entryKey ? '..' : '.' }/${ this.entryName }`);

      if (this.entries.indexOf(this.entryName) === -1) {
        // push the new entry into the entries list    
        this.entries.push(this.entryName);
      }

      // clear the name and update all refs
      this.entryName = '';
      this.ref.detectChanges();
    }
  }
}
