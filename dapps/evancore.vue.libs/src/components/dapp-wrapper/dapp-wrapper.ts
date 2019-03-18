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

// vue imports
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

// evan.network imports
import * as bcc from '@evan.network/api-blockchain-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';

import { DAppWrapperRouteInterface } from '../../interfaces';

@Component({ })
export default class DAppWrapper extends Vue {
  /**
   * url to img for large sidebar
   */
  @Prop() brandLarge: string;

  /**
   * url to img for large sidebar
   */
  @Prop() brandSmall: string;

  /**
   * routes that should be displayed in the sidepanel, if no sidebar slot is given
   * format: [
   *    {
   *      name: 'favorites.evan',
   *      icon: 'fas fa-bookmark',
   *      title: '_dashboard.routes.favorites'
   *    }
   *  ]
   */
  @Prop({ type: Array }) routes: Array<DAppWrapperRouteInterface>;

  /**
   * base url of the vue component that uses the dapp-wrapper (e.g.: dashboard.evan)
   */
  @Prop() routeBaseHash: string;

  /**
   * should be the runtime created? Includes onboarding & login checks.
   */
  @Prop({ default: true }) createRuntime: any;

  /**
   * is the small toolbar shown on large devices?
   */
  smallToolbar: boolean = window.localStorage['evan-small-toolbar'] ? true : false;

  /**
   * Is the sidebar enabled and should be shown? Per defaul enabled, but when no routes are defined
   * or the user is within an onboarding or login process, it will be true.
   */
  enableSidebar = true;

  /**
   * Enables the nav bar icons including mailbox, synchronisation, .... Will be disabled uring login
   * or onboarding process.
   */
  enableNav = true;

  /**
   * show sidebar on small / medium devices?
   */
  showSideBar = false;

  /**
   * show second level navigation on small devices?
   */
  showSideBar2 = true;

  /**
   * login function that was applied by the setPasswordFunction
   */
  login: Function|boolean = false;

  /**
   * Returns the i18n title key for the active route.
   *
   * @return     {string}  active route i18n or route path
   */
  get activeRouteTitle(): string {
    for (let i = 0; i < this.routes.length; i++) {
      if (this.$route.path.startsWith(<string>this.routes[i].fullPath)) {
        return this.routes[i].title;
      }
    }

    return this.$route.path;
  }

  /**
   * Toggles the toolbar large and small on big screens, on medium screens show hide the toolbar, on
   * small screens, show / hide both toolbars.
   */
  toggleSmallToolbar() {
    if (window.innerWidth < 992) {
      this.showSideBar = !this.showSideBar;
    } else {
      this.smallToolbar = !this.smallToolbar;

      // set or clear the localStorage variable
      if (this.smallToolbar) {
        window.localStorage['evan-small-toolbar'] = true;
      } else {
        delete window.localStorage['evan-small-toolbar'];
      }
    }
  }

  /**
   * Triggered when the a root sidebar navigation was clicked. If the route already activated, show
   * the second level navigation.
   *
   * @param      {DAppWrapperRouteInterface}  route   route that was activated
   */
  routeActivated(route: DAppWrapperRouteInterface) {
    this.showSideBar2 = true;

    // if the same route was opened, the second navigation should be displayed
    if (!this.$route.path.startsWith(<string>route.fullPath)) {
      this.showSideBar = false;
    }
  }

  /**
   * Initialize the core runtime for the evan network.
   */
  async created(): Promise<any> {
    // disable sidebar, when no routes are defined
    if (this.routes.length === 0) {
      this.enableSidebar = false;
    } else {
      // else map full path to check active route states and translations
      this.routes.forEach((route) => route.fullPath = `${ this.routeBaseHash }/${ route.path }`);
    }

    // if the runtime should be created, start it up
    if (this.createRuntime) {
      // check for logged in account and if its onboarded
      const activeAccount = dappBrowser.core.activeAccount();
      let loggedIn = false;
      let isOnboarded = false;

      // check if a user is already logged in, if yes, navigate to the signed in route
      if (activeAccount && window.localStorage['evan-vault']) {
        loggedIn = true;

        try {
          isOnboarded = await dappBrowser.bccHelper.isAccountOnboarded(activeAccount);
        } catch (ex) { }
      }

      if (!isOnboarded || !loggedIn) {
        return window.location.hash =
          `#${ this.routeBaseHash }/onboarding.${ dappBrowser.getDomainName() }`;
      } else {
        // set the password function
        dappBrowser.lightwallet.setPasswordFunction(async () =>
          // set resolve password
          await new Promise((resolve) => this.login = (password: string) => {
            this.login = false;

            resolve(password);
          })
        );

        // unlock the profile directly
        await dappBrowser.lightwallet.loadUnlockedVault();
      }
    }

    dappBrowser.loading.finishDAppLoading();
  }
}
