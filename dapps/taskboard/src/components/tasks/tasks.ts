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
  getDomainName
} from '@evan.network/ui-dapp-browser';

import {
  Component, OnInit, OnDestroy, // @angular/core
  ChangeDetectorRef
} from '@evan.network/ui-angular-libs';

import {
  createOpacityTransition,
  createGrowTransition,
  createTabSlideTransition,
  createRouterTransition,
  AnimationDefinition,
  EvanCoreService,
  EvanUtilService,
  EvanRoutingService,
  EvanQueue,
  EvanTranslationService,
  AsyncComponent
} from '@evan.network/ui-angular-core';

import { TaskService } from '../../services/task';

/**************************************************************************************************/

@Component({
  selector: 'taskboard-tasks',
  templateUrl: 'tasks.html',
  animations: [
    createOpacityTransition(),
    createGrowTransition(),
    createTabSlideTransition(),

    createRouterTransition([
      new AnimationDefinition('task-list', '=>', 'task-create', 'right'),
      new AnimationDefinition('task-list', '=>', 'task-detail', 'right'),
      new AnimationDefinition('task-create', '=>', 'task-detail', 'left'),
      new AnimationDefinition('task-detail', '=>', 'task-create', 'left'),
    ])
  ]
})

export class TasksComponent extends AsyncComponent {
  private filteredTasks: Array<any>;
  private filterString: string;
  public loading: boolean;
  private tasks: Array<any>;
  private taskCreatingListenter: Function;
  private translationUpdate: Function;
  private taskUpdatedListener: Function;
  private clearQueue: Function;
  private watchRouteChange: Function;

  constructor(
    private core: EvanCoreService,
    private utils: EvanUtilService,
    private routing: EvanRoutingService,
    private queueService: EvanQueue,
    private taskService: TaskService,
    private translateService: EvanTranslationService,
    private ref: ChangeDetectorRef
  ) {
    super(ref);
  }

  async _ngOnInit() {
    this.clearQueue = await this.queueService.onQueueFinish(this.taskService.taskQueueId, () => this.loadTasks());

    this.taskCreatingListenter = this.utils.onEvent('task-creating', (event) => {
      this.routing.goBack();

      this.tasks.unshift(event.detail);

      this.filter();
      this.ref.detectChanges();
    });

    this.taskUpdatedListener = this.utils.onEvent('task-updating', (event) => {
      const task = event.detail;

      const existingTask = this.tasks.find(loadedTask => loadedTask.address === task.address);
      if (existingTask) {
        this.tasks[this.tasks.indexOf(existingTask)] = task;
      } else {
        this.tasks.unshift(task);
      }
      
      this.ref.detectChanges();
    });

    this.watchRouteChange = this.routing.subscribeRouteChange(() => this.ref.detectChanges());

    // used to handle sub dapp task translations
    this.translationUpdate = this.translateService.watchTranslationUpdate(() => this.ref.detectChanges());
  }

  async _ngOnDestroy() {
    this.taskCreatingListenter && this.taskCreatingListenter();
    this.translationUpdate && this.translationUpdate();
    this.taskUpdatedListener && this.taskUpdatedListener();
    this.clearQueue && this.clearQueue();
    this.watchRouteChange && this.watchRouteChange();
  }

  async loadTasks() {
    this.loading = true;
    this.ref.detectChanges();

    this.tasks = await this.taskService.getTasks(() => this.ref.detectChanges());
    this.filter();
    
    this.loading = false;
    this.ref.detectChanges();
  }

  /**
   * Filter active tasks
   * @param  $event keyboard event from search input
   */
  filter($event?: any) {
    let value = '';

    if ($event) {
      value = $event.target.value || '';
    }

    if (value && value.trim() !== '') {
      this.filteredTasks = this
        .tasks
        .filter(element => {
          return JSON.stringify(element)
            .toLowerCase()
            .includes(value.toLowerCase());
        });
    } else {
      this.filteredTasks = this.tasks;
    }
    
    this.filteredTasks = this.filteredTasks.sort((a: any, b: any) => {
      return b.created - a.created;
    });

    this.ref.detectChanges();
  }
  
  /**
   * Check if currently the create or detail page is open.
   */
  isTaskActive() {
    return this.routing.getRouteConfigParam('state') !== 'task-list';
  }

  /**
   * Check if user press enter to jump into task creation
   * @param  $event keyboard event from search input
   */
  filterChanged($event: any) {
    if ($event.keyCode === 13) {
      this.createTask();

      return false;
    } else {
      setTimeout(() => {
        this.filter($event);
      });
    }
  }

  async createTask() {
    const queryParams: any = { };

    if (this.filterString) {
      queryParams.name = this.filterString
    }

    this.routing.navigate(`task.${ getDomainName() }/task-create`, true, queryParams);

    this.filterString = '';
    this.filter();

    this.ref.detectChanges();
  }

  /**
   * Return the percentage of finished todos within an task
   * @param task  task contract
   */
  getTaskProgress(task) {
    if (task && task.todos) {
      return task.todos.filter(todo => todo.solved).length * (100 / task.todos.length);
    } else {
      return 0;
    }
  }

  getActiveTask() {
    if (this.utils.devMode) {
      const paths = this.routing.getRouteFromUrl(window.location.hash).split('/');

      return paths[paths.length - 1];
    } else {
      return this.routing.getHashParam('address');
    }
  }

  async openTask(task) {
    if (!task.loading) {
      this.translateService.addSingleTranslation(task.address, task.name);
      
      if (this.utils.devMode) {
        this.routing.navigate(`./task.${ getDomainName() }/${ task.address }`, true);
      } else {
        this.routing.navigate(`./${ task.address }`, true);
      }
    }
  }
}
