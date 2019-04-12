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
  ChangeDetectorRef,
  Component,     // @angular/core
  DomSanitizer,
  ViewChild
} from '@evan.network/ui-angular-libs';

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
  createTabSlideTransition,
  EvanTranslationService,
  EvanToastService
} from '@evan.network/ui-angular-core';

import { ExplorerService } from '../../services/explorer.service';

/**************************************************************************************************/

@Component({
  selector: 'explorer-dbcp',
  templateUrl: 'dbcp.html',
  animations: [
    createTabSlideTransition()
  ]
})

/**
 * TODO: Implement selector for several available DBCP's
 *   E.g. lindig.evan => DBCP for lindig.evan ENS Address, DBCP for underlaying business center 
 */

/**
 * Detail wrapper for the whole application when an id was opened
 */
export class ExplorerDBCPComponent extends AsyncComponent {
  /**
   * value of the current selected id
   */
  private id: string;

  /**
   * id corresponding contract id 
   */
  private contractAddress: string;

  /**
   * dbcp definition of this id
   */
  private fullDBCP: any;

  /**
   * public part of the dbcp definition of this id
   */
  private dbcp: any;

  /**
   * stringified dbcp definition of this id
   */
  private dbcpString: string;

  /**
   * current displayed dbcp data tab
   */
  private activeTab: number = 0;

  /**
   * hide / show the save button
   */
  private showUpdateDBCP: boolean;

  /**
   * is the description is saving?
   */
  private updating: boolean;

  /**
   * dbcp abi => stringified
   */
  private abi: string;

  constructor(
    private _DomSanitizer: DomSanitizer,
    private alertService: EvanAlertService,
    private bcc: EvanBCCService,
    private core: EvanCoreService,
    private explorerService: ExplorerService,
    private qrCodeService: EvanQrCodeService,
    private ref: ChangeDetectorRef,
    private routingService: EvanRoutingService,
    private toastService: EvanToastService,
    private translateService: EvanTranslationService
  ) {
    super(ref);
  }

  /**
   * Load all sections that should be displayed and sort them using the sections order.
   */
  async _ngOnInit() {
    this.id = this.routingService.getHashParam('id');

    if (this.id.indexOf('0x') !== 0) {
      // load the contract address for the current id
      const contractAddress = await this.explorerService.nameResolver.getAddress(this.id);

      try {
        // check if a description can be loaded for the contract address
        const contractAddressDescription = await this.bcc.description.getDescriptionFromContract(
          contractAddress,
          this.core.activeAccount()
        );

        // if a description for the contract could be loaded, we are viewing the contract
        // description else a underlaying contract is available, but has no description (e.g.
        // dashboard ens address with underlaying deployed business center on the same ens address)
        if (contractAddressDescription) {
          this.fullDBCP = contractAddressDescription;
          this.contractAddress = contractAddress;
        }
      } catch (ex) { }
    } else {
      this.contractAddress = this.id;
    }

    // load dbcp information, if it wasnt loaded before by the getDescriptionFromContract call
    if (!this.fullDBCP) {
      try {
        this.fullDBCP = await this.bcc.description.getDescription(this.id, this.core.activeAccount());
      } catch (ex) {
        this.fullDBCP = null
      }

      // fill empty dbcp
      if (this.fullDBCP === null) {
        this.fullDBCP = {
          public: { },
          private: { },
        };
      }
    }
    
    // stringify them for raw mode with a 2 space indent
    this.dbcpString = JSON.stringify(this.fullDBCP, null, 2);

    // set dbcp object to the fullDBCP.public, to handle easier property paths
    this.dbcp = this.fullDBCP.public;

    /**
     * try to parse abis from dbcp
     */
    try {
      this.abi = JSON.stringify(this.dbcp.abis, null, 2);
    } catch (ex) { }

    // prefill tags (for testing)
    this.dbcp.tags = this.dbcp.tags || [ ];

    // fill empty i18n values
    this.dbcp.i18n = this.dbcp.i18n || { };
    this.dbcp.i18n.name = this.dbcp.i18n.name || { };
    this.dbcp.i18n.description = this.dbcp.i18n.description || { };

    // fill empty versions
    this.dbcp.versions = this.dbcp.versions || { };

    // fill empty dapp
    this.dbcp.dapp = this.dbcp.dapp || { };
    this.dbcp.dapp.dependencies = this.dbcp.dapp.dependencies || { };

    this.showUpdateDBCP = await this.canUpdateDBCP();
  }

  /**
   * update change refs to show correct values for checkboxes
   */
  async _ngAfterViewInit() {
    setTimeout(() => this.ref.detectChanges(), 100);
  }

  /**
   * Check if the user has permissions to update the DBCP. If a contractAddress is avilable, load it
   * from the contract, else load it for the ens address.
   *
   * @return     {boolean}  True if able to update dbcp, False otherwise
   */
  async canUpdateDBCP(): Promise<boolean> {
    let canUpdate = false;
    let activeAccount = this.core.activeAccount();

    if (this.contractAddress) {
      canUpdate = await this.explorerService.isUserOwnerOrAdmin(this.contractAddress);
    } else {
      // check if user is able to update the current id as a ENS address
      const ensHash = this.explorerService.nameResolver.namehash(this.id);
      // load contract with the AbstractENS interface for the current ens address 
      const ensContract = await this.bcc.contractLoader.loadContract(
        'AbstractENS',
        this.explorerService.nameResolver.config.ensAddress
      );

      // get the owner of the ens contract
      const ensOwner = await this.bcc.executor.executeContractCall(ensContract, 'owner', ensHash);

      // if the current user is the owner, the data can be updated
      if (ensOwner === activeAccount) {
        canUpdate = true;
      }
    }

    return canUpdate;
  }

  /**
   * Set the activeTab to the provided index.
   *
   * @param      {number}  index   index of the tab that should be displayed
   */
  activateTab(index: number) {
    this.activeTab = index;

    this.ref.detectChanges();

    setTimeout(() => this.ref.detectChanges(), 500);
  }

  /**
   * Update the current DBCP description.
   *
   * @return     {Promise<void>}  Resolved when done
   */
  async updateDBCP() {
    // ask the user, if he realy want to update the data
    try {
      await this.alertService.showSubmitAlert(
        '_explorer.dbcp.update-question',
        '_explorer.dbcp.update-question-desc',
        '_explorer.cancel',
        '_explorer.ok',
      );
    } catch (ex) {
      return;
    }

    // if we are in rawMode, parse the current dbcpString and set the fullDBCP
    if (this.explorerService.rawMode) {
      try {
        this.fullDBCP = JSON.parse(this.dbcpString);
      } catch (ex) {
        try {
          await this.alertService.showAlert(
            '_explorer.dbcp.invalid-dbcp',
            '_explorer.dbcp.invalid-dbcp-desc',
          );
        } catch (ex) { }
      }
    } else {
      // back parse abi (was transformed to string at the beginning for edition)
      if (this.abi) {
        try {
          this.dbcp.abis = JSON.parse(this.abi);
        } catch (ex) {
          try {
            await this.alertService.showAlert(
              '_explorer.invalid-abi',
              '_explorer.invalid-abi-desc',
            );
          } catch (ex) { }

          return;
        }
      } else {
        delete this.dbcp.abis;
      }
    }

    // show loading
    this.updating = true;
    this.ref.detectChanges();

    try {
      // set the description
      await this.bcc.description.setDescription(
        this.contractAddress || this.id,
        this.fullDBCP,
        this.core.activeAccount()
      );

      // let the user know, that everything is awesome
      this.toastService.showToast({
        message: '_explorer.dbcp.updated-successfully',
        duration: 3000
      });
    } catch (ex) {
      // set error message
      let errorMessage = ex.message;

      // parse the fields to show it better readable
      if (ex.message.indexOf('description invalid: ') !== -1) {
        // set initial params are missing message 
        errorMessage = this.translateService.instant('_explorer.dbcp.params-missing');

        // add missing fields
        const errorList = JSON.parse(ex.message.replace('description invalid:', ''));
        errorMessage += errorList
          .map(error => error.params.missingProperty)
          .join(', ');
      }

      // let the user know, that everything is awesome
      try {
        this.alertService.showAlert(
          '_explorer.dbcp.updated-fail',
          errorMessage,
        );
      } catch (ex) { }

      this.core.utils.log(`Error while updating description: ${ ex.message } : ${ ex.stack }`, 'error');
    }

    // hide loading
    this.updating = false;
    this.ref.detectChanges();
  }

  /**
   * Add a new version to the version object.
   *
   * @return     {Promise<void>}  Resolved when done.
   */
  async addVersion() {
    let version;

    try {
      // shows an alert, where the version key should be entered
      const result = await this.alertService.showSubmitAlert(
        '_explorer.dbcp.add-version',
        '_explorer.dbcp.add-version-desc',
        '_explorer.cancel',
        '_explorer.ok',
        [
          {
            type: 'text',
            label: '_explorer.dbcp.version-key',
            placeholder: '_explorer.dbcp.version-key',
            value: '',
            required: true
          }
        ]
      );

      // use first returned value as input result
      const version = result[0];

      // if no version was specified or its not a valid version key, show an error
      if (!version || !version.match(/^(?:\^|~)?\d+\.\d+\.\d+$/)) {
        try {
          return this.alertService.showAlert(
            '_explorer.dbcp.invalid-version-key',
            '_explorer.dbcp.invalid-version-key-desc',
          );
        } catch (ex) { }
      }

      if (this.dbcp.versions[version]) {
        try {
          return this.alertService.showAlert(
            '_explorer.dbcp.version-already-exists',
            '_explorer.dbcp.version-already-exists-desc',
          );
        } catch (ex) { }
      }

      this.dbcp.versions[version] = '';
    } catch (ex) {
      console.error(ex);
    }

    this.ref.detectChanges();
  }

    /**
   * Add a new version to the version object.
   *
   * @return     {Promise<void>}  Resolved when done.
   */
  async addLangKey(i18nObj: any) {
    let version;

    try {
      // shows an alert, where the version key should be entered
      const result = await this.alertService.showSubmitAlert(
        '_explorer.dbcp.add-lang-key',
        '_explorer.dbcp.add-lang-key-desc',
        '_explorer.cancel',
        '_explorer.ok',
        [
          {
            type: 'text',
            label: '_explorer.dbcp.lang-key',
            placeholder: '_explorer.dbcp.lang-key',
            value: '',
            required: true
          }
        ]
      );

      // use first returned value as input result
      const langKey = result[0];

      // if no version was specified or its not a valid version key, show an error
      if (!langKey) {
        try {
          return this.alertService.showAlert(
            '_explorer.dbcp.invalid-lang-key',
            '_explorer.dbcp.invalid-lang-key-desc',
          );
        } catch (ex) { }
      }

      if (i18nObj[langKey]) {
        try {
          return this.alertService.showAlert(
            '_explorer.dbcp.lang-key-exists',
            '_explorer.dbcp.lang-key-exists-desc',
          );
        } catch (ex) { }
      }

      i18nObj[langKey] = '';
    } catch (ex) {
      console.error(ex);
    }

    this.ref.detectChanges();
  }

  /**
   * Removes a key from an object (angular dom dont know "delete" statement)
   *
   * @param      {any}     obj     object, where the key should be deleted
   * @param      {string}  key     key that should be delete from the object
   */
  deleteKey(obj: any, key: string) {
    delete obj[key];

    this.ref.detectChanges();
  }
}
