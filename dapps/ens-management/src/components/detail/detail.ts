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
  DomSanitizer,
  Input,
  NavController,
  OnDestroy,
  OnInit,
  TranslateService,
  ViewChild,
} from 'angular-libs';

import {
  AnimationDefinition,
  AsyncComponent,
  createOpacityTransition,
  createRouterTransition,
  createTabSlideTransition,
  EvanAlertService,
  EvanBCCService,
  EvanClaimService,
  EvanCoreService,
  EvanQueue,
  EvanRoutingService,
  QueueId,
} from 'angular-core';

import { ENSManagementService } from '../../services/service';

/**************************************************************************************************/

/**
 * Used to check if the identity for the current logged in user exists, if not, it will enable a
 * functionality, to create a new identity.
 */
@Component({
  selector: 'ens-management-detail',
  templateUrl: 'detail.html',
  animations: [
    createOpacityTransition(),
    createTabSlideTransition(),
  ]
})

export class ENSManagementDetailComponent extends AsyncComponent {
  /*****************    variables    *****************/
  /**
   * current active shown tabs
   */
  private activeTab: number = 0;

  /**
   * Function to unsubscribe from queue results.
   */
  private queueWatcher: Function;

  /**
   * currently opened ens address
   */
  private ensAddress: string;

  /**
   * ens address specific data
   */
  private ensData: any = { }

  constructor(
    private _DomSanitizer: DomSanitizer,
    private alertService: EvanAlertService,
    private bcc: EvanBCCService,
    private claimService: EvanClaimService,
    private core: EvanCoreService,
    private ensManagementService: ENSManagementService,
    private queue: EvanQueue,
    private ref: ChangeDetectorRef,
    private routingService: EvanRoutingService,
  ) {
    super(ref, core);
  }

  /**
   * Load claims for the current addres, contract address or the active account.
   */
  async _ngOnInit() {
    // watch for updates
    this.queueWatcher = await this.queue.onQueueFinish(
      this.ensManagementService.getQueueId(),
      async (reload, results) => {
        this.ensAddress = this.routingService.getHashParam('address');
  
        // load the ens details        
        const nameResolver = this.ensManagementService.nameResolver;
        const [ owner, address, registrar, contentAddress ] = await Promise.all([
          this.ensManagementService.getOwner(this.ensAddress),
          nameResolver.getAddress(this.ensAddress),
          this.bcc.executor.executeContractCall(nameResolver.ensContract, 'resolver',
            this.ensAddress),
          nameResolver.getContent(this.ensAddress),
        ]);

        this.ensData = { owner, address, registrar, contentAddress, };

        this.ref.detectChanges();
      }
    );
  }

  /**
   * Remove watchers
   */
  _ngOnDestroy() {
    this.queueWatcher();
  }

  /**
   * Actives the new chosen tab.
   *
   * @param      {number}  index   index of the tab that should be displayed.
   */
  activateTab(index: number) {
    this.activeTab = index;

    this.ref.detectChanges();
    setTimeout(() => this.ref.detectChanges(), 500);
  }
}
