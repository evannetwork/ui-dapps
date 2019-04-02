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
} from '@evan.network/ui-dapp-browser';

import {
  ChangeDetectorRef,
  Component,
  DomSanitizer,
  EventEmitter,
  Input,
  NavController,
  OnDestroy,
  OnInit,
  Output,
  TranslateService,
  ViewChild,
} from '@evan.network/ui-angular-libs';

import {
  AnimationDefinition,
  AsyncComponent,
  createOpacityTransition,
  createRouterTransition,
  EvanAddressBookService,
  EvanAlertService,
  EvanBCCService,
  EvanVerificationService,
  EvanCoreService,
  EvanDescriptionService,
  EvanFileService,
  EvanPictureService,
  EvanQueue,
  EvanRoutingService,
} from '@evan.network/ui-angular-core';

import { ENSManagementService } from '../../services/service';

/**************************************************************************************************/

/**
 * Explorer verifications using an topic, subject input. If needed, all interactions can be disabled and
 * only the given parameters are used. When the dev mode is enabled, also the display mode can be
 * adjusted for testing purposes.
 */
@Component({
  selector: 'evan-ens-check',
  templateUrl: 'ens-check.html',
  animations: [
    createOpacityTransition()
  ]
})

export class ENSCheckComponent extends AsyncComponent {
  /***************** inputs & outpus *****************/

  /*****************    variables    *****************/
  /**
   * amount of eves that must be payed, when the user purchases a ens address
   */
  public ensPrice: number;

  /**
   * the current logged in active acount id
   */
  public activeAccount: string;

  /**
   * if the inserted ens address is available, show the purchase popup
   */
  public ensAddress: string;

  /**
   * current balance of the user
   */
  public balance: number;

  /**
   * show loading symbol, if the current input gets checked
   */
  public showLoading: boolean;

  /**
   * Function to unsubscribe from queue results.
   */
  public queueWatcher: Function;

  /**
   * queue id for the purchaseDispatcher
   */
  public queueId: any;

  /**
   * show the popover for the favorite card
   */
  public showItemPopover: string;

  /**
   * all ens addresses that were pinned by me
   */
  private pinned: Array<any>;

  /**
   * show the loading
   */
  public loading: boolean;

  /**
   * EventEmitter that is triggered when this ref was updated, so the parent component can update
   * it's data
   */
  @Output() updated: EventEmitter<any> = new EventEmitter();

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
    super(ref);
  }

  /**
   * Load my ens addresses and set initial values.
   */
  async _ngOnInit() {
    this.activeAccount = this.core.activeAccount();
    this.queueId = this.ensManagementService.getQueueId();

    // watch for updates
    this.queueWatcher = await this.queue.onQueueFinish(
      this.queueId,
      async (reload, results) => {
        !reload && await this.loadPinned();

        reload && setTimeout(async () => {
          await this.loadPinned();
          this.updateRef();
        });
      }
    );

    this.loading = false;
    this.updated.emit();
    this.core.utils.detectTimeout(this.ref);
  }

  /**
   * Remove watchers
   */
  async _ngOnDestroy() {
    this.queueWatcher();
  }

  /**
   * Update the current ref and trigger parent components update event.
   */
  updateRef() {
    this.updated.emit();
    this.ref.detectChanges();
  }

  /**
   * Load the pinned domains for this topic and check if the loading component is set.
   */
  async loadPinned() {
    this.showLoading = this.queue.getQueueEntry(this.queueId, true).data.length > 0;
    this.pinned = await this.ensManagementService.getPinnedEnsAddresses();
  }

  /**
   * Check if the user submits the input using the enter key.
   *
   * @param      {event}    event    input keyup event
   * @param      {boolean}  loading  currently something loading?
   * @return     {boolean}   return false to stop event propagation
   */
  submitOnEnter(event: any, func: any, value: string = event.target.value) {
    if (event.keyCode === 13 && !this.showLoading) {
      // run optional function
      func ? func(value) : this.checkEnsAddress(value);

      event.stopPropagation();
      return false;
    }
  }

  /**
   * Check the current input address, if an owner is set, navigate to the detail page, else provide
   * the purchase popup.
   *
   * @param      {string}  ensAddress  ens address that should be checked
   */
  async checkEnsAddress(ensAddress: string) {
    const domainName = this.ensManagementService.domainName;

    // replace duplicated dots
    ensAddress = ensAddress.replace(/\.\./g, '.');

    if (ensAddress.indexOf(domainName, ensAddress.length - domainName.length) === -1) {
      ensAddress = `${ ensAddress }.${ domainName }`;
    }

    if (ensAddress.split('.').length > 2) {
      await this.addFavorite(ensAddress);
    } else {
      this.showLoading = true;
      this.updateRef();

      let owner = this.ensManagementService.nullAddress;
      try {
        // load the current owner of the ens address
        const namehash = this.ensManagementService.nameResolver.namehash(ensAddress);
        owner = await this.bcc.executor.executeContractCall(
          this.ensManagementService.nameResolver.ensContract, 'owner', namehash);
      } catch (ex) {
        this.core.utils.log(ex, 'error');
      }

      // load the currents users balance
      this.balance = await this.core.getBalance(this.activeAccount);

      // if no owner exists, show the purchase dialog, else navigate to the detail
      if (owner === this.ensManagementService.nullAddress) {
        this.ensPrice = this.bcc.web3.utils.fromWei(
          await this.ensManagementService.nameResolver.getPrice(ensAddress));
      } else {
        this.routingService.navigate(ensAddress);
      }

      this.ensAddress = ensAddress;
      this.showLoading = false;

      this.updateRef();
    }
  }

  /**
   * Trigger the purchase process.
   */
  async purchaseEnsAddress(ensAddress: string) {
    try {
      await this.alertService.showSubmitAlert(
        '_ensmanagement.purchasing',
        {
          key: '_ensmanagement.purchasing-desc',
          translateOptions: {
            amount: this.ensPrice,
            ensAddress: ensAddress,
          }
        },
        '_ensmanagement.cancel',
        '_ensmanagement.buy',
      );

      // trigger the purchase queue
      this.queue.addQueueData(
        this.ensManagementService.getQueueId('purchaseDispatcher'),
        {
          ensAddress: ensAddress
        }
      );

      // update the ui
      this.showLoading = true;
      delete this.ensAddress;
      this.updateRef();
    } catch (ex) { }
  }

  /**
   * Check if the ens address is already a favorite, if not, save it as favorite.
   *
   * @param      {string}  ensAddress  the ens address that should be checked
   */
  async addFavorite(ensAddress: string) {
    try {
      if (this.pinned.indexOf(ensAddress) === -1) {
          await this.alertService.showSubmitAlert(
            '_ensmanagement.add-favorite',
            {
              key: '_ensmanagement.add-favorite-desc',
              translateOptions: {
                ensAddress: ensAddress,
              }
            },
            '_ensmanagement.cancel',
            '_ensmanagement.add-favorite',
          );

          // trigger the purchase queue
          this.queue.addQueueData(
            this.ensManagementService.getQueueId('addFavoriteDispatcher'),
            {
              ensAddress: ensAddress
            }
          );

          // update the ui
          this.showLoading = true;
          delete this.ensAddress;
          this.updateRef();
      } else {
        await this.alertService.showSubmitAlert(
          '_ensmanagement.add-favorite',
          '_ensmanagement.favorite-already-added',
          '_ensmanagement.ok'
        );
      }
    } catch (ex) { }
  }

    /**
     * Trigger the removeFavorite process.
     *
     * @param      {string}  ensAddress  the ens address that should be removed
     */
  async removeFavorite(ensAddress: string, uiControl: any) {
    if (uiControl) {
      uiControl.close();
    }

    try {
      await this.alertService.showSubmitAlert(
        '_ensmanagement.remove-favorite',
        {
          key: '_ensmanagement.remove-favorite-desc',
          translateOptions: {
            ensAddress: ensAddress,
          }
        },
        '_ensmanagement.cancel',
        '_ensmanagement.remove-favorite',
      );

      // trigger the purchase queue
      this.queue.addQueueData(
        this.ensManagementService.getQueueId('removeFavoriteDispatcher'),
        {
          ensAddress: ensAddress
        }
      );

      // update the ui
      this.showLoading = true;
      delete this.ensAddress;
      this.updateRef();
    } catch (ex) { }
  }

  /**
   * show the popover for the current favorite.
   *
   * @param      {string}  ensAddress  ens address of the favorite, where the popover should be
   *                                   shown
   */
  togglePopover(ensAddress: string) {
    if (this.showItemPopover) {
      if (this.showItemPopover !== ensAddress) {
        this.showItemPopover = ensAddress;
      } else {
        delete this.showItemPopover;
      }
    } else {
      this.showItemPopover = ensAddress;
    }

    this.updateRef();
  }
}
