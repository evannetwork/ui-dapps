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
  EventEmitter,
  Input,
  NavController,
  OnDestroy,
  OnInit,
  Output,
  TranslateService,
  ViewChild,
} from 'angular-libs';

import * as bcc from 'bcc';

import {
  bccHelper,
  getDomainName,
  lightwallet,
} from 'dapp-browser';

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
  EvanDescriptionService,
} from 'angular-core';

import { DemoManagementService } from '../../services/service';

/**************************************************************************************************/

@Component({
  selector: 'demomanagement-users',
  templateUrl: 'users.html',
  animations: [

  ]
})

export class UsersComponent extends AsyncComponent {
  /**
   * Function to unsubscribe from queue results.
   */
  private queueWatcher: Function;

  /**
   * dbcp description of the onboarding dapp to be able to use it's ens origin to load the captcha
   * check html
   */
  private onboardingOriginUrl: string;

  /**
   * clear the window message listener when component gets destroyed
   */
  private clearCaptchaResponse: Function;

  /**
   * current captcha token value
   */
  private captchaToken: boolean;

  /**
   * has the captcha loaded
   */
  private showCaptcha: boolean;

  /**
   * all users that are added into the demo
   */
  private users: Array<any>;

  /**
   * the demo gets currently upated or profiles gets created 
   */
  private saving: boolean;

  /**
   * array of users
   */
  @Input() demo: any;

  /**
   * disable the user inputs
   */
  @Input() readonly: Array<any>;

  /**
   * Captcha iframe element to acces the element
   */
  @ViewChild('captchaIframe') captchaIframe: any;

  /**
   * Event emitter that is called when something has changed
   */
  @Output() public onChange: EventEmitter<any> = new EventEmitter();

  constructor(
    private bcc: EvanBCCService,
    private core: EvanCoreService,
    private demoManagement: DemoManagementService,
    private descriptionService: EvanDescriptionService,
    private queue: EvanQueue,
    private ref: ChangeDetectorRef,
    private routingService: EvanRoutingService,
    private translate: EvanTranslationService,
    private _DomSanitizer: DomSanitizer
  ) {
    super(ref, core);
  }

  async _ngOnInit() {
    this.users = this.demo.users;

    this.onboardingOriginUrl = await this.descriptionService.getENSOriginUrl(
      `onboarding.${ getDomainName() }`);

    // watch for updates
    this.queueWatcher = await this.queue.onQueueFinish(
      this.demoManagement.getWatchQueueId(this.demo),
      async (reload, results) => { }
    );

    // initially check status values of the 
    for (let user of this.users) {
      await this.checkUserStatus(user, true);
    }

    // Check if anything for this demo is saving
    this.saving = this.queue.getQueueEntry(this.demoManagement.getWatchQueueId(this.demo.address),
      true).data.length > 0;

    // We need to handle the terms-of-use captcha within an iframe, to be able to use iframes on
    // android devices. Captcha does not allow //:file domain, so we use the within the onboarding
    // dapp deployed captcha.html, that is opened using the current url.
    // 
    // create listener function to handle captcha result
    const onCaptchaResponse = (event) => {
      try {
        const data = JSON.parse(event.data);

        // if data could be parsed, and we get a new captcha token, set it to the current context
        switch (data.type) {
          case 'captcha-result': {
            this.captchaToken = data.result;
            break;
          }
          case 'captcha-reset': {
            delete this.captchaToken;
            break;
          }
          case 'captcha-resize': {
            this.captchaIframe.nativeElement.style.height = data.result + 'px';

            break;
          }
          case 'finished-loading': {
            this.showCaptcha = true;
            this.captchaIframe.nativeElement.style.visibility = 'visible';

            break;
          }
        }
        
        this.ref.detectChanges();
      } catch (ex) {
        console.dir(ex);
        console.log('Invalid captcha message: ' + ex.message);
      }
    };

    // add eventListener for captcha iframe and remove 
    window.addEventListener('message', onCaptchaResponse);
    this.clearCaptchaResponse = () => {
      window.removeEventListener('message', onCaptchaResponse);
    }

    this.core.utils.hideLoading(this);
    this.onChange.emit();
  }

  _ngOnDestroy() {
    this.queueWatcher();
    this.clearCaptchaResponse();
  }

  /**
   * Run detectChanges directly and after and timeout again, to update select fields.
   */
  detectTimeout() {
    this.ref.detectChanges();

    setTimeout(() => this.ref.detectChanges());
  }

  /**
   * Check all users if anything is loading.
   *
   * @return     {boolean}  True if user checking, False otherwise.
   */
  isUserChecking() {
    return this.users.filter(user => user.loading).length > 0;
  }

  /**
   * Check all users if anything is loading.
   *
   * @return     {boolean}  True if user checking, False otherwise.
   */
  isUserError() {
    return this.users.filter(user => user.error).length > 0;
  }

  /**
   * Check all users if anything is loading.
   *
   * @return     {boolean}  True if user checking, False otherwise.
   */
  areUsersValid() {
    return this.users.filter(user => user.isValidPassword).length === this.users.length;
  }

  /**
   * Create the profiles for the current users.
   *
   * @return     {any}  { description_of_the_return_value }
   */
  createProfiles() {
    // submit new data to the queue
    this.queue.addQueueData(
      this.demoManagement.getProfilesQueueId(this.demo),
      Object.assign(this.demo, { captchaToken: this.captchaToken })
    );

    this.saving = true;
    this.ref.detectChanges();
  }

  /**
   * Start the demo with a specific user.
   *
   * @param      {any}     user    the user that should run the demo
   */
  startDemo(user: any) {
    window.open(
      [
        window.location.origin + window.location.pathname,
        '?' + [
          `provider=internal`,
          `accountId=${ user.accountId }`,
          `mnemonic=${ user.mnemonic }`,
          `password=${ user.password }`
        ].join('&'),
        `#/lindig.${ getDomainName() }/${ this.demo.contractAddress }`,
      ].join(''),
      '_blank'
    );
  }

  /**
   * Run demoManagement.checkUserStatus and trigger the onChange event.
   *
   * @param      {any}            user            The user object.
   * @param      {boolean}        disableTimeout  use timeout or not?
   * @return     {Promise<void>}  resolved when done
   */
  async checkUserStatus(user: any, disableTimeout?: boolean) {
    await this.demoManagement.checkUserStatus(this, user, disableTimeout);

    // trigger on change
    this.onChange.emit();
  }
}
