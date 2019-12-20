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
*/

import {
  Component,     // @angular/core
  DomSanitizer,
  ChangeDetectorRef,
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
  EvanAddressBookService,
  EvanTranslationService,
} from '@evan.network/ui-angular-core';

import {
  prottle,
} from '@evan.network/api-blockchain-core';

import { ExplorerService } from '../../../services/explorer.service';

/**************************************************************************************************/

@Component({
  selector: 'explorer-transaction-detail',
  templateUrl: 'detail.html',
  animations: [ ]
})

/**
 * Detail wrapper for the whole application when an id was opened
 */
export class ExplorerTransactionDetailComponent extends AsyncComponent {
  /**
   * value of the current selected id
   */
  private id: string;

  /**
   * id corresponding contract id 
   */
  private contractAddress: string;

  /**
   * current transaction hash
   */
  private transactionHash: string;

  /**
   * loaded transaction
   */
  private transaction: any;

  /**
   * transaction signature matches function signature of the abi 
   */
  private abiFunc: any;

  /**
   * transform inputs into an readable format
   */
  private abiFuncInputs: string;

  /**
   * current transactions function signature
   */
  private funcSig: string;

  /**
   * current users addressbook
   */
  private contacts: any;

  /**
   * calculated gas as eve number
   */
  private gas2EVE: number;

  /**
   * stringified transaction
   */
  private stringifiedTransaction: string;

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
    private addressBook: EvanAddressBookService
  ) {
    super(ref);
  }

  /**
   * load url parameters, transaction details and check for a matching abi function
   *
   * @return     {Promise<void>}  Resolved when done
   */
  async _ngOnInit() {
    this.id = this.routingService.getHashParam('id');
    this.transactionHash = this.routingService.getHashParam('transactionhash');
    this.contacts = await this.addressBook.loadAccounts();

    // add correct dapp-wrapper title
    this.translateService.addSingleTranslation(
      this.transactionHash,
      `${ this.id } - ${ this.translateService.instant('_explorer.section.transactionhistory') } - ${ this.transactionHash }`
    );

    // load the transaction details
    this.transaction = await this.bcc.getWeb3().eth.getTransaction(this.transactionHash);
    this.funcSig = this.transaction.input.substr(0, 10);
    this.gas2EVE = (this.transaction.gas * (this.transaction.gasPrice / 1000000000)) / 1000000000;

    // check for matching abi func signature
    if (this.explorerService.abi) {
      for (let i = 0; i < this.explorerService.abi.length; i++) {
        if (this.explorerService.abi[i].signature === this.funcSig) {
          this.abiFunc = this.explorerService.abi[i];

          this.abiFuncInputs = this.abiFunc.inputs
            .map(input => `${ input.name}: ${ input.type }`)
            .join(', ');
        }
      }
    }

    this.stringifiedTransaction = JSON.stringify(this.transaction, null, 2);
  }
}