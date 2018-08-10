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
  getDomainName
} from 'dapp-browser';

import {
  Injectable, OnDestroy,    // '@angular/core';
  Platform,                 // ionic-angular
  Observable, Subscription
} from 'angular-libs';

import {
  EvanCoreService,
  EvanBCCService,
  EvanDescriptionService,
  EvanRoutingService,
  SingletonService,
  EvanAlertService
} from 'angular-core';

/**************************************************************************************************/
/**
 * Utility service for the explorer DApp to resolve ens, contract ids, ...
 */
@Injectable()
export class ExplorerService implements OnDestroy {
  /**
   * all function members that specifies a base contract
   */
  private baseContractMembers: Array<string> = [
    'allowConsumerInvite',
    'changeConsumerState',
    'changeContractState',
    'consumer2index',
    'consumerCount',
    'consumerState',
    'contractState',
    'contractType',
    'created',
    'getConsumerState',
    'getMyState',
    'getProvider',
    'index2consumer',
    'inviteConsumer',
    'isConsumer',
    'removeConsumer',
  ];

  /**
   * all function members thath specifies a data contract
   */
  private dataContractMembers: Array<string> = [
    'addListEntries',
    'changeConsumerState',
    'changeContractState',
    'getEntry',
    'getListEntry',
    'getListEntryCount',
    'getMappingValue',
    'init',
    'moveListEntry',
    'removeListEntry',
    'setEntry',
    'setMappingValue',
  ];

  /**
   * abi that is selected for the current opened contract
   */
  public abi: any;

  /**
   * dataSchema that is selected for the current openend contract
   */
  public dataSchema: any;

  /**
   * enable time travel to view the contract from a specific block number
   */
  public timeTravel: boolean;

  /**
   * blockNumber to load the data for, only nesecary when timeTravel is enabled
   */
  public blockNumber: string;

  /**
   * should the frontend be displayed using raw mode?
   */
  public rawMode: boolean;

  /**
   * Cache all blocks when they was loaded ones
   */
  public blocks: any;

  /**
   * ace editor options
   */
  public aceOptions: any;

  constructor(
    private core: EvanCoreService,
    private bcc: EvanBCCService,
    private descriptionService: EvanDescriptionService,
    private routingService: EvanRoutingService,
    private singleton: SingletonService
  ) {
    return singleton.create(ExplorerService, this, () => {
      // restore raw mode from local storage 
      this.rawMode = window.localStorage['evan-explorer-rawMode'] === 'true';

      // cache blocks
      this.blocks = { };

      // ace options for global usage
      this.aceOptions = {
        printMargin: false,
        tabSize: 2
      };
    });
  }

  /**
   * Checks if a id is valid (more then 0 sections are loaded)
   *
   * @param      {string}            id            ID that should be opened. (contract id, ens
   *                                               address, ipfs hash)
   * @param      {EvanAlertSErvice}  alertService  alert service from the component to handle
   *                                               correct alertService scope
   * @param      {any}               abi           manual provided abi definition
   * @return     {Promise<void>}     resolved when done
   */
  async openID(id: string, alertService: EvanAlertService, abi?: any, dataSchema? :any): Promise<void> {
    // remove eventually added unsessary data like https:// or anything
    const filteredID = id.split('/').pop();
    const sections = await this.getExplorerSections(filteredID, abi);

    // check if any data could be loaded for the contract addess.
    // show error if not, navigate to address if available
    if (sections.length === 0) {
      try {
        await alertService.showAlert(
          '_explorer.invalid',
          '_explorer.invalid-desc',
        );
      } catch (ex) { }
    } else {
      this.abi = abi;
      this.dataSchema = dataSchema;

      // try to load abi, if nothing was provided
      if (!this.abi || !this.dataSchema) {
        const dbcp = await this.descriptionService.getDescription(filteredID);

        // set abi definition
        if (!this.abi && dbcp.abis && dbcp.abis.own) {
          this.abi = dbcp.abis.own;
        }

        if (!this.dataSchema && dbcp.dataSchema) {
          this.dataSchema = dbcp.dataSchema;
        }
      }

      if (window.location.href.indexOf(filteredID) === -1) {
        this.routingService.navigate(`/explorer.${ getDomainName() }/${ filteredID }`);
      }
    }
  }

  /**
   * Return the several sections that are available wihtin the UI (details, transactionhistory,
   * dbcp)
   *
   * @param      {string}                  id      ID that should be opened. (contract id, ens
   *                                               address, ipfs hash)
   * @param      {any}                     abi     manual provided abi definition
   * @return     {Promise<Array<string>>}  The explorer sections.
   * 
   * Usage:
   *   const sections = await this.explorerService.getExplorerSections('0x00...');
   *   
   *   [
   *     'transactionhistory',
   *     'contractinteraction',
   *     'dbcp',
   *     'basecontract',
   *     'datacontract'
   *   ]
   */
  async getExplorerSections(id: string, abi?: any): Promise<Array<string>> {
    let sections = [  ];
    let contractId;

    // try to load a contract address
    try {
      // load contract address if we are not using an contractId
      if (id.indexOf('0x') !== 0) {
        contractId = await this.bcc.nameResolver.getAddress(id);
      } else {
        contractId = id;
      }

      // check if valid contract address could be loaded
      if (contractId && contractId !== '0x0000000000000000000000000000000000000000') {
        sections = sections.concat([
          'transactionhistory',
          'dbcp'
        ]);
      } else {
        // clear if its not available
        contractId = null;
      }
    } catch(ex) {
      console.warn(`Could not looking up contract address: ${ ex && ex.message ? ex.message : ex } `);
    }
    
    // try to load DBCP for contract address or ens address
    try {
      const dbcp = await this.descriptionService.getDescription(id);

      // check if loaded dbcp is valid
      if (dbcp && dbcp.status !== 'invalid') {

        // set abi definition, if it wasnt overwritten manually
        if (!abi && dbcp.abis && dbcp.abis.own) {
          abi = dbcp.abis.own;
        }
      }
    } catch (ex) {
      console.warn(`Could not looking up ens address: ${ ex && ex.message ? ex.message : ex } `);
    }

    // if abi is available, check if a base- or data contract can be loaded 
    if (abi && contractId && contractId !== '0x0000000000000000000000000000000000000000') {
      // if we have an abi and a contract id, we can show the contract interaction
      sections.push('contractinteraction');

      try {
        const contract = new this.bcc.web3.eth.Contract(abi, contractId);
        const contractMethodKeys = Object.keys(contract.methods);

        // check if all base contract methods could be loaded
        const isBaseContractInterface = this.baseContractMembers
          .filter(member => contractMethodKeys.indexOf(member) !== -1).length !== 0;
        // check if the created property can be get, to check if a valid BaseContract is their
        let created;
        try {
          created = this.bcc.executor.executeContractCall(contract, 'created');
        } catch (ex) {
          this.core.utils.log(`Could not load BaseContract informations: ${ ex.message }`, 'warning');
        }

        if (isBaseContractInterface && created) {
          sections.push('basecontract');

          // check if all data contract methods could be loaded
          const isDataContract = this.dataContractMembers
            .filter(member => contractMethodKeys.indexOf(member) !== -1).length !== 0;

          if (isDataContract) {
            sections.push('datacontract');
          }
        }
      } catch(ex) {
        console.warn(`Could not looking up contract interface: ${ ex && ex.message ? ex.message : ex } `);
      }
    }

    return sections;
  }

  /**
   * Returns the owner of an contract
   *
   * @param      {string}  contractAddress  contract address to load the owner for.
   * @return     {string}  onwer address
   */
  async getOwner(contractAddress: string) {
    // load contract with the DSAuth interface for the contract address
    const authContract = new this.bcc.web3.eth.Contract(
      JSON.parse(this.bcc.contracts.DSAuth.interface),
      contractAddress
    );

    // load the owner for the contract
    return await this.bcc.executor.executeContractCall(authContract, 'owner');
  }

  /**
   * Check if the current user is owner of a contract or has the admin role.
   *
   * @param      {string}            contractAddress  contract address to check
   * @param      {string}            activeAccount    account to check
   * @return     {Promise<boolean>}  True if user owner or admin, False otherwise.
   */
  async isUserOwnerOrAdmin(contractAddress: string, activeAccount:string = this.core.activeAccount()) {
    let isOwnerOrAdmin = false;

    // load contract with the DSAuth interface for the contract address
    const authContract = new this.bcc.web3.eth.Contract(
      JSON.parse(this.bcc.contracts.DSAuth.interface),
      contractAddress
    );

    // 1. check if the current user is the owner
    const contractOwner = await this.bcc.executor.executeContractCall(authContract, 'owner');

    // if the current user is the owner, he has no explicit permissions but as the owner he can
    // set it
    if (contractOwner === activeAccount) {
      isOwnerOrAdmin = true;
    } else {
      // 2. if the user is not the owner, check if the current user has explicit permissions
      // load the authority for the authContract
      const authorityAddress = await this.bcc.executor.executeContractCall(authContract, 'authority');
      const authorityContract = await this.bcc.contractLoader.loadContract(
        'DSAuthority',
        authorityAddress
      );

      // get the function signature for setContractDescription, to check if the user can call this
      // function
      const functionSignature = this.bcc.getWeb3().utils
        .soliditySha3('setContractDescription(bytes32)').substr(0, 10);

      // check if the current user is permitted to call the setContractDescription function 
      isOwnerOrAdmin = await this.bcc.executor.executeContractCall(
        authorityContract,
        'canCall',
        activeAccount,
        '0x0000000000000000000000000000000000000000',
        functionSignature
      );
    }

    return isOwnerOrAdmin;
  }

  /**
   * Load a contract instance and retrieves the rolesCount.
   *
   * @param      {string}  contractAddress  contract address to load
   * @return     {number}  amount of roles
   */
  async getRoleCount(contractAddress: string) {
    const contractInstance = this.bcc.contractLoader.loadContract('BaseContractInterface', contractAddress);
    const rolesAddress = await this.bcc.executor.executeContractCall(
      contractInstance,
      'authority'
    );
    const rolesContract = this.bcc.contractLoader.loadContract('DSRolesPerContract', rolesAddress);
    const roleCount = await this.bcc.executor.executeContractCall(rolesContract, 'roleCount');

    return roleCount;
  }

  /**
   * Splits the content with \n, count the rows and multiply it with the current ace line height to
   * get an optimal ace height. If the caluclated height is greater than 80%, return 80%.
   *
   * @param      {string}  content  content to check
   * @return     {number}  Calculated Ace height.
   */
  getInitialAceHeight(content: string) {
    if (content) {
      content = content.toString();
      const height = (content.split('\n').length * 14) + 10;
      const maxHeight = window.outerHeight * 0.6;

      return (height > maxHeight ? maxHeight : height) + 'px';
    } else {
      return '14px';
    }
  }

  /**
   * Returns the role capability for the current contract and a function signature
   *
   * @param      {string}  signature  function signature
   *                                  (this.bcc.getWeb3().utils.soliditySha3(result).substr(0, 10);)
   * @return     {Promise<string>}  role capability (0x0000..1)
   */
  async getRoleCapability(baseContract: any, signature: string) {
    const authorityAddress = await this.bcc.executor.executeContractCall(baseContract, 'authority');
    const rolesContract = await this.bcc.contractLoader.loadContract(
      'DSRolesPerContract',
      authorityAddress
    );

    return await this.bcc.executor.executeContractCall(
      rolesContract,
      'getCapabilityRoles',
      '0x0000000000000000000000000000000000000000',
      signature.substr(0, 10)
    );
  }
}