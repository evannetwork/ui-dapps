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
  EvanTranslationService
} from 'angular-core';

import { ExplorerService } from '../../services/explorer.service';

/**************************************************************************************************/

@Component({
  selector: 'explorer-general',
  templateUrl: 'general.html',
  animations: [ ]
})

/**
 * Detail wrapper for the whole application when an id was opened
 */
export class ExplorerContractGeneralComponent extends AsyncComponent {
  /**
   * value of the current selected id
   */
  private id: string;

  /**
   * loaded dbcp to check if an dapp can be opnend
   */
  private dbcp: any;

  /**
   * id corresponding contract id 
   */
  private contractAddress: string;

  /**
   * the created date of the contract
   */
  private created: number;

  /**
   * the created date of the contract
   */
  private owner: string;

  /**
   * contract type
   */
  private contractType: string;

  /**
   * balance of the current contract
   */
  private balance: number;

  constructor(
    private _DomSanitizer: DomSanitizer,
    private alertService: EvanAlertService,
    private bcc: EvanBCCService,
    private core: EvanCoreService,
    private explorerService: ExplorerService,
    private qrCodeService: EvanQrCodeService,
    private ref: ChangeDetectorRef,
    private routingService: EvanRoutingService,
    private translateService: EvanTranslationService
  ) {
    super(ref);
  }

  /**
   * Load the basic informations about the current contract
   */
  async _ngOnInit() {
    this.id = this.routingService.getHashParam('id');

    if (this.id.indexOf('0x') !== 0) {
      this.contractAddress = await this.bcc.nameResolver.getAddress(this.id);
    } else {
      this.contractAddress = this.id;
    }

    if (!this.contractAddress) {
      this.contractAddress = '----';
    }

    if (this.contractAddress && this.contractAddress !== '----') {
      try {
        // load baseContract data
        const baseContract = new this.bcc.web3.eth.Contract(
          JSON.parse(this.bcc.contracts.BaseContract.interface),
          this.contractAddress
        );
        // get created and contractType from contract
        this.created = await this.bcc.executor.executeContractCall(baseContract, 'created') * 1000;
        this.contractType = await this.bcc.executor.executeContractCall(baseContract, 'contractType');
      } catch (ex) {
        this.core.utils.log(`Could not load BaseContract informations: ${ ex.message }`, 'warning');
      }

      try {
        // load the owner from the DSAuth interface
        const authContract = new this.bcc.web3.eth.Contract(
          JSON.parse(this.bcc.contracts.DSAuth.interface),
          this.contractAddress
        );
        this.owner = await this.bcc.executor.executeContractCall(authContract, 'owner');
      } catch (ex) {
        this.core.utils.log(`Could not load DSAuth informations: ${ ex.message }`, 'warning');
      }

      this.balance = await this.bcc.web3.eth.getBalance(this.contractAddress);
    }

    try {
      this.dbcp = await this.bcc.description.getDescription(this.id, this.core.activeAccount());
    } catch (ex) {
      this.core.utils.log(`Could not load DBCP informations: ${ ex.message }`, 'warning');
    }
  }

  /**
   * Starts the application within the explorer.
   *
   * @return     {<type>}  { description_of_the_return_value }
   */
  openDApp() {
    this.routingService.navigate(`/${ this.id }`);
  }
}
