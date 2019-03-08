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
} from '@evan.network/ui-angular-core';

import { ExplorerService } from '../../services/explorer.service';

/**************************************************************************************************/

@Component({
  selector: 'explorer-contractinteraction',
  templateUrl: 'contractinteraction.html',
  animations: [ ]
})

/**
 * Detail wrapper for the whole application when an id was opened
 */
export class ExplorerContractInteractionComponent extends AsyncComponent {
  /**
   * value of the current selected id
   */
  private id: string;

  /**
   * id corresponding contract id 
   */
  private contractAddress: string;

  /**
   * with the current abi instantiated contract
   */
  private contractInstance: any;

  /**
   * show loading symbols and disable call buttons
   */
  private running: boolean;

  /**
   * abis filtered for functions
   */
  private abiFunctions: Array<any>;

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
   * Load all sections that should be displayed and sort them using the sections order.
   */
  async _ngOnInit() {
    this.id = this.routingService.getHashParam('id');
    this.contractAddress = await this.bcc.nameResolver.getAddress(this.id) || this.id;

    // start a size watcher to display run button on large screens more optimized
    this.watchWindowSize = await this.core.utils.windowSize((width) => {
      this.screenSize = width;

      this.ref.detectChanges();
    });

    if (!this.explorerService.abi) {
      this.abiFunctions = [ ];
    } else {
      this.contractInstance = new this.bcc.web3.eth.Contract(this.explorerService.abi, this.contractAddress);
      // filter, sort and copy abi functions
      this.abiFunctions = JSON.parse(JSON.stringify(this.explorerService.abi
        // show only functions
        .filter(abiFunc => abiFunc.type === 'function')
        // sort by type and name
        .sort((a, b) => {
          const aValue = (a.constant ? 'a_' : 'b_') + a.name;
          const bValue = (b.constant ? 'a_' : 'b_') + b.name;

          if (aValue.toLowerCase() < bValue.toLowerCase()) return -1;
          if (aValue.toLowerCase() > bValue.toLowerCase()) return 1;
          return 0;
        })
      ));  
    }

    // set each abi function name so we can easily use it within the template
    this.abiFunctions.forEach(abiFunc => {
      // if we are using the rawMode, transform the inputs into an string, so we can use an ace
      // editor
      abiFunc.inputValues = this.explorerService.rawMode ? '[\n  \n]' : [ ];
      abiFunc.readableInputs = abiFunc.inputs
        .map(input => `${ input.name}: ${ input.type }`)
        .join(', ');
    });
  }

  async _ngOnDestroy() {
    this.watchWindowSize();
  }

  /**
   * Runs an abi functions with the current input values
   *
   * @param      {any}     abiFunc  abi function object from explorerService.abi[x]
   * @return     {Promise<void>}  resolved when done
   */
  async runAbiFunc(abiFunc: any) {
    this.running = true;
    this.ref.detectChanges();

    // set initial params for an call without parameters 
    let applyParams = [ this.contractInstance, abiFunc.name ];

    // add transaction parameters if we need to run executeContractTransaction
    if (!abiFunc.constant) {
      applyParams.push({ from: this.core.activeAccount(), autoGas: 1.1, });
    }

    // if we have more than zero inputs, check if they are valid
    // if we have no inputs, ignore the inputParams
    if (abiFunc.inputs.length > 0) {
      let inputValues = abiFunc.inputValues;

      // if we are using the rawMode, try to parse it
      if (this.explorerService.rawMode) {
        try {
          inputValues = JSON.parse(inputValues);
        } catch (ex) { }
      }

      // if we have an invalid array, throw an error and stop running
      if (!Array.isArray(inputValues)) {
        try {
          this.alertService.showAlert(
            '_explorer.interaction.invalid-input-array',
            '_explorer.interaction.invalid-input-array-desc',
          );
        } catch (ex) {
          return;
        }
      }

      // get the current input parameters
      applyParams = applyParams.concat(inputValues);
    }

    try {
      // if the abiFunc is constant, use executeContractCall
      if (abiFunc.constant) {
        abiFunc.result = await (
          this.bcc.executor.executeContractCall.apply(this.bcc.executor, applyParams)
        );
      } else {
        // else use executeContractTransaction
        abiFunc.result = await (
          this.bcc.executor.executeContractTransaction.apply(this.bcc.executor, applyParams)
        );
      }
    } catch (ex) {
      // set the error
      abiFunc.result = this.core.utils.getErrorLog(ex);
      console.error(abiFunc.result);
    }

    // check if the result is an object, try to parse it into an string for displaying
    if (typeof abiFunc.result !== 'string') {
      abiFunc.result = JSON.stringify(abiFunc.result, null, 2);
    }

    abiFunc.wasExecuted = true;

    this.running = false;
    this.ref.detectChanges();
  }

  /**
   * Check if all inputs have an value.
   *
   * @param      {any}      abi     abi to check for
   * @return     {boolean}  True if all input fields have values, else false
   */
  areInputsValid(abi) {
    return abi.inputs.filter((input, index) => !abi.inputValues[index]).length === 0;
  }
}

