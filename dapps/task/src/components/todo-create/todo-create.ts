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
  Component, OnInit, AfterViewInit,                // @angular/core
  Validators, FormBuilder, FormGroup, FormControl, // @angular/forms
  ViewChild, ElementRef, Input, Output, EventEmitter,
  ChangeDetectionStrategy, ChangeDetectorRef
} from 'angular-libs';

import {
  createOpacityTransition,
  EvanCoreService,
  EvanRoutingService,
  EvanUtilService,
  EvanAddressBookService,
  EvanQueue,
  EvanTranslationService
} from 'angular-core';

import { TaskService } from '../../services/task';

/**************************************************************************************************/

@Component({
  selector: 'taskboard-todo-create',
  templateUrl: 'todo-create.html',
  animations: [
    createOpacityTransition()
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class TodoCreateComponent implements OnInit, AfterViewInit {
  @Input() todos: Array<any>;
  @Input() headerText?: string;
  @Input() task?: any;
  @Input() unshift?: boolean;
  @Input() initialOrder?: number;

  @Output() public onChange: EventEmitter<any> = new EventEmitter();

  private todoText: string;
  private orderIncrease = 100;

  constructor(
    private core: EvanCoreService,
    private formBuilder: FormBuilder,
    private utils: EvanUtilService,
    private routing: EvanRoutingService,
    private addressBook: EvanAddressBookService,
    private queueService: EvanQueue,
    private taskService: TaskService,
    private translationService: EvanTranslationService,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit() {
    if (!this.initialOrder) {
      this.initialOrder = 1000;
    }

    this.todoText = '';

    this.ref.detectChanges();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.ref.detectChanges();
    }, 1000);
  }

  /**
   * Check if a user enters a todo text and press enter.
   * @param  $event Incoming keyboard event
   */
  todoTextChanged($event: any) {
    this.ref.detectChanges();

    if ($event.keyCode === 13) {
      this.addTodo();

      $event.preventDefault()
      $event.stopPropagation();
      return false;
    }
  }

  addTodo() {
    if (this.todoText.length) {
      const addFunction = this.unshift ? 'unshift' : 'push';

      this.todos[addFunction]({
        id: this.utils.generateID(),
        alias: this.todoText,
        order: this.getHighestOrder() + this.orderIncrease,
        createdFrom: this.core.activeAccount() ,
        criteria: [
          'comment'
        ],
        required: {
          pictures: 1,
          files: 1
        },
        labels: {
          choice: this.translationService.instant('_dapptaskboard.todocriteria.choice'),
          comment: this.translationService.instant('_dapptaskboard.todocriteria.comment'),
          pictures: this.translationService.instant('_dapptaskboard.todocriteria.pictures'),
          files: this.translationService.instant('_dapptaskboard.todocriteria.files'),
          signature: this.translationService.instant('_dapptaskboard.todocriteria.signature'),
        },
      });

      this.todoText = '';

      this.onChange.emit();
      this.ref.detectChanges();
    }
  }

  /**
   * Remove a todo from the todos list
   * @param todo  todo to remove
   */
  removeTodo(todo) {
    this.todos.splice(this.todos.indexOf(todo), 1);

    this.onChange.emit();
    this.ref.detectChanges();
  }

  getHighestOrder() {
    if (this.todos.length === 0) {
      return this.initialOrder - this.orderIncrease;
    }
    const max = Math.max.apply(
      Math,
      this.todos.map((elem) => elem.order)
    )
    return max;
  }

  reorderItems(indexes) {
    let element = this.todos[indexes.from];
    this.todos.splice(indexes.from, 1);
    this.todos.splice(indexes.to, 0, element);

    let order = this.initialOrder - this.orderIncrease
    for (let todo of this.todos) {
      order += this.orderIncrease;
      todo.order = order;
    }

    this.ref.detectChanges();
  }
}
