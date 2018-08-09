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
  RightsAndRoles
} from 'bcc';

import {
  Router,             // '@angular/router';
  OnInit, Injectable, // '@angular/core';
  Observable, CanActivate,
  DomSanitizer
} from 'angular-libs';

import {
  EvanAddressBookService,
  EvanBCCService,
  EvanBcService,
  EvanCoreService,
  EvanDescriptionService,
  EvanPictureService,
  EvanQueue,
  EvanRoutingService,
  EvanTranslationService,
  EvanUtilService,
  QueueId,
  SingletonService,
} from 'angular-core';

/**************************************************************************************************/

@Injectable()
export class TaskService {
  public dataContract: any;
  public ensAddress: string;
  public queueAddress: string;
  public bcAddress: string;
  public taskQueueId: QueueId;
  public tasks: Array<any>;
  public criteriaTypes: Array<string>;
  private whitelist_roles: any = [0, 1];

  constructor(
    private singleton: SingletonService,
    private routingService: EvanRoutingService,
    private core: EvanCoreService,
    private utils: EvanUtilService,
    private descriptionService: EvanDescriptionService,
    private bcService: EvanBcService,
    private bccService: EvanBCCService,
    private queueService: EvanQueue,
    private translate: EvanTranslationService,
    private addressBook: EvanAddressBookService,
    public _DomSanitizer: DomSanitizer,
    private pictureService: EvanPictureService
  ) {
    return singleton.create(TaskService, this, () => {
      this.ensAddress = this.descriptionService.getEvanENSAddress('task');
      this.queueAddress = this.ensAddress;
      this.bcAddress = this.descriptionService.getEvanENSAddress('taskboard');
      this.tasks = [ ];
      this.criteriaTypes = [
        'choice',
        'pictures',
        // 'files',
        'comment',
        'signature'
      ];

      this.taskQueueId = new QueueId(
        this.queueAddress,
        'TaskContractDispatcher',
        'taskContract'
      );
    }, true);
  }

  getTodoQueueId(taskId) {
    return new QueueId(
      this.queueAddress,
      'TodoDispatcher',
      taskId
    );
  }

  getTodoLogQueueId(taskId) {
    return new QueueId(
      this.queueAddress,
      'TodoLogDispatcher',
      taskId
    );
  }

  getStateQueueId(taskId) {
    return new QueueId(
      this.queueAddress,
      'StateDispatcher',
      taskId
    );
  }

  getMemberQueueId(taskId) {
    return new QueueId(
      this.queueAddress,
      'MemberDispatcher',
      taskId
    );
  }

  async getTaskMetadata(taskAddress: string) {
    const dataContract = await this.getDataContract();
    return await dataContract.getEntry(
      taskAddress,
      'metadata',
      this.core.activeAccount()
    );
  }

  async getDataContract() {
    const businessCenter = await this.bcService.getCurrentBusinessCenter(this.bcAddress);
    const dataContract = businessCenter.dataContract;

    return dataContract;
  }

  async getBlobUri(dataUrl) {
    const buffer = await this.pictureService.dataURItoBlob(dataUrl);
    const urlCreator = (<any>window).URL || (<any>window).webkitURL;
    return urlCreator.createObjectURL(new Blob([buffer], {type: 'image/png'}));
  }

  async getMemberState(contractId?: any, accountId?: string) {
    if (accountId === this.core.activeAccount()) {
      const stateChanges = this.queueService.getQueueEntry(this.getStateQueueId(contractId), true).data;
      const myStateUpdate = !!stateChanges.find(stateUpdate => stateUpdate === 'me');

      if (myStateUpdate) {
        return 'loading';
      }
    }

    const contractInstance = this.bccService.contractLoader.loadContract('BaseContract', contractId);
    return await this.bccService.executor.executeContractCall(contractInstance, 'getConsumerState', accountId);
  }

  async getContractState(contractId?: any) {
    const stateChanges = this.queueService.getQueueEntry(this.getStateQueueId(contractId), true).data;
    const contractStateUpdate = !!stateChanges.find(stateUpdate => stateUpdate === 'contract');

    if (contractStateUpdate) {
      return 'loading';
    } else {
      const contractInstance = this.bccService.contractLoader.loadContract('BaseContract', contractId);

      return await this.bccService.executor.executeContractCall(contractInstance, 'contractState');
    }
  }

  async getMembers(contractId?: any, ensDomain?: string) {
    const bcRoles = new RightsAndRoles({
      contractLoader: this.bccService.contractLoader,
      executor: this.bccService.executor,
      nameResolver: this.bccService.nameResolver,
    });
    let members = [];

    const roles = await bcRoles.getMembers(contractId);
    for (let roleId in roles) {
      if (this.whitelist_roles.indexOf(parseInt(roleId, 10)) !== -1) {
        members = members.concat(roles[roleId]);
      }
    }

    this.utils
      .deepCopy(this.queueService.getQueueEntry(this.getMemberQueueId(contractId), true).data)
      .forEach(member => {
        members.unshift(member.accountId);
      });

    // unique
    members = members.filter(
      (el, index, a) => index === a.indexOf(el)
    );

    return members;
  }

  public async getTask(taskId: string, reload?: boolean, awaitDetails?: boolean|Function) {
    let existingTask = this.tasks.find(task => task.address === taskId);

    const dataContract = await this.getDataContract();
    let loadedTask = await this.bcService.getBCContract(this.bcAddress, taskId);

    loadedTask = this.utils.deepCopy(loadedTask);

    if (!loadedTask) {
      loadedTask = {
        error: 'Not permitted'
      };
    } else {
      existingTask = this.tasks.find(task => task.address === taskId);

      const index = this.tasks.indexOf(existingTask);

      if (index !== -1) {
        this.tasks.splice(index, 1);
        this.tasks.splice(index, 0, loadedTask);
      } else {
        this.tasks.push(loadedTask);
      }

      loadedTask.loading = true;

      // reset members
      loadedTask.members = [ ];
      loadedTask.metadata = await this.getTaskMetadata(taskId);

      if (typeof awaitDetails === 'function') {
        setTimeout(async () => {
          await this.loadDetailsForTask(dataContract, this.core.activeAccount(), loadedTask);
          
          awaitDetails(loadedTask)
        });
      } else if (awaitDetails) {
        await this.loadDetailsForTask(dataContract, this.core.activeAccount(), loadedTask);
      } else {
        this.loadDetailsForTask(dataContract, this.core.activeAccount(), loadedTask);
      }
    }

    return loadedTask;
  }

  public async loadDetailsForTask(dataContract: any, activeAccount: string, task: any) {
    try {
      const todos = await dataContract.getListEntries(
        task.address,
        'todos',
        activeAccount,
        true,
        true,
        Number.MAX_VALUE,
        0,
        false
      );

      let logs = await dataContract.getListEntries(
        task.address,
        'todologs',
        activeAccount,
        true,
        true,
        Number.MAX_VALUE,
        0,
        false
      );

      this.utils
        .deepCopy(this.queueService.getQueueEntry(this.getTodoQueueId(task.address), true).data)
        .forEach(todo => {
          todo.loading = true;

          todos.unshift(todo);
        })

      const queueLogs = this.utils
        .deepCopy(this.queueService.getQueueEntry(this.getTodoLogQueueId(task.address), true).data);

      logs = [ ].concat(logs, queueLogs);

      for (let todo of todos) {
        const logEntry = logs.find(taskLog => taskLog.id === todo.id);
        let todoDetailEntry;
        
        if (task && task.todos) {
          todoDetailEntry = task.todos.find(originTodo => originTodo.id === todo.id);
        }

        todo.solved = !!logEntry;

        if (logEntry) {
          if (logEntry.pictures) {
            if(!Array.isArray(logEntry.pictures)) {
              const decrypted = await dataContract.decrypt(
                logEntry.pictures,
                task.address,
                this.core.activeAccount(),
                '*'
              );

              logEntry.pictures = decrypted.private;
            }
            const urlCreator = (<any>window).URL || (<any>window).webkitURL;

            for (let picture of logEntry.pictures) {
              picture.file = new Blob([picture.file], { type: picture.fileType });
              const blobUri = urlCreator.createObjectURL(picture.file);
              picture.blobURI = this._DomSanitizer.bypassSecurityTrustUrl(blobUri);
            }
          }

          todo.detail = logEntry;
        } else if (todoDetailEntry && todoDetailEntry.detail) {
          todo.detail = todoDetailEntry.detail;
        } else {
          todo.detail = {
            id: todo.id,
            taskId: task.address
          };
        }

        if (todoDetailEntry && todoDetailEntry.showDetail) {
          todo.showDetail = true;
        }

        if (queueLogs.indexOf(logEntry) !== -1) {
          todo.loading = true;
        }

        // sort criterias
        if (todo.criteria) {
          todo.criteria = todo.criteria.sort((criteriaA, criteriaB) => {
            return this.criteriaTypes.indexOf(criteriaA) - this.criteriaTypes.indexOf(criteriaB);
          });
        }
      }

      todos.sort((a, b) => a.order - b.order);

      task.contractState = await this.getContractState(task.address);
      task.members = await this.getMembers(task.address);
      task.states = await this.loadTaskStates(task);
      task.todos = todos;
      task.logs = logs;
    } catch (ex) {
      console.error(ex);

      task.ex = true;
      task.members = task.members || [ ];
      task.states = task.states || { };
      task.todos = task.todos || [ ];
      task.logs = task.logs || [ ];
    }

    task.loading = false;
  }

  async loadTaskStates(task) {
    const states = { };

    for (let member of task.members) {
      states[member] = await this.getMemberState(task.address, member);
    }

    return states;
  }

  async createContract() {
    const businessCenter = await this.bcService.getCurrentBusinessCenter(this.bcAddress);
    const dataContract = businessCenter.dataContract;

    // check if user is joined
    if (!businessCenter.joined) {
      await this.bcService.joinBc(this.bcAddress);
    }

    const contract = await dataContract.create(
      'tasks',
      this.core.activeAccount(),
      this.bcAddress
    );

    await this.changeState(contract, 'me', 4)
    return contract;
  }

  async saveTaskMyProfile(contract, task) {
    await this.bccService.profile.loadForAccount(this.bccService.profile.treeLabels.contracts);

    const activeAccount = this.core.activeAccount();
    const dataContract = await this.getDataContract();
    const addressBook = await this.addressBook.loadAccounts();
    const ensDescription = await this.descriptionService.getDescription(this.ensAddress);

    // get cryptor and data to save to my profile
    const cryptor = this.bccService.cryptoProvider.getCryptorByCryptoAlgo(
      dataContract.options.defaultCryptoAlgo
    );

    const envelope = {
      cryptoInfo: cryptor.getCryptoInfo(this.bccService.nameResolver.sha3(contract.options.address)),
      public: {
        abis: {
          own: contract.options.jsonInterface,
        },
        author: ensDescription.author,
        dapp: ensDescription.dapp,
        dataSchema: ensDescription.dataSchema,
        description: ensDescription.description,
        i18n: ensDescription.i18n,
        imgSquare: ensDescription.imgSquare,
        imgWide: ensDescription.imgWide,
        name: task.name,
        tags: ensDescription.tags,
        version: ensDescription.version,
      }
    };

    // save to my profile
    await this.addMetadataToTask(contract, Object.assign({ }, task.metadata || { }, {
      bc: this.bcAddress,
      type: 'task',
      created: Date.now(),
      createdby: activeAccount,
    }));
    
    await this.bccService.description.setDescriptionToContract(
      contract.options.address, envelope, activeAccount
    );

    await this.bccService.profile.addBcContract(
      this.bcAddress,
      contract.options.address,
      envelope.public
    );

    await this.bccService.profile.storeForAccount(this.bccService.profile.treeLabels.contracts);
  }

  async addMetadataToTask(task: any, metadata: any) {
    const dataContract = await this.getDataContract();
    await dataContract.setEntry(task,
      'metadata',
      metadata,
      this.core.activeAccount()
    );
  }

  async inviteMembersToTask(contract, task) {
    if (task.members.length > 0) {
      const dataContract = await this.getDataContract();
      const activeAccount = this.core.activeAccount();
      const contactId = contract && contract.options ? contract.options.address : contract;

      // invite members to contract
      const members = task.members;
      const bc = await this.bcService.getCurrentBusinessCenter(this.bcAddress);

      // invite all users to contract
      for (let memberAddress of members) {
        // build bmail for invited user
        const ret = {
          content: {
            from: activeAccount,
            fromAlias: await this.bccService.profile.getProfileKey('alias', activeAccount),
            title: this.translate.instant('_dapptaskboard.contract-invitation.text-title'),
            body: this.translate.instant('_dapptaskboard.contract-invitation.text-body', { taskName: task.name}),
            attachments: [{
              type: 'contract',
              address: contactId,
              bc: this.bcAddress
            }]
          }
        };

        const isMember = await this.bccService.executor.executeContractCall(bc.businessCenter, 'isMember', memberAddress);
        if (!isMember) {
          await this.bccService.executor.executeContractTransaction(
            bc.businessCenter,
            'invite',
            { from: activeAccount, autoGas: 1.1, },
            memberAddress
           );
        }

        // invite user to contract
        await dataContract.inviteToContract(
          this.bcAddress,
          contactId,
          activeAccount,
          memberAddress
        );

        // get the content sharing key
        const contentKey = await this.bccService.sharing.getKey(contactId, activeAccount, '*');

        // share the contract with the user
        await this.bccService.sharing.addSharing(
          contactId,
          activeAccount,
          memberAddress,
          '*',
          0,
          contentKey,
        );

        const hashKey = await this.bccService.sharing.getHashKey(contactId, activeAccount);
        await this.bccService.sharing.ensureHashKey(contactId, activeAccount, memberAddress, hashKey);
        // send the bmail to the invitee
        await this.bccService.mailbox.sendMail(
          ret,
          activeAccount,
          memberAddress
        );
      }
    }
  }

  async addTodos(contract, todos) {
    const dataContract = await this.getDataContract();
    const activeAccount = this.core.activeAccount();

    const todoCopies = this.utils.deepCopy(todos).map(todo => {
      todo.created = Date.now();

      delete todo.taskId;
      delete todo.loading;

      return todo;
    });

    await dataContract.addListEntries(
      contract,
      'todos',
      todoCopies,
      activeAccount
    );

    todos.forEach(todo => {
      delete todo.loading;

      todo.detail = {
        id: todo.id,
        taskId: todo.taskId
      };
    });
  }

  async addTodo(contract, todo) {
    await this.addTodos(contract, [ todo ]);
  }

  async changeState(contract, target, state) {
    const dataContract = await this.getDataContract();
    const activeAccount = this.core.activeAccount();
    if (target === 'contract') {
      await dataContract.changeContractState(
        contract,
        activeAccount,
        state
      );
    } else if (target === 'me') {
      await dataContract.changeConsumerState(
        contract,
        activeAccount,
        activeAccount,
        state
      );
    }
  }

  async addTodoLog(taskId, todoLog) {
    const dataContract = await this.getDataContract();

    if (todoLog.pictures) {
      const blockNr = await this.bccService.web3.eth.getBlockNumber();
      const encryptedPictures = await dataContract.encrypt(
        { private: todoLog.pictures },
        taskId,
        this.core.activeAccount(),
        'todologs',
        blockNr,
        'aesBlob'
      );
      todoLog.pictures = encryptedPictures;
    }

    delete todoLog.taskId;

    await dataContract.addListEntries(
      taskId,
      'todologs',
      [ todoLog ],
      this.core.activeAccount()
    );
    // const task = await this.getTask(taskId);
    // await this.loadDetailsForTask(dataContract, this.core.activeAccount(), task);

    // const todo = task.todos.find(t => t.id === todoLog.id);
    // if (todo) {
    //   delete todo.loading;
    // }
  }
}
