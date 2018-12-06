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
  private useAddressInput: boolean = false;

  /**
   * use address input or addressbook select
   */
  private useAddressBook: boolean = true;

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
   * list of objects including the account ids of the ens owners of the mapped topics and the
   * description
   * 
   *   e.g.: topic    = /notary/company/issuer
   *         owner of = notary.claims.evan
   */
  private topicDetails: Array<any>;

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

    // prefill subject
    this.subject = this.subject ||
      this.routingService.getContractAddress() ||
      this.activeAccount;

    // if no valid subject was supplied, reset it
    if (!this.isValidAddress(this.subject)) {
      this.subject = '';
      this.subjectSelect = [ this.activeAccount ];
    }

    // fill initial input
    this.subjectInput = this.subject;

    // show the address input only, if no address was applied
    this.showAddressSelect = this.showAddressSelect || !this.subject;
    
    // show the topic select only if no topics were applied
    this.showTopicSelect = this.showTopicSelect || !Array.isArray(this.topics);

    // fill empty topics
    this.topics = this.topics || [ ];

    // try to load the list of of the last selected claim topics
    this.prefilledClaims = window.localStorage['evan-claims-dapp-topic'] || [
      '/contacts/valid',
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
    this.showClaims = !this.showTopicSelect && this.isValidAddress(this.subject);

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
      // add the new topic to the prefilled claims, make the list unique and save only the first 10
      // values
      this.prefilledClaims.unshift(this.topic);
      this.prefilledClaims = this.core.utils.uniqueArray(this.prefilledClaims);
      this.prefilledClaims = this.prefilledClaims.splice(0, 10);

      this.topics = [ this.topic ];
      window.localStorage['evan-claims-dapp-topic'] = JSON.stringify(this.prefilledClaims);
    }

    // resolve all claim ens owners for the topics 
    this.topicDetails = [ ];
    await Promise.all(this.topics.map(async (topic, index) => {
      // map the topic to the claim ens name and extract the top level claims domain to check, if
      // the user can set the claim tree
      const ensDomain = this.claimService.getClaimEnsAddress(topic);
      const topLevelDomain = ensDomain.split('.').splice(-3, 3).join('.');

      // transform the ens domain into a namehash and load the ens top level topic owner
      const namehash = this.bcc.nameResolver.namehash(topLevelDomain);
      const [ owner, loadedDesc ] = await Promise.all([
        this.bcc.executor.executeContractCall(
          this.bcc.nameResolver.ensContract, 'owner', namehash),
        this.bcc.description.getDescription(ensDomain, this.activeAccount)
      ]);

      this.topicDetails[index] = {
        ensDomain: ensDomain,
        owner: owner,
        description: loadedDesc ? loadedDesc.public : {
          author: this.activeAccount,
          dbcpVersion: 1,
          description: topic,
          name: topic,
          version: '1.0.0',
        },
        image: [ ],
      };

      // fill empty i18n object
      const description = this.topicDetails[index].description;
      description.i18n = description.i18n || { };
      description.i18n.name = description.i18n.name || { };
      description.i18n.name.en = description.i18n.name.en || topic.split('/').pop();
    }));

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

  /**
   * Transform the file input result for the description img into an single value.
   *
   * @param      {any}  topicDetail  the topic detail for that the img was changed
   */
  async descriptionImgChanged(topicDetail: any) {
    if (topicDetail.image.length > 0) {
      const urlCreator = (<any>window).URL || (<any>window).webkitURL;
      const blobURI = urlCreator.createObjectURL(topicDetail.image[0]);
      // transform to array buffer so we can save it within the queue
      const arrayBuffer = await this.fileService.readFilesAsArrayBuffer(
        [ topicDetail.image[0] ]);

      // transform file object
      topicDetail.image[0] = {
        blobURI: this._DomSanitizer.bypassSecurityTrustUrl(blobURI),
        file: arrayBuffer[0].file,
        fileType: arrayBuffer[0].type,
        name: arrayBuffer[0].name,
        base64: await this.pictureService.blobToDataURI(topicDetail.image[0]),
      };

      topicDetail.description.imgSquare = topicDetail.image[0].base64;
    }

    this.ref.detectChanges();
  }

  /**
   * Save the description for a specific topic.
   *
   * @param      {any}            topicDetail  the topic detail
   * @return     {Promise<void>}  resolved when done
   */
  async setDescription(topicDetail: any) {
    this.savingTopicDetail = true;

    // start the setting
    this.queue.addQueueData(
      this.claimService.getQueueId('descriptionDispatcher'),
      topicDetail
    );

    // close all description edits
    this.topicDetails.forEach((topicDetail: any) => {
      topicDetail.showDescription = false;
    });

    this.ref.detectChanges();
  }
}
