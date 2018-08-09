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
  Injectable,
  Component, OnInit, Input,            // @angular/core
  Validators, FormBuilder, FormGroup,  // @angular/forms
  DomSanitizer
} from 'angular-libs';

import {
  EvanBCCService,
  EvanBcService,
  EvanCoreService,
  QueueDispatcher,
  QueueSequence,
  SingletonService,
} from 'angular-core';

import { TaskService } from '../services/task';

import {
  translations
} from '../i18n/registry';

/**************************************************************************************************/

@Injectable()
export class TaskContractDispatcherService {
  constructor(
    public singleton: SingletonService,
    public taskService: TaskService
  ) {
    return singleton.create(TaskContractDispatcherService, this);
  }
}

export const TaskContractDispatcher = new QueueDispatcher(
  [
    new QueueSequence(
      '_dapptaskboard.dispatcher.create-task',
      '_dapptaskboard.dispatcher.create-task-description',
      async (service: TaskContractDispatcherService, queueEntry: any) => {
        const tasks = queueEntry.data;
        const taskService = service.taskService;

        for (let task of tasks) {
          const contract = await taskService.createContract();
          await Promise.all([
            taskService.inviteMembersToTask(contract, task),
            taskService.addTodos(contract, task.todos.reverse()),
            taskService.saveTaskMyProfile(contract, task)
          ]);
        }
      }
    )
  ],
  translations,
  'TaskContractDispatcherService'
);

export const TodoDispatcher = new QueueDispatcher(
  [
    new QueueSequence(
      '_dapptaskboard.dispatcher.todo-log',
      '_dapptaskboard.dispatcher.todo-log-description',
      async (service: TaskContractDispatcherService, queueEntry: any) => {
        const todos = queueEntry.data;
        const taskService = service.taskService;

        for (let todo of todos) {
          await taskService.addTodos(todo.taskId, todo.todos);
        }
      }
    )
  ],
  translations,
  'TaskContractDispatcherService'
);

export const TodoLogDispatcher = new QueueDispatcher(
  [
    new QueueSequence(
      '_dapptaskboard.dispatcher.todo-log',
      '_dapptaskboard.dispatcher.todo-log-description',
      async (service: TaskContractDispatcherService, queueEntry: any) => {
        const logs = queueEntry.data;
        const taskService = service.taskService;

        for (let taskLog of logs) {
          await taskService.addTodoLog(taskLog.taskId, taskLog);
        }
      }
    )
  ],
  translations,
  'TaskContractDispatcherService'
);

export const StateDispatcher = new QueueDispatcher(
  [
    new QueueSequence(
      '_dapptaskboard.dispatcher.state',
      '_dapptaskboard.dispatcher.state-description',
      async (service: TaskContractDispatcherService, queueEntry: any) => {
        const states = queueEntry.data;
        const taskService = service.taskService;

        for (let state of states) {
          await taskService.changeState(state.contract, state.target, state.state);
        }
      }
    )
  ],
  translations,
  'TaskContractDispatcherService'
);

export const MemberDispatcher = new QueueDispatcher(
  [
    new QueueSequence(
      '_dapptaskboard.dispatcher.member',
      '_dapptaskboard.dispatcher.member-description',
      async (service: TaskContractDispatcherService, queueEntry: any) => {
        const members = queueEntry.data;
        const taskService = service.taskService;

        for (let member of members) {
          await taskService.inviteMembersToTask(member.taskId, {
            members: [ member.accountId ],
            name: member.taskName
          });
        }
      }
    )
  ],
  translations,
  'TaskContractDispatcherService'
);
