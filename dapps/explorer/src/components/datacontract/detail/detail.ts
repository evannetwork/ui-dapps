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
  EvanTranslationService,
  EvanToastService
} from 'angular-core';

import {
  prottle
} from 'bcc';

import { ExplorerService } from '../../../services/explorer.service';

/**************************************************************************************************/

@Component({
  selector: 'datacontract-detail',
  templateUrl: 'detail.html',
  animations: [ ]
})

/**
 * Detail wrapper for the whole application when an id was opened
 */
export class ExplorerDataContractDetailComponent extends AsyncComponent {
  /**
   * value of the current selected id
   */
  private id: string;

  /**
   * id corresponding contract id 
   */
  private contractAddress: string;

  /**
   * key of the current entry
   */
  private entryKey: string;

  /**
   * current logged in users account id
   */
  private activeAccount: string;

  /**
   * disable UI elements if some values are changing
   */
  private updating: boolean;

  /**
   * data of the current entry
   */
  private data: any;

  /**
   * entries type (entry / list)
   */
  private type: string;

  /**
   * newListEntryData
   */
  private newListEntry: string;

  /**
   * the current contract instance using the BaseContract Interface
   */
  private baseContract: any;

  /**
   * show loading screen
   */
  private loading: boolean;

  /**
   * load list entries from dfs
   */
  private useDfsStorage: boolean;

  /**
   * load list entries using encypted hashes
   */
  private encryptedHashes: boolean;

  /**
   * default encryption to use
   */
  private encryption: string;

  /**
   * includes loaded permissions to run add / remove listentries and setEntry
   */
  private canCall: any;

  /**
   * display occured error 
   */
  private error: any;

  constructor(
    private core: EvanCoreService,
    private bcc: EvanBCCService,
    private alertService: EvanAlertService,
    private qrCodeService: EvanQrCodeService,
    private ref: ChangeDetectorRef,
    private explorerService: ExplorerService,
    private routingService: EvanRoutingService,
    private _DomSanitizer: DomSanitizer,
    private translateService: EvanTranslationService,
    private toastService: EvanToastService
  ) {
    super(ref);
  }

  /**
   * Load all entries from dbcp dataSchema
   */
  async _ngOnInit() {
    this.id = this.routingService.getHashParam('id');
    this.contractAddress = await this.bcc.nameResolver.getAddress(this.id) || this.id;
    this.activeAccount = this.core.activeAccount();
    this.entryKey = this.routingService.getHashParam('entryKey');

    // set initial loading parameters if we are on a list
    this.useDfsStorage = false;
    this.encryptedHashes = false;
    this.encryption = 'aes';

    // load baseContract data
    this.baseContract = new this.bcc.web3.eth.Contract(
      JSON.parse(this.bcc.contracts.BaseContract.interface),
      this.contractAddress
    );

    await this.loadEntryInformations();
  }

  /**
   * Load all nessecary informations about the current entry.
   *
   * @return     {Promise<void>}  resolved when done
   */
  async loadEntryInformations() {
    try {
      // reset last error
      delete this.error;

      this.translateService.addSingleTranslation(
        this.entryKey,
        `${ this.id } - ${ this.translateService.instant('_explorer.section.datacontract') } - ${ this.entryKey }`
      );

       // is this enty a list?
      const listCount = await this.bcc.dataContract.getListEntryCount(
        this.contractAddress,
        this.entryKey
       );

      // if we get an list count, try to load list entries and show the entry as a list
      if (listCount && listCount > 0) {
        this.type = 'list';
        this.data = [ ];
      } else {
        // if we have no list, try to load the entry data
        this.type = 'entry';
        const data = await this.bcc.dataContract.getEntry(
          this.contractAddress,
          this.entryKey,
          this.core.activeAccount(),
          this.useDfsStorage,
          this.encryptedHashes
        );

        // if we found data, apply it to the entry
        if (data !== '0x0000000000000000000000000000000000000000000000000000000000000000') {
          this.data = data;
        }
      }

      // check permissions
      // load authority
      const authorityAddress = await this.bcc.executor.executeContractCall(this.baseContract, 'authority');
      const authorityContract = await this.bcc.contractLoader.loadContract(
        'DSRolesPerContract',
        authorityAddress
      );

      // check each permission we need
      this.canCall = {
        setEntry: await this.canCallOperation(authorityContract, 'entry', 'set'),
        addListEntries: await this.canCallOperation(authorityContract, 'listentry', 'set'),
        removeListEntries: await this.canCallOperation(authorityContract, 'listentry', 'remove'),
      };
    } catch (ex) {
      this.onListEntryError(ex);
    }
  }

  /**
   * Function that is called when load list entries of the contract list entries component or the
   * this.loadEntryInformations function fails.
   *
   * @param      {Error}   ex      incoming error object
   */
  onListEntryError(ex) {
    this.core.utils.log(this.core.utils.getErrorLog(ex), 'error');
    this.error = ex;

    this.ref.detectChanges();
  }

  /**
   * Check if the current user is permitted to set an operation
   *
   * @param      {any}               authorityContract  to the curren contract mapped
   *                                                    authorityContract
   * @param      {string}            type               type to check for (listentry / entry)
   * @param      {string}            operation          operation to check (set / remove)
   * @return     {Promise<boolean>}  True if able to call operation, False otherwise
   */
  async canCallOperation(authorityContract: any, type: string, operation: string) {
    const sha3 = this.bcc.getWeb3().utils.soliditySha3;

    return await this.bcc.executor.executeContractCall(
      authorityContract,
      'canCallOperation',
      this.activeAccount,
      '0x0000000000000000000000000000000000000000',
      sha3(sha3(sha3(type), sha3(this.entryKey)), sha3(operation))
    );
  }

  /**
   * Load list entries for an data contract entry that has more than zero list entries.
   *
   * @param      {Array<string}   listEntries  all currently loaded list entries
   * @return     {Promise<void>}  resolved when done
   */
  loadListEntries(listEntries: Array<string>) {
    this.data = listEntries;

    this.ref.detectChanges();
  }

    /**
     * Sets the updating property to true, runs a function and removes the loading
     *
     * @param      {Function}       updateFunc   function to run for the update
     * @param      {string}         finishText   text that should be displayed as toast when
     *                                           everything is fine
     * @param      {Function}       customError  custom error function to show a custom alert
     * @return     {Promise<void>}  resolved when done
     */
  async setUpdating(updateFunc: Function, finishText?: string, customError?: Function) {
    let error;
    this.updating = true;
    this.ref.detectChanges();
    
    try {
      await updateFunc();
    } catch (ex) {
      error = ex;
    }

    this.updating = false;
    this.ref.detectChanges();

    if (error) {
      this.core.utils.log(`Error during BaseContract data update: ${ this.core.utils.getErrorLog(error) }`, 'error');

      if (!customError) {
        try {
          this.alertService.showAlert(
            '_explorer.datacontract.invalid-entry-update',
            '_explorer.datacontract.invalid-entry-update-desc',
          );
        } catch (ex) { }
      } else {
        customError(error);
      }
    } else {
      if (finishText) {
        // let the user know, that everything is awesome
        this.toastService.showToast({
          message: finishText,
          duration: 3000
        });
      }
    }
  }

  /**
   * Shows loading and runs _ngOnInit()
   *
   * @return     {Promise<void>}  resolved when done
   */
  async update() {
    this.loading = true;
    this.ref.detectChanges();

    await this.loadEntryInformations();

    this.loading = false;
    this.ref.detectChanges();

    // update change refs to show correct values for checkboxes
    setTimeout(() => this.ref.detectChanges(), 100);
  }

  async getFormattedEntry(listEntry: string) {
    let formatted = listEntry;

    // we can think the provided data should be an json
    if (typeof listEntry === 'string' && listEntry.match(/\{|\}/g)) {
      try {
        formatted = JSON.parse(listEntry);
      } catch (ex) {
        await this.alertService.showSubmitAlert(
          '_explorer.datacontract.format-list-entry-json',
          '_explorer.datacontract.format-list-entry-json-question',
          '_explorer.cancel',
          '_explorer.ok',
        );
      }
    }

    return formatted;
  }

  /**
   * Adds the current newListEntry input as an new list entry
   *
   * @return     {Promise<void>}  resolved when done
   */
  async addListEntry() {
    let formattedListEntry;
    try {
      formattedListEntry = await this.getFormattedEntry(this.newListEntry);
    } catch (ex) {
      // return if the user wants to save an json, but its not valid
      return;
    }

    try {
      await this.alertService.showSubmitAlert(
        '_explorer.datacontract.add-list-entry',
        '_explorer.datacontract.add-list-entry-question',
        '_explorer.cancel',
        '_explorer.ok',
      );
    } catch (ex) {
      return;
    }

    this.setUpdating(async () => {
      await this.bcc.dataContract.addListEntries(
        this.contractAddress,
        this.entryKey,
        [
          formattedListEntry
        ],
        this.activeAccount,
        this.useDfsStorage,
        this.encryptedHashes,
        this.encryption
      );

      await this.update();
      this.ref.detectChanges();
    }, '_explorer.datacontract.listentry-added');
  }

  /**
   * removes an list entry from the cotnract list entries 
   *
   * @param      {<type>}  index   The index
   * @return     {<type>}  { description_of_the_return_value }
   */
  async removeListEntry(index: number) {
    if (this.updating) {
      return;
    }

    try {
      await this.alertService.showSubmitAlert(
        '_explorer.datacontract.remove-listentry',
        '_explorer.datacontract.remove-listentry-question',
        '_explorer.cancel',
        '_explorer.ok',
      );
    } catch (ex) {
      return;
    }

    this.setUpdating(async () => {
      await this.bcc.dataContract.removeListEntry(
        this.contractAddress,
        this.entryKey,
        index,
        this.activeAccount
      );

      await this.update();
    }, '_explorer.datacontract.listentry-removed');
  }

  /**
   * Updates the data of an entry
   *
   * @return     {Promise<void>}  resolved when done
   */
  async updateEntry(data: any = this.data) {
    let formattedData;
    try {
      formattedData = await this.getFormattedEntry(data);
    } catch (ex) {
      // return if the user wants to save an json, but its not valid
      return;
    }

    try {
      await this.alertService.showSubmitAlert(
        '_explorer.datacontract.update-entry',
        '_explorer.datacontract.update-entry-question',
        '_explorer.cancel',
        '_explorer.ok',
      );
    } catch (ex) {
      return;
    }

    this.setUpdating(async () => {
      await this.bcc.dataContract.setEntry(
        this.contractAddress,
        this.entryKey,
        formattedData,
        this.activeAccount,
        this.useDfsStorage,
        this.encryptedHashes,
        this.encryption
      );

      await this.update();
    }, '_explorer.datacontract.entry-updated');
  }
}
