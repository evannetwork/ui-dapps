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
  Component, OnInit, OnDestroy, // @angular/core
  TranslateService,             // @ngx-translate/core
  NavController,                // ionic-angular
  ViewChild, Slides,
  AfterViewInit, ChangeDetectorRef
} from '@evan.network/ui-angular-libs';

import {
  AnimationDefinition,
  createRouterTransition,
  EvanQueue,
  EvanAlertService,
  EvanToastService,
  EvanRoutingService,
  ObjectToArrayPipe,
  createOpacityTransition,
  EvanSlidesService,
  EvanUtilService,
  EvanLoggingService,
  AsyncComponent
} from '@evan.network/ui-angular-core';

/**************************************************************************************************/

@Component({
  selector: 'queue-list',
  templateUrl: 'queue.html',
  animations: [
    createOpacityTransition()
  ]
})

export class QueueComponent extends AsyncComponent {
  private queue: any;
  private enableAutoSync: boolean;
  private enableDetailView: boolean;
  private screenSize: number;
  public loading: boolean;
  private onQueueUpdate: Function;

  @ViewChild('slider') slide: Slides;

  constructor(
    public queueService: EvanQueue,
    public alertService: EvanAlertService,
    public toastService: EvanToastService,
    public routing: EvanRoutingService,
    public slidesService: EvanSlidesService,
    private utils: EvanUtilService,
    private ref: ChangeDetectorRef,
    private loggingService: EvanLoggingService
  ) {
    super(ref);
  }

  async _ngOnInit() {
    this.queue = this.queueService.queue;
    this.loading = true;
    this.ref.detectChanges();

    this.onQueueUpdate = this.utils.onEvent('evan-queue-update', async () => this.ref.detectChanges());

    this.enableAutoSync = true;
    this.enableDetailView = false;

    try {
      await this.queueService.loadDispatcherForQueue();
    } catch (ex) {
      this.utils.log(ex, 'error');
    }
  }

  async _ngAfterViewInit() {
    this.slidesService.afterViewInit(this.slide);
  }

  async _ngOnDestroy() {
    this.onQueueUpdate();
  }

  /**
   * Remove an data set from an queueEntry
   * @param parentData   Array of data (queueEntry.data)
   * @param entry        Entry that should be removed
   * @param uiControl    Ui control to close (ion-item-sliding or fab)
   */
  removeQueueData(parentData, entry, uiControl: any) {
    if (uiControl) {
      uiControl.close();
    }

    return this
      .alertService.showSubmitAlert(
        '_angularcorequeue.removeQueueEntry',
        '_angularcorequeue.removeQueueEntryDescription',
        'cancel',
        'submit'
      )
      .then(() => {
        parentData.splice(parentData.indexOf(entry), 1);

        this.queueService.saveQueue();
        this.ref.detectChanges();
      })
      .catch(() => { });
  }

    /**
   * Remove a whole queue entry
   * @param queueEntry   Entry that should be removed
   * @param uiControl    Ui control to close (ion-item-sliding or fab)
   */
  removeQueueEntry(queueEntry: any, uiControl: any) {
    if (uiControl) {
      uiControl.close();
    }

    return this
      .alertService.showSubmitAlert(
        '_angularcorequeue.removeQueueEntry',
        '_angularcorequeue.removeQueueEntryDescription',
        'cancel',
        'submit'
      )
      .then(() => {
        this.queueService.removeQueueEntry(queueEntry.queueId);

        this.queueService.saveQueue();
        this.ref.detectChanges();
      })
      .catch(() => { });
  }

  showAutoSyncHint() {
    this.alertService
      .showSubmitAlert(
        '_angularcorequeue.enable-auto-sync',
        '_angularcorequeue.enable-auto-sync-desc',
        'ok'
      )
      .catch(ex => { });
  }

  /**
   * Toggles automated deployment local storage flag.
   */
  autoSyncChanged() {
    if (this.enableAutoSync) {
      delete window.localStorage['evan-queue-delayed'];

      this.queueService.startSyncAll();
    } else {
      window.localStorage['evan-queue-delayed'] = true;
    }
  }

  /**
   * Toggles detail view local storage flag.
   */
  detailViewChanged() {
    this.slidesService.afterViewInit(this.slide);

    if (this.enableDetailView) {
      window.localStorage['evan-queue-detail-view'] = true;
    } else {
      delete window.localStorage['evan-queue-detail-view'];
    }
  }
}
