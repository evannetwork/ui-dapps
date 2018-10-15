import {
  DemoManagementService
} from '../services/service';

/**
 * configuration that should be used
 */
const config = {
  description: {
    "public": {
      "name": "Digital Twin",
      "description": "digial representation of a physical object",
      "author": "evan GmbH",
      "version": "1.0.1",
      "dataSchema": {
        "technicalData": {
          "$schema": "http://json-schema.org/draft-06/schema#",
          "description": "A representation of a Digital Twin",
          "type": "object",
          "additionalProperties": false,
          "required": ["machineId"],
          "properties": {
            "machineId": {
              "description": "id of the machine",
              "type": "string",
            },
            "constructionYear": {
              "description": "The construction year",
              "type": "integer",
              "minimum": 1900
            },
            "condition": {
              "description": "condition of the twin (defect, preparation, maintenence, in use)",
              "type": "integer",
              "enum": [0, 1, 2, 3]
            },
            "emptyWeight": {
              "description": "the empty weight of the twin",
              "type": "integer"
            },
            "manufacturer": {
              "description": "manufacturer of the twin",
              "type": "string"
            },
            "modelDescription": {
              "description": "description of the model",
              "type": "string"
            },
            "specialFeatures": {
              "description": "special features of the twin",
              "type": "string"
            },
            "internalDesignation": {
              "description": "internal description of the twin",
              "type": "string"
            },
            "type": {
              "description": "type of the digital twin",
              "type": "string"
            },
            "offRoadCapable": {
              "description": "is the twin offroad capable ?",
              "type": "boolean"
            },
            "offRoadCapableType": {
              "description": "type of the offroad capability",
              "type": "string"
            },
            "markingFreeTyres": {
              "description": "has the twin marking free tyres ?",
              "type": "boolean"
            },
            "driveType": {
              "description": "drive type of the twin (diesel, hybrid, electro)",
              "type": "integer",
              "enum": [0, 1, 2, 3]
            },
            "driveVoltage": {
              "description": "drive type voltage in V (if applicable)",
              "type": "number"
            },
            "driveLicense": {
              "description": "which drive license is needed ?",
              "type": "string"
            },
            "trailerLoad": {
              "description": "the trailer load of the twin",
              "type": "integer"
            },
            "workingHeight": {
              "description": "working height of the twin (2 decimals)",
              "type": "string"
            },
            "heightLimitation": {
              "description": "does the twin have a height limitation ?",
              "type": "boolean"
            },
            "coverage": {
              "description": "coverage of the twin (2 decimals)",
              "type": "number"
            },
            "basketLoadRetracted": {
              "description": "possible basket load when retracted",
              "type": "integer"
            },
            "basketLoad": {
              "description": "possible basket load when not retracted",
              "type": "integer"
            },
            "personCount": {
              "description": "persons needed for the twin (indoor/outdoor)",
              "type": "string"
            },
            "basketHeight": {
              "description": "height of the basket (2 decimals)",
              "type": "number"
            },
            "basketWidth": {
              "description": "width of the basket (2 decimals)",
              "type": "number"
            },
            "basketLength": {
              "description": "length of the basket (2 decimals)",
              "type": "number"
            },
            "rotateableBasket": {
              "description": "is the basket rotateable ?",
              "type": "boolean"
            },
            "pivotedBasketArm": {
              "description": "is the basket arm pivoted ?",
              "type": "boolean"
            },
            "basketExtensible": {
              "description": "is the basket extensible ?",
              "type": "boolean"
            },
            "platformHeight": {
              "description": "height of the platform (2 decimals)",
              "type": "number"
            },
            "platformWidth": {
              "description": "width of the platform (2 decimals)",
              "type": "number"
            },
            "platformLength": {
              "description": "length of the platform (2 decimals)",
              "type": "number"
            },
            "platformAvailable": {
              "description": "is a platform available ?",
              "type": "boolean"
            },
            "platformExtendable": {
              "description": "is the platform extendable ?",
              "type": "boolean"
            },
            "supportWidth": {
              "description": "the width of the support arms (2 decimals)",
              "type": "number"
            },
            "supportLength": {
              "description": "the length of the support arms (2 decimals)",
              "type": "number"
            },
            "groundPressure": {
              "description": "ground pressure of the twin (1 decimal)",
              "type": "number"
            },
            "groundClearance": {
              "description": "ground clearance of the twin (2 decimals)",
              "type": "number"
            },
            "climbingAbility": {
              "description": "climbing ability of the twin",
              "type": "string"
            },
            "transportLength": {
              "description": "transport length of the twin (2 decimals)",
              "type": "number"
            },
            "transportWidth": {
              "description": "transport width of the twin (2 decimals)",
              "type": "number"
            },
            "transportHeight": {
              "description": "transport height of the twin (2 decimals)",
              "type": "number"
            },
            "location": {
              "description": "location of the twin",
              "type": "string"
            },
            "maintenanceStatus": {
              "description": "maintenance status/history of the twin",
              "type": "string"
            },
            "uvvProtocol": {
              "description": "last uvv protocol of the twin (ipfs hash with file)",
              "type": "string"
            }
          }
        },
        "tasks": {
        }
      }
    }
  },
  twin: {
    "basketExtensible": false,
    "basketLoad": 454,
    "climbingAbility": "30",
    "condition": 1,
    "constructionYear": 2018,
    "driveLicense": "EMPTY",
    "driveType": 2,
    "driveVoltage": 24,
    "emptyWeight": 2447,
    "groundClearance": 95,
    "heightLimitation": false,
    "internalDesignation": "SB 100 E",
    "location": "Eisenach",
    "machineId": "DEV",
    "maintenanceStatus": "EMPTY",
    "manufacturer": "Linde",
    "markingFreeTyres": true,
    "modelDescription": "H50/1100",
    "offRoadCapable": false,
    "personCount": "2",
    "pivotedBasketArm": false,
    "platformAvailable": true,
    "platformExtendable": true,
    "platformHeight": 1160,
    "platformLength": 2260,
    "platformWidth": 910,
    "rotateableBasket": false,
    "specialFeatures": "",
    "transportHeight": 2260,
    "transportLength": 2410,
    "transportWidth": 1170,
    "type": "Diesel- und Treibgas-stapler",
    "uvvProtocol": "EMPTY",
    "workingHeight": "9800"
  }
};
export class RentalPreset {
  /**
   * Array of users that should be included into the construct
   */
  private users: Array<any>;

  /**
   * the business center domain that should be used
   */
  private businessCenterDomain: string = 'rentaldemo.evan';

  /**
   * the dispatcher angular service to access angular functions
   */
  private angularService: DemoManagementService;

  /**
   * log function saved to current scope for quick access
   */
  private log: Function;

  constructor(users: Array<any>, runtimes: Array<any>, angularService: DemoManagementService) {
    this.users = users.map((user, index: number) => {
      return Object.assign(user, { runtime: runtimes[index] });
    });

    this.angularService = angularService;
    this.log = angularService.core.utils.log.bind(angularService.core.utils);
  }

  /**
   * make users known to each other, run the contract creation, invite and share everything, add
   * bookmarks.
   *
   * @return     {Promise<string>}  the contract address
   */
  async run() {
    // make users known to each other
    for (let i = 0; i < this.users.length; i++) {
      // run key exchange for all other users
      for (let x = 0; x < this.users.length; x++) {
        if (x !== i) {
          await this.keyExchange(this.users[i], this.users[x]);
        }
      }

      // check business center status
      await this.businessCenterJoin(this.users[i]);
    }

    // create new contract
    const creationResult = await this.createContract(this.users[0]);

    // invite all users
    await this.inviteToContract(this.users[0], this.users, creationResult.contract);

    // set all users to active
    await this.setConsumerState(this.users, creationResult.contract, 4);

    // set the bookmakrs for all users
    this.setBookmarks(this.users);

    return creationResult.address;
  }
  
  /**
   * Run the server key exchange with another account id.
   *
   * @param      {any}            runtime    the runtime of the user that interacts
   * @param      {any}            userToAdd  the user that should be added object including alias,
   *                                         mnemonic, ...
   * @return     {Promise<void>}  resolved when done
   */
  async keyExchange (inviter: any, invitee: any) {
    this.log(`[Demo-Management]: key exchange ${ inviter.alias } (${ inviter.accountId }),
      ${ invitee.accountId } (${ invitee.accountId })`, 'debug');

    await inviter.runtime.profile.loadForAccount(inviter.runtime.profile.treeLabels.addressBook);

    if (!(await inviter.runtime.profile.getContactKey(invitee.accountId, 'commKey'))) {
      // no key for target account, start key exchange
      // generate commKey
      const commKey = await inviter.runtime.keyExchange.generateCommKey();

      // store for current account
      await inviter.runtime.profile.addContactKey(invitee.accountId, 'commKey', commKey);
      await inviter.runtime.profile.addProfileKey(invitee.accountId, 'alias', invitee.alias);
      await inviter.runtime.profile.storeForAccount(inviter.runtime.profile.treeLabels.addressBook);

      // other party has to accept
      await invitee.runtime.profile.loadForAccount(invitee.runtime.profile.treeLabels.addressBook);
      await invitee.runtime.profile.addContactKey(inviter.acountId, 'commKey', commKey);
      await invitee.runtime.profile.addProfileKey(inviter.agentAccount, 'alias', inviter.alias);
      await invitee.runtime.profile.storeForAccount(invitee.profile.treeLabels.addressBook);
    }
  }

  /**
   * Join a user into the business center
   *
   * @param      {any}            user    the user object that should be checked, if already joined,
   *                                      if not, join
   * @return     {Promise<void>}  resolved when done
   */
  async businessCenterJoin(user: any) {
    this.log(`[Demo-Management]: bc check ${ user.alias } (${ user.accountId }),`, 'debug');

    const businessCenter = user.runtime.contractLoader.loadContract(
      'BusinessCenter',
      await user.runtime.nameResolver.getAddress(this.businessCenterDomain),
    );

    const isMember = await user.runtime.executor.executeContractCall(businessCenter, 'isMember',
      user.accountId);

    // decide to continue or request client to join
    if (!isMember) {
      const address = await user.runtime.nameResolver.getAddress(this.businessCenterDomain);
      await user.runtime.executor.executeContractTransaction(
        businessCenter, 'join', { from: user.runtime.activeAccount, })
    }
  }

  /**
   * User that should create the contract.
   *
   * @param      {any}     user    the user that should be added object including alias, mnemonic,
   *                               ...
   * @return     {any}  the contract instance
   */
  async createContract(user: any) {
    this.log(`[Demo-Management]: contract create ${ user.alias } (${ user.accountId }),`, 'debug');

    // set latest dapp deployment to definition
    const digitalTwinDbcp = await user.runtime.description.getDescriptionFromEns('digitaltwin.rentaldemo.evan');
    
    // build the dbcp description object
    const dbcpDescription = JSON.parse(JSON.stringify(digitalTwinDbcp));
    dbcpDescription.public.dapp = digitalTwinDbcp.public.dapp;
    dbcpDescription.public.abis = digitalTwinDbcp.public.abis;

    // use random id for twin
    config.twin.machineId = `demo${(Math.floor(Math.random() * 100000))}`

    // create contract
    const contract = await user.runtime.dataContract.create('dt.factory.rentaldemo.evan',
      user.accountId, null, config.description);
    await user.runtime.dataContract.setEntry(contract, 'technicalData', config.twin, user.accountId);

    // register the ens addres
    /*contract.ensAddress = `${config.twin.machineId}.dt.rentaldemo.evan`
    await user.runtime.nameResolver.setAddress(contract.ensAddress, contract,
      user.accountId, user.accountId);*/
    
    // return all necessary data
    return {
      address: contract.options.address,
      contract: contract,
      ensAddress: config.twin.machineId,
    };
  }

  /**
   * Invite a list of members into the contract.
   *
   * @param      {any}            inviter   the user object that should invite the users
   * @param      {Array<any>}     users     list of users that should be invited
   * @param      {any}            contract  the contract where the users should be invited
   * @return     {Promise<void>}  resolved when done
   */
  async inviteToContract(inviter: any, users: Array<any>, contract: any) {
    const runtime = inviter.runtime;

    for (let user of users) {
      if (user !== inviter) {
        this.log(`[Demo-Management]: invite to contract ${ inviter.alias } (${ inviter.accountId }),
          ${ user.accountId } (${ user.accountId })`, 'debug');
        // is the user already invited?
        const isConsumer = await runtime.executor.executeContractCall(
          contract, 'isConsumer', user.accountId);

        if (!isConsumer) {
          // invite to contracts
          await runtime.dataContract.inviteToContract(
            this.businessCenterDomain,
            contract,
            inviter.accountId,
            user.accountId,
          );
      
          // extend sharings
          for (let sharing of contract.sharings) {
            const contentKey = await runtime.sharing.getKey(contract,
              runtime.activeAccount, sharing);
            await runtime.sharing.addSharing(
              contract,
              inviter.accountId,
              user.accountId,
              sharing,
              0,
              contentKey,
            );
          }
        }
      }
    }
  }

  /**
   * Save the predefined bookmarks into it's profile.
   *
   * @param      {Array<any>}  users   the users where the bookmarks should be added
   * @return     {Promise<void>}  resolved when done
   */
  async setBookmarks(users: Array<any>) {
    const bookmark = 'rentaldemo.evan';
    const bookmarkDescription = this.angularService.bookmarkService
      .getBookmarkDefinitions('rentaldemo.evan');

    for (let i = 0; i < users.length; i++) {
      this.log(`[Demo-Management]: set bookmark ${ users[i].alias } (${ users[i].accountId })`,
        'debug');

      const runtime = users[i].runtime;

      // check all bookmarks if they exists
      const existingBookmark = await runtime.profile.getDappBookmark(bookmark);

      if (!existingBookmark) {
        await runtime.profile.loadForAccount(runtime.profile.treeLabels.bookmarkedDapps);
        await runtime.profile.addDappBookmark(bookmark, bookmarkDescription);
        await runtime.profile.storeForAccount(runtime.profile.treeLabels.bookmarkedDapps);
      }
    }
  }

  /**
   * Sets the cusomer state.
   *
   * @param      {<type>}  users     The users
   * @param      {<type>}  contract  The contract
   * @return     {<type>}  { description_of_the_return_value }
   */
  async setConsumerState(users: Array<any>, contract: any, consumerState: number) {
    // set the consumer state to active
    for (let i = 0; i < users.length; i++) {
      this.log(`[Demo-Management]: set consumerstate to ${ consumerState } : ${ users[i].alias }
        (${ users[i].accountId })`, 'debug');

      await this.users[i].runtime.executor.executeContractTransaction(
        contract,
        'changeConsumerState',
        { from: this.users[i].accountId },
        this.users[i].accountId,
        consumerState
      );
    }
  }
}
