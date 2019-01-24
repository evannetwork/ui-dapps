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
  evanGlobals,
  routing
} from 'dapp-browser';

import {
  Component, OnInit,      // @angular/core
  TranslateService,       // @ngx-translate/core
  NavController,          // ionic-angular
  Observable, OnDestroy,
  ChangeDetectorRef
} from 'angular-libs';

import {
  AnimationDefinition,
  createRouterTransition,
  EvanRoutingService,
  EvanCoreService,
  EvanBCCService,
  createOpacityTransition,
  AsyncComponent
} from 'angular-core';

/**************************************************************************************************/

@Component({
  selector: 'onboarding-root',
  templateUrl: 'root.html',
  animations: [
    createOpacityTransition(),
    createRouterTransition([
      new AnimationDefinition('welcome', '=>', '*', 'right'),
      new AnimationDefinition('welcome', '=>', 'metamask', 'left'),
      new AnimationDefinition('welcome', '=>', 'identity-create', 'left'),
      new AnimationDefinition('welcome', '=>', 'identity-import', 'left'),
      
      new AnimationDefinition('metamask', '=>', 'welcome', 'left'),
      new AnimationDefinition('metamask', '=>', 'terms-of-use', 'right'),
      
      new AnimationDefinition('identity-create', '=>', 'welcome', 'left'),
      new AnimationDefinition('identity-create', '=>', 'terms-of-use', 'right'),
      
      new AnimationDefinition('identity-import', '=>', 'welcome', 'left'),
      new AnimationDefinition('identity-import', '=>', 'terms-of-use', 'right'),

      new AnimationDefinition('terms-of-use', '=>', 'welcome', 'left'),
      new AnimationDefinition('terms-of-use', '=>', 'metamask', 'left'),
      new AnimationDefinition('terms-of-use', '=>', 'identity-create', 'left'),
      new AnimationDefinition('terms-of-use', '=>', 'identity-import', 'left'),
      new AnimationDefinition('terms-of-use', '=>', 'profile-create', 'right'),

      new AnimationDefinition('profile-create', '=>', 'metamask', 'left'),
      new AnimationDefinition('profile-create', '=>', 'identity-create', 'left'),
      new AnimationDefinition('profile-create', '=>', 'identity-import', 'left'),
    ])
  ]
})

export class OnboardingRootComponent extends AsyncComponent {
  private activeDApp: Observable<string>;
  private canNavigateBack: Observable<boolean>;
  private loading: boolean;
  private watchRouteChange: Function;

  constructor(
    private routing: EvanRoutingService,
    private core: EvanCoreService,
    private bcc: EvanBCCService,
    private ref: ChangeDetectorRef
  ) {
    super(ref);
  }

  async _ngOnInit() {
    await this.bcc.initialize((accountId) => this.bcc.globalPasswordDialog(accountId));

    this.activeDApp = this.routing.activeRouteName().pipe();
    this.canNavigateBack = this.routing.canNavigateBack().pipe();

    this.watchRouteChange = this.routing.subscribeRouteChange(() => this.ref.detectChanges());
    this.core.finishDAppLoading();
  }

  _ngAfterViewInit() {
    (<any>window).particlesJS("evan-particles", {
      "particles": {
        "number": {
          "value": 80,
          "density": {
            "enable": true,
            "value_area": 946.9771699587272
          }
        },
        "color": {
          "value": "#ffffff"
        },
        "shape": {
          "type": "circle",
          "stroke": {
            "width": 0,
            "color": "#000000"
          },
          "polygon": {
            "nb_sides": 5
          },
          "image": {
            "src": "img/github.svg",
            "width": 100,
            "height": 100
          }
        },
        "opacity": {
          "value": 0.4,
          "random": false,
          "anim": {
            "enable": false,
            "speed": 1,
            "opacity_min": 0.1,
            "sync": false
          }
        },
        "size": {
          "value": 3,
          "random": true,
          "anim": {
            "enable": false,
            "speed": 40,
            "size_min": 0.1,
            "sync": false
          }
        },
        "line_linked": {
          "enable": true,
          "distance": 200,
          "color": "#ffffff",
          "opacity": 0.3,
          "width": 1
        },
        "move": {
          "enable": true,
          "speed": 6,
          "direction": "none",
          "random": false,
          "straight": false,
          "out_mode": "out",
          "bounce": false,
          "attract": {
            "enable": false,
            "rotateX": 600,
            "rotateY": 1200
          }
        }
      },
      "interactivity": {
        "detect_on": "canvas",
        "events": {
          "onhover": {
            "enable": false,
            "mode": "repulse"
          },
          "onclick": {
            "enable": false,
            "mode": "push"
          },
          "resize": false
        },
        "modes": {
          "grab": {
            "distance": 400,
            "line_linked": {
              "opacity": 1
            }
          },
          "bubble": {
            "distance": 400,
            "size": 40,
            "duration": 2,
            "opacity": 8,
            "speed": 3
          },
          "repulse": {
            "distance": 200,
            "duration": 0.4
          },
          "push": {
            "particles_nb": 4
          },
          "remove": {
            "particles_nb": 2
          }
        }
      },
      "retina_detect": true
    });
  }

  async _ngOnDestroy() {
    this.watchRouteChange();
  }

  goBack() {
    this.routing.goBack();
  }
}
