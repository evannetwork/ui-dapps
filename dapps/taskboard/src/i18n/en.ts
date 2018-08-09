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

export const en = {
  'taskboard': 'Task Board',
  'task-create': 'New Task',
  'queue': 'Synchronization',
  'task': 'New Task',
  '_dapptaskboard': {
    'no-task-created': 'No tasks found',
    'nothing-found-filter': 'No tasks found for <b>{{ filter }}</b>...',
    'add': 'New Task',
    'remove': 'Remove',
    'filter-items': 'Filter tasks or create one...',
    'create-form': {
      'task-title': 'Title *',
      'members' : 'Members *',
      'what-needs-to-be-done' : 'What needs to be done?',
      'add-todo-hint': `
        Enter a todo into the textbox and press enter.<br><br>
        <b>Add at least one ToDo to continue.</b>
      `,
      'todos': 'ToDos *',
      'add-member': 'Add members:',
      'criteria': 'Fulfillment Criteria',
      'me': 'Me',
      'i': 'I',
      'criteria-description': 'Fulfillment Criteria must be met to complete a ToDo.',
      'task-finish-in-order': 'ToDo\'s must be finished in order'
    },
    'dispatcher': {
      'create-task': 'Create Task',
      'create-task-description': 'Initializes your new task including members and ToDos.',
      'todo-log': 'Resolving todos...',
      'todo-log-description': 'Save task todo logs to the task contract.'
    },
    'todocriteria': {
      'comment': 'Comment',
      'img': 'Image',
    },
    'contract-invitation': {
      'text-title': 'Task invitation',
      'text-body': `
You are invited to the Task {{ taskName }}.
Use the attachment action to accept the invitation.
`
    },
    'submit': 'Submit',
    'cancel': 'Cancel',
    'loading': 'Loading task...',
    'solved-by': 'Solved by',
    'solved-at': 'Solved at',
    'created': 'Created',
    'members': 'Members',
    'todos': 'ToDos',
    'created-by': 'Created by',
    'no-members': 'No members invited',
    'contract-id': 'Contract ID',
    'contract-locked': 'Contract locked',
    'contract-locked-desc': `
      You are not a participant in this task and do not have the necessary rights to
      load the task internal data.
    `,
    'contract-state': 'Task Status',
    'contract-states': {
      'undefined': 'Unknown',
      '0': 'Initial',
      '1': 'Error',
      '2': 'Draft',
      '3': 'PendingApproval',
      '4': 'Approved',
      '5': 'Active',
      '6': 'VerifyFinished',
      '7': 'Finished',
      'loading': 'Loading...'
    },
    'my-states': {
      'undefined': 'Unknown',
      '0': 'Initial',
      '1': 'Error',
      '2': 'Draft',
      '3': 'Rejected',
      '4': 'Active',
      '5': 'Finished',
      'loading': 'Loading...'
    },
    'set-terminated': 'Finish Task',
    'set-active': 'Start task',
    'my-state': 'My State',
    'set-my-state-active': 'Accept',
    'reject-task': 'Reject',
    'not-activated': 'Contract not activated',
    'not-activated-desc': 'This contract is not activated for you. Please activate it, to work through ToDos.',
    'task-status': 'Task Status',
    'task-details': 'Task Details',
    'set-me-terminated': 'Finish Work',
    'for': 'for',
    'creator': 'Creator',
    'reallyTerminate': 'Finish Task ?',
    'reallyTerminateMessage': 'With finishing this task, no more changes will be accepted on any todos',
    'solveTodo': 'Finish ToDo',
    'solveTodoMessage': 'Mark ToDo as solved ?',
    'startToSolveTodo': 'Task not started',
    'startToSolveTodoMessage': 'The task must be started to solve Todos.',
    'created-from': 'Created from'
  }
};
