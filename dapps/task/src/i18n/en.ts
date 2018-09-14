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

export const en = {
  'taskboard': 'Task Board',
  'taskcreate': 'New Task',
  'queue': 'Synchronization',
  'task': 'New Task',
  'opendapp': 'Open DApp',
  '_dapptaskboard': {
    'no-task-created': 'No tasks found',
    'nothing-found-filter': 'No tasks found for <b>{{ filter }}</b>...',
    'add': 'New Task',
    'add-hint': 'Please fill in all fields marked with *.',
    'remove': 'Remove',
    'filter-items': 'Filter tasks or create one...',
    'solve-todo': 'Save',
    'close-todo': 'Close',
    '_dapptaskboard.min': 'min.',
    'create-task': 'Create Task',
    'showMore': 'Show technical data',
    'showLess': 'Hide technical data',
    'add-members': 'Add members',
    'invite-members': 'Send Invitations',
    'technical-details': 'Technical contract information',
    'task-reload': 'Task is updating...',
    'rlyFinishMember': 'Complete task',
    'yes': 'Yes',
    'no': 'No',
    'todo-finish-not-allowed': 'You are not authorized to complete subtasks.',
    'rlyFinishMemberMessage': `
      When you finish reporting the work on this task, your employer will be notified of the progress and
      further processing is no longer possible.
    `,
    'rlyClose': 'Close task',
    'rlyCloseMessage': `
      When you close this task, further processing is no longer possible.
    `,
    'strict-finish-hint': `
      The Subtask must be processed one after the other. Please finish the previous todo.
    `,
    'todo-finish-hint-1': `
      The task must have started and you must be able to edit it.
    `,
    'todo-finish-hint-2': `
      You must accept the task to process it. 
    `,
    'create-form': {
      'task-title': 'Title *',
      'members' : 'Members *',
      'title-placeholder': 'Insert title of the task',
      'what-needs-to-be-done' : 'What needs to be done?',
      'add-todo-hint': `Add at least one ToDo to continue.`,
      'todos': 'Subtasks *',
      'add-member': 'Add members:',
      'criteria': 'Fulfillment Criteria',
      'me': 'Me',
      'i': 'I',
      'criteria-description': 'Fulfillment Criteria must be met to complete a ToDo.',
      'task-finish-in-order': 'Subtasks must be finished in order',
      'new-todo': 'New Subtask',
      'order': 'Subtask order'
    },
    'dispatcher': {
      'create-task': 'Create Task',
      'create-task-description': 'Initializes your new task including members and Subtasks.',
      'todo-log': 'Resolving Subtasks...',
      'todo-log-description': 'Save task todo logs to the task contract.',
      'state': 'Contract State change',
      'state-description': 'Change the state of a contract'
    },
    'todocriteria': {
      'comment': 'Comment',
      'comment-desc': 'Comment',
      'pictures': 'Images',
      'files': 'Files',
      'choice': 'Choice (yes / no)',
      'choice-label': 'Question',
      'choice-required': 'Must be marked as true?',
      'min-pics-required': 'Minimum amount of images',
      'min-files-required': 'Minimum amount of files',
      'comment-required': 'Comment required?',
      'take-a-picture': 'Take a picture',
      'no-pictures-taken': 'No pictures taken',
      'signature': 'Signature',
      'signature-required': 'Is the signature required?',
      'empty-signature': 'No signature has been saved yet.',
      'signature-clear-text': 'Name',
      'label': 'Criteria',
      'description': 'Description',
      'required': 'Required',
      'none': 'Confirmation'
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
    'todos': 'Subtasks',
    'add-new-todos': 'Add new Subtasks',
    'created-by': 'Created by',
    'no-members': 'No members invited',
    'contract-id': 'Contract ID',
    'solve-task-hint': 'To complete a task, the subtasks must be completed.',
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
    'set-contract-terminated': 'Finish Task',
    'set-active': 'Start task',
    'my-state': 'My State',
    'set-my-state-active': 'Accept',
    'reject-task': 'Reject',
    'not-activated': 'Contract not activated',
    'not-activated-desc': 'This contract is not activated for you. Please activate it, to work through Subtasks.',
    'task-status': 'Task Status',
    'task-details': 'Task Details',
    'set-me-terminated': 'Finish Work',
    'for': 'for',
    'creator': 'Creator',
    'reallyTerminate': 'Finish Task?',
    'reallyTerminateMessage': 'With finishing this task, no more changes will be accepted on any Subtasks',
    'solveTodo': 'Finish Subtask',
    'solveTodoInvalid': 'Finish Subtask not possible',
    'solveTodoMessage': 'Mark Subtask as solved?',
    'startToSolveTodo': 'Task not started',
    'startToSolveTodoMessage': 'The task must be started to solve Subtasks.',
    'created-from': 'Created from'
  }
};
