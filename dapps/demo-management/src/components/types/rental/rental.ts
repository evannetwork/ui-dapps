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
  ChangeDetectorRef
} from 'angular-libs';

import {
  lightwallet
} from 'dapp-browser';

import {
  AnimationDefinition,
  AsyncComponent,
  createOpacityTransition,
  createRouterTransition,
  EvanBCCService,
  EvanCoreService,
  EvanQueue,
  EvanRoutingService,
  EvanTranslationService,
} from 'angular-core';

import { DemoManagementService } from '../../../services/service';

/**************************************************************************************************/

@Component({
  selector: 'demomanagement-rental',
  templateUrl: 'rental.html',
  animations: [

  ]
})

export class RentalComponent extends AsyncComponent {
  /**
   * Function to unsubscribe from queue results.
   */
  private queueWatcher: Function;

  /**
   * address of the opened demo
   */
  private address: any = { };

  /**
   * current demo object
   */
  private demo: any = { };

  /**
   * current data that is selected
   */
  private formData: any = { };

  /**
   * Is the element currently loading?
   */
  private loading: boolean;

  constructor(
    private bcc: EvanBCCService,
    private core: EvanCoreService,
    private demoManagement: DemoManagementService,
    private queue: EvanQueue,
    private ref: ChangeDetectorRef,
    private routingService: EvanRoutingService,
    private translate: EvanTranslationService
  ) {
    super(ref, core);
  }

  async _ngOnInit() {
    this.address = this.routingService.getHashParam('address');
    
    // load the details
    await this.loadDetail();

    // set formData only intial
    this.setupFormData();

    // watch for updates
    this.queueWatcher = await this.queue.onQueueFinish(
      this.demoManagement.getHandlingQueueId(),
      async (reload, results) => {
        reload && this.loadDetail();
      }
    );

    // is currently anything loading?
    this.loading = this.queue.getQueueEntry(this.demoManagement.getHandlingQueueId(), true).data
      .length > 0;

    this.detectTimeout();
  }

  _ngOnDestroy() {
    this.queueWatcher();
  }

  /**
   * Run detectChanges directly and after and timeout again, to update select fields.
   */
  detectTimeout() {
    this.ref.detectChanges();

    setTimeout(() => this.ref.detectChanges());
  }

  /**
   * Load the detail for the current demo.
   *
   * @return     {Promise<void>}  resolved when done
   */
  private async loadDetail() {
    this.demo = await this.demoManagement.getDemo(this.address);

    // add header translation
    this.translate.addSingleTranslation(
      this.address,
      this.demo.name
    );
  }

  /**
   * Uses demo details and apply the default values.
   */
  private setupFormData() {
    this.formData = this.core.utils.deepCopy(this.demo);

    if (!this.formData.users) {
      this.formData.users = [ ];

      this.formData.users.push({
        mnemonic: lightwallet.generateMnemonic(),
        password: Math.random().toString(36).substr(2, 5),
        alias: `${ this.demo.name } Disponent`
      });

      this.formData.users.push({
        mnemonic: lightwallet.generateMnemonic(),
        password: Math.random().toString(36).substr(2, 5),
        alias: `${ this.demo.name } Disponent`
      });
    }
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
}
