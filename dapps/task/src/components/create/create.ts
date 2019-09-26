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
*/

import {
  Component, OnInit, AfterViewInit,     // @angular/core
  Validators, FormBuilder, FormControl, // @angular/forms
  ViewChild, ElementRef, Input, Output,
  EventEmitter, OnDestroy, ChangeDetectorRef,
  ChangeDetectionStrategy
} from '@evan.network/ui-angular-libs';

import {
  createOpacityTransition,
  EvanCoreService,
  EvanRoutingService,
  EvanUtilService,
  EvanAddressBookService,
  EvanQueue,
  AsyncComponent
} from '@evan.network/ui-angular-core';

import { TaskService } from '../../services/task';

/**************************************************************************************************/

@Component({
  selector: 'taskboard-task-create',
  templateUrl: 'create.html',
  animations: [
    createOpacityTransition()
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class TaskCreateComponent extends AsyncComponent {
  public todoText: string;
  public contacts: any;
  public activeAccount: string;
  public contactKeys: Array<string>;
  public taskCreating: boolean;

  public name: string;
  public members: Array<string>;
  public todos: Array<any>;
  public strictFinish: boolean;
  private clearQueue: any;

  @ViewChild('nameInput') nameInput: any;
  @Input('task') predefinedTask: any;
  @Input('ngSubmit') ngSubmit: Function;
  @Input('isDetailValid') isDetailValid: Function;
  @Input('membersRequired') membersRequired: number;

  constructor(
    private core: EvanCoreService,
    private utils: EvanUtilService,
    private routing: EvanRoutingService,
    private addressBook: EvanAddressBookService,
    private queueService: EvanQueue,
    private taskService: TaskService,
    private ref: ChangeDetectorRef
  ) {
    super(ref, false);
  }

  async _ngOnInit() {
    const queryParams = this.routing.getQueryparams();

    this.activeAccount = this.core.activeAccount();
    this.name = queryParams.name || '';
    this.todos = [ ];
    this.members = [ ];
    this.strictFinish = false;

    this.clearQueue = await this.queueService.onQueueFinish(this.taskService.taskQueueId, (reload) => {
      this.name = queryParams.name || '';
      this.todos = [ ];
      this.members = [ ];
      this.strictFinish = false;
      this.taskCreating = false;
    });

    if (this.predefinedTask && typeof this.predefinedTask === 'object' && this.predefinedTask !== null) {
      const keys = Object.keys(this.predefinedTask);

      for (let i = 0; i < keys.length; i++) {
        this[keys[i]] = this.predefinedTask[keys[i]];

        if (keys[i] === 'todos') {
          for (let x = 0; x < this.todos.length; x++) {
            this.todos[x].criteria = this.todos[x].criteria || [];
            this.todos[x].required = this.todos[x].required || {};
            this.todos[x].labels = this.todos[x].labels || { };
          }
        }
      }
    }

    if (!this.isDetailValid) {
      this.isDetailValid = () => {
        return true;
      };
    }
  }

  async _ngOnDestroy() {
    this.clearQueue();
  }

  async _ngAfterViewInit() {
    this.focusNameInput();
    this.ref.detectChanges();
  }

  /**
   * Auto focus alias input.
   */
  focusNameInput() {
    if (this.nameInput) {
      this.nameInput.setFocus();
    }
  }

  /**
   * Save active task data to the task queue.
   */
  saveTask() {
    const task = {
      name: this.name,
      members: this.members,
      todos: this.todos,
      loading: true,
      metadata: {
        strictFinish: this.strictFinish,
      }
    };
    
    if (this.ngSubmit) {
      this.ngSubmit(task);
    } else {
      this.taskCreating = true;

      this.queueService.addQueueData(
        this.taskService.taskQueueId,
        task
      );
  
      this.utils.sendEvent('task-creating', task);
    }
    
    this.ref.detectChanges();
  }
}
