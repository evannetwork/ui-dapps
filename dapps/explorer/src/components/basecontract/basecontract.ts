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
  ChangeDetectorRef
} from 'angular-libs';

import {
  AnimationDefinition,
  AsyncComponent,
  EvanAddressBookService,
  EvanAlertService,
  EvanBCCService,
  EvanCoreService,
  EvanQrCodeService,
  EvanRoutingService,
  EvanToastService,
  createOpacityTransition,
  createRouterTransition,
  EvanTranslationService,
  createTabSlideTransition
} from 'angular-core';

import {
  BaseContract,
  RightsAndRoles,
  prottle,
  createBC
} from 'bcc';

import { ExplorerService } from '../../services/explorer.service';

/**************************************************************************************************/

@Component({
  selector: 'explorer-basecontract',
  templateUrl: 'basecontract.html',
  animations: [
    createTabSlideTransition()
  ]
})

/**
 * Detail wrapper for the whole application when an id was opened
 */
export class ExplorerBaseContractComponent extends AsyncComponent {
  /**
   * value of the current selected id
   */
  private id: string;

  /**
   * currently active tab
   */
  private activeTab: number;

  /**
   * id corresponding contract id 
   */
  private contractAddress: string;

  /**
   * users current account id
   */
  private activeAccount: string;

  /**
   * the current bcc BaseContract instance
   */
  private bccBaseContract: any;

  /**
   * the current contract instance using the BaseContract Interface
   */
  private baseContract: any;

  /**
   * blockchain-core RighsAndRoles instance
   */
  private bccRoles: any;

  /**
   * my contract state (have a look at i18n for contract state mapping)
   */
  private myState: string;

  /**
   * current contract state (have a look at i18n for contract state mapping)
   */
  private contractState: string;

  /**
   * Check if the current user can update the contractState
   */
  private isAdminOrOwner: boolean;

  /**
   * owner address
   */
  private owner: string;

  /**
   * disable UI elements if some values are changing
   */
  private updating: boolean;

  /**
   * Roles of the contract mapped to an array of members
   */
  private roles: any;

  /**
   * array of all available rolls
   */
  private availableRoles: Array<string>;

  /**
   * object of with keys of accountIds and its specific roles
   */
  private members: any;

  /**
   * current users addressbook
   */
  private contacts: any;

  /**
   * all members mapped to its state
   */
  private membersWithStates: any;

  /**
   * array of account ids that should be invited into the contract
   */
  private membersToAdd: Array<string>;

  /**
   * all abi functions mapped to its permitted roles and members
   */
  private abiPermissions: Array<any>;

  /**
   * all abi functions / properties that are public
   */
  private publicAbiPermissions: Array<any>;

  /**
   * reload the add member component for membersToAdd reset
   */
  private reloadAddMembers: boolean;

  constructor(
    private _DomSanitizer: DomSanitizer,
    private addressBook: EvanAddressBookService,
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
   * Load all basic contract instances / bcc classes and load the roles and states for the contract
   * and members.
   */
  async _ngOnInit() {
    this.activeTab = 0;
    this.id = this.routingService.getHashParam('id');
    this.contractAddress = await this.bcc.nameResolver.getAddress(this.id) || this.id;
    this.activeAccount = this.core.activeAccount();

    // initialize empty array for member handle component 
    this.membersToAdd = [ ];

    // check if the current user is admin or owner to enable UI edit elements 
    this.isAdminOrOwner = await this.explorerService.isUserOwnerOrAdmin(this.contractAddress);
    this.owner = await this.explorerService.getOwner(this.contractAddress);

    // get a BaseContract instance to initialize it only once for updating
    this.bccBaseContract = new BaseContract({
      executor: this.bcc.executor,
      loader: this.bcc.contractLoader,
      log: this.core.utils.log,
      nameResolver: this.bcc.nameResolver,
    });

    // get the bcc roles object to handle roles within the UI
    this.bccRoles = new RightsAndRoles({
      contractLoader: this.bcc.contractLoader,
      executor: this.bcc.executor,
      nameResolver: this.bcc.nameResolver,
      web3: this.bcc.getWeb3()
    });

    // load baseContract data
    this.baseContract = new this.bcc.web3.eth.Contract(
      JSON.parse(this.bcc.contracts.BaseContract.interface),
      this.contractAddress
    );

    await this.loadContractState();
    await this.loadRoles();
  }

  /**
   * update change refs to show correct values for checkboxes
   */
  async _ngAfterViewInit() {
    setTimeout(() => this.ref.detectChanges(), 100);
  }

  /**
   * Load the contract state and my state and sets it to the current context.
   *
   * @return     {Promise<void>}  resolved when done
   */
  async loadContractState() {
    try {
      // load my state
      this.myState = await this.bcc.executor.executeContractCall(
        this.baseContract,
        'getConsumerState',
        this.core.activeAccount()
      );

      // load contract state
      this.contractState = await this.bcc.executor.executeContractCall(
        this.baseContract,
        'contractState'
      );
    } catch (ex) {
      this.core.utils.log(`Could not load BaseContract informations: ${ ex.message }`, 'warning');
    }
  }

  /**
   * Load the roles for the current contract and sets it to the current context.
   *
   * @return     {Promise<void>}  Resolved when done.
   */
  async loadRoles() {
    // load addressbook to check for aliases
    this.contacts = await this.addressBook.loadAccounts();

    // load roles with all members
    this.roles = await this.bccRoles.getMembers(this.contractAddress);

    // load the roleCount to be able to show all roles, even if no member was assigned to this role
    const roleCount = await this.explorerService.getRoleCount(this.contractAddress);

    // push each role into an array as a string to show it within the roles table
    this.availableRoles = [ ];
    for (let i = 0; i < roleCount; i++) {
      this.availableRoles.push(i.toString());
    }

    // remap members to roles for table display
    let consumerCount = parseInt(await this.bcc.executor.executeContractCall(
      this.baseContract, 'consumerCount'));

    // set initial states
    this.membersWithStates = { };
    this.members = { };

    // add contract owner
    this.members[this.owner] = { roles: [ ] };

    // only retrieve index greate than zero (smart-contracts starts consumer index by 1)
    while (consumerCount > 0) {
      const consumerAddress = await this.bcc.executor.executeContractCall(
        this.baseContract, 'index2consumer', consumerCount);

      this.members[consumerAddress] = {
        roles: [ ]
      };
      consumerCount--;
    }

    // assign roles to members
    Object.keys(this.roles).forEach(role => {
      this.roles[role].forEach(member => {
        if (!this.members[member]) {
          this.members[member] = { roles: [ ] };
        }

        // unique roles
        if (this.members[member].roles.indexOf(role) === -1) {
          this.members[member].roles.push(role);
        }
      })
    });

    // load all member states
    if (Object.keys(this.members).length > 0) {
      await prottle(10, Object.keys(this.members).map(member => async () => {
        // check if the user has all roles that can be added or not
        this.members[member].roleAddable = this.members[member].roles.length !== Object.keys(this.roles).length;

        // load consumer state
        this.members[member].state = await this.bcc.executor.executeContractCall(
          this.baseContract,
          'getConsumerState',
          member
        );

        this.membersWithStates[member] = this.members[member].state;
      }));
    }

    // check abi permissions
    this.abiPermissions = [ ];
    this.publicAbiPermissions = [ ];
    if (this.explorerService.abi) {
      const authorityAddress = await this.bcc.executor.executeContractCall(this.baseContract, 'authority');
      const rolesContract = await this.bcc.contractLoader.loadContract(
        'DSRoles',
        authorityAddress
      );
    
      // load all details for the explorerService.abi
      await prottle(10, this.explorerService.abi.map(abiFunc => async () => {
        // only add it, when it has a signature (could be a constructor)
        if (abiFunc.signature) {
          // split abi permissions into public and into permissions that needs to be permitted
          if (abiFunc.constant) {
            this.publicAbiPermissions.push({
              name: abiFunc.name,
              signature: abiFunc.signature.substr(0, 10),
              inputTypes: abiFunc.inputs.map(input => input.type).join(',')
            });
          } else {
            // load permitted roles and members for abi permissions
            this.abiPermissions.push({
              name: abiFunc.name,
              signature: abiFunc.signature.substr(0, 10),
              inputTypes: abiFunc.inputs.map(input => input.type).join(','),
              roles: await this.getPermittedRoles(abiFunc.signature),
              members: await this.getPermittedMembers(abiFunc.signature)
            });
          }
        }
      }));

      // sort permissions with name
      this.publicAbiPermissions.sort((a, b) => {
        if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
        if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
        return 0;
      });
      this.abiPermissions.sort((a, b) => {
        if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
        if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
        return 0;
      });
    }
  }

  /**
   * Sets the updating property to true, runs a function and removes the loading
   *
   * @param      {Function}       updateFunc  function to run for the update
   * @param      {string}         finishText  text that should be displayed as toast when everything
   *                                          is fine
   * @return     {Promise<void>}  resolved when done
   */
  async setUpdating(updateFunc: Function, finishText?: string) {
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

      try {
        this.alertService.showAlert(
          '_explorer.generic-error',
          '_explorer.generic-error-desc',
        );
      } catch (ex) { }
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
   * Update the contract state to the current selected value
   *
   * @param      {string}         state   state to set
   * @return     {Promise<void>}  resolved when done
   */
  async setContractState(state: string) {
    await this.setUpdating(async () => {
      await this.bccBaseContract.changeContractState(
        this.contractAddress,
        this.core.activeAccount(),
        parseInt(state)
      );
    }, '_explorer.basecontract.contract-state-changed');
  }

  /**
   * Update my state for the current selected value
   *
   * @param      {string}         consumer  account id for the consumer
   * @param      {string}         state     state of the consumer
   * @return     {Promise<void>}  resolved when done
   */
  async setConsumerState(consumer: string, state: string) {
    this.setUpdating(async () => {
      await this.bccBaseContract.changeConsumerState(
        this.contractAddress,
        this.core.activeAccount(),
        consumer,
        parseInt(state)
      );
    }, '_explorer.basecontract.contract-state-changed');
  }

  /**
   * Transfer the ownership of this contract to another accountid.
   *
   * @param      {string}  newOwner  accountId of new owner
   * @return     {Promise<void>}  resolved when done
   */
  async transferOwnerShip(newOwner: string) {
    try {
      await this.alertService.showSubmitAlert(
        '_explorer.basecontract.transfer-ownership',
        '_explorer.basecontract.transfer-ownership-question',
        '_explorer.cancel',
        '_explorer.ok',
      );
    } catch (ex) {
      return;
    }

    await this.setUpdating(async () => {
      await this.bccRoles.transferOwnership(this.contractAddress, this.core.activeAccount(), newOwner);
    }, '_explorer.basecontract.ownership-transfered');
  }

  /**
   * Check a function call is permitted for a specific role.
   *
   * @return     {Promise<void>}  resolved when done
   */
  async checkFunctionForRoles(roles: Array<string>) {
    let result;

    try {
      result = await this.alertService.showSubmitAlert(
        '_explorer.basecontract.check-role-func',
        '_explorer.basecontract.check-role-func-desc',
        '_explorer.cancel',
        '_explorer.ok',
        [
          {
            type: 'text',
            label: '_explorer.basecontract.role-func-sig',
            placeholder: '_explorer.basecontract.role-func-sig',
            value: '',
            required: true
          }
        ]
      );

      result = result[0];
    } catch (ex) {
      return;
    }

    await this.setUpdating(async () => {
      // setEntry(bytes32,bytes32)
      let functionSignature = result;
      if (functionSignature.indexOf('0x') !== 0) {
        functionSignature = this.bcc.getWeb3().utils
          .soliditySha3(result).substr(0, 10);
      }

      const roleCapability = await this.explorerService.getRoleCapability(
        this.baseContract, functionSignature);
      let hasPermissions = false;
      for (let i = 0; i < roles.length; i++) {
        hasPermissions = (parseInt(roleCapability, 16) & Math.pow(2, parseInt(roles[i]))) > 0;
      }

      try {
        result = await this.alertService.showSubmitAlert(
          `_explorer.basecontract.has-permissions.title`,
          {
            key: `_explorer.basecontract.has-permissions.${ hasPermissions }`,
            translateOptions: {
              role: roles.join(' | '),
              input: result,
              signature: functionSignature
            }
          },
          '_explorer.ok'
        );

        result = result[0];
      } catch (ex) {
        return;
      }
    });
  }

  /**
   * Ask for a function / signature that should be permitted for this role and runs
   * bccRoles.setFunctionPermission.
   *
   * @return     {Promise<void>}  resolved when done
   */
  async setFunctionPermission(role: string) {
    let allow = false;
    let funcName;

    try {
      allow = await this.alertService.showSubmitAlert(
        '_explorer.basecontract.allow-role-func',
        '_explorer.basecontract.allow-role-func-desc',
        '_explorer.cancel',
        '_explorer.ok',
        [
          {
            type: 'radio',
            label: '_explorer.basecontract.allow',
            placeholder: '_explorer.basecontract.allow',
            value: true,
            checked: true
          },
          {
            type: 'radio',
            label: '_explorer.basecontract.deny',
            placeholder: '_explorer.basecontract.deny',
            value: false
          }
        ]
      );
    } catch (ex) {
      return;
    }

    try {
      funcName = await this.alertService.showSubmitAlert(
        '_explorer.basecontract.set-role-func',
        '_explorer.basecontract.set-role-func-desc',
        '_explorer.cancel',
        '_explorer.ok',
        [
          {
            type: 'text',
            label: '_explorer.basecontract.role-func-sig',
            placeholder: '_explorer.basecontract.role-func-sig',
            value: '',
            required: true
          }
        ]
      );

      funcName = funcName[0];
    } catch (ex) {
      return;
    }

    await this.setUpdating(async () => {
      await this.bccRoles.setFunctionPermission(
        this.contractAddress,
        this.activeAccount,
        role,
        funcName,
        allow
      );

      await this.loadRoles();
      this.ref.detectChanges();
    }, '_explorer.basecontract.setted-role-func');
  }

  /**
   * Ask for a property / signature that should be permitted for this role and runs
   * bccRoles.setFunctionPermission.
   *
   * @return     {Promise<void>}  resolved when done
   */
  async setOperationPermission(role: string) {
    let allow;
    let propName;
    let propertyType;
    let modificationType;

    try {
      allow = await this.alertService.showSubmitAlert(
        '_explorer.basecontract.allow-role-property',
        '_explorer.basecontract.allow-role-property-desc',
        '_explorer.cancel',
        '_explorer.ok',
        [
          {
            type: 'radio',
            label: '_explorer.basecontract.allow',
            placeholder: '_explorer.basecontract.allow',
            value: true,
            checked: true
          },
          {
            type: 'radio',
            label: '_explorer.basecontract.deny',
            placeholder: '_explorer.basecontract.deny',
            value: false
          }
        ]
      );
    } catch (ex) {
      return;
    }

    try {
      propName = await this.alertService.showSubmitAlert(
        '_explorer.basecontract.set-role-property',
        '_explorer.basecontract.set-role-property-desc',
        '_explorer.cancel',
        '_explorer.ok',
        [
          {
            type: 'text',
            label: '_explorer.basecontract.role-property-sig',
            placeholder: '_explorer.basecontract.role-property-sig',
            value: '',
            required: true
          }
        ]
      );

      propName = propName[0];
    } catch (ex) {
      return;
    }

    try {
      propertyType = await this.alertService.showSubmitAlert(
        '_explorer.basecontract.allow-role-propertyType',
        '_explorer.basecontract.allow-role-propertyType-desc',
        '_explorer.cancel',
        '_explorer.ok',
        [
          {
            type: 'radio',
            label: '_explorer.basecontract.entry',
            placeholder: '_explorer.basecontract.entry',
            value: this.bcc.getWeb3().utils.soliditySha3('entry'),
            checked: true
          },
          {
            type: 'radio',
            label: '_explorer.basecontract.listentry',
            placeholder: '_explorer.basecontract.listentry',
            value: this.bcc.getWeb3().utils.soliditySha3('listentry')
          }
        ]
      );
    } catch (ex) {
      return;
    }

    try {
      modificationType = await this.alertService.showSubmitAlert(
        '_explorer.basecontract.allow-role-modificationType',
        '_explorer.basecontract.allow-role-modificationType-desc',
        '_explorer.cancel',
        '_explorer.ok',
        [
          {
            type: 'radio',
            label: '_explorer.basecontract.set',
            placeholder: '_explorer.basecontract.set',
            value: this.bcc.getWeb3().utils.soliditySha3('set'),
            checked: true
          },
          {
            type: 'radio',
            label: '_explorer.basecontract.remove',
            placeholder: '_explorer.basecontract.remove',
            value: this.bcc.getWeb3().utils.soliditySha3('remove')
          }
        ]
      );
    } catch (ex) {
      return;
    }

    await this.setUpdating(async () => {
      await this.bccRoles.setOperationPermission(
        this.contractAddress,
        this.activeAccount,
        role,
        propName,
        propertyType,
        modificationType,
        allow
      );

      await this.loadRoles();
      this.ref.detectChanges();
    }, '_explorer.basecontract.setted-role-property');
  }

  /**
   * Adds a new role to the roles object to provide the possibilty, that the user can add
   * permissions to this role.
   */
  async addRole() {
    try {
      await this.alertService.showSubmitAlert(
        '_explorer.basecontract.add-role-hint',
        '_explorer.basecontract.add-role-hint-desc',
        '_explorer.ok',
      );
    } catch (ex) { }

    const roleKeys = Object.keys(this.roles);
    let highestRole: string = '-1';

    // search for the highest role key
    roleKeys.forEach(role => {
      if (parseInt(role) > parseInt(highestRole)) {
        highestRole = role;
      }
    });

    const newRole = (parseInt(highestRole) + 1).toString();

    // add the next new role
    this.roles[newRole] = [ ];
    this.availableRoles.push(newRole);
    this.ref.detectChanges();
  }

  /**
   * add a role to a member
   *
   * @param      {string}         member  account id of the member
   * @return     {Promise<void>}  resolved when done
   */
  async addRoleToMember(member: string) {
    let result;

    try {
      const inputs = Object
        .keys(this.roles)
        .filter(role => this.members[member].roles.indexOf(role) === -1)
        .map((role: string) => {
          let label = role;

          if (role === '0') {
            label = this.translateService.instant('_explorer.owner');
          } else if (role == '1') {
            label = this.translateService.instant('_explorer.basecontract.member');
          }

          return {
            type: 'radio',
            label: label,
            value: role,
          };
        });

      result = await this.alertService.showSubmitAlert(
        '_explorer.basecontract.add-role',
        '_explorer.basecontract.add-role-desc',
        '_explorer.cancel',
        '_explorer.ok',
        inputs
      );

      if (result && result[0]) {
        result = result[0];
      }
    } catch (ex) {
      return;
    }

    if (!result) {
      try {
        this.alertService.showAlert(
          '_explorer.basecontract.empty-role-add',
          '_explorer.basecontract.empty-role-add-desc',
        );
      } catch (ex) { }
      return;
    }

    await this.setUpdating(async () => {
      await this.bccRoles.addAccountToRole(
        this.contractAddress,
        this.activeAccount,
        member,
        result
      );

      await this.loadContractState();
      await this.loadRoles();
    }, '_explorer.basecontract.role-successfully-added');
  }

  /**
   * Remove a role from a meber
   *
   * @param      {string}         member  account id of the member
   * @param      {string}         role    role to remove
   * @return     {Promise<void>}  resolved when done
   */
  async removeRoleFromMember(member: string, role: string) {
    if (this.members[member].roles.length === 1) {
      try {
        await this.alertService.showSubmitAlert(
          '_explorer.basecontract.remove-role',
          '_explorer.basecontract.remove-role-desc',
          '_explorer.cancel',
          '_explorer.ok',
        );
      } catch (ex) {
        return;
      }
    }

    await this.setUpdating(async () => {
      await this.bccRoles.removeAccountFromRole(
        this.contractAddress,
        this.activeAccount,
        member,
        role
      );

      if (this.members[member].roles.length === 1) {
        // removeConsumer
        await this.bcc.executor.executeContractTransaction(
          this.baseContract, 'removeConsumer', { from: this.activeAccount, autoGas: 1.1, }, member);
      }

      await this.loadContractState();
      await this.loadRoles();
    }, '_explorer.basecontract.role-successfully-removed');
  }


  /**
   * Invites new members into contracts
   *
   * @return     {Promise<void>}  resolved when done
   */
  async inviteMembers() {
    let bcAddress;
    let bc;

    // ask user, if the contract is located within an busciness center
    try {
      bcAddress = await this.alertService.showSubmitAlert(
        '_explorer.basecontract.choose-bc',
        '_explorer.basecontract.choose-bc-desc',
        '_explorer.cancel',
        '_explorer.ok',
        [
          {
            type: 'text',
            label: '_explorer.basecontract.bc-address',
            placeholder: '_explorer.basecontract.bc-address',
            value: '',
            required: true
          }
        ]
      );

      bcAddress = bcAddress[0];
    } catch (ex) {
      return;
    }

    await this.setUpdating(async () => {
      // if the user entered the ens address of an business-center, load the bc address
      if (bcAddress && bcAddress.indexOf('0x') !== 0) {
        bc = await createBC({
          ensDomain: bcAddress,
          ProfileBundle: this.bcc.ProfileBundle
        });
      }

      // invite all users to contract
      for (let memberAddress of this.membersToAdd) {
        // build bmail for invited user
        const ret = {
          content: {
            from: this.activeAccount,
            fromAlias: await this.bcc.profile.getProfileKey('alias', this.activeAccount),
            title: this.translateService.instant('_explorer.basecontract.contract-invitation.text-title'),
            body: this.translateService.instant('_explorer.basecontract.contract-invitation.text-body', {
              contractAddress: this.contractAddress
            }),
            attachments: [{
              type: 'contract',
              address: this.contractAddress
            }]
          }
        };

        if (bc) {
          const isMember = await this.bcc.executor.executeContractCall(bc.businessCenter, 'isMember', memberAddress);
          if (!isMember) {
            await this.bcc.executor.executeContractTransaction(
              bc.businessCenter,
              'invite',
              { from: this.activeAccount, autoGas: 1.1, },
              memberAddress
             );
          }
        }

        // invite user to contract
        await this.bccBaseContract.inviteToContract(
          bcAddress,
          this.contractAddress,
          this.activeAccount,
          memberAddress
        );

        // get the content sharing key
        const contentKey = await this.bcc.sharing.getKey(this.contractAddress, this.activeAccount, '*');

        // share the contract with the user
        await this.bcc.sharing.addSharing(
          this.contractAddress,
          this.activeAccount,
          memberAddress,
          '*',
          0,
          contentKey,
        );

        const hashKey = await this.bcc.sharing.getHashKey(this.contractAddress, this.activeAccount);
        await this.bcc.sharing.ensureHashKey(
          this.contractAddress, this.activeAccount, memberAddress, hashKey);
        // send the bmail to the invitee
        await this.bcc.mailbox.sendMail(
          ret,
          this.activeAccount,
          memberAddress
        );
      }

      // reset members to add and reload users and roles
      this.membersToAdd = [ ];
      this.reloadAddMembers = true;
      await this.loadContractState();
      await this.loadRoles();

      this.ref.detectChanges();
      await this.core.utils.timeout(0);

      this.reloadAddMembers = true;
      this.ref.detectChanges();
    }, '_explorer.basecontract.successfully-invited');
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
   * Get the permitted members for a function signature
   *
   * @param      {string}                  signature  abi function signature
   * @return     {Promise<Array<string>>}  The permitted members
   */
  async getPermittedMembers(signature: string) {
    const roleCapability = await this.explorerService.getRoleCapability(this.baseContract, signature);
    const members = [ this.owner ];

    // iterate through all members and check if any role has permissions to this function
    Object.keys(this.members).forEach((member: string) => {
      const roles = this.members[member].roles;

      if (members.indexOf(member) === -1) {
        for (let i = 0; i < roles.length; i++) {
          const hasPermissions = (parseInt(roleCapability, 16) & Math.pow(2, parseInt(roles[i]))) > 0;

          if (hasPermissions) {
            members.push(member);
            break;
          }
        }
      }
    });

    return members;
  }

  /**
   * Get the permitted roles for a function signature
   *
   * @param      {string}                  signature  the abi function signature
   * @return     {Promise<Array<string>>}  The permitted roles
   */
  async getPermittedRoles(signature: string) {
    const roleCapability = await this.explorerService.getRoleCapability(this.baseContract, signature);
    const roles = [ ];

    // iterate each role and check if its permitted
    Object.keys(this.roles).forEach((role: string) => {
      const hasPermissions = (parseInt(roleCapability, 16) & Math.pow(2, parseInt(role))) > 0;

      if (hasPermissions) {
        roles.push(role);
      }
    });

    return roles;
  }
}
