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
  EvanAddressBookService,
  EvanAlertService,
  EvanBCCService,
  EvanClaimService,
  EvanCoreService,
  EvanQueue,
  EvanRoutingService,
} from 'angular-core';

import { ClaimService } from '../../services/service';

/**************************************************************************************************/

@Component({
  selector: 'evan-claims-inspect',
  templateUrl: 'claims.html',
  animations: [
    createOpacityTransition()
  ]
})

export class EvanClaimsOverviewComponent extends AsyncComponent {
  /***************** inputs & outpus *****************/
  /**
   * overwrite the address for loading claims
   */
  @Input() subject?: string;

  /**
   * predefined set of topics to show, this will disable input field
   */
  @Input() topics?: Array<string>;

  /**
   * should the topic select displayed?
   */
  @Input() showTopicSelect?: boolean = false;

  /**
   * should the topic select displayed?
   */
  @Input() showAddressSelect?: boolean = false;

  /**
   * overwrite the default display mode of the claims
   */
  @Input() displayMode: string = 'detail';

  /**
   * Show only one combined claim card for each topic
   */
  @Input() computedClaims: boolean = true;

  /*****************    variables    *****************/
  /**
   * Function to unsubscribe from queue results.
   */
  private queueWatcher: Function;

  /**
   * current topic input
   */
  private topic: string = '/company';

  /**
   * Should the claim container be displayed? (not used while running without standalone)
   */
  private showClaims: boolean;

  /**
   * use address input or addressbook select
   */
  private useAddressInput: boolean = true;

  /**
   * use address input or addressbook select
   */
  private useAddressBook: boolean = false;

  /**
   * use array of members so the user can also select users from his address book directly
   */
  private subjectInput: string;

  /**
   * use array of members so the user can also select users from his address book directly
   */
  private subjectSelect: Array<string> = [ ];

  /**
   * has the current user already a identity?
   */
  private identityExists: boolean;

  /**
   * active loaded subject
   */
  private activeSubject: string;

  /**
   * current addressbook contact
   */
  private addressbook: any;

  /**
   * should the configuration view for claim displaymode, expanded and computed be displayed?
   */
  private showClaimDisplayConfiguration: boolean;

  /**
   * current formular
   */
  @ViewChild('selectForm') selectForm: any;

  constructor(
    private _DomSanitizer: DomSanitizer,
    private alertService: EvanAlertService,
    private bcc: EvanBCCService,
    private claimService: EvanClaimService,
    private core: EvanCoreService,
    private internalClaimService: ClaimService,
    private queue: EvanQueue,
    private ref: ChangeDetectorRef,
    private routingService: EvanRoutingService,
    private addressBookService: EvanAddressBookService
  ) {
    super(ref, core);
  }

  /**
   * Load claims for the current addres, contract address or the active account.
   */
  async _ngOnInit() {
    // prefill subject
    this.subject = this.subject ||
      this.routingService.getContractAddress() ||
      this.core.activeAccount();

    // if no valid subject was supplied, reset it
    if (!this.isValidAddress(this.subject)) {
      this.subject = '';
    }

    // show the address input only, if no address was applied
    this.showAddressSelect = this.showAddressSelect || !this.subject;
    
    // show the topic select only if no topics were applied
    this.showTopicSelect = this.showTopicSelect || !Array.isArray(this.topics) || this.topic.length === 0;

    // fill empty topics
    this.topics = this.topics || [ ];

    // show claims directly, when topics are available
    this.showClaims = !this.showTopicSelect && this.isValidAddress(this.subject);

    // load currents users contacts
    this.addressbook = await this.addressBookService.loadAccounts();

    // watch for updates
    this.queueWatcher = await this.queue.onQueueFinish(
      this.claimService.getQueueId(),
      async (reload, results) => {
        // check if the current user has an identity
        this.identityExists = await this.bcc.claims.identityAvailable(this.core.activeAccount());

        reload && this.reloadClaims();
      }
    );

    // should the claim configuration be displayed?
    this.showClaimDisplayConfiguration = this.core.utils.isDeveloperMode();

    this.detectTimeout();
  }

  /**
   * Remove watchers
   */
  _ngOnDestroy() {
    this.queueWatcher();
  }

  /**
   * Resets the createForm and reloads the demos.
   *
   * @return     {Promise<void>}  resolved when done
   */
  async reloadClaims() {
    // reload the data
    this.core.utils.showLoading(this);

    this.core.utils.hideLoading(this);
  }

  /**
   * Run detectChanges directly and after and timeout again, to update select fields.
   */
  detectTimeout() {
    this.ref.detectChanges();

    setTimeout(() => this.ref.detectChanges());
  }

  /**
   * Activate the current topic input
   *
   * @return     {Promise<void>}  resolved when done.
   */
  async useCurrentValues() {
    this.showClaims = false;
    this.ref.detectChanges();

    // only use the subject input / select if they was shown
    if (this.showAddressSelect) {
      if (this.useAddressInput) {
        this.subject = this.subjectInput;
      } else {
        this.subject = this.subjectSelect[0];
      }
    }

    // only overwrite topics if the input is shown
    if (this.showTopicSelect) {
      this.topics = [ this.topic ];
    }

    await this.core.utils.timeout(0);

    this.showClaims = true;
    this.ref.detectChanges();
  }

  /**
   * Checks if a form property is touched and invalid.
   *
   * @param      {string}   paramName  name of the form property that should be checked
   * @return     {boolean}  true if touched and invalid, else false
   */
  showError(paramName: string) {
    if (this.selectForm && this.selectForm.controls[paramName]) {
      return this.selectForm.controls[paramName].invalid &&
        this.selectForm.controls[paramName].touched;
    }
  }

  /**
   * Determines if the select form is valid
   *
   * @return     {boolean}  True if valid form, False otherwise
   */
  isValidForm() {
    if (
      this.topic && (!this.showAddressSelect ||
        (this.useAddressInput && this.isValidAddress(this.subjectInput)) || 
        (this.useAddressBook && this.subjectSelect.length > 0)
      )) {
      return true;
    }

    return false;
  }

  /**
   * Check if the provided address if a valid 0x0000... address.
   *
   * @param      {string}   address  address that should be checked
   * @return     {boolean}  True if valid address, False otherwise
   */
  isValidAddress(address: string) {
    return this.bcc.web3.utils.isAddress(address);
  }

  /**
   * Check if the user submits the input using the enter key.
   *
   * @param      {event}   event   input keyup event
   */
  submitOnEnter(event: any) {
    if (event.keyCode === 13 && this.isValidForm()) {
      this.useCurrentValues();

      event.stopPropagation();
      return false;
    }
  }
}
