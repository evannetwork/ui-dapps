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
import { ExplorerService } from 'explorer';

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
   * ens address specific data for editing
   */
  private ensData: any = { };

  /**
   * ens address specific data
   */
  private originalData: any = { };

  /**
   * all ens addresses that were pinned by me, filter by sub addresses of the opened ens address
   */
  private pinned: Array<any>;

  /**
   * sub ens address input value
   */
  private subEnsAddress: string;

  /**
   * show the evan-loading
   */
  private loading: boolean;

  /**
   * clear current route watcher
   */
  private watchRouteChange: Function;

  /**
   * is the current user allowed to edit this data?
   */
  private canEdit: boolean;

  /**
   * is the current ens domain pinned?
   */
  private isPinned: boolean;

  /**
   * backup the latest explorer name resolver, to backup it after destroying this component
   */
  private originExplorerNameResolver: any;

  /**
   * current detail container for auto scroll
   */
  @ViewChild('ensCheckComp') ensCheckComp: any;

  constructor(
    private _DomSanitizer: DomSanitizer,
    private alertService: EvanAlertService,
    private bcc: EvanBCCService,
    private claimService: EvanClaimService,
    private core: EvanCoreService,
    private ensManagementService: ENSManagementService,
    private explorerService: ExplorerService,
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
      async (reload, results) => this.loadEnsData(reload)
    );

    // watch for route changes, so we do not need to reload the full component
    this.watchRouteChange = this.routingService.subscribeRouteChange(() => this.loadEnsData(true));
    
    // switch explorer nameResolver to eventually used custom nameResolver
    this.originExplorerNameResolver = this.explorerService.nameResolver;
    this.explorerService.nameResolver = this.ensManagementService.nameResolver;
  }

  /**
   * Remove watchers
   */
  _ngOnDestroy() {
    this.queueWatcher();
    this.watchRouteChange();

    // restore origin ens explorer name resolver
    this.explorerService.nameResolver = this.originExplorerNameResolver;
  }

  /**
   * Analyse the current ens hash param and load ens specific data (owner, resolver).
   *
   * @param      {boolean}  reloadPinned  reload the pinned domains by the checkbox component.
   */
  async loadEnsData(reloadPinned: boolean) {
    this.loading = true;
    this.ref.detectChanges();

    this.ensAddress = this.routingService.getHashParam('id');

    // reload pins and check for actual ens address sub addresses
    if (reloadPinned) {
      this.subEnsAddress = ''; 
      await this.ensCheckComp.loadPinned();
      this.ensCheckUpdated();
    }

    // load the ens details        
    const nameResolver = this.ensManagementService.nameResolver;
    const [ owner, address, resolver, contentAddress, validUntil ] = await Promise.all([
      this.ensManagementService.getOwner(this.ensAddress),
      nameResolver.getAddress(this.ensAddress),
      this.bcc.executor.executeContractCall(nameResolver.ensContract, 'resolver',
        nameResolver.namehash(this.ensAddress)),
      nameResolver.getContent(this.ensAddress),
      (async () => {
        try {
          return await nameResolver.getValidUntil(this.ensAddress);
        } catch(ex) { }
      })(),
    ]);

    // save the data to the scope
    this.ensData = { owner, address, resolver, contentAddress, validUntil, };
    this.originalData = { owner, address, resolver, contentAddress, validUntil, };

    // split the ens address, to check each parent, if we can set the current data
    let splitted = this.ensAddress.split('.');
    this.canEdit = false;
    while (!this.canEdit && splitted.length > 1) {
      this.canEdit = (await this.ensManagementService.getOwner(splitted.join('.'))) ===
        this.core.activeAccount();

      splitted.splice(0, 1);
    }

    this.loading = false;
    this.ref.detectChanges();
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

  /**
   * Updates the current pinned ens addresses list, filtered by top level domains.
   */
  ensCheckUpdated() {
    this.pinned = this.ensCheckComp.pinned.filter(pinned =>
      pinned.ensAddress !== this.ensAddress && pinned.ensAddress.indexOf(this.ensAddress,
      pinned.ensAddress.length - this.ensAddress.length) !== -1
    );
    this.isPinned = this.ensCheckComp.pinned.filter(pinned =>
      pinned.ensAddress === this.ensAddress
    ).length > 0;

    this.ref.detectChanges();
  }

  /**
   * Trigger the data update dispatcher.
   */
  async updateData() {
    try {
      await this.alertService.showSubmitAlert(
        '_ensmanagement.save-data',
        {
          key: '_ensmanagement.save-data-desc',
          translateOptions: {
            ensAddress: this.ensAddress,
            ensData: this.ensData,
            originData: this.originalData,
          }
        },
        '_ensmanagement.cancel',
        '_ensmanagement.save-data',
      );

      // trigger the purchase queue
      this.queue.addQueueData(
        this.ensManagementService.getQueueId('dataDispatcher'),
        {
          ensAddress: this.ensAddress,
          ensData: this.ensData,
          originData: this.originalData,
        }
      );

      // update the ui
      this.ensCheckComp.showLoading = true;
      this.ref.detectChanges();
    } catch (ex) { }
  }
}
