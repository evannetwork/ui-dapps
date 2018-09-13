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
  EvanAddressBookService,
} from 'angular-core';

import {
  prottle,
} from 'bcc';

import { ExplorerService } from '../../services/explorer.service';

/**************************************************************************************************/

@Component({
  selector: 'explorer-transactionhistory',
  templateUrl: 'transactionhistory.html',
  animations: [ ]
})

/**
 * Detail wrapper for the whole application when an id was opened
 */
export class ExplorerTransactionHistoryComponent extends AsyncComponent {
  /**
   * value of the current selected id
   */
  private id: string;

  /**
   * id corresponding contract id 
   */
  private contractAddress: string;

  /**
   * current providers web3 for quick access
   */
  private web3: any;

  /**
   * all contract specific transactions
   */
  private transactions: Array<any>;

  /**
   * Block batches to load
   */
  private loadBlockCount: any = 100;

  /**
   * Block batches to load
   */
  private blocksToLoad: number;

  /**
   * Block batches to load
   */
  private loadTransactionCount: any = 5;

  /**
   * load until transactions are loaded
   */
  private transactionsToLoad: number;

  /**
   * web3.eth.getBlock(); lowest loaded block instance
   */
  private lastBlock: any;

  /**
   * web3.eth.getBlock('latest'); highest loaded block instance
   */
  private heighestBlock: any;

  /**
   * display loading symbol for loading more blocks
   */
  private loadMore: boolean;

  /**
   * current users addressbook
   */
  private contacts: any;

  /**
   * used to reducre amount of ref updates that are called
   */
  private refTimeout: any;

  /**
   * Stop the current loading
   */
  private stopLoading: boolean;

  /**
   * Ref update is called multiple times shortly, update it after the refTimout
   */
  private callRefAfterTimeout: boolean;

  constructor(
    private core: EvanCoreService,
    private bcc: EvanBCCService,
    private alertService: EvanAlertService,
    private qrCodeService: EvanQrCodeService,
    private ref: ChangeDetectorRef,
    private explorerService: ExplorerService,
    private routingService: EvanRoutingService,
    private _DomSanitizer: DomSanitizer,
    private addressBook: EvanAddressBookService
  ) {
    super(ref);
  }

  /**
   * Load all sections that should be displayed and sort them using the sections order.
   */
  async _ngOnInit() {
    this.id = this.routingService.getHashParam('id');
    this.contractAddress = await this.bcc.nameResolver.getAddress(this.id) || this.id;
    this.web3 = this.bcc.getWeb3();
    this.transactions = [ ];

    // load addressbook to check for aliases
    this.contacts = await this.addressBook.loadAccounts();

    // load the latest block and load downwards
    this.lastBlock = this.heighestBlock = await this.web3.eth.getBlock('latest');

    // load first bunch of blocks
    const cachedBlockCount = Object.keys(this.explorerService.blocks).length;
    if (cachedBlockCount > 0) {
      this.loadMoreBlocks(cachedBlockCount);
    } else {
      this.loadMoreTransactions();
    }

    // register block emitter listener
    this.web3.eth.subscribe('newBlockHeaders').on('data', async (blockHeader) => {
      this.heighestBlock = await this.loadBlock(blockHeader.number, true);
    });
  }

  async _ngOnDestroy() {
    this.stopLoading = true;
  }

  /**
   * Call ref update only every 500ms.
   */
  timeoutRefDetect() {
    if (!this.refTimeout) {
      this.ref.detectChanges();

      // set a ref update timeout
      this.refTimeout = setTimeout(() => {
        delete this.refTimeout;

        // if another ref should be updated during the timeout, update it
        if (this.callRefAfterTimeout) {
          this.callRefAfterTimeout = false;
          this.ref.detectChanges();
        }
      }, 500);
    } else {
      this.callRefAfterTimeout = true;
    }
  }

  /**
   * Load transactions until the current selected loadTransactionCount is reached
   *
   * @return     {Promise<void>}  Resolved when done
   */
  async loadMoreTransactions() {
    this.loadMore = true;
    this.timeoutRefDetect()

    // calculate transactions that should be reached
    this.transactionsToLoad = this.transactions.length + this.loadTransactionCount;

    // search until the transaction count is reached or we have the latest block
    while (this.transactions.length < this.transactionsToLoad && this.lastBlock.number !== 0 &&
      !this.stopLoading) {
      await this._loadMoreBlocks(100,);
    }

    delete this.transactionsToLoad;
    this.stopLoading = false;
    this.loadMore = false;
    this.timeoutRefDetect()
  }

  /**
   * Load X blocks until loadBlockCount is reached
   *
   * @param      {number}         loadBlockCount  amount of blocks to load
   * @return     {Promise<void>}  resolved when done
   */
  async loadMoreBlocks(loadBlockCount: any = this.loadBlockCount) {
    this.loadMore = true;
    this.timeoutRefDetect()

    await this._loadMoreBlocks(loadBlockCount);

    this.loadMore = false;
    this.stopLoading = false;
    this.timeoutRefDetect()
  }

  /**
   * Load X blocks until the blocksToLoad parameter is reached
   *
   * @param      {any}            blocksToLoad  blocks to load (number or 'all')
   * @return     {Promise<void>}  resolved when done
   */
  async _loadMoreBlocks(blocksToLoad: any) {
    // load until the loadBlockFrom - blocksToLoad is reached
    // save as local variable, this.lastBlock will be overwritten to show status within frontend
    // reduce it by one, the current lastBlock was already loaded
    const loadBlockFrom = this.lastBlock.number - 1;

    // check the blocks to load
    // if we are under zero or the user selected 'all' load all remaining blocks
    if ((blocksToLoad === 'all') || (loadBlockFrom - blocksToLoad < 0)) {
      blocksToLoad = loadBlockFrom + 1;
    }

    // show it in the frontend, which blocks should be synced
    this.blocksToLoad = (this.heighestBlock.number - this.lastBlock.number) + blocksToLoad;

    // create an iterator array to load the next X blocks
    let iterator:Array<number> = Array
      .apply(null, { length: blocksToLoad })
      .map((empty, index) => index);

    // if we are able to load more blocks, load them
    if (iterator.length > 0) {
      await prottle(100, iterator.map((index: number) => async () => {
        if (!this.stopLoading) {
          try {
            const block = await this.loadBlock(loadBlockFrom - index);

            // set the latest loaded block
            if (!this.lastBlock || this.lastBlock.number > block.number) {
              this.lastBlock = block;
              this.timeoutRefDetect()
            }
          } catch (ex) { 
            this.core.utils.log(this.core.utils.getErrorLog(ex), 'warning');
          }
        }
      }));
    }

    // reset the load count
    delete this.blocksToLoad;
  }

  /**
   * Takes a blocknumber and checks for contract specific transactions
   *
   * @param      {number|any}     block   block number or block instance
   * @return     {Promise<void>}  resolved when done
   */
  async loadBlock(block: number|any, reload?: boolean) {
    // check if the provided block is not an object (object already loaded instance)
    if (!isNaN(block)) {
      // if the block was cached before and it shouldnt be reloaded, use the cache
      if (this.explorerService.blocks[block] && !reload) {
        block = this.explorerService.blocks[block];
      } else {
        // else load the block
        block = this.explorerService.blocks[block] = await this.web3.eth.getBlock(block);
      }
    }

    // when the block transactions were not loaded before, load them
    if (!block.loaded) {
      if (block.transactions.length > 0) {
        const blockTransactions = [];

        // load all transactions
        await prottle(10, block.transactions.map(transaction => async () => {
          blockTransactions.push(await this.web3.eth.getTransaction(transaction));
        }));

        block.transactions = blockTransactions;
      }

      block.loaded = true;
    }

    this.checkAndCallContractUpdates(block);

    return block;
  }

    /**
   * checks every block transaction if the target is a contract we 
   * currently watching and executes the filter and event function
   *
   * @param      {any}  block   block information including transactions details
   */
  checkAndCallContractUpdates(block) {
    if (block.transactions.length > 0) {
      // when we have more than zero transactions in the current block
      for (let transaction of block.transactions) {
        // iterate over all available transactions
        if (transaction.to && transaction.to.toLowerCase() === this.contractAddress.toLowerCase()) {
          transaction.funcSig = transaction.input.substr(0, 10);
          transaction.gasPrice = parseFloat(transaction.gasPrice);
          transaction.gas2EVE = (transaction.gas * (transaction.gasPrice / 1000000000)) / 1000000000;

          // search within the abi to check if the transaction signature can be mapped to an abi
          // function
          if (this.explorerService.abi) {
            for (let i = 0; this.explorerService.abi.length; i++) {
              if (this.explorerService.abi[i].signature === transaction.funcSig) {
                transaction.abiFunc = this.explorerService.abi[i];
                // transform inputs into an readable format
                transaction.abiFuncInputs = transaction.abiFunc.inputs
                  .map(input => `${ input.name}: ${ input.type }`)
                  .join(', ');
                break;
              }
            }
          }

          // add the transaction to the transactions array
          this.transactions.push(transaction);

          // sort them by blockNumber
          this.transactions.sort((a, b) => b.blockNumber - a.blockNumber);
          this.timeoutRefDetect();
        }
      }
    }
  }

  /**
   * Return the full amount of used eve of the contract using the previous loaded transactions.
   *
   * @return     {number}  amount of used eves.
   */
  getFullUsedEve() {
    let amount = 0;

    // calculate the used eves
    this.transactions.forEach(transaction => {
      amount = amount + transaction.gas2EVE;
    });

    // trim comma values
    return Math.round(amount * 1000000) / 1000000;
  }
}
