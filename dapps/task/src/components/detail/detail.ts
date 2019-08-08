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
  Component, OnInit, OnDestroy, ViewChild,  // @angular/core
  NavController,                            // ionic-angular
  DomSanitizer, ChangeDetectorRef, ChangeDetectionStrategy,
  EventEmitter, Output, Input
} from '@evan.network/ui-angular-libs';

import {
  createOpacityTransition,
  EvanCoreService,
  EvanAlertService,
  EvanRoutingService,
  EvanTranslationService,
  EvanUtilService,
  createGrowTransition,
  EvanQueue,
  EvanAddressBookService,
  EvanModalService,
  SnapshotDialogComponent,
  EvanToastService,
  EvanPictureService,
  AsyncComponent
} from '@evan.network/ui-angular-core';

import { TaskService } from '../../services/task';

import *  as SignaturePad from 'signature_pad';

/**************************************************************************************************/

@Component({
  selector: 'taskboard-task-detail',
  templateUrl: 'detail.html',
  animations: [
    createOpacityTransition(),
    createGrowTransition()
  ]
})

export class TaskDetailComponent extends AsyncComponent {
  public loading: boolean;
  private taskId: string;
  private task: any;
  private routeChangeSubscription: Function;
  private contacts: any;
  private myAccountId: string;
  private addMoreTodos: boolean;
  private todosToAdd: Array<any>;
  private membersToAdd: Array<string>;
  private queueEventsBinded: boolean;
  private showAddMember: boolean;
  private initialOrder = 1000;
  private orderIncrease = 100;
  private signaturePad;
  private clearStateQueue: any;
  private clearTodoQueue: any;
  private clearTodoLogQueue: any;

  @Input() todosDisabled: Function;
  @Input() customTodoValidForResolve: Function;
  @Output() public onLoad: EventEmitter<any> = new EventEmitter();

  constructor(
    public _DomSanitizer: DomSanitizer,
    public routing: EvanRoutingService,
    private core: EvanCoreService,
    private alertService: EvanAlertService,
    private translateService: EvanTranslationService,
    private taskService: TaskService,
    private utils: EvanUtilService,
    private queueService: EvanQueue,
    private addressBook: EvanAddressBookService,
    private modalService: EvanModalService,
    private toastService: EvanToastService,
    private pictureService: EvanPictureService,
    private ref: ChangeDetectorRef
  ) {
    super(ref);
  }

  async _ngOnInit() {
    this.myAccountId = this.core.activeAccount();
    this.todosToAdd = [ ];
    this.membersToAdd = [ ];

    this.taskId = this.getTaskId();
    await this.loadTask();

    // subscribe for route change
    //  => router will not reload component when another detail is already opened
    this.routeChangeSubscription = this.routing.subscribeRouteChange(() => {
      const taskId = this.getTaskId();

      if (taskId !== this.taskId) {
        // reset watchers if the task is changed to a new task
        this.removeQueueWatchers();
        this.queueEventsBinded = false;

        this.loadTask();
      }
    });
  }

  async _ngOnDestroy() {
    this.routeChangeSubscription && this.routeChangeSubscription();

    // remove overflow hidden for scroll-contents
    this.removeQueueWatchers();
  }

  removeQueueWatchers() {
    this.hideTodoDetail({ });
    this.clearStateQueue && this.clearStateQueue();
    this.clearTodoQueue && this.clearTodoQueue();
    this.clearTodoLogQueue && this.clearTodoLogQueue();
  }

  async takeSnapshot(todo) {
    try {
      const picture = await this.pictureService.takeSnapshot();

      if (!todo.detail.pictures) {
        todo.detail.pictures = [picture];
      } else {
        todo.detail.pictures.unshift(picture);
      }
    } catch (ex) { }

    this.ref.detectChanges();
  }

  customDisable = (task, todo) => {
    let disabled = false;

    if (this.todosDisabled) {
      disabled = this.todosDisabled(task, todo);
      // keep it for backwards compatilibity
    } if (this.customTodoValidForResolve) {
      disabled = !this.customTodoValidForResolve(task, todo);
    }

    return disabled;
  }

  areTodosDisabled(task, todo) {
    return this.task.contractState !== 5 || !this.isMyAccountActive() || this.customDisable(task, todo) || !this.isStrictFinish(todo);
  }

  getTaskId() {
    const taskId = this.routing.getHashParam('address');
    if (!taskId) {
      debugger;
    }

    return taskId;
  }

  /**
   * Load the current opened task.
   */
  async loadTask(reload?: boolean) {
    this.loading = true;
    this.ref.detectChanges();

    this.hideTodoDetail({ });

    // get current task id and set translation to loading
    this.taskId = this.getTaskId();
    this.setTranslation();

    // load task data
    this.task = await this.taskService.getTask(this.taskId, reload, () => this.ref.detectChanges());

    if (!this.contacts) {
      this.contacts = await this.addressBook.loadAccounts();
    }

    if (!this.queueEventsBinded) {
      this.queueEventsBinded = true;

      this.clearStateQueue = await this.queueService.onQueueFinish(
        this.taskService.getStateQueueId(this.taskId),
        async (queueFinish) => {
          if (queueFinish) {
            this.task.contractState = await this.taskService.getContractState(this.task.address);

            this.task.states = await this.taskService.loadTaskStates(this.task);
          }

          await this.onTodoQueueFinish(queueFinish);
        }
      );

      this.clearTodoQueue = await this.queueService.onQueueFinish(
        this.taskService.getTodoQueueId(this.taskId),
        async (queueFinish) => await this.onTodoQueueFinish(queueFinish)
      );

      this.clearTodoLogQueue = await this.queueService.onQueueFinish(
        this.taskService.getTodoLogQueueId(this.taskId),
        async (queueFinish) => await this.onTodoQueueFinish(queueFinish)
      );

      this.clearTodoLogQueue = await this.queueService.onQueueFinish(
        this.taskService.getMemberQueueId(this.taskId),
        async (queueFinish) => await this.onTodoQueueFinish(queueFinish)
      );
    }

    this.loading = false;
    this.setTranslation();
    this.ref.detectChanges();
    this.hideTodoDetail({ });
    this.onLoad.emit();
  }

  /**
   * Reload current task and displays an toast.
   */
  reloadTask() {
    this.loadTask(true);

    this.toastService.showToast({
      message: '_dapptaskboard.task-reload',
      duration: 2000
    });
  }

  async onTodoQueueFinish(queueFinish) {
    if (queueFinish) {
      const dataContract = await this.taskService.getDataContract();

      this.hideTodoDetail({ });

      await this.taskService.loadDetailsForTask(
        dataContract,
        this.myAccountId,
        this.task
      );

      if (this.task.todos) {
        for (let i = 0; i < this.task.todos.length; i++) {
          this.setupSignatureCanvas(this.task.todos[i]);
        }
      }

      this.utils.sendEvent('task-updating', this.task);
      this.ref.detectChanges();
    }
  }

  /**
   * Set translation for the task address (loading / task.name)
   */
  setTranslation() {
    let title;

    if (this.loading) {
      const loadingTranslation = this.translateService.instant('_dapptaskboard.loading');
      const lastUrlHash = window.location.hash.split('/').pop().split('.')[0];

      this.translateService.addSingleTranslation(this.taskId, loadingTranslation);
      this.translateService.addSingleTranslation(lastUrlHash, loadingTranslation);
    } else {
      this.translateService.addSingleTranslation(this.taskId, this.task.name);
    }

    this.ref.detectChanges();
  }

  /**
   * Toggle detail of a todo, or solve it, when no criterias are given
   * @param todo  todo where detail should be toggled
   */
  async toggleTodoDetail(todo) {
    if (todo.criteria && todo.criteria.length > 0) {
      todo.showDetail = !todo.showDetail;

      this.setupSignatureCanvas(todo);

      if (todo.criteria.indexOf('choice') !== -1) {
        setTimeout(() => {
          this.ref.detectChanges();
        });
      }

      if (!todo.showDetail) {
        this.hideTodoDetail(todo);
      } else if (!this.utils.isMD) {
        const scrollContents = document.querySelectorAll('.scroll-content');

        for (let i = 0; i < scrollContents.length; i++) {
          scrollContents[i].className += ' no-overflow-small';
        }

        // ios will not scroll the todo container sometimes
        //   => make the container overflow hidden and scroll again, to enable ios scrolling
        if (this.utils.isMobileIOS()) {
          setTimeout(async () => {
            const todoContainer: any = document.querySelector('.todo-container.is-active');

            todoContainer.style.overflowY = 'hidden';
            await this.utils.timeout(100);
            todoContainer.style.overflowY = 'scroll';
          }, 500);
        }
      }
    } else if (!todo.solved && this.task.contractState === 5) {
      try {
        if (!this.isTodoValidForResolve(todo)) {
          return;
        }

        await this
          .alertService.showSubmitAlert(
            '_dapptaskboard.solveTodo',
            '_dapptaskboard.solveTodoMessage',
            'cancel',
            'ok',
          );
      } catch (ex) {
        return;
      }

      this.finishTodo(todo);
    }

    this.ref.detectChanges();
  }

  setupSignatureCanvas(todo) {
    if (todo.criteria.indexOf('signature') !== -1 && typeof todo.detail.signature !== 'string' && todo.showDetail) {
      todo.signatureCreate = true;
      todo.signatureLoaded = false;
      setTimeout(() => {
        const canvas:any = document.querySelector("#signature-" + todo.id);

        if (canvas) {
          var ratio =  Math.max(window.devicePixelRatio || 1, 1);
          canvas.width = canvas.offsetWidth * ratio;
          canvas.height = canvas.offsetHeight * ratio;
          canvas.getContext("2d").scale(ratio, ratio);

          let sigData;
          if (todo.detail.signature) {
            sigData = todo.detail.signature.toData();
          }

          todo.detail.signature = new SignaturePad.default(canvas, {
            penColor: '#fff',
            onEnd: () => this.ref.detectChanges()
          });

          if (sigData) {
            todo.detail.signature.fromData(sigData);
          }
        }
        todo.signatureLoaded = true;
        this.ref.detectChanges();
      }, 500);
    }
  }

  isStrictFinish(todo) {
    if (this.task.metadata.strictFinish) {
      const minNotFinished = this.getLowestNotFinishedTodo();

      if (todo.order === minNotFinished) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  /**
   * Check if a todo can be solved
   * @param todo  todo to check if it resolved
   */
  isTodoValidForResolve(todo) {
    if (this.customDisable(this.task, todo)) {
      return this.showInvalidSolveAlert(todo, '_dapptaskboard.todo-finish-not-allowed');
    }

    if (this.task.contractState !== 5 && this.task.contractState !== 7) {
      return this.showInvalidSolveAlert(todo, '_dapptaskboard.todo-finish-hint-1');
    }

    if (this.task.contractState === 5 && !this.isMyAccountActive()) {
      return this.showInvalidSolveAlert(todo, '_dapptaskboard.todo-finish-hint-2');
    }

    if (!this.isStrictFinish(todo)) {
      return this.showInvalidSolveAlert(todo, '_dapptaskboard.strict-finish-hint');
    }

    if (todo.detail && todo.required) {
      for (let i = 0; i < todo.criteria.length; i++) {
        switch (todo.criteria[i]) {
          case 'comment': {
            if (todo.required.comment && !todo.detail.comment) {
              return false;
            }

            break;
          }

          case 'choice': {
            if (todo.required.checkbox && typeof todo.detail.checkbox === 'undefined') {
              return false;
            }
            break;
          }

          case 'files': {
            if (todo.required.files && todo.required.files > 0 &&
               (!todo.detail.files || todo.detail.files.length < todo.required.files)) {
              return false;
            }
            break;
          }

          case 'pictures': {
            if (todo.required.pictures && todo.required.pictures > 0 &&
                (!todo.detail.pictures || todo.detail.pictures.length < todo.required.pictures)) {
              return false;
            }
            break;
          }

          case 'signature': {
            if (todo.required.signature) {
              if (!todo.detail.signature || !todo.detail.signatureClear) {
                return false;
              } else {
                return !todo.detail.signature.isEmpty();
              }
            }

            break;
          }
        }
      }

      return true;
    } else {
      return false;
    }
  }

  showInvalidSolveAlert(todo, text) {
    if (todo && todo.criteria.length === 0) {
      try {
        this
          .alertService.showSubmitAlert(
            '_dapptaskboard.solveTodoInvalid',
            {
              key: text,
            },
            'ok',
        );
      } catch (ex) {  }
    }

    return false;
  }

  async setContractState(state) {
    if (state === 7) {
      try {
        await this
          .alertService.showSubmitAlert(
            '_dapptaskboard.reallyTerminate',
            {
              key: '_dapptaskboard.reallyTerminateMessage',
            },
            'cancel',
            'ok',
          );
      } catch (ex) {
        return;
      }

      this.setMyState(5);
    }

    this.task.contractState = 'loading';
    this.queueService.addQueueData(
      this.taskService.getStateQueueId(this.taskId),
      {
        contract: this.taskId,
        target: 'contract',
        state
      }
    );

    this.ref.detectChanges();
  }

  async setMyState(state) {
    if (state === 5) {
      try {
        await this
          .alertService.showSubmitAlert(
            '_dapptaskboard.rlyFinishMember',
            '_dapptaskboard.rlyFinishMemberMessage',
            'cancel',
            'ok',
          );
      } catch (ex) {
        return;
      }
    }

    this.task.states[this.myAccountId] = 'loading';

    this.queueService.addQueueData(
      this.taskService.getStateQueueId(this.taskId),
      {
        contract: this.taskId,
        target: 'me',
        state
      }
    );

    this.ref.detectChanges();
  }

  async finishTodo(todo) {
    todo.solved = true;
    todo.loading = true;

    this.ref.detectChanges();
    
    this.hideTodoDetail(todo);

    if(todo.detail.signature) {
      todo.detail.signature = todo.detail.signature.toDataURL();
    }

    todo.detail.solveTime = Date.now();
    todo.detail.solver = this.myAccountId;
    todo.detail.solverAlias = await this.addressBook.activeUserName();

    this.task.logs.push(todo.detail);

    this.queueService.addQueueData(
      this.taskService.getTodoLogQueueId(this.taskId),
      todo.detail
    );

    this.ref.detectChanges();
  }

  async addTodos() {
    const todoQueue = this.taskService.getTodoQueueId(this.taskId);
    const todosToAdd = [];

    for (let i = this.todosToAdd.length - 1; i > -1; i--) {
      const todo = this.todosToAdd[i];

      todo.loading = true;
      todo.taskId = this.taskId;

      todosToAdd.unshift(todo);
      this.task.todos.unshift(todo);
      this.task.todos.sort((a, b) => a.order - b.order);
    }

    this.queueService.addQueueData(
      todoQueue,
      {
        todos: todosToAdd,
        taskId: this.taskId
      }
    );

    this.todosToAdd = [];

    this.ref.detectChanges();
  }

  async addMembers() {
    this.showAddMember = false;

    const memberQueue = this.taskService.getMemberQueueId(this.taskId);

    for (let i = 0; i < this.membersToAdd.length; i++) {
      this.queueService.addQueueData(
        memberQueue,
        {
          accountId: this.membersToAdd[i],
          taskId: this.taskId,
          taskName: this.task.name
        }
      );

      this.task.members.unshift(this.membersToAdd[i]);
    }

    this.membersToAdd = [];
    this.ref.detectChanges();
  }

  copyDetailUrl() {
    this.core.copyString(window.location.origin + window.location.pathname +
      `#/${ this.taskId }`
    )
  }

  isMyAccountActive() {
    return this.task.states[this.myAccountId] === 4;
  }

  amITheCreator() {
    return this.task.metadata.createdby === this.myAccountId;
  }

  getLowestNotFinishedTodo() {
    const filteredTodos = this.task.todos
      .filter((elem) => !elem.solved)
      .map((elem) => elem.order);
    if (filteredTodos.length === 0) {
      return this.initialOrder;
    }
    const min = Math.min.apply(
      Math,
      filteredTodos
    );
    return min;
  }

  getNextOrder() {
    const max = Math.max.apply(
      Math,
      this.task.todos.map((elem) => elem.order)
    )
    return max + this.orderIncrease;
  }

  removePicture(todo, index) {
    todo.detail.pictures.splice(index, 1);

    this.ref.detectChanges();
  }

  todoCriteriaChoiceToggle(todo) {
    if (!todo.solved && this.task.contractState === 5) {
      todo.detail.choice = !todo.detail.choice;
    }

    this.ref.detectChanges();
  }

  allTodosFinished() {
    return !this.task.todos.find(todo => !todo.solved);
  }

  hideTodoDetail(todo: any) {
    delete todo.showDetail;

    const scrollContents = document.querySelectorAll('.scroll-content');

    for (let i = 0; i < scrollContents.length; i++) {
      scrollContents[i].className = scrollContents[i].className.replace(/no\-overflow\-small/g, '');
    }

    this.ref.detectChanges();
  }

  enablePtr() {
    console.log('enable')
    this.utils.sendEvent('enable-ptr');
  }

  disablePtr() {
    console.log('disable')
    this.utils.sendEvent('disable-ptr');
  }

  openPictureDetail(dataUrl) {
    try {
      return this.modalService.showBigPicture(
        'alertTitle',
        'alertText',
        dataUrl,
      );
    } catch (ex) { }
  }
}
