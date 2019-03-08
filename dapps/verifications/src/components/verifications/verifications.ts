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

import { VerificationService } from '../../services/service';

/**************************************************************************************************/

/**
 * Explorer verifications using an topic, subject input. If needed, all interactions can be disabled and
 * only the given parameters are used. When the dev mode is enabled, also the display mode can be
 * adjusted for testing purposes.
 */
@Component({
  selector: 'evan-verifications-inspect',
  templateUrl: 'verifications.html',
  animations: [
    createOpacityTransition()
  ]
})

export class EvanVerificationsOverviewComponent extends AsyncComponent {
  /***************** inputs & outpus *****************/
  /**
   * overwrite the address for loading verifications
   */
  @Input() subject?: string;

  /**
   * predefined set of topics to show, this will disable input field
   */
  @Input() topics?: Array<string>;

  /**
   * should the topic select displayed?
   */
  @Input() showTopicSelect = false;

  /**
   * should the topic select displayed?
   */
  @Input() showAddressSelect = false;

  /**
   * overwrite the default display mode of the verifications
   */
  @Input() displayMode = 'detail';

  /**
   * Show only one combined verification card for each topic
   */
  @Input() computedVerifications = true;

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
  private topic = '';

  /**
   * Should the verification container be displayed? (not used while running without standalone)
   */
  private showVerifications: boolean;

  /**
   * use address input or addressbook select
   */
  private useAddressBook: boolean;

  /**
   * use array of members so the user can also select users from his address book directly
   */
  private subjectInput: string;

  /**
   * try to resolve the subject input for an ens and try to get the underlying contract address
   */
  private subjectEnsAddress: string;

  /**
   * wait a second to resolve the input ens address
   */
  private subjectEnsAddressTimeout: any;

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
   * should the configuration view for verification displaymode, expanded and computed be displayed?
   */
  private showVerificationDisplayConfiguration: boolean;

  /**
   * Allow the user to select one of the last X verifications
   */
  private prefilledVerifications: Array<string>;

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
  @ViewChild('verificationTopicSelect') verificationTopicSelect: any;

  constructor(
    private _DomSanitizer: DomSanitizer,
    private addressBookService: EvanAddressBookService,
    private alertService: EvanAlertService,
    private bcc: EvanBCCService,
    private verificationService: EvanVerificationService,
    private core: EvanCoreService,
    private descriptionService: EvanDescriptionService,
    private fileService: EvanFileService,
    private internalVerificationService: VerificationService,
    private pictureService: EvanPictureService,
    private queue: EvanQueue,
    private ref: ChangeDetectorRef,
    private routingService: EvanRoutingService,
  ) {
    super(ref);
  }

  /**
   * Load verifications for the current addres, contract address or the active account.
   */
  async _ngOnInit() {
    this.activeAccount = this.core.activeAccount();

    // prefill subject
    this.subject = this.subject || this.routingService.getContractAddress();

    // if no valid subject was supplied, reset it
    if (!this.isValidAddress(this.subject)) {
      delete this.subject;
    }

    // try to resolve the latest used values
    this.subjectInput = this.subject || window.localStorage['evan-verifications-dapp-address'];

    if (this.subjectInput.indexOf('0x') !== 0) {
      try {
        this.subjectEnsAddress = await this.bcc.nameResolver.getAddress(this.subjectInput);
      } catch (ex) { }
    }

    // if no valid subject was supplied, reset it
    if (!this.isValidAddress(this.subjectInput) && !this.isValidAddress(this.subjectEnsAddress)) {
      delete this.subjectInput;
    }

    // show the address input only, if no address was applied
    this.showAddressSelect = this.showAddressSelect || !this.subject;

    // show the topic select only if no topics were applied
    this.showTopicSelect = this.showTopicSelect || !Array.isArray(this.topics);

    // fill empty topics
    this.topics = this.topics || [ ];

    // try to load the list of of the last selected verification topics
    this.prefilledVerifications = window.localStorage['evan-verifications-dapp-topic'] || [
      '/evan/onboarding/termsofuse',
    ];
    if (!Array.isArray(this.prefilledVerifications)) {
      try {
        this.prefilledVerifications = JSON.parse(this.prefilledVerifications);
      } catch (ex) {
        this.prefilledVerifications = [ ];
      }
    }

    this.topic = this.prefilledVerifications.length > 0 ? this.prefilledVerifications[0] : '';

    // show verifications directly, when topics are available
    this.showVerifications = (!this.showTopicSelect && this.isValidAddress(this.subject)) ||
      this.isValidAddress(this.subjectInput);

    // load currents users contacts
    this.addressbook = await this.addressBookService.loadAccounts();

    // watch for updates
    this.queueWatcher = await this.queue.onQueueFinish(
      this.verificationService.getQueueId(),
      async (reload, results) => {
        // check if the current user has an identity
        this.identityExists = await this.bcc.verifications.identityAvailable(this.activeAccount);
        this.savingTopicDetail = this.queue.getQueueEntry(
          this.verificationService.getQueueId('descriptionDispatcher'), true).data.length > 0;

        reload && this.reloadVerifications();
      }
    );

    // should the verification configuration be displayed?
    this.showVerificationDisplayConfiguration = this.core.utils.isDeveloperMode();

    // if no subject is provided, but the verifications can directly be loaded, use the current values
    if (!this.subject && this.showVerifications) {
      await this.useCurrentValues();
    } else {
      this.detectTimeout();
    }
  }

  /**
   * Remove watchers
   */
  async _ngOnDestroy() {
    this.queueWatcher();
  }

  /**
   * Resets the createForm and reloads the demos.
   *
   * @return     {Promise<void>}  resolved when done
   */
  async reloadVerifications() {
    // clear the cache directly for this view
    this.bcc.verifications.verificationCache = { };

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
    this.showVerifications = false;
    this.ref.detectChanges();

    // only use the subject input / select if they was shown
    this.subject = this.isValidAddress(this.subjectInput) ? this.subjectInput :
      this.subjectEnsAddress;

    // only overwrite topics if the input is shown
    if (this.showTopicSelect) {
      // add the new topic to the prefilled verifications, make the list unique and save only the first 10
      // values
      this.prefilledVerifications.unshift(this.topic);
      this.prefilledVerifications = this.core.utils.uniqueArray(this.prefilledVerifications);
      this.prefilledVerifications = this.prefilledVerifications.splice(0, 10);

      this.topics = [ this.topic ];
      window.localStorage['evan-verifications-dapp-topic'] = JSON.stringify(this.prefilledVerifications);
      window.localStorage['evan-verifications-dapp-address'] = this.subjectInput;
    }

    // clear the cache directly for this view
    this.bcc.verifications.verificationCache = { };

    await this.core.utils.timeout(0);

    this.showVerifications = true;
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
    return !!this.topic && (this.isValidAddress(this.subjectInput) ||
      this.isValidAddress(this.subjectEnsAddress));
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
          '_verifications.recreate-identity',
          '_verifications.recreate-identity-description',
          'cancel',
          '_verifications.recreate-identity'
        );

      this.queue.addQueueData(this.verificationService.getQueueId('identityDispatcher'), { force: true });
      this.identityExists = false;

      this.ref.detectChanges();
    } catch (ex) { }
  }

  /**
   * Check if the current address input is an ens address and
   *
   * @return     {Promise<void>}  resolved when done
   */
  addressInputChanged(submit: boolean) {
    if (!this.subjectEnsAddressTimeout) {
      window.clearTimeout(this.subjectEnsAddressTimeout);
    }

    this.subjectEnsAddressTimeout = setTimeout(async () => {
      if (this.subjectInput.length > 2 && this.subjectInput.indexOf('0x') !== 0) {
        try {
          this.subjectEnsAddress = await this.bcc.nameResolver.getAddress(this.subjectInput);
        } catch (ex) { }
      } else {
        this.subjectEnsAddress = '';
      }

      if (submit && this.isValidForm()) {
        this.useCurrentValues();
      }

      this.ref.detectChanges();
    });

    this.ref.detectChanges();
  }
}
