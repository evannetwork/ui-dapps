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
  ipfs,
} from '@evan.network/ui-dapp-browser';

import {
  Component,
  OnInit,
  NavController,
  DomSanitizer,
  ViewChild,
  Slides,
  AfterViewInit,
  ElementRef,
  ChangeDetectorRef,
  OnDestroy,
  Http,
} from '@evan.network/ui-angular-libs';

import {
  createOpacityTransition,
  EvanAlertService,
  EvanRoutingService,
  EvanTranslationService,
  EvanSlidesService,
  EvanCoreService,
  EvanOnboardingService,
  EvanUtilService,
  EvanDescriptionService,
  AsyncComponent
} from '@evan.network/ui-angular-core';

import { OnboardingService } from '../../services/onboarding';
/**************************************************************************************************/

@Component({
  selector: 'terms-of-use',
  templateUrl: 'terms-of-use.html',
  animations: [
    createOpacityTransition(),
  ]
})

export class TermsOfUseComponent extends AsyncComponent {
  private hasRead: boolean;
  public loading: boolean;
  private provider: string;
  private clearCaptchaResponse: Function;
  private activeAccount: string;
  private showCaptcha: boolean;

  /**
   * onboarding dapp origin
   */
  private ensOrigin: string;

  /**
   * current terms of use specification
   */
  private termsOfUse: string;

  @ViewChild('captchaIframe') captchaIframe: ElementRef;

  constructor(
    private _DomSanitizer: DomSanitizer,
    private routing: EvanRoutingService,
    private translate: EvanTranslationService,
    private core: EvanCoreService,
    private alertService: EvanAlertService,
    private onboarding: OnboardingService,
    private onboardingService: EvanOnboardingService,
    private utils: EvanUtilService,
    private ref: ChangeDetectorRef,
    private http: Http,
    private descriptionService: EvanDescriptionService,
  ) {
    super(ref);
  }

  async _ngOnInit() {
    this.hasRead = true;
    this.showCaptcha = false;
    this.ref.detectChanges();

    this.provider = this.routing.getHashParam('provider');
    this.ensOrigin = await this.descriptionService.getENSOriginUrl(`onboarding.${ getDomainName() }`);
    this.termsOfUse = await this.loadTermsOfUse();

    if (this.provider === 'metamask') {
      this.activeAccount = this.core.getExternalAccount();
    } else {
      this.activeAccount = this.onboarding.activeAccount;
    }

    if (!this.activeAccount) {
      this.routing.navigate(`./`, true, this.routing.getQueryparams());
    }

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
            this.onboarding.captchaToken = data.result;
            break;
          }
          case 'captcha-reset': {
            delete this.onboarding.captchaToken;
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
  }

  async _ngOnDestroy() {
    this.clearCaptchaResponse();
  }
  
  /**
   * Load the terms of for the current chain the current language.
   */
  async loadTermsOfUse() {
    // load the terms of use origin url
    const termsOfUseOrigin = await this.descriptionService
      .getENSOriginUrl(`termsofuse.${ getDomainName() }`);
    const ipfsHost = ipfs.ipfsConfig.host;

    // multiple url's that can be requested one after another to fallback current runtime configurations
    const fallbacks = [
      // load from current ipfs host the current language, else fallback to english
      `${ termsOfUseOrigin }/${ ipfsHost }/${ this.translate.getCurrentLang() }.html`,
      `${ termsOfUseOrigin }/${ ipfsHost }/en.html`,
      // if a not registered ipfs host is requested, load the current language for mainnet, else
      // fallback to en
      `${ termsOfUseOrigin }/storage.evan.network/${ this.translate.getCurrentLang() }.html`,
      `${ termsOfUseOrigin }/storage.evan.network/en.html`,
    ];

    // try to load the terms of use for the current language, if this is not available, load the
    // next fallback
    for (let i = 0; i < fallbacks.length; i++) {
      try {
        return (<any>await this.http
          .get(fallbacks[i]))
          .map((res) => res.text())
          .toPromise();
      } catch (ex) { }
    }
  }

  onScroll($event) {
    this.hasRead = true;

    // const scrollEl: any = $event.target;
    // if (scrollEl.offsetHeight + scrollEl.scrollTop === scrollEl.scrollHeight) {
    //   this.hasRead = true;
    // } else {
    //   this.hasRead = false;
    // }

    this.ref.detectChanges();
  }

  async setTermsOfUse() {
    this.loading = true;
    this.ref.detectChanges();

    this.routing.navigate(`./profile-create/${this.provider}`, true, this.routing.getQueryparams());

    this.loading = false;
    this.ref.detectChanges();
  }

  goBack() {
    this.routing.navigate(`./`, true, this.routing.getQueryparams());
  }
}
