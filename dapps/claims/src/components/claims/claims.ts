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
  EvanDescriptionService,
  EvanFileService,
  EvanPictureService,
  EvanQueue,
  EvanRoutingService,
} from 'angular-core';

import { ClaimService } from '../../services/service';

/**************************************************************************************************/

/**
 * Explorer claims using an topic, subject input. If needed, all interactions can be disabled and
 * only the given parameters are used. When the dev mode is enabled, also the display mode can be
 * adjusted for testing purposes.
 */
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
   * the current logged in active acount id
   */
  private activeAccount: string;

  /**
   * Function to unsubscribe from queue results.
   */
  private queueWatcher: Function;

  /**
   * current topic input
   */
  private topic: string = '';

  /**
   * Should the claim container be displayed? (not used while running without standalone)
   */
  private showClaims: boolean;

  /**
   * use address input or addressbook select
   */
  private useAddressInput: boolean;

  /**
   * use address input or addressbook select
   */
  private useAddressBook: boolean;

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
   * Allow the user to select one of the last X claims
   */
  private prefilledClaims: Array<string>;

  /**
   * is currently a topic detail saving?
   */
  private savingTopicDetail: boolean;

  /**
   * current formular
   */
  @ViewChild('selectForm') selectForm: any;

  /**
   * Prefilled topic selectors
   */
  @ViewChild('claimTopicSelect') claimTopicSelect: any;

  constructor(
    private _DomSanitizer: DomSanitizer,
    private addressBookService: EvanAddressBookService,
    private alertService: EvanAlertService,
    private bcc: EvanBCCService,
    private claimService: EvanClaimService,
    private core: EvanCoreService,
    private descriptionService: EvanDescriptionService,
    private fileService: EvanFileService,
    private internalClaimService: ClaimService,
    private pictureService: EvanPictureService,
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
    this.activeAccount = this.core.activeAccount();

    // enable latest used mode
    const useAddressBook = window.localStorage['evan-claims-dapp-use-addressbook'];
    this.useAddressBook = !useAddressBook || useAddressBook === 'true' ?
      true : false;
    this.useAddressInput = !this.useAddressBook;

    // prefill subject
    this.subject = this.subject || this.routingService.getContractAddress();

    // if no valid subject was supplied, reset it
    if (!this.isValidAddress(this.subject)) {
      delete this.subject;
    }

    // try to resolve the latest used values
    this.subjectInput = this.subject || window.localStorage['evan-claims-dapp-address-input'];
    this.subjectSelect = [ this.subject || window.localStorage['evan-claims-dapp-address-select'] ];

    // if no valid subject was supplied, reset it
    if (!this.isValidAddress(this.subjectInput)) {
      delete this.subjectInput;
    }

    // if no valid subject was supplied, reset it
    if (!this.isValidAddress(this.subjectSelect[0])) {
      this.subjectSelect = [ this.activeAccount ];
    }

    // show the address input only, if no address was applied
    this.showAddressSelect = this.showAddressSelect || !this.subject;
    
    // show the topic select only if no topics were applied
    this.showTopicSelect = this.showTopicSelect || !Array.isArray(this.topics);

    // fill empty topics
    this.topics = this.topics || [ ];

    // try to load the list of of the last selected claim topics
    this.prefilledClaims = window.localStorage['evan-claims-dapp-topic'] || [
      '/onboarding/agbaccepted',
    ];
    if (!Array.isArray(this.prefilledClaims)) {
      try {
        this.prefilledClaims = JSON.parse(this.prefilledClaims);
      } catch (ex) {
        this.prefilledClaims = [ ];
      }
    }

    this.topic = this.prefilledClaims.length > 0 ? this.prefilledClaims[0] : ''; 

    // show claims directly, when topics are available
    this.showClaims = (!this.showTopicSelect && this.isValidAddress(this.subject)) ||
      (this.useAddressBook && this.isValidAddress(this.subjectSelect[0])) ||
      (!this.useAddressBook && this.isValidAddress(this.subjectInput));

    // load currents users contacts
    this.addressbook = await this.addressBookService.loadAccounts();

    // watch for updates
    this.queueWatcher = await this.queue.onQueueFinish(
      this.claimService.getQueueId(),
      async (reload, results) => {
        // check if the current user has an identity
        this.identityExists = await this.bcc.claims.identityAvailable(this.activeAccount);
        this.savingTopicDetail = this.queue.getQueueEntry(
          this.claimService.getQueueId('descriptionDispatcher'), true).data.length > 0;

        reload && this.reloadClaims();
      }
    );

    // should the claim configuration be displayed?
    this.showClaimDisplayConfiguration = this.core.utils.isDeveloperMode();

    // if no subject is provided, but the claims can directly be loaded, use the current values
    if (!this.subject && this.showClaims) {
      await this.useCurrentValues();
    } else {
      this.detectTimeout();
    }
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
      // add the new topic to the prefilled claims, make the list unique and save only the first 10
      // values
      this.prefilledClaims.unshift(this.topic);
      this.prefilledClaims = this.core.utils.uniqueArray(this.prefilledClaims);
      this.prefilledClaims = this.prefilledClaims.splice(0, 10);

      this.topics = [ this.topic ];
      window.localStorage['evan-claims-dapp-topic'] = JSON.stringify(this.prefilledClaims);
      window.localStorage['evan-claims-dapp-use-addressbook'] = this.useAddressBook;
      window.localStorage['evan-claims-dapp-address-input'] = this.subjectInput;
      window.localStorage['evan-claims-dapp-address-select'] = this.subjectSelect[0];
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
  showError(form: any, paramName: string) {
    if (form && form.controls[paramName]) {
      return form.controls[paramName].invalid &&
        form.controls[paramName].touched;
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
   * Determines if valid description.
   *
   * @return     {boolean}  True if valid description, False otherwise.
   */
  isValidDescription(form: any) {

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

  /**
   * Triggers the queue for creating an identity.
   *
   * @return     {Promise<void>}  resolved when done
   */
  async createIdentity() {
    try {
      await this
        .alertService.showSubmitAlert(
          '_claims.recreate-identity',
          '_claims.recreate-identity-description',
          'cancel',
          '_claims.recreate-identity'
        );

      this.queue.addQueueData(this.claimService.getQueueId('identityDispatcher'), { force: true });
      this.identityExists = false;

      this.ref.detectChanges();
    } catch (ex) { }
  }
}
