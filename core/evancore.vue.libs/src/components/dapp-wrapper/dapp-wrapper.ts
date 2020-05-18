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
*/
// vue imports
import Component, { mixins } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

// evan.network imports
import * as bcc from '@evan.network/api-blockchain-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';
import { session, lightwallet, bccHelper } from '@evan.network/ui-session';
import {
  profileUtils, EvanQueue, Dispatcher, DispatcherInstance,
} from '@evan.network/ui';

import EvanComponent from '../../component';
import EvanVueDispatcherHandler from '../../dispatcher';
import { DAppWrapperRouteInterface } from '../../interfaces';

import { getDomainName } from '../../utils';

// load domain name for quick usage
const domainName = getDomainName();
const i18nPref = '_evan._routes';

/**
 * Each DApp must be wrapped with the evan-dapp-wrapper component. This component will handle the
 * complete login process and it is necessary to use the ``getRuntime`` that is included into the
 * `EvanComponent <../js/components.html>`__ function. It also provides this UI interactions:
 * Dispatcher Interaction, Mailbox Notifications, Profile, Addressbook, Favorites, Mailbox Links…,
 * Top Panel, Left Panel, Login & Logout.
 *
 * It also provides content containers for a second left panel tree and a persistent breadcrumb
 * navigation, that can be applied by every component. Have a look at the breadcrumbs /
 * dapp-wrapper-level-2 component.
 *
 * TODO: Rework login function
 *
 * @class         DAppWrapperComponent
 * @selector      evan-dapp-wrapper
 */
@Component({ })
export default class DAppWrapperComponent extends mixins(EvanComponent) {
  /**
   * url to img for large sidebar (default is set in the create function using $store)
   */
  @Prop({
    default() {
      return `${this.$store.state.uiLibBaseUrl}/assets/evan-logo-dark-half.svg`;
    },
  }) brandLarge: string;

  /**
   * url to img for large sidebar (default is set in the create function using $store)
   */
  @Prop({
    default() {
      return `${this.$store.state.uiLibBaseUrl}/assets/evan-logo-small.svg`;
    },
  }) brandSmall: string;

  /**
   * base url of the vue component that uses the dapp-wrapper (e.g.: dashboard.evan)
   */
  @Prop({
    default() {
      return this.$store.state.dapp.baseHash;
    },
  }) routeBaseHash: string;

  /**
   * should be the runtime created? Includes onboarding & login checks.
   */
  @Prop({ default: true }) createRuntime: boolean;

  get isLoggedin(): boolean {
    return this.$store.state.isLoggedin;
  }

  set isLoggedin(state) {
    this.$store.commit('setLoginState', state);
  }

  /**
   * id of this element, so child elements can be queried easier
   */
  id = `dappwrapper_${Date.now() + Math.round(Math.random() * 1000000)}`;

  /**
   * selector for the side bar 2
   */
  sideBar2Selector = `#${this.id} .dapp-wrapper-content-wrapper > .dapp-wrapper-sidebar-2 > *`;

  /**
   * is the current dapp-wrapper gets initialized? => use loading to don't render dapp-loader or
   * something quickly and directly after this remove the content and show the login or onboarding
   */
  loading = true;

  /**
   * Is the sidebar enabled and should be shown? Per default enabled, but when no routes are defined
   * or the user is within an onboarding or login process, it will be true.
   */
  enableSidebar = true;

  /**
   * Enables the nav bar icons including mailbox, synchronization, .... Will be disabled during login
   * or onboarding process.
   */
  topLevel = true;

  /**
   * Is the sidebar-level-2 enabled?
   */
  enabledSideBar2 = false;

  /**
   * show sidebar on small / medium devices?
   */
  showSideBar = false;

  /**
   * login function that was applied by the setPasswordFunction
   */
  login: Function|boolean = false;

  /**
   * onboarding dapp is opened, so the user isn't logged in
   */
  onboarding: Function|boolean = false;

  /**
   * Function for unsubscribing from session changes, so the ui is able to react for account /
   * identity switches.
   */
  stopSessionWatcher: Function;

  /**
   * Watch for hash updates when the user is on the onboarding screen. Wait for the user to finished
   * the process.
   */
  hashChangeWatcher: any;

  /**
   * current user information
   */
  userInfo = {
    address: '', // TODO: wording "address" vs "accountId" in different components
    addressBook: {} as any, // TODO: resolve any
    alias: '',
    loading: false,
    mails: [],
    mailsLoading: false,
    newMailCount: 0,
    readMails: [],
    totalMails: 0,
  };

  /**
   * Queue loading information
   */
  queueInstances = { };

  queueCount = 0;

  queueErrorCount = 0;

  queueLoading = false;

  queueWatcher = null;

  /**
   * Show a modal for delete / accepting an dispatcher instance
   */
  instanceInteraction: any = undefined;

  /**
   * Set interval to reload mails each 30 seconds
   */
  mailsWatcher: any;

  /**
   * Watch for sidebar close events, so it can be closed from outside
   */
  sideBarCloseWatcher: any;

  /**
   * Watch for sidebar enable events, so we can enable and disable menu button on small devices
   */
  sidebar2EnableWatcher: any;

  sidebar2DisableWatcher: any;

  /**
   * Is the current browser supported? Else show info dialog and stop everything.
   */
  supportedBrowser: any;

  /**
   * Used to hide / display queue panel
   */
  showQueuePanel = false;

  /**
   * List of loaded dispatchers, so dispatcher updates, that were not registered before within this
   * dispatcher, will be loaded.
   */
  loadedDispatchers: Array<string> = [];

  /**
   * dispatcher handler, so applications can easily access dispatcher data from vuex store
   */
  dispatcherHandler: EvanVueDispatcherHandler = null;

  /**
   * routes that should be displayed in the sidepanel, if no sidebar slot is given
   */
  routes: { [category: string]: { [type: string]: Array<DAppWrapperRouteInterface> } } = null;

  /**
   * Triggered when the a root sidebar navigation was clicked. If the route already activated, show
   * the second level navigation.
   *
   * @param      {DAppWrapperRouteInterface}  route   route that was activated
   */
  routeActivated(route: DAppWrapperRouteInterface): void {
    this.showSideBar = false;
  }

  /**
   * Initialize the core runtime for the evan network.
   */
  async created(): Promise<any> {
    this.setRoutes();

    // check if the current browser is allowed
    if (dappBrowser.utils.browserName === 'Firefox' && dappBrowser.utils.isPrivateMode) {
      this.supportedBrowser = false;
    } else {
      this.supportedBrowser = !dappBrowser.utils.browserName || [
        'Opera', 'Firefox', 'Safari', 'Chrome', 'Edge', 'Blink', 'Cordova',
      ].indexOf(dappBrowser.utils.browserName) !== -1;
    }

    // hide loading and stop anything, when browser is not supported
    if (!this.supportedBrowser || !this.createRuntime) {
      this.loading = false;
      // if the runtime should be created, start it up
    } else {
      await this.handleLoginOnboarding();
    }

    this.sideBarCloseWatcher = (): void => { this.showSideBar = false; };
    this.sidebar2EnableWatcher = (): void => { this.enabledSideBar2 = true; };
    this.sidebar2DisableWatcher = (): void => { this.enabledSideBar2 = false; };
    window.addEventListener('dapp-wrapper-sidebar-close', this.sideBarCloseWatcher);
    window.addEventListener('dapp-wrapper-sidebar-2-enable', this.sidebar2EnableWatcher);
    window.addEventListener('dapp-wrapper-sidebar-2-disable', this.sidebar2DisableWatcher);

    // Set correct language on body (for correct auto hyphens)
    document.body.setAttribute('lang', this.$i18n.locale());
  }


  /**
   * Clear the hash change watcher
   */
  beforeDestroy(): void {
    // only remove the hashChangeWatcher, when it was already bind (user was on the onboarding)
    if (this.hashChangeWatcher) {
      window.removeEventListener('hashchange', this.hashChangeWatcher);
    }
    // clear mails watcher
    if (this.mailsWatcher) {
      window.clearInterval(this.mailsWatcher);
    }
    // clear queue watcher
    if (this.userInfo && this.queueWatcher) {
      this.queueWatcher();
    }
    // remove the watch function
    if (this.sideBarCloseWatcher) {
      window.removeEventListener(`evan-queue-${this.id}`, this.sideBarCloseWatcher);
    }
    // delete dispatcher handler
    if (this.dispatcherHandler) {
      this.dispatcherHandler.destroy();
    }
    // stop the ui session and runtime updates
    if (this.stopSessionWatcher) {
      this.stopSessionWatcher();
    }
    // unbind dapp-wrapper-sidebar level handlers
    window.removeEventListener('dapp-wrapper-sidebar-2-enable', this.sidebar2EnableWatcher);
    window.removeEventListener('dapp-wrapper-sidebar-2-disable', this.sidebar2DisableWatcher);
  }

  /**
   * Check for parent dapp-wrapper elements and disable nav / sidebar if needed
   */
  mounted(): void {
    let parent: Element = this.$el;

    /* search until body or an wrapper body is reached, if an parent dapp-wrapper is found, hide nav
       and sidebar for this dapp-wrapper */
    do {
      parent = parent.parentElement;
      if (parent && parent !== this.$el && parent.className.indexOf('dapp-wrapper-body') !== -1) {
        this.topLevel = false;
        this.enableSidebar = false;

        break;
      }
    } while (parent && parent !== document.body);
  }

  /**
   * If a runtime should be created, ensure that the user is logged in / onboarded and create
   * runtimes
   */
  async handleLoginOnboarding(): Promise<void> {
    this.stopSessionWatcher = await session.start(async (action: string): Promise<string> => {
      let result;

      switch (action) {
        case 'onboarding': {
          await new Promise((resolve) => {
            this.loading = false;
            this.onboarding = true;

            // if the watcher was already bound, remove it!
            if (this.hashChangeWatcher) {
              window.removeEventListener('hashchange', this.hashChangeWatcher);
            }

            // set the hash change watcher, so we can check that the user finished the onboarding process
            this.hashChangeWatcher = (): void => {
              if (window.location.hash.indexOf(`onboarding.vue.${this.domainName}`) === -1) {
                // recheck login and onboarding
                resolve();
              }
            };

            // add the hash change listener
            window.addEventListener('hashchange', this.hashChangeWatcher);

            if (this.$route.path.indexOf(`/onboarding.vue.${this.domainName}`) === -1) {
              /* navigate to the onboarding and apply the current hash as origin, so the onboarding can
                 navigate back their */
              this.$router.push({
                path: `${this.dapp.baseHash}/onboarding.vue.${this.domainName}`,
                query: {
                  origin: this.$route.path,
                  ...this.$route.query,
                },
              });
            }
          });

          break;
        }
        case 'password': {
          result = await new Promise((resolve) => {
            this.loading = false;
            this.userInfo.address = session.activeAccount;
            this.login = (password: string): void => {
              // if the user has logged in, reenable loading circle
              this.login = null;
              this.loading = true;
              resolve(password);
            };
          });

          break;
        }
        case 'runtimeUpdate': {
          this.loading = true;
          this.$store.state.runtime = session.identityRuntime; // TODO: remove runtime from $store, check old dapps

          /* create and register a vue dispatcher handler, so applications can easily access dispatcher data
             from vuex store */
          if (this.dispatcherHandler) {
            this.dispatcherHandler.destroy();
          }
          this.dispatcherHandler = new EvanVueDispatcherHandler(this);
          await this.dispatcherHandler.initialize();

          // send logged in event
          this.setRoutes();
          this.$emit('loggedin', this.$store.state.runtime);
          this.onboarding = false;
          this.loading = false;
          this.login = false;
          this.isLoggedin = true;

          // load the user infos like alias, mails, dispatchers ...
          if (this.topLevel) {
            await this.loadUserSpecific();
            window.localStorage.setItem('evan-alias', this.userInfo.alias);
          }
          break;
        }
        default: {
          // uknown event type?
        }
      }

      return result;
    }, this.topLevel);
  }

  /**
   * Load the users specific data.
   */
  async loadUserSpecific(): Promise<void> {
    this.userInfo.loading = true;
    this.userInfo.address = session.activeAccount;

    // load alias from addressbook
    this.userInfo.addressBook = await this.$store.state.runtime.profile.getAddressBook();
    this.userInfo.alias = await profileUtils.getUserAlias(this.$store.state.runtime);

    // setup dispatcher data saving logic
    this.setupQueue();

    // load mail information and initialize an mail watcher
    if (!this.mailsWatcher) {
      this.loadMails();
      this.mailsWatcher = setInterval(() => this.loadMails(), 30e3);
    }

    this.userInfo.loading = false;
  }

  /**
   * Load the mail information for the current user
   */
  async loadMails(): Promise<void> {
    if (!this.userInfo.mailsLoading) {
      this.userInfo.mailsLoading = true;

      const { runtime } = this.$store.state;
      try {
        // load mail inbox informations, load 10 for checking for +9 new mails
        this.userInfo.readMails = JSON.parse(
          window.localStorage.getItem(`${this.getRuntime().activeIdentity}-mail-read`) || '[ ]',
        );

        let mails = [];
        let offset = 0;
        let initial = true;
        this.userInfo.totalMails = 0;

        // load until 5 mails could be decrypted or the maximum amount of mails is reached
        while (mails.length < 5 && (initial || offset < this.userInfo.totalMails)) {
          // eslint-disable-next-line no-await-in-loop
          const mailResult = await runtime.mailbox.getReceivedMails(5, offset);

          // increase offset with amount of loaded mails
          initial = false;
          offset += Object.keys(mailResult.mails).length;

          // update the total mail count
          this.userInfo.totalMails = mailResult.totalResultCount;

          // map all the mails in to an mail array and show only 5
          mails = mails.concat(Object.keys(mailResult.mails)
            .map((mailAddress: string): any => {
              if (mailResult.mails[mailAddress] && mailResult.mails[mailAddress].content) {
                const mail = mailResult.mails[mailAddress].content;
                mail.address = mailAddress;

                return mail;
              }

              return undefined;
            })
            .filter((mail) => !!mail));
        }

        // show a maximum of 5 mails
        this.userInfo.mails = mails.slice(0, 5);

        // check the last read mail count against the current one, to check for new mails
        const previousRead = parseInt(
          window.localStorage.getItem(`${this.getRuntime().activeIdentity}-mail-read-count`) || '0',
          10,
        );
        this.userInfo.newMailCount = this.userInfo.totalMails - previousRead;

        if (previousRead < this.userInfo.totalMails && !window.localStorage.getItem('evan-test-mode')) {
          // show a toast message for the last unread mails
          await Promise.all(this.userInfo.mails.slice(0, this.userInfo.newMailCount).map(async (mail) => {
            const alias = mail.fromAlias || await profileUtils.getUserAlias(runtime, mail.from);
            const mailClass = mail.address.replace('0x', 'mail-');
            const mailLink = [
              this.dapp.baseUrl,
              this.dapp.rootEns,
              `mailbox.vue.${this.dapp.domainName}/received/detail`,
              `${mail.address}`,
            ].join('/');
            const modalClick = (e, toastObject): void => {
              this.markMailAsRead(mail);
              toastObject.goAway(0);
              this.loadMails();
            };

            if (!document.querySelector(`.${mailClass}`)
                && this.userInfo.readMails.indexOf(mail.address) === -1) {
              this.$toasted.show(
                `${mail.title}${alias ? ` ${this.$t('_evan.dapp-wrapper.from')} ${alias}` : ''}`,
                {
                  className: mailClass,
                  duration: null,
                  type: 'info',
                  action: [
                    {
                      text: '',
                      class: 'mdi mdi-email-open-outline',
                      href: mailLink,
                      icon: '',
                      onClick: (e, toastObject): void => {
                        modalClick(e, toastObject);
                        // then redirect to original location
                        window.location.assign(mailLink);
                      },
                    },
                    {
                      text: '',
                      icon: '',
                      class: 'mdi mdi-close',
                      onClick: modalClick,
                    },
                  ],
                },
              );
            }
          }));
        }
      } catch (ex) {
        this.$store.state.runtime.logger.log(ex.message, 'error');
      }

      this.userInfo.mailsLoading = false;
    }
  }

  /**
   * Add a mail address to the readMails array.
   *
   * @param      {any}  mail    mail object
   */
  markMailAsRead(mail: any): void {
    // set the mail read and save it into the local store
    if (this.userInfo.readMails.indexOf(mail.address) === -1) {
      this.userInfo.readMails.push(mail.address);

      window.localStorage.setItem(
        `${this.getRuntime().activeIdentity}-mail-read`,
        JSON.stringify(this.userInfo.readMails),
      );

      // calculate new read mail count
      const currReadCount = parseInt(
        window.localStorage.getItem(`${this.getRuntime().activeIdentity}-mail-read-count`) || '0',
        10,
      );
      const mailIndex = this.userInfo.mails.indexOf(mail);
      const newReadCount = this.userInfo.totalMails - mailIndex;
      if (mailIndex !== -1 && currReadCount < newReadCount) {
        window.localStorage.setItem(
          `${this.getRuntime().activeIdentity}-mail-read-count`,
          newReadCount.toString(),
        );
      }
    }
  }

  /**
   * Load dispatcher from an ens address or return thee cached one.
   */
  async loadDispatcher(dispatcherId: string): Promise<Dispatcher> {
    const [dappEns, dispatcherName] = dispatcherId.split('|||');
    // load dependencies and dapp content
    await dappBrowser.dapp.loadDAppDependencies(dappEns, false);
    const dapp = await dappBrowser.System.import(`${dappEns}!dapp-content`);
    const dispatcher = dapp[dispatcherName];

    // add translation to correctly display instance dispatcher titles
    if (dapp.translations) {
      Object.keys(dapp.translations)
        .forEach((key) => this.$i18n.add(key, dapp.translations[key]));
    }

    // push dispatcher id into the list of already loaded, so we only need to load translations once
    if (this.loadedDispatchers.indexOf(dispatcherId) === -1) {
      this.loadedDispatchers.push(dispatcherId);
    }

    return dispatcher;
  }

  /**
   * Update routes and enforce rerendering
   */
  setRoutes(): void {
    this.$set(this, 'routes', {
      left: {
        top: [
          {
            icon: 'mdi mdi-apps',
            path: `favorites.vue.${domainName}`,
            title: `${i18nPref}.favorites`,
          },
        ],
        center: [
          {
            icon: 'mdi mdi-cube-outline',
            path: `assets.${domainName}`,
            title: `${i18nPref}.assets`,
          },
          {
            icon: 'mdi mdi-account-outline',
            path: `profile.vue.${domainName}/${session.activeIdentity}`,
            title: `${i18nPref}.profile`,
          },
          {
            icon: 'mdi mdi-credit-card-outline',
            path: `wallet.${domainName}`,
            title: `${i18nPref}.wallet`,
          },
          {
            icon: 'mdi mdi-bell-outline rotate-45',
            path: `mailbox.vue.${domainName}`,
            title: `${i18nPref}.actions`,
          },
        ],
        bottom: [
          {
            icon: 'mdi mdi-settings-outline',
            path: `settings.${domainName}`,
            title: `${i18nPref}.settings`,
          },
        ],
      },
      bottom: {
        right: [
          {
            icon: 'mdi mdi-help-circle-outline',
            path: `help.vue.${domainName}`,
            title: `${i18nPref}.help`,
          },
          {
            action: () => (this.$refs.queuePanel as any).show(),
            icon: 'mdi mdi-sync',
            id: 'synchronization',
            title: `${i18nPref}.synchronization`,
          },
        ],
      },
    });

    // create fullPath for current routes to get correct active state
    [
      ...this.routes.left.top,
      ...this.routes.left.center,
      ...this.routes.left.bottom,
      ...this.routes.bottom.right,
    ].forEach((route) => {
      route.fullPath = `${this.dapp.baseHash}/${route.path}`; // eslint-disable-line no-param-reassign
    });
  }

  /**
   * Load the queue data
   */
  async setupQueue(): Promise<void> {
    this.queueLoading = true;

    // load queue for the current account and load the queue entries
    const { runtime } = this.$store.state;
    const queue = await new EvanQueue(this.$store.state.runtime.activeIdentity);
    const dispatchers = await queue.load('*');

    // load all dispatcher instances for this user
    await Promise.all(dispatchers.map(async (dispatcherObj: any) => {
      try {
        const dispatcher = await this.loadDispatcher(dispatcherObj.dispatcherId);
        await Promise.all(Object.keys(dispatcherObj.entries).map(async (instanceId: string) => {
          const entry = dispatcherObj.entries[instanceId];
          const instance = new DispatcherInstance({
            queue,
            dispatcher,
            runtime,
            data: entry.data,
            stepIndex: entry.stepIndex,
            id: instanceId,
            error: entry.error,
            customPrice: entry.customPrice,
          });

          // apply all queue instances to the queue instance object
          this.$set(this.queueInstances, instanceId, instance);
        }));
      } catch (ex) {
        runtime.logger.log(ex, 'error');
      }
    }));

    // set queue count
    const setQueueCount = (): void => {
      const instances = Object.keys(this.queueInstances).map((key) => this.queueInstances[key]);
      this.queueCount = instances.filter((subInstance) => !subInstance.error).length;
      this.queueErrorCount = instances.filter((subInstance) => !!subInstance.error).length;
    };
    setQueueCount();
    this.queueLoading = false;

    // watch for queue updates
    if (!this.queueWatcher && this.topLevel) {
      this.queueWatcher = Dispatcher.watch(async (event: CustomEvent) => {
        const { instance } = event.detail;

        // load missing translations
        if (this.loadedDispatchers.indexOf(instance.dispatcher.id) === -1) {
          await this.loadDispatcher(instance.dispatcher.id);
        }

        // trigger special queue interactions and set toast type
        const toastOpts = {
          action: null,
          duration: 3000,
          type: 'info',
        };
        const toastMessage: string|boolean = this.getDispatcherTranslation(instance);
        switch (instance.status) {
          case 'accept': {
            this.startDispatcherInstance(instance);
            break;
          }
          case 'deleted': {
            delete this.queueInstances[instance.id];
            break;
          }
          case 'error': {
            toastOpts.type = 'error';
            break;
          }
          case 'finished': {
            if (instance.data.callbackUrl) {
              toastOpts.duration = null;
              toastOpts.action = {
                text: this.$t('_evan.dapp-wrapper.dispatcher-url-callback'),
                onClick: (e, toastObject): void => {
                  window.location.hash = instance.data.callbackUrl;
                  toastObject.goAway(0);
                },
              };
            } else {
              toastOpts.duration = 7000;
            }

            delete this.queueInstances[instance.id];
            toastOpts.type = 'success';
            break;
          }
          default: {
            toastOpts.type = 'info';
          }
        }

        // disable toast message, when developer set the custom transaltion to false
        if (toastMessage !== false) {
          // show user synchronisation status
          this.$toasted.show(toastMessage, toastOpts);
        }

        if (instance.status !== 'finished' && instance.status !== 'deleted') {
          /* if the watch was already defined and it's not the incoming instance, copy only the
             values */
          this.$set(this.queueInstances, instance.id, instance);
        }

        setQueueCount();
      });
    }
  }

  /**
   * Starts an dispatcher instances and checks for accept status.
   *
   * @param      {any}  instance  an dispatcher instance
   */
  startDispatcherInstance(instance: DispatcherInstance): void {
    if (instance.status === 'accept') {
      this.instanceInteraction = { type: 'accept', instance };

      (this.$refs as any).instanceInteraction.show();
    } else {
      instance.start();
    }
  }

  /**
   * Get a translation for a dispatcher, a instance status and a specific step. Default translations
   * will be used, when no i18n object is prepared for the specific entries. For custom
   * translations, specify a translation object with the key of the dispatcher title and nest all
   * the status and step translations in their. If you want to use default translations, just leave
   * the entries out of your translation object, but do not forget to specify a title. Set one entry
   * to false, to disable the toast message for this.Sample:
   *
   * {
   *   "my-dapp": {
   *     "dispatcher-status": {
   *        "deleted": "deleted dispatcher",
   *        "deleting": "deleting dispatcher",
   *        "error": "error dispatcher",
   *        "finished": "completed dispatcher",
   *        "step1": "step 1 started",
   *        "step2": "step 2 started",
   *        "step3": "step 3 started",
   *        "starting": "starting dispatcher",
   *        "stopped": "Stopped dispatcher",
   *        "stopping": false,
   *        "title": "My awesome dispatcher"
   *      }
   *   }
   * }
   *
   * @param      {DispatcherInstance}  instance   dispatcher instance, with the dispatcher
   *                                              specification, active step and status
   * @param      {string}              status     pass a custom status, to get a specific state
   * @param      {number}              stepIndex  get the translation for a certain step
   * @return     {string}  translation or false, if it should be disabled
   */
  getDispatcherTranslation(
    instance: DispatcherInstance,
    status = instance.status,
    stepIndex = instance.stepIndex,
  ): string|boolean {
    let customTranslation;
    // check for custom step description
    if (status === 'running') {
      customTranslation = this.$t(`${instance.dispatcher.title}.step${stepIndex}`, null);
    } else {
      // check for custom status translation
      customTranslation = this.$t(`${instance.dispatcher.title}.${status}`, null);
    }
    // early exit, when a custom translation exists
    if (customTranslation !== null) {
      return customTranslation;
    }

    // default translation
    return this.$t(
      `_evan.dapp-wrapper.dispatcher-status.${status}`,
      {
        title: this.$t(`${instance.dispatcher.title}.title`, this.$t(instance.dispatcher.title)),
        percentage: Math.round((100 / instance.dispatcher.steps.length) * stepIndex),
      },
    );
  }
}
