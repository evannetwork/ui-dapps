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

// load domain name for quick usage
const domainName = dappBrowser.getDomainName();
const i18nPref = '_evan._routes';

@Component({ })
export default class DAppWrapper extends Vue {
  /**
   * url to img for large sidebar (default is set in the create function using $store)
   */
  @Prop({
    default: function() {
      return (<any>this).$store.state.uiLibBaseUrl + '/assets/evan-logo-dark-half.svg';
    }
  }) brandLarge: string;

  /**
   * url to img for large sidebar (default is set in the create function using $store)
   */
  @Prop({
    default: function() {
      return (<any>this).$store.state.uiLibBaseUrl + '/assets/evan-logo-small.svg';
    }
  }) brandSmall: string;

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
  @Prop({
    type: Array,
    default: function(options) {
      return [
        { title: `${ i18nPref }.identities`, path: `identities.${ domainName }`, icon: 'fas fa-id-card' },
        { title: `${ i18nPref }.favorites`, path: `favorites.${ domainName }`, icon: 'fas fa-bookmark' },
        // { title: `${ i18nPref }.mailbox`, path: `mailbox.${ domainName }`, icon: 'fas fa-envelope' },
        { title: `${ i18nPref }.contacts`, path: `addressbook.${ domainName }`, icon: 'fas fa-address-book' },
        // { title: `${ i18nPref }.profile`, path: `profile.${ domainName }`, icon: 'fas fa-user' },
      ];
    }
  }) routes: Array<DAppWrapperRouteInterface>;

  /**
   * organized like the normal routes, but displayed smaller on the bottom of the nav
   */
  @Prop({
    type: Array,
  }) bottomRoutes: Array<DAppWrapperRouteInterface>;


  /**
   * base url of the vue component that uses the dapp-wrapper (e.g.: dashboard.evan)
   */
  @Prop({
    default: function() {
      return (<any>this).$store.state.dapp.baseHash;
    }
  }) routeBaseHash: string;

  /**
   * should be the runtime created? Includes onboarding & login checks.
   */
  @Prop({ default: true }) createRuntime: any;

  /**
   * is the current dapp-wrapper gets initialized? => use loading to don't render dapp-loader or
   * something quickly and directly after this remove the content and show the login or onboarding
   */
  loading = true;

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
   * onboarding dapp is opened, so the user isn't logged in
   */
  onboarding: Function|boolean = false;

  /**
   * Watch for hash updates when the user is on the onboarding screen. Wait for the user to finished
   * the process.
   */
  hashChangeWatcher: any;

  /**
   * current user informations
   */
  userInfo: any = {
    addressBook: { },
    alias: '',
    loading: false,
    mails: '',
    newMailCount: '',
    readMails: [ ],
  };

  /**
   * Set interval to reload mails each 30 seconds
   */
  mailsWatcher: any;

  /**
   * Core routes that will be displayed in the top right user dropdown
   */
  coreRoutes = [
    { name: `favorites`, icon: 'fas fa-bookmark' },
    { name: `mailbox`, icon: 'fas fa-envelope' },
    { name: `contacts`, icon: 'fas fa-address-book' },
    { name: `profile`, icon: 'fas fa-user' },
  ];

  /**
   * Returns the i18n title key for the active route.
   *
   * @return     {string}  active route i18n or route path
   */
  get activeRouteTitle(): string {
    if (this.routes) {
      const allRoutes = (<any>[ ]).concat(this.routes, this.bottomRoutes || [ ]);

      for (let i = 0; i < allRoutes.length; i++) {
        if (this.$route.path.startsWith(<string>allRoutes[i].fullPath)) {
          return allRoutes[i].title;
        }
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
    (<any>this).evanNavigate(route.path);

    this.$nextTick(() => {
      this.showSideBar2 = true;

      // if the same route was opened, the second navigation should be displayed
      if (!this.$route.path.startsWith(<string>route.fullPath)) {
        this.showSideBar = false;
      }
    });
  }

  /**
   * Initialize the core runtime for the evan network.
   */
  async created(): Promise<any> {
    // disable sidebar, when no routes are defined
    if (!this.routes || this.routes.length === 0) {
      this.enableSidebar = false;
    } else {
      // else map full path to check active route states and translations
      (<any>[ ]).concat(this.routes, this.bottomRoutes || [ ])
        .forEach((route) => route.fullPath = `${ (<any>this).activeDApp().baseHash }/${ route.path }`);
    }

    // if the runtime should be created, start it up
    if (this.createRuntime) {
      await this.handleLoginOnboarding();
    } else {
      this.loading = false;
    }
  }


  /**
   * Clear the hash change watcher
   */
  destroyed() {
    // only remove the hashChangeWatcher, when it was already bind (user was on the onboarding)
    if (this.hashChangeWatcher) {
      // remove the hash change listener
      window.removeEventListener('hashchange', this.hashChangeWatcher);
    }

    if (this.mailsWatcher) {
      window.clearInterval(this.mailsWatcher);
    }
  }

  /**
   * Check for parent dapp-wrapper elements and disable nav / sidebar if needed
   */
  async mounted() {
    let parent: any = this.$el;

    // search until body or an wrapper body is reached, if an parent dapp-wrapper is found, hide nav
    // and sidebar for this dapp-wrapper
    do {
      parent = parent.parentElement;
      if (parent !== this.$el && parent.className.indexOf('dapp-wrapper-body') !== -1) {
        this.enableNav = false;
        this.enableSidebar = false;

        break;
      }
    } while (parent !== document.body);
  }

  /**
   * If a runtime should be created, ensure that the user is logged in / onboarded and create
   * runtimes
   */
  async handleLoginOnboarding() {
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
      this.loading = false;
      this.onboarding = true;

      // if the watcher was already bound, remove it!
      if (this.hashChangeWatcher) {
         window.removeEventListener('hashchange', this.hashChangeWatcher);
      }

      // set the hash change watcher, so we can check that the user finished the onboarding process
      const dappLoader = this;
      this.hashChangeWatcher = function() {
        if (window.location.hash.indexOf(`onboarding.${ dappBrowser.getDomainName() }`) === -1) {
          // recheck login and onboarding
          dappLoader.handleLoginOnboarding();
        }
      };

      // add the hash change listener
      window.addEventListener('hashchange', this.hashChangeWatcher);

      if (this.$route.path.indexOf(`/onboarding.${ domainName }`) === -1) {
        // navigate to the onboarding and apply the current hash as origin, so the onboarding can
        // navigate back their
        this.$router.push({
          path: `${ (<any>this).activeDApp().baseHash }/onboarding.${ dappBrowser.getDomainName() }`,
          query: {
            origin: this.$route.path,
            ...this.$route.query,
          }
        });
      }

      return;
    } else {
      this.onboarding = false;
      this.loading = false;

      // set the password function
      dappBrowser.lightwallet.setPasswordFunction(async () =>
        // set resolve password
        await new Promise((resolve) => this.login = (password: string) => resolve(password))
      );

      // unlock the profile directly
      const vault = await dappBrowser.lightwallet.loadUnlockedVault();

      // setup runtime and save it to the axios store
      this.$store.state.runtime = await dappBrowser.bccHelper.createDefaultRuntime(
        bcc,
        activeAccount,
        vault.encryptionKey,
        dappBrowser.lightwallet.getPrivateKey(vault, activeAccount)
      );

      // send logged in event
      this.$emit('loggedin', this.$store.state.runtime);
      this.login = false;

      // load the user infos like alias, mails, dispatchers ...
      this.loadUserSpecific();
    }
  }

  /**
   * Navigates the user to the root page of the dapp.
   */
  openRouteBaseHash() {
    if (!this.onboarding) {
      this.$router.push({ path: (<any>this).activeDApp().baseHash })
    }
  }

  /**
   * Load the users specific data.
   */
  async loadUserSpecific() {
    this.userInfo.loading = true;
    this.userInfo.address = dappBrowser.core.activeAccount();

    // load alias from addressbook
    this.userInfo.addressBook = await this.$store.state.runtime.profile.getAddressBook();
    this.userInfo.alias = this.userInfo.addressBook.profile[dappBrowser.core.activeAccount()].alias;

    // load mail information and initialize and mail watcher
    this.loadMails();
    this.mailsWatcher = setInterval(() => this.loadMails);

    this.userInfo.loading = false;
  }

  /**
   * Load the mail informations for the current user
   */
  async loadMails() {
    this.userInfo.mailsLoading = true;

    // load mail inbox informations, load 10 for checking for +9 new mails
    const mailResult = await this.$store.state.runtime.mailbox.getReceivedMails(10);
    this.userInfo.readMails = JSON.parse(window.localStorage['evan-mail-read'] || [ ]);
    this.userInfo.newMailCount = 8;

    // map all the mails in to an mail array and show only 5
    this.userInfo.mails = Object.keys(mailResult.mails)
      .map((mailAddress: string) => {
        const mail = mailResult.mails[mailAddress].content;
        mail.address = mailAddress;

        return mail;
      })
      .slice(0, 5);

    // check last 10 mails if they are already readed
    this.userInfo.readMails.forEach(readMail => {
      if (!mailResult.mails[readMail]) {
        this.userInfo.newMailCount += 1;
      }
    });

    this.userInfo.mailsLoading = false;
  }
}
