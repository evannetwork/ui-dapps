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
  Component, OnInit, ViewChild,     // @angular/core
  DomSanitizer, ChangeDetectorRef, ChangeDetectionStrategy
} from 'angular-libs';

import {
  EvanCoreService,
  EvanBCCService,
  EvanAlertService,
  EvanQrCodeService,
  AsyncComponent,
  EvanRoutingService
} from 'angular-core';

import { ExplorerService } from '../../services/explorer.service';

/**************************************************************************************************/

@Component({
  selector: 'explorer-select',
  templateUrl: 'select.html',
  animations: [ ]
})

/**
 * Insert an contract id, ens address or ipfs hash
 */
export class ExplorerSelectComponent extends AsyncComponent {
  /**
   * value of the current id input
   */
  private id: string;

  /**
   * check if currently the sections are loading
   */
  private sectionLoading: boolean;

  constructor(
    private core: EvanCoreService,
    private bcc: EvanBCCService,
    private alertService: EvanAlertService,
    private qrCodeService: EvanQrCodeService,
    private ref: ChangeDetectorRef,
    private explorerService: ExplorerService,
    private routingService: EvanRoutingService
  ) {
    super(ref);
  }

  /**
   * Set empty id.
   */
  async _ngOnInit() {
    this.id = '';
  }

  /**
   * Loads the sections for the provided id, to check if any data is available. If the cound of
   * sections is grate than 0, open the detail for the id.
   *
   * @return     {Promise<void>}  Resolved when done.
   */
  async open(): Promise<void> {
    this.sectionLoading = true;
    this.ref.detectChanges();

    await this.explorerService.openID(this.id, this.alertService);

    this.sectionLoading = false;
    this.ref.detectChanges();
  }

  /**
   * Scans a qr code and runs the open function.
   *
   * @return     {Promise<void>}  Resolved when done
   */
  async scanQRCode() {
    try {
      this.id = await this.qrCodeService.scanQRCode();

      this.ref.detectChanges();
      this.open();
    } catch (ex) { }
  }

  /**
   * Used to run the open function when the enter key was pressed within the id input.
   *
   * @param      {any}  event   Input event.
   */
  submitOnEnter(event: any) {
    if (event.keyCode === 13) {
      this.open();

      event.stopPropagation();
      return false;
    }
  }
}
