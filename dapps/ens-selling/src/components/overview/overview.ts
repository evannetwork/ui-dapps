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

import { ENSSellingService } from '../../services/service';

/**************************************************************************************************/

/**
 * Explorer claims using an topic, subject input. If needed, all interactions can be disabled and
 * only the given parameters are used. When the dev mode is enabled, also the display mode can be
 * adjusted for testing purposes.
 */
@Component({
  selector: 'evan-ens-selling',
  templateUrl: 'overview.html',
  animations: [
    createOpacityTransition()
  ]
})

export class ENSSellingOverviewComponent extends AsyncComponent {
  /***************** inputs & outpus *****************/

  /*****************    variables    *****************/
  /**
   * amount of eves that must be payed, when the user purchases a ens address
   */
  private ensCosts: number = 5;

  /**
   * the current logged in active acount id
   */
  private activeAccount: string;

  /**
   * Function to unsubscribe from queue results.
   */
  private queueWatcher: Function;

  /**
   * all ens addresses that were pinned by me
   */
  private pinned: Array<any>;

  /**
   * current domain name
   */
  private domainName: string;

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
   * show loading symbol, if the current input gets checked
   */
  private showLoading: boolean;

  /**
   * queue id for the buy dispatcher
   */
  private queueId: any;

  /**
   * show the popover for the favorite card
   */
  private showItemPopover: string;

  constructor(
    private _DomSanitizer: DomSanitizer,
    private addressBookService: EvanAddressBookService,
    private alertService: EvanAlertService,
    private bcc: EvanBCCService,
    private core: EvanCoreService,
    private descriptionService: EvanDescriptionService,
    private fileService: EvanFileService,
    private ensSellingService: ENSSellingService,
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
    this.domainName = getDomainName();
    this.queueId = this.ensSellingService.getQueueId();

    // watch for updates
    this.queueWatcher = await this.queue.onQueueFinish(
      this.queueId,
      async (reload, results) => {
        this.pinned = await this.ensSellingService.getPinnedEnsAddresses();

        reload && setTimeout(() => {
          this.showLoading = this.queue.getQueueEntry(this.queueId, true).data.length > 0;
          this.ref.detectChanges();
        });
      }
    );

    this.detectTimeout();
  }

  /**
   * Remove watchers
   */
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
   * Checks if a form property is touched and invalid.
   *
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
   * Check the current input address, if an owner is set, navigate to the detail page, else provide
   * the purchase popup.
   *
   * @param      {string}  ensAddress  ens address that should be checked
   */
  async checkEnsAddress(ensAddress: string = this.ensAddress) {
    this.showLoading = true;
    this.ref.detectChanges();

    // if the ens address does not ends with the default domainName, append it!
    if (ensAddress.indexOf(this.domainName, ensAddress.length - this.domainName.length) !== -1) {
      ensAddress = `${ ensAddress }.${ this.domainName }`;
    }

    // load the current owner of the ens address
    const namehash = this.bcc.nameResolver.namehash(ensAddress);
    const owner = await this.bcc.executor.executeContractCall(
      this.bcc.nameResolver.ensContract, 'owner', namehash);

    // load the currents users balance
    this.balance = await this.core.getBalance(this.activeAccount);

    // if no owner exists, show the purchase dialog, else navigate to the detail
    if (owner === '0x0000000000000000000000000000000000000000') {
      this.purchaseEns = ensAddress;
      this.showLoading = false;

      this.ref.detectChanges();
    } else {
      this.routingService.navigate(ensAddress);
    }
  }

  /**
   * Check if the user submits the input using the enter key.
   *
   * @param      {event}   event   input keyup event
   */
  submitOnEnter(event: any) {
    if (event.keyCode === 13 && !this.showLoading) {
      this.checkEnsAddress();

      event.stopPropagation();
      return false;
    }
  }

  /**
   * Trigger the purchase process.
   */
  async purchaseEnsAddress(ensAddress: string) {
    try {
      await this.alertService.showSubmitAlert(
        '_ensselling.purchasing',
        {
          key: '_ensselling.purchasing-desc',
          translateOptions: {
            amount: this.ensCosts,
            domain: ensAddress,
          }
        },
        '_ensselling.cancel',
        '_ensselling.buy',
      );

      // trigger the purchase queue
      this.queue.addQueueData(
        this.ensSellingService.getQueueId('buyDispatcher'),
        {
          ensAddress: ensAddress
        }
      );

      // update the ui
      this.showLoading = true;
      this.purchaseEns = false;
      this.ref.detectChanges();
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
        '_ensselling.remove-favorite',
        {
          key: '_ensselling.remove-favorite-desc',
          translateOptions: {
            domain: ensAddress,
          }
        },
        '_ensselling.cancel',
        '_ensselling.remove-favorite',
      );

      // trigger the purchase queue
      this.queue.addQueueData(
        this.ensSellingService.getQueueId('removeFavoriteDispatcher'),
        {
          ensAddress: ensAddress
        }
      );

      // update the ui
      this.showLoading = true;
      this.purchaseEns = false;
      this.ref.detectChanges();
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

    this.ref.detectChanges();
  }
}
