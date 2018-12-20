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
  getDomainName,
} from 'dapp-browser';

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
  EvanAddressBookService,
  EvanAlertService,
  EvanBCCService,
  EvanClaimService,
  EvanCoreService,
  EvanDescriptionService,
  EvanFileService,
  EvanPictureService,
  EvanQueue,
  EvanRoutingService,
} from 'angular-core';

import { ENSManagementService } from '../../services/service';

/**************************************************************************************************/

/**
 * Explorer claims using an topic, subject input. If needed, all interactions can be disabled and
 * only the given parameters are used. When the dev mode is enabled, also the display mode can be
 * adjusted for testing purposes.
 */
@Component({
  selector: 'evan-ens-management',
  templateUrl: 'overview.html',
  animations: [
    createOpacityTransition()
  ]
})

export class ENSManagementOverviewComponent extends AsyncComponent {
  /***************** inputs & outpus *****************/

  /*****************    variables    *****************/
  /**
   * amount of eves that must be payed, when the user purchases a ens address
   */
  private ensPrice: number;

  /**
   * the current logged in active acount id
   */
  private activeAccount: string;

  /**
   * current value of the ens address input
   */
  private ensAddress: string;

  /**
   * if the inserted ens address is available, show the purchase popup 
   */
  private purchaseEns: any;

  /**
   * current balance of the user
   */
  private balance: number;

  /**
   * all ens addresses that were pinned by me
   */
  private pinned: Array<any>;

  /**
   * current detail container for auto scroll
   */
  @ViewChild('ensCheckComp') ensCheckComp: any;

  constructor(
    private _DomSanitizer: DomSanitizer,
    private addressBookService: EvanAddressBookService,
    private alertService: EvanAlertService,
    private bcc: EvanBCCService,
    private core: EvanCoreService,
    private descriptionService: EvanDescriptionService,
    private ensManagementService: ENSManagementService,
    private fileService: EvanFileService,
    private pictureService: EvanPictureService,
    private queue: EvanQueue,
    private ref: ChangeDetectorRef,
    private routingService: EvanRoutingService,
  ) {
    super(ref, core);
  }

  /**
   * Load my ens addresses and set initial values.
   */
  async _ngOnInit() {
    this.activeAccount = this.core.activeAccount();

    this.core.utils.detectTimeout(this.ref);
  }

  /**
   * Updates the current pinned ens addresses list, filtered by top level domains.
   */
  ensCheckUpdated() {
    this.pinned = this.ensCheckComp.pinned
      .filter(pinned => pinned.ensAddress.split('.').length < 3);

    this.ref.detectChanges();
  }
}
