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
  Input
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
  EvanModalService
} from 'angular-core';

import {
  prottle
} from 'bcc';

import { ExplorerService } from '../../../services/explorer.service';

/**************************************************************************************************/

@Component({
  selector: 'datacontract-listentry',
  templateUrl: 'listentry.html',
  animations: [ ]
})

/**
 * Used to show an listentry within the datacontract with ace editor
 */
export class ExplorerDataContractListEntryComponent extends AsyncComponent {
  /**
   * id corresponding contract id 
   */
  @Input() contractAddress: string;

  /**
   * header that should be shown within the entry box
   */
  @Input() header: string;

  /**
   * parent object for back reference
   */
  @Input() parent: string;

  /**
   * parameter that should be used.
   */
  @Input() key: string;

  /**
   * parameter that should be used.
   */
  @Input() toggable: boolean;

  /**
   * parent[key] content stringified to show it within ace
   */
  private stringified: string;

  /**
   * analysed data
   */
  private analysis: Array<any>;

  constructor(
    private core: EvanCoreService,
    private bcc: EvanBCCService,
    private alertService: EvanAlertService,
    private qrCodeService: EvanQrCodeService,
    private ref: ChangeDetectorRef,
    private explorerService: ExplorerService,
    private routingService: EvanRoutingService,
    private _DomSanitizer: DomSanitizer,
    private modalService: EvanModalService
  ) {
    super(ref);
  }

  async _ngOnInit() {
    if (typeof this.parent[this.key] === 'object' && this.parent[this.key] !== null) {
      this.stringified = JSON.stringify(this.parent[this.key], null, 2);
    } else {
      this.stringified = this.parent[this.key];
    }

    // initialize analysis object to push values into it
    this.analysis = [ ];
    await this.analyseData();
  }

  /**
   * Try to update the original value.
   *
   * @param      {any}     $event  onChange event
   */
  onChange($event: any) {
    try {
      this.parent[this.key] = JSON.parse(this.stringified);
    } catch (ex) {
      this.parent[this.key] = this.stringified;
    }
  }

  /**
   * Check the data object recursivly for images, account ids, contract addresses, ...
   *
   * @param      {any}     data    data to analyse (default is the provided data), used to work
   *                               recursivly
   * @param      {number}  deep    Count recursive states to avoid endless loops
   * @return     {<type>}  { description_of_the_return_value }
   */
  async analyseData(data:any = this.parent[this.key], fullKey: string = 'entry', deep: number = 0) {
    if (data && typeof data === 'object') {
      const keys = Object.keys(data);
    
      // iterate through all parameters and check for images and so on
      for (let key of keys) {
        // if we have an object, move recursivly through it
        if (typeof data[key] === 'object' && data[key] !== 'undefined') {
          if (data[key].fileType && data[key].file) {
            await this.valueDataAnalyse(data[key], key, fullKey, deep);
          } else if (deep < 20) {
            this.analyseData(data[key], `${ fullKey }.${ key }`, deep + 1);
          }
        } else if (typeof data[key] === 'string') {
          await this.valueDataAnalyse(data[key], key, fullKey, deep);
        }
      }
    }
  }

  /**
   * Check an data entry if we have an string (for accountids, images, ...) or an decrypted value.
   *
   * @param      {any}            data     passed by analyseData data[key]
   * @param      {string}         currKey  the current value key data[=>key]
   * @param      {string}         fullKey  current string including parent history
   * @param      {number}         deep     current recursion deep
   * @return     {Promise<void>}  resolved when done
   */
  async valueDataAnalyse(data:any, currKey: string, fullKey: string, deep: number) {
    // check for decrypted file
    if (typeof data === 'object' && data !== 'undefined' && data.fileType && data.file) {
      // we have decrypted successfully an image :)
      if (data.fileType.indexOf('image/') !== -1) {
        // analyse the blob img
        const file = new Blob([
          data.file
        ], { type: data.fileType });
        const blobUri = ((<any>window).URL || (<any>window).webkitURL).createObjectURL(file);
        this.analysis.push({
          key: `${ fullKey }.${ currKey } (${ data.name })`,
          type: 'img',
          data: this._DomSanitizer.bypassSecurityTrustUrl(blobUri)
        });
      }
    // check if we have an img
    } else if (data.match(/\.(jpeg|jpg|gif|png)$/) !== null || data.indexOf('data:image') === 0) {
      this.analysis.push({
        key: `${ fullKey }.${ currKey }`,
        type: 'img',
        data: this._DomSanitizer.bypassSecurityTrustUrl(data)
      });
    } else if (deep < 20) {
      try {
        // try to parse data from any string
        const jsonData = JSON.parse(data);
       
        // if we could parse an string, try to analyse this object again
        await this.analyseData(jsonData, `${ fullKey }.${ currKey }`, deep + 1);
        
        // if we have an cryptoInfo, try to decrypt it and load the data
        if (jsonData.cryptoInfo) {
          const decrypted = await this.bcc.dataContract.decrypt(
            data,
            this.contractAddress,
            this.core.activeAccount(),
            '*'
          );

          await this.analyseData(decrypted, `${ fullKey }.${ currKey }`, deep + 1);
        }
      } catch (ex) { }
    }
  }

  /**
   * Uses an img and shows it within an modal on full screen
   *
   * @param      {string}         dataUrl  url of the img
   */
  async openPictureDetail(dataUrl) {
    try {
      await this.modalService.showBigPicture(
        'alertTitle',
        'alertText',
        dataUrl,
      );
    } catch (ex) { }
  }
}