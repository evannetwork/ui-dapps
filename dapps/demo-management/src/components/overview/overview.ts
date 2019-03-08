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
  ChangeDetectorRef,
  DomSanitizer
} from '@evan.network/ui-angular-libs';

import {
  AnimationDefinition,
  AsyncComponent,
  createOpacityTransition,
  createRouterTransition,
  EvanAlertService,
  EvanBCCService,
  EvanCoreService,
  EvanQueue,
  EvanRoutingService,
} from '@evan.network/ui-angular-core';

import { DemoManagementService } from '../../services/service';

/**************************************************************************************************/

@Component({
  selector: 'demomanagement-overview',
  templateUrl: 'overview.html',
  animations: [
    createOpacityTransition()
  ]
})

export class OverviewComponent extends AsyncComponent {
  /**
   * Function to unsubscribe from queue results.
   */
  private queueWatcher: Function;

  /**
   * list of all available demos
   */
  private demos: Array<any>;

  /**
   * current data of the new demo formular
   */
  private formData: any = { };

  /**
   * currently opened demo popover
   */
  private showItemPopover: string;

  /**
   * should the create demo popup visible?
   */
  private showCreateDemo: boolean;

  constructor(
    private _DomSanitizer: DomSanitizer,
    private alertService: EvanAlertService,
    private bcc: EvanBCCService,
    private core: EvanCoreService,
    private demoManagement: DemoManagementService,
    private queue: EvanQueue,
    private ref: ChangeDetectorRef,
    private routingService: EvanRoutingService,
  ) {
    super(ref);
  }

  async _ngOnInit() {
    this.demos = await this.demoManagement.getDemos();

    // watch for updates
    this.queueWatcher = await this.queue.onQueueFinish(
      this.demoManagement.getWatchQueueId(),
      (reload, results) => reload && this.reloadDemos()
    );
  }

  async _ngOnDestroy() {
    this.queueWatcher();
  }

  /**
   * Resets the createForm and reloads the demos.
   *
   * @return     {Promise<void>}  resolved when done
   */
  async reloadDemos() {
    // reset the latest data
    this.formData = { };

    // reload the data
    this.core.utils.showLoading(this);
    this.demos = await this.demoManagement.getDemos();
    this.core.utils.hideLoading(this);
  }

  /**
   * Checks if a form property is touched and invalid.
   *
   * @param      {any}      form       The form
   * @param      {string}   paramName  name of the form property that should be checked
   * @return     {boolean}  true if touched and invalid, else false
   */
  showError(form: any, paramName: string) {
    if (form && form.controls[paramName]) {
      return form.controls[paramName].invalid &&
        form.controls[paramName].touched;
    }
  }

  /**
   * Run detectChanges directly and after and timeout again, to update select fields.
   */
  detectTimeout() {
    this.ref.detectChanges();

    setTimeout(() => this.ref.detectChanges());
  }

  /**
   * Opens the detail for a demo.
   */
  openDemoDetail(demo: any) {
    // if it wasnt saved before, dont open it
    if (demo.loading && !demo.created) {
      return;
    }

    this.routingService.navigate(`./${ demo.type }/${ demo.address }`);
  }

  /**
   * Addds a new demo into the queue.
   *
   * @return     {Promise<void>}  resolved when done
   */
  createDemo() {
    const enriched = Object.assign(this.formData, {
      address: this.core.utils.generateID(),
      action: 'save',
    });

    // submit new data to the queue
    this.queue.addQueueData(this.demoManagement.getHandlingQueueId(enriched), enriched);

    this.showCreateDemo = false;
    this.reloadDemos();
  }

  /**
   * Removes a demo from this account.
   *
   * @param      {any}  demo    the demo object
   */
  removeDemo(demo: any, uiControl: any) {
    if (uiControl) {
      uiControl.close();
    }
    try {
      this.alertService.showSubmitAlert(
        '_dm.remove-demo.title',
        {
          key: '_dm.remove-demo.message',
          translateOptions: demo
        },
        'cancel',
        '_dm.remove-demo.remove'
      );
    } catch (ex) {
      return;
    }

    // submit new data to the queue
    this.queue.addQueueData(
      this.demoManagement.getHandlingQueueId(demo),
      Object.assign(demo, {
        action: 'delete',
      })
    );

    this.reloadDemos();
  }

  /**
   * Shows the popover for a demo to show the possibilty to delete it.
   *
   * @param      {any}  demo    the demo object
   */
  togglePopover(demo: any) {
    if (this.showItemPopover) {
      if (this.showItemPopover !== demo.address) {
        this.showItemPopover = demo.address;
      } else {
        delete this.showItemPopover;
      }
    } else {
      this.showItemPopover = demo.address;
    }

    this.ref.detectChanges();
  }
}
