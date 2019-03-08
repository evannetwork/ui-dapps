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
  ChangeDetectorRef,
  Component,
  NavController,               
  OnDestroy,
  OnInit,
  TranslateService,            
  ViewChild,
} from '@evan.network/ui-angular-libs';

import {
  lightwallet
} from '@evan.network/ui-dapp-browser';

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
  EvanAlertService,
} from '@evan.network/ui-angular-core';

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
   * the demo gets currently upated or profiles gets created 
   */
  private saving: boolean;

  /**
   * current formular
   */
  @ViewChild('userManagement') userManagement: any;

  constructor(
    private alertService: EvanAlertService,
    private bcc: EvanBCCService,
    private core: EvanCoreService,
    private demoManagement: DemoManagementService,
    private queue: EvanQueue,
    private ref: ChangeDetectorRef,
    private routingService: EvanRoutingService,
    private translate: EvanTranslationService,
  ) {
    super(ref);
  }

  async _ngOnInit() {
    this.address = this.routingService.getHashParam('address');
    
    // load the details
    await this.loadDetail();

    // set formData only intial
    this.setupFormData();

    // watch for updates
    this.queueWatcher = await this.queue.onQueueFinish(
      this.demoManagement.getWatchQueueId(),
      async (reload, results) => {
        reload && setTimeout(async () => {
          await this.loadDetail();
          this.setupFormData();
        });
      }
    );

    this.detectTimeout();
  }

  async _ngOnDestroy() {
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
    this.core.utils.showLoading(this);

    this.demo = await this.demoManagement.getDemo(this.address);

    // add header translation
    this.translate.addSingleTranslation(
      this.address.replace(/\-/g, ''),
      this.demo.name
    );

    // is currently anything saving?
    this.saving = this.queue.getQueueEntry(this.demoManagement.getWatchQueueId(this.demo.address), true)
      .data.length > 0;

    this.core.utils.hideLoading(this);
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
        password: Math.random().toString(36).substr(2, 8),
        alias: `${ this.demo.name } Disponent`,
        role: 'owner'
      });

      this.formData.users.push({
        mnemonic: lightwallet.generateMnemonic(),
        password: Math.random().toString(36).substr(2, 8),
        alias: `${ this.demo.name } Consumer`,
        role: 'member'
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

  /**
   * Use the current users and create a new demo contract instance for them.
   */
  async createContractStructure() {
    if (this.demo.contractAddress) {
      try {
        await this
          .alertService.showSubmitAlert(
            '_dm.recreate-contract.alert-title',
            '_dm.recreate-contract.alert-desc',
            'cancel',
            '_dm.recreate-contract.accept',
          );
      } catch (ex) {
        return;
      }
    }

    // submit new data to the queue
    this.queue.addQueueData(
      this.demoManagement.getContractStructureQueueId(this.demo),
      this.demo
    );

    this.saving = true;
    this.ref.detectChanges();
  }
}
