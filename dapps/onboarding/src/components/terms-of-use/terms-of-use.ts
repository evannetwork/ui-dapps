/*
  Copyright (C) 2018-present evan GmbH. 
  
  This program is free software: you can redistribute it and/or modify it
  under the terms of the GNU Affero General Public License, version 3, 
  as published by the Free Software Foundation. 
  
  This program is distributed in the hope that it will be useful, 
  but WITHOUT ANY WARRANTY; without even the implied warranty of 
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
  See the GNU Affero General Public License for more details. 
  
  You should have received a copy of the GNU Affero General Public License along with this program.
  If not, see http://www.gnu.org/licenses/ or write to the
  
  Free Software Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA, 02110-1301 USA,
  
  or download the license from the following URL: https://evan.network/license/ 
  
  You can be released from the requirements of the GNU Affero General Public License
  by purchasing a commercial license.
  Buying such a license is mandatory as soon as you use this software or parts of it
  on other blockchains than evan.network. 
  
  For more information, please contact evan GmbH at this address: https://evan.network/license/ 
*/

import {
  getDomainName
} from 'dapp-browser';

import {
  Component, OnInit, // @angular/core
  NavController,     // ionic-angular
  DomSanitizer,
  ViewChild, Slides, AfterViewInit,
  ElementRef,
  ChangeDetectorRef, OnDestroy
} from 'angular-libs';

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
} from 'angular-core';

import { OnboardingService } from '../../services/onboarding';

export class RegisterComponent {
}
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
  private loading: boolean;
  private provider: string;
  private ensOrigin: string;
  private clearCaptchaResponse: Function;
  private activeAccount: string;
  private showCaptcha: boolean;

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
          case 'captcha-result': {
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
