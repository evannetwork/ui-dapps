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
  getDomainName
} from '@evan.network/ui-dapp-browser';

import {
  RightsAndRoles
} from '@evan.network/api-blockchain-core';

import {
  Router,             // '@angular/router';
  OnInit, Injectable, // '@angular/core';
  Observable, CanActivate
} from '@evan.network/ui-angular-libs';

import {
  EvanAddressBookService,
  EvanBCCService,
  EvanBcService,
  EvanCoreService,
  EvanDescriptionService,
  EvanQueue,
  EvanRoutingService,
  EvanTranslationService,
  EvanUtilService,
  QueueId,
  SingletonService,
} from '@evan.network/ui-angular-core';

/**************************************************************************************************/

@Injectable()
export class TaskService {
  public dataContract: any;
  public ensAddress: string;
  public bcAddress: string;
  public taskQueueId: QueueId;
  public tasks: Array<any>;
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
    private addressBook: EvanAddressBookService
  ) {
    return singleton.create(TaskService, this, () => {
      this.ensAddress = this.descriptionService.getEvanENSAddress('task');
      this.bcAddress = this.descriptionService.getEvanENSAddress('taskboard');
      this.tasks = [ ];

      this.taskQueueId = new QueueId(
        this.ensAddress,
        'TaskContractDispatcher',
        'taskContract'
      );
    }, true);
  }

  getTodoQueueId(taskId) {
    return new QueueId(
      this.ensAddress,
      'TodoDispatcher',
      taskId
    );
  }

  getTodoLogQueueId(taskId) {
    return new QueueId(
      this.ensAddress,
      'TodoLogDispatcher',
      taskId
    );
  }

  getStateQueueId(taskId) {
    return new QueueId(
      this.ensAddress,
      'StateDispatcher',
      taskId
    );
  }

  getMemberQueueId(taskId) {
    return new QueueId(
      this.ensAddress,
      'MemberDispatcher',
      taskId
    );
  }

  async getDataContract() {
    const businessCenter = await this.bcService.getCurrentBusinessCenter(this.bcAddress);
    const dataContract = businessCenter.dataContract;

    return dataContract;
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
      web3: this.bccService.web3
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

  public async getTask(taskId: string, reload?: boolean) {
    let existingTask = this.tasks.find(task => task.address === taskId);

    if (!existingTask || reload) {
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
        this.loadDetailsForTask(dataContract, this.core.activeAccount(), loadedTask);
      }

      return loadedTask;
    } else {
      return existingTask;
    }
  }

  public async getTasks(onTaskDetail?: Function) {
    const activeAccount = this.core.activeAccount();
    const dataContract = await this.getDataContract();
    let tasks = await this.bcService.getBCContracts(this.bcAddress);
    tasks = this.utils.deepCopy(tasks);

    // load todos for all task
    for (let i = 0; i < tasks.length; i++) {
      if (typeof tasks[i] !== 'object' || tasks[i] === null) {
        tasks.splice(i, 1);

        i--;

        continue;
      }

      tasks[i].loading = true;

      tasks[i].members = [ ];
      setTimeout(async () => {
        await this.loadDetailsForTask(dataContract, activeAccount, tasks[i]);

        if (onTaskDetail) {
          onTaskDetail();
        }
      });
    }

    // load tasks from queue and push them with loading flag to the task list
    let queuedTasks = this.utils
      .deepCopy(this.queueService.getQueueEntry(this.taskQueueId, true).data)
      .map(queueTask => {
        queueTask.loading = true;

        return queueTask;
      });

    tasks = this.tasks = [ ].concat(queuedTasks, tasks);
    tasks.sort((a, b) => {
      return a.created - b.created;
    });

    return tasks;
  }

  public async loadDetailsForTask(dataContract: any, activeAccount: string, task: any) {
    try {
      // dont load data, when the contract is only a queue dummy 
      if (!task || !task.address) {
        return;
      }

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

      todos.forEach(todo => {
        const logEntry = logs.find(taskLog => taskLog.id === todo.id);

        todo.solved = !!logEntry;
        todo.detail = logEntry || {
          id: todo.id,
          taskId: task.address
        };

        if (queueLogs.indexOf(logEntry) !== -1) {
          todo.loading = true;
        }
      });

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
      task.states = task.members || [ ];
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
}
