declare module '@evan.network/ui-vue-core'
{
	import Vue from 'vue';
	import VueRouter from 'vue-router';
	/**
	 * Evan.network component wrapper for easily accessing blockchain runtime data and active DApp information.
	 *
	 * @class      EvanComponent
	 */
	export default class EvanComponent extends Vue {
	    /**
	     * active dapp that was detected by the routing lib (getNextDApp)
	     */
	    dapp: any;
	    /**
	     * Active dapp browser domain name
	     */
	    domainName: string;
	    /**
	     * Declare vue stuff
	     */
	    $i18n: any;
	    $router: VueRouter;
	    $route: any;
	    $store: any;
	    $t: any;
	    /**
	     * Are currently automated test running?
	     */
	    testMode: boolean;
	    constructor();
	    /**
	     * Custom navigation method for evan vue projects. Always navigates using window.location.hash to
	     * force hash chaning on nested DApps.
	     *
	     * @param      {string}  path      path that should be navigated to
	     * @param      {string}  baseHash  navigation base hash (e.g. dashboard.vue.evan, default = this.dapp.baseHash)
	     */
	    evanNavigate(path: string, baseHash?: string): void;
	    /**
	     * Returns the active dapp object, including the current contract address, route base hash and
	     * ens address
	     *
	     * @return     {any}  routing.getNextDApp result
	     */
	    activeDApp(): any;
	    /**
	     * Returns the current runtime from the state or returns an dappBrowser core runtime.
	     *
	     * @return     {any}  bcc runtime
	     */
	    getRuntime(): any;
	}

	import Vue from 'vue';
	import { EvanFormControlOptions } from './interfaces';
	/**
	 * Represents one formular input and handles dirty and error flags, also runs validations.
	 *
	 * @class      EvanFormControl
	 */
	export class EvanFormControl {
	    /**
	     * Is the current element dirty? Error will be only returned, if an error is available.
	     */
	    dirty: boolean;
	    /**
	     * Internal error without custom getter
	     */
	    _error: any;
	    /**
	     * overwrite the error getter, so we only return an error, when the element is dirty
	     */
	    error: any;
	    /**
	     * Form control name.
	     */
	    name: string;
	    /**
	     * form control reference
	     */
	    readonly $ref: any;
	    /**
	     * Original value, without custom setter amd getter
	     */
	    _value: any;
	    /**
	     * overwrite the value getter, so we automatically check for errors, when an validate was
	     * applied.
	     */
	    value: any;
	    /**
	     * validate function that will be runned when the value was changed
	     */
	    _validate: Function | undefined;
	    /**
	     * Original vue instance to directly access component references within the control
	     */
	    vueInstance: Vue;
	    /**
	     * Parent evan form, so the form is valid flag can be set automatically
	     */
	    form: EvanForm | undefined;
	    /**
	     * True, when an asynchronious validate function was applied and this validation is running
	     */
	    validating: boolean;
	    /**
	     * Create the new forms instance.
	     */
	    constructor(name: string, value: any, vueInstance: Vue, validate?: Function, form?: EvanForm);
	    /**
	     * Sets the control into dirty mode.
	     */
	    setDirty(): void;
	    /**
	     * Runs the validate function for this control
	     */
	    validate(): Promise<void>;
	}
	/**
	 * Generalized data representation for a evan.network formular. Handles full validation and error
	 * handling logic. Uses the EvanFormControls to handle all controls seperated and calculates them
	 * into one status detail into this class.
	 *
	 * @class      EvanForm
	 */
	export class EvanForm {
	    /**
	     * list of control names that were applied to the form
	     */
	    controls: Array<string>;
	    /**
	     * The vue instance of for validation etc..
	     */
	    vueInstance: Vue;
	    /**
	     * Is everything valid within the form?
	     */
	    isValid: boolean;
	    /**
	     * Checks for an valid email address.
	     *
	     * @param      {string}   email   email address to checkl
	     * @return     {boolean}  true / false
	     */
	    static validateEmail(email: string): boolean;
	    /**
	     * Checks for an valid ethereum accoung id.
	     *
	     * @param      {string}   email   email address to checkl
	     * @return     {boolean}  true / false
	     */
	    static validEthAddress(address: string): boolean;
	    /**
	     * Create new EvanForm instance.
	     *
	     * @param      {any}                                    vueInstance  Parent vueInstance to
	     *                                                                   directly accessing input refs
	     * @param      {{ [s: string]: EvanFormControlOptions}  }            controls   object of controls
	     *                                                                   that should be added directly
	     */
	    constructor(vueInstance: any, controls: {
	        [s: string]: EvanFormControlOptions;
	    });
	    /**
	     * Iterate through all controls, checks if they are valid and sets the form `isValid` parameter.
	     */
	    validateControls(): void;
	    /**
	     * Adds a single control to the current form and runs the validateControls functions to check
	     * directly the current fiorm validity
	     *
	     * @param      {string}                  controlKey  The control key
	     * @param      {EvanFormControlOptions}  control     control options
	     */
	    addControl(controlKey: string, control: EvanFormControlOptions): void;
	    /**
	     * Remove a control from the form.
	     *
	     * @param      {string}  controlKey    controlKey of the control
	     */
	    removeControl(controlKey: string): void;
	}

	import EvanComponent from './component';
	export * from './components/registry';
	export * from './forms';
	export * from './interfaces';
	export * from './routing';
	export * from './utils';
	export * from './vue-core';
	export { EvanComponent };

	/******************************************** interfaces ******************************************/
	/**
	 * Used to map routes to a route name and a specific component.
	 */
	export interface RouteRegistrationInterface {
	    beforeEnter?: Function;
	    children?: any;
	    component?: any;
	    name?: string;
	    path: string;
	    redirect?: any;
	}
	/**
	 * Used to map routes path including icon and title for dapp-wrapper sidebar
	 */
	export interface DAppWrapperRouteInterface {
	    fullPath?: string;
	    icon: string;
	    id?: string;
	    path?: string;
	    title: string;
	}
	/**
	 * Used to map components to it's template names. (ref.: ./components/registry)
	 */
	export interface ComponentRegistrationInterface {
	    name: string;
	    component: any;
	}
	/**
	 * Used to initialize the evan vue core to startup a whole new vue instance including routes, i18n,
	 * components, vuex, ...
	 */
	export interface EvanVueOptionsInterface {
	    components: Array<ComponentRegistrationInterface>;
	    container: Element;
	    dappBaseUrl: string;
	    dappEnsOrContract: string;
	    dbcpName: string;
	    RootComponent: any;
	    routes: Array<RouteRegistrationInterface>;
	    state: any;
	    translations: any;
	    Vue: any;
	}
	/**
	 * Represents one generalized form control within an vue form.
	 */
	export interface EvanFormControlOptions {
	    validate?: Function;
	    name: string;
	    value?: any;
	}

	import VueRouter from 'vue-router';
	import { EvanVueOptionsInterface } from './interfaces';
	/**
	 * Uses the dapps.basehash and appends the given path.
	 *
	 * @param      {string}  path    route path
	 * @param      {any}     dapp    getNextDApp result
	 * @return     {string}  The route with correct application base.
	 */
	export function getRouteWithDAppBase(path: string, dapp: any): string;
	/**
	 * Start the routing for a vue application. Clones the original routes and sets the base routing (=
	 * current dapp that should be opened).
	 *
	 * @param      {EvanVueOptionsInterface}  options  Evan vue options
	 */
	export function initializeRouting(options: EvanVueOptionsInterface): Promise<{
	    dappToLoad: {
	        baseHash: any;
	        baseUrl: string;
	        contractAddress: any;
	        domainName: string;
	        ens: string;
	        fullUrl: string;
	        rootEns: string;
	    };
	    router: VueRouter;
	}>;
	/**
	 * Retrieves the url hash path for the next dapp, that should be loaded, by checking the
	 * dappEnsOrContract address or by tracing every url hash part and checks, if an element with the
	 * dom id exists.
	 *
	 * Returns ens:
	 *   - ens: ens address of the loaded dapp
	 *   - contractAddess: optional detected contract address
	 *   - baseHash: base of the dapp
	 *
	 * E.g.: opened url #/dashboard.evan/onboarding.evan
	 *
	 *   1. dashboard.evan element was not found, start it
	 *   2. dashboard.evan/** will be triggered and loads the dapp-loader compoment
	 *   3. dapp-loader tracks the url hashes and detects the dashboard.evan/onboarding.evan route and
	 *      will start this dapp in the dapp-loader
	 *   4. when navigating to /dashboard.evan/digitaltwins.evan, the dapp-loader trackts the url change
	 *      and 3. will be started with the new url hash
	 *
	 * @param      {string}   dappEnsOrContract     The dapp ens or contract (e.g.
	 *                                              /dashboard.evan/onboarding.evan)
	 */
	export function getNextDApp(dappEnsOrContract?: string): Promise<{
	    baseHash: any;
	    baseUrl: string;
	    contractAddress: any;
	    domainName: string;
	    ens: string;
	    fullUrl: string;
	    rootEns: string;
	}>;

	/**
	 * Return the domain name. Wrapper function for the dapp-browser.getDomainName.
	 */
	export function getDomainName(): string;

	import { ComponentRegistrationInterface, EvanVueOptionsInterface } from './interfaces';
	/******************************************** functions *******************************************/
	/**
	 * Starts an evan vue dapp and wraps all start functionallities.
	 *
	 * @param      {EvanVueOptions}  options  vue options passed by the dapp
	 */
	export function initializeVue(options: EvanVueOptionsInterface): Promise<any>;
	/**
	 * Registers the components within Vue. If a name is specified, register it also as component, not
	 * only for routing.
	 *
	 * @param      {any}                                  Vue         vue prototype
	 * @param      {ArrayComponentRegistrationInterface}  components  components that should be registered
	 */
	export function registerComponents(Vue: any, components: Array<ComponentRegistrationInterface>): void;
	/**
	 * Register the current translations within vueJS.
	 *
	 * @param      {any}  Vue           vue prototype
	 * @param      {any}  translations  key value object of languages ({ 'de': { ... } })
	 */
	export function registerEvanI18N(Vue: any, translations: any): void;
	/**
	 * Vue does not trigger correct destroy events when a vue application is removed from the dom or
	 * when the browser is freshed. This will cause uncleared watchers and memory leaks. This function
	 * binds window unload event handlers and a vue base element MutationObserver, so we can trigger
	 * correct vue destroy events when DApps are removed from the dom.
	 *
	 * @param      {Vue}  vueInstance  initialized vue instance
	 */
	export function registerEventHandlers(vueInstance: any): void;

	import { ComponentRegistrationInterface } from '../interfaces';
	import AddressComponent from './address/address.vue';
	import BreadcrumbsComponent from './breadcrumbs/breadcrumbs.vue';
	import ButtonComponent from './button/button.vue';
	import CardComponent from './card/card.vue';
	import ContactBatchComponent from './contact-batch/contact-batch.vue';
	import DAppLoaderComponent from './dapp-loader/dapp-loader.vue';
	import DAppLoadingComponent from './loading/loading.vue';
	import DAppWrapperComponent from './dapp-wrapper/dapp-wrapper.vue';
	import DAppWrapperSidebarLevel2Component from './dapp-wrapper-level-2/dapp-wrapper-level-2.vue';
	import DropdownComponent from './dropdown/dropdown.vue';
	import EvanComponent from '../component';
	import FileInputComponent from './files/files.vue';
	import IframeComponent from './iframe/iframe.vue';
	import LoginComponent from './login/login.vue';
	import LogoutComponent from './logout/logout.vue';
	import ModalComponent from './modal/modal.vue';
	import NavListComponent from './nav-list/nav-list.vue';
	import NavTabsComponent from './nav-tabs/nav-tabs.vue';
	import ProfilePreview from './profile-preview/profile-preview.vue';
	import StepsComponent from './steps/steps.vue';
	import SuccessComponent from './success/success.vue';
	import SwipePanelComponent from './swipe-panel/swipe-panel.vue';
	import TooltipComponent from './tooltip/tooltip.vue';
	import UnderDevelopmentComponent from './under-development/under-development.vue';
	export { AddressComponent, BreadcrumbsComponent, ButtonComponent, CardComponent, ContactBatchComponent, DAppLoaderComponent, DAppLoadingComponent, DAppWrapperComponent, DAppWrapperSidebarLevel2Component, DropdownComponent, EvanComponent, FileInputComponent, IframeComponent, LoginComponent, LogoutComponent, ModalComponent, NavListComponent, NavTabsComponent, ProfilePreview, StepsComponent, SuccessComponent, SwipePanelComponent, TooltipComponent, UnderDevelopmentComponent, };
	const componentRegistration: Array<ComponentRegistrationInterface>;
	export default componentRegistration;

	import EvanComponent from '../../component';
	const AddressComponent_base: import("vue-class-component/lib/declarations").VueClass<EvanComponent>;
	/**
	 * Displays a account / contract address and applies generalized interactions like copy, open in
	 * explorer, ...
	 *
	 * @class      AddressComponent @selector      evan-address
	 */
	export default class AddressComponent extends AddressComponent_base {
	    /**
	     * Address that should be displayed
	     */
	    address: any;
	    /**
	     * Specific custom classes
	     */
	    class: any;
	    /**
	     * Should the interactions are shown?
	     */
	    hover: boolean;
	    /**
	     * Copy the current address to the users clipboard
	     */
	    copyAddress(): void;
	}
	export {};

	import EvanComponent from '../../component';
	const BreadcrumbsComponent_base: import("vue-class-component/lib/declarations").VueClass<EvanComponent>;
	/**
	 * Breadcrumb component that parses the currents browser url hash and displays a breadcrumb
	 * navigation for all entries. Also, each breadcrumb can be translated or ignored. Also backwards
	 * and reload buttons can be enabled.
	 *
	 * @class         BreadcrumbsComponent
	 * @selector      evan-breadcrumbs
	 */
	export default class BreadcrumbsComponent extends BreadcrumbsComponent_base {
	    /**
	     * Every route name will be translated using the leading i18nScope. E.g.: digitaltwins.evan =>
	     * _evan.digitaltwins
	     */
	    i18nScope: any;
	    /**
	     * Should the reload button be visible?
	     */
	    enableReload: any;
	    /**
	     * Change the route base hash that should be navigated to
	     */
	    baseHash: any;
	    /**
	     * Move the breadcrumbs element to the most top level dapp-wrapper
	     */
	    attachToDAppWrapper: any;
	    /**
	     * Ignore specific breadcrumbs by applying the url parts that should be ignored
	     */
	    ignored: any;
	    /**
	     * active route, splitted by hash and prepared using the following params: name, fallbackName, path
	     */
	    breadcrumbs: Array<{
	        name: string;
	        fallbackName: string;
	        path: string;
	    }>;
	    /**
	     * Watch for hash updates
	     */
	    hashChangeWatcher: any;
	    /**
	     * Was the component destroyed, before the hash change event was bind?
	     */
	    wasDestroyed: boolean;
	    /**
	     * Show the go back button
	     */
	    goBack: boolean;
	    /**
	     * Correctly used base hash (props should not be overwritten, so we copy the value to the
	     * _baseHash prop)
	     */
	    _baseHash: string;
	    /**
	     * found dapp-wrapper breadcrumbs container element, where this element can be applied to
	     */
	    dappWrapperBreadcrumb: Element;
	    /**
	     * Bind the hash change watcher to track hash changes and to update the routes
	     */
	    created(): Promise<void>;
	    /**
	     * Take the current element and search for an parent wrapper level 2 container, so move the
	     * current element to this element.
	     */
	    mounted(): void;
	    /**
	     * Clear the hash change watcher
	     */
	    beforeDestroy(): void;
	}
	export {};

	import EvanComponent from '../../component';
	const Button_base: import("vue-class-component/lib/declarations").VueClass<EvanComponent>;
	/**
	 * Wrapper component for button elements.
	 *
	 * @class         ComponentsOverview
	 * @selector      evan-components-overview
	 */
	export default class Button extends Button_base {
	    /**
	     * disabled option, passed to html button element
	     */
	    disabled: boolean;
	    /**
	     * size of the button (lg, normal, sm)
	     */
	    size: string;
	    /**
	     * Evan specific button type (have a look at known types) + bootstrap definitions
	     */
	    type: string;
	    href: string;
	    /**
	     * Evan specific button definitions mapped to it's classes. By applying other types, they will be
	     * added as usual bootstrap buttons.
	     */
	    knownTypes: {
	        'icon': string;
	        'icon-primary': string;
	        'icon-secondary': string;
	        'link': string;
	        'primary': string;
	        'secondary': string;
	        'text': string;
	        'text-primary': string;
	        'text-secondary': string;
	    };
	}
	export {};

	const CardComponent_base: import("vue-class-component/lib/declarations").VueClass<unknown>;
	/**
	 * Wrapper for profile verifications.
	 */
	export default class CardComponent extends CardComponent_base {
	    /**
	     * Card type that should be used (transparent, outline, filled)
	     */
	    type: any;
	    /**
	     * Specify small card
	     */
	    small: any;
	}
	export {};

	import EvanComponent from '../../component';
	const ContactBatchComponent_base: import("vue-class-component/lib/declarations").VueClass<EvanComponent>;
	/**
	 * Displays a small colored batch for previewing a users account / name.
	 *
	 * @class         ContactBatchComponent
	 * @selector      evan-batch-component
	 */
	export default class ContactBatchComponent extends ContactBatchComponent_base {
	    /**
	     * String for that the batch should be generated
	     */
	    value: string;
	    /**
	     * Short batch title (Test User => TU, Employee => EM)
	     */
	    batch: string;
	    /**
	     * Batch specific random hex color code.
	     */
	    bgColor: string;
	    /**
	     * text color for the specific background color.
	     */
	    textColor: string;
	    /**
	     * Watch for value changes for life updates
	     */
	    onChildChanged(val: string, oldVal: string): void;
	    /**
	     * Parse the incoming value and generate a hex color code.
	     */
	    created(): void;
	    /**
	     * Takes the current value and generates random colors for the batch.
	     */
	    setupBatchColors(): void;
	    /**
	     * Fill empty strings.
	     *
	     * @return     {string}  text with 2 characters
	     */
	    filledText(text?: string, fallback?: string): string;
	    /**
	     * Use a text to generate a random color code
	     * (https://gist.github.com/0x263b/2bdd90886c2036a1ad5bcf06d6e6fb37/).
	     *
	     * @param      {string}  text    text that shiould be analyzed
	     */
	    getRGBForText(text: string): Array<number>;
	    /**
	     * Load the correct contrast color for a specific
	     *
	     * @param      {Arraystring}  rgb     The rgb
	     */
	    getContrastColor(rgb: Array<any>): "#000000" | "#ffffff";
	}
	export {};

	import EvanComponent from '../../component';
	const DAppLoaderComponent_base: import("vue-class-component/lib/declarations").VueClass<EvanComponent>;
	/**
	 * Dynamic component that loads the next not loaded dapp within the window location hash.
	 *
	 * @class         DAppLoaderComponent
	 * @selector      evan-dapp-loader
	 */
	export default class DAppLoaderComponent extends DAppLoaderComponent_base {
	    /**
	     * save the latest dapp path that was started, so we can check on an hash change, if the dapp for
	     * this dapp loader has been changed.
	     */
	    startedDApp: any;
	    /**
	     * Watch for hash updates and start a new dapp, when the corresponding hash for this dapp-loader
	     * has been changed
	     */
	    hashChangeWatcher: any;
	    /**
	     * no valid dapp could be found for this route
	     */
	    dappNotFound: boolean;
	    /**
	     * Was the component destroyed, before the hash change event was bind?
	     */
	    wasDestroyed: boolean;
	    /**
	     * Start the dapp directly and create an hash change watcher, so we can react on hash changes to
	     * reload the dapp or to start another one.
	     */
	    mounted(): Promise<void>;
	    /**
	     * Clear the hash change watcher
	     */
	    beforeDestroy(): void;
	    /**
	     * Searches for the next dapp in the url that should be started and run it
	     */
	    startDApp(): Promise<void>;
	}
	export {};

	import EvanComponent from '../../component';
	import { DAppWrapperRouteInterface } from '../../interfaces';
	const DAppWrapperComponent_base: import("vue-class-component/lib/declarations").VueClass<EvanComponent>;
	/**
	 * Each DApp must be wrapped with the evan-dapp-wrapper component. This component will handle the
	 * complete login process and it is nessecary to use the ``getRuntime`` that is included into the
	 * `EvanComponent <../js/components.html>`__ function. It also provides this UI interactions:
	 * Dispatcher Interaction, Mailbox Notifications, Profile, Addressbook, Favorites, Mailbox Links…,
	 * Top Panel, Left Panel, Login & Logout.
	 *
	 * It also provides content containers for a second left panel tree and a persistent breadcrumb
	 * navigation, that can be applied by every component. Have a look at the breadcrumbs /
	 * dapp-wrapper-level-2 component.
	 *
	 * @class         DAppWrapperComponent
	 * @selector      evan-dapp-wrapper
	 */
	export default class DAppWrapperComponent extends DAppWrapperComponent_base {
	    /**
	     * url to img for large sidebar (default is set in the create function using $store)
	     */
	    brandLarge: string;
	    /**
	     * url to img for large sidebar (default is set in the create function using $store)
	     */
	    brandSmall: string;
	    /**
	     * routes that should be displayed in the sidepanel, if no sidebar slot is given
	     * format: [
	     *    {
	     *      name: 'favorites.evan',
	     *      icon: 'mdi mdi-bookmark',
	     *      title: '_dashboard.routes.favorites'
	     *    }
	     *  ]
	     */
	    routes: Array<DAppWrapperRouteInterface>;
	    /**
	     * organized like the normal routes, but displayed smaller on the bottom of the nav
	     */
	    bottomRoutes: Array<DAppWrapperRouteInterface>;
	    /**
	     * base url of the vue component that uses the dapp-wrapper (e.g.: dashboard.evan)
	     */
	    routeBaseHash: string;
	    /**
	     * should be the runtime created? Includes onboarding & login checks.
	     */
	    createRuntime: boolean;
	    /**
	     * id of this element, so child elements can be queried easier
	     */
	    id: string;
	    /**
	     * selector for the side bar 2
	     */
	    sideBar2Selector: string;
	    /**
	     * is the current dapp-wrapper gets initialized? => use loading to don't render dapp-loader or
	     * something quickly and directly after this remove the content and show the login or onboarding
	     */
	    loading: boolean;
	    /**
	     * Is the sidebar enabled and should be shown? Per defaul enabled, but when no routes are defined
	     * or the user is within an onboarding or login process, it will be true.
	     */
	    enableSidebar: boolean;
	    /**
	     * Enables the nav bar icons including mailbox, synchronization, .... Will be disabled uring login
	     * or onboarding process.
	     */
	    topLevel: boolean;
	    /**
	     * Is the sidebar-level-2 enabled?
	     */
	    enabledSideBar2: boolean;
	    /**
	     * show sidebar on small / medium devices?
	     */
	    showSideBar: boolean;
	    /**
	     * login function that was applied by the setPasswordFunction
	     */
	    login: Function | boolean;
	    /**
	     * onboarding dapp is opened, so the user isn't logged in
	     */
	    onboarding: Function | boolean;
	    /**
	     * Watch for hash updates when the user is on the onboarding screen. Wait for the user to finished
	     * the process.
	     */
	    hashChangeWatcher: any;
	    /**
	     * current user informations
	     */
	    userInfo: any;
	    /**
	     * Queue loading informations
	     */
	    queueInstances: {};
	    queueCount: number;
	    queueErrorCount: number;
	    queueLoading: boolean;
	    queueWatcher: any;
	    /**
	     * Show a modal for delete / accepting an dispatcher instance
	     */
	    instanceInteraction: any;
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
	    showQueuePanel: boolean;
	    /**
	     * Returns the i18n title key for the active route.
	     *
	     * @return     {string}  active route i18n or route path
	     */
	    readonly activeRouteTitle: string;
	    /**
	     * Triggered when the a root sidebar navigation was clicked. If the route already activated, show
	     * the second level navigation.
	     *
	     * @param      {DAppWrapperRouteInterface}  route   route that was activated
	     */
	    routeActivated(route: DAppWrapperRouteInterface): void;
	    /**
	     * Initialize the core runtime for the evan network.
	     */
	    created(): Promise<any>;
	    /**
	     * Clear the hash change watcher
	     */
	    beforeDestroy(): Promise<void>;
	    /**
	     * Check for parent dapp-wrapper elements and disable nav / sidebar if needed
	     */
	    mounted(): Promise<void>;
	    /**
	     * If a runtime should be created, ensure that the user is logged in / onboarded and create
	     * runtimes
	     */
	    handleLoginOnboarding(): Promise<void>;
	    /**
	     * Load the users specific data.
	     */
	    loadUserSpecific(): Promise<void>;
	    /**
	     * Load the mail informations for the current user
	     */
	    loadMails(mailsToReach?: number): Promise<void>;
	    /**
	     * Opens the mail preview dropdown and sets the evan-mail-read-count.
	     */
	    openMailDropdown(): void;
	    /**
	     * Opens a mail within the mailbox
	     */
	    openMail(mail: any, $event: any): void;
	    /**
	     * Load the queue data
	     */
	    setupQueue(): Promise<void>;
	    /**
	     * Starts an dispatcher instances and checks for accept status.
	     *
	     * @param      {any}  instance  an dispatcher instance
	     */
	    startDispatcherInstance(instance: any): void;
	}
	export {};

	export default class DAppWrapperUtils {
	    /**
	     * Get the highest dapp-wrapper reference for a specific element.
	     *
	     * @param      {Element}  $el     Element to search for a parent from
	     * @return     {Element}  highest dapp wrapper instance or undefined
	     */
	    static getActiveDAppWrapper($el: Element): Element | undefined;
	}

	import EvanComponent from '../../component';
	const DAppWrapperLevel2Component_base: import("vue-class-component/lib/declarations").VueClass<EvanComponent>;
	/**
	 * The dapp-warpper has the functionality, that a custom second level navigation can be applied.
	 * Using this component, this content container does not must be filled directly, it can be filled
	 * from every child component, even from nested, fully seperated dapps. The content that will be
	 * applied to the dapp-wrapper-level-2 component, will be moved to the highest available
	 * dapp-wrapper component. The content will be overwritten, when another DAppWrapperLevel2 component
	 * will be started or, if this included dapp was destroyed.
	 *
	 * @class         DAppWrapperLevel2Component
	 * @selector      evan-dapp-wrapper-level-2
	 */
	export default class DAppWrapperLevel2Component extends DAppWrapperLevel2Component_base {
	    /**
	     * found dapp-wrapper-sidebar 2 container element, where this element can be applied to
	     */
	    highestSidebar: Element;
	    /**
	     * Child element that contains the level 2 content
	     */
	    contentElement: Element;
	    /**
	     * Run destoyed method only ones
	     */
	    isDestroyed: boolean;
	    /**
	     * Take the current element and search for an parent wrapper level 2 container, so move the
	     * current element to this element.
	     */
	    mounted(): void;
	    /**
	     * Trigger destroy function
	     */
	    beforeDestroy(): void;
	    /**
	     * When the element was destroyed, remove this element from the parent dapp-wrapper-2 container,
	     * when found.
	     */
	    destroy(): void;
	    /**
	     * Sends the hide sidebar event.
	     */
	    hide(): void;
	}
	export {};

	import EvanComponent from '../../component';
	const DropdownComponent_base: import("vue-class-component/lib/declarations").VueClass<EvanComponent>;
	/**
	 * Bootstrap dropdown menu wrapper in evan.network style.
	 *
	 * @class         DropdownComponent
	 * @selector      evan-dropdown
	 */
	export default class DropdownComponent extends DropdownComponent_base {
	    /**
	     * Where should the popup should been attached?
	     */
	    alignment: string;
	    /**
	     * Dropdown width specification (e.g. 100px)
	     */
	    width: string;
	    /**
	     * Custom style object
	     */
	    customStyle: string;
	    /**
	     * Disables the dropdown functionality (used to handle dropdowns and single buttons within the
	     * same component)
	     */
	    renderOnlyContent: any;
	    /**
	     * shows the dom elements of the modal
	     */
	    isRendered: boolean;
	    /**
	     * animate them
	     */
	    isShown: boolean;
	    /**
	     * Renders the modal element and shows it animated.
	     */
	    show(): void;
	    /**
	     * Remove the modal element and hide it animated.
	     */
	    hide($event: any): void;
	}
	export {};

	import EvanComponent from '../../component';
	import { FileHandler } from '@evan.network/ui';
	const FilesInputComponent_base: import("vue-class-component/lib/declarations").VueClass<EvanComponent>;
	/**
	 * Wrapper for HTML 5 file upload. Uses the ui-core File utils, load load, return and format files
	 * to handle the correct format.
	 *
	 * @class         FilesInputComponent
	 * @selector      evan-file-input
	 */
	export default class FilesInputComponent extends FilesInputComponent_base {
	    /**
	     * input accept options
	     */
	    accept: string;
	    /**
	     * All selected files.
	     */
	    value: Array<FileHandler.UIContainerFile>;
	    /**
	     * Name of the input.
	     */
	    name: string;
	    /**
	     * Empty text that shown, when no files are uploaded and the component is not disabled.
	     */
	    placeholder: string;
	    /**
	      * Empty text that shown, when no files are uploaded and the component is disabled.
	      */
	    emptyText: string;
	    /**
	     * Disable drag & drop and the upload button
	     */
	    disabled: boolean;
	    /**
	     * is set to an index of a file that should be removed
	     */
	    fileRemove: number;
	    /**
	     * is dropzone hovered?
	     */
	    hovered: boolean;
	    /**
	     * Transform the input files to the correct format.
	     */
	    created(): Promise<void>;
	    /**
	     * Handle new files
	     *
	     * @param      {Arrayany}  files   The files
	     */
	    filesChanged(fileList: FileList): Promise<void>;
	    /**
	     * Remove a file from the value array.
	     *
	     * @param      {any}                         $event  bootstrap html click event
	     * @param      {FileHandlerUIContainerFile}  file    ui container file
	     * @param      {number}                      index   index of the file in the value list
	     */
	    removeFile($event: any, file: FileHandler.UIContainerFile, index: number): boolean;
	}
	export {};

	import EvanComponent from '../../component';
	const IframeComponent_base: import("vue-class-component/lib/declarations").VueClass<EvanComponent>;
	/**
	 * Dynamic iframe wrapper component. Primarily used to show iframes within routes.
	 *
	 * @class         IframeComponent
	 * @selector      evan-iframe
	 */
	export default class IframeComponent extends IframeComponent_base {
	    /**
	     * The iframes src that should be rendered
	     */
	    src: any;
	    /**
	     * show loading indicator
	     */
	    loading: boolean;
	    created(): void;
	}
	export {};

	import EvanComponent from '../../component';
	const DAppLoadingComponent_base: import("vue-class-component/lib/declarations").VueClass<EvanComponent>;
	/**
	 * Shows a full screen loading symbol.
	 *
	 * @class         DAppLoadingComponent
	 * @selector      evan-loading
	 */
	export default class DAppLoadingComponent extends DAppLoadingComponent_base {
	}
	export {};

	import EvanComponent from '../../component';
	const LoginComponent_base: import("vue-class-component/lib/declarations").VueClass<EvanComponent>;
	/**
	 * Handles the password input of a user and checks, if it's correct and it's profile can be
	 * encrypted with that password. Used by the dapp-wrapper to login the current user if needed. Will
	 * send an `logged-in` event including the users provided password.
	 *
	 * @class         LoginComponent
	 * @selector      evan-login
	 */
	export default class LoginComponent extends LoginComponent_base {
	    /**
	     * preload accountId
	     */
	    accountId: any;
	    /**
	     * is the current mnemonic / password is currently checking?
	     */
	    checkingPassword: boolean;
	    /**
	     * formular specific variables
	     */
	    form: {
	        /**
	         * current password input
	         */
	        password: {
	            value: any;
	            valid: boolean;
	            dirty: boolean;
	            ref: any;
	        };
	    };
	    /**
	     * Focus the password element.
	     */
	    mounted(): void;
	    /**
	     * Check the current password input and send the logged in event to the parent component.
	     *
	     * @param      {any}  event   form submit event
	     */
	    login(): Promise<void>;
	}
	export {};

	import EvanComponent from '../../component';
	const EvanLogout_base: import("vue-class-component/lib/declarations").VueClass<EvanComponent>;
	/**
	 * Handles user logout. Directly provides a button, that triggers a logout accept modal. Logs out
	 * the user, if modal gets accepted. Optionally, the button can be disabled and the modal can be
	 * triggered using vue refs.
	 *
	 * @class         EvanLogout
	 * @selector      evan-logout
	 */
	export default class EvanLogout extends EvanLogout_base {
	    /**
	     * Dont show any button
	     */
	    disableButton: any;
	    /**
	     * Show the logout modal
	     */
	    logout(): void;
	    /**
	     * Logout the user.
	     */
	    runLogout(): void;
	}
	export {};

	import EvanComponent from '../../component';
	const EvanModal_base: import("vue-class-component/lib/declarations").VueClass<EvanComponent>;
	/**
	 * Bootstrap modal wrapper in evan custom design.
	 *
	 * @class         EvanModal
	 * @selector      evan-modal
	 */
	export default class EvanModal extends EvanModal_base {
	    /**
	     * Removes the normal content containers and enables the ``<slot name="content" v-if="customModal"></slot>`` slot.
	     */
	    customModal: any;
	    /**
	     * Set true, to hide the default cancel button in footer.
	     */
	    hideFooterButton: any;
	    /**
	     * Configurable modal width
	     */
	    maxWidth: any;
	    /**
	     * Enable or disable evna specific modal part classes. E.g. by removing the modal-header class,
	     * the header will loose it's style, so you can use usal html & css withou evan design.
	     */
	    modalClasses: any;
	    /**
	     * shows the dom elements of the modal
	     */
	    isRendered: boolean;
	    /**
	     * animate them
	     */
	    isShown: boolean;
	    /**
	     * Set true, to prevent hiding when click started inside modal, e.g. during text selection
	     */
	    preventHide: boolean;
	    /**
	     * Send component instance to parent.
	     */
	    created(): void;
	    /**
	     * Renders the modal element and shows it animated.
	     */
	    show(): void;
	    /**
	     * Remove the modal element and hide it animated.
	     */
	    hide(): void;
	}
	export {};

	import EvanComponent from '../../component';
	/**
	 * Describes each tab that can be provided to the NaveComponent
	 */
	interface NavEntryInterface {
	    /**
	     * Optional id that is added as tab id selector
	     */
	    id?: string;
	    /**
	     * icon that should be displayed before the text
	     */
	    icon: string;
	    /**
	     * i18n translation key
	     */
	    text: string;
	    /**
	     * Url that should be opened
	     */
	    href?: string;
	    /**
	     * specify a custom action
	     */
	    action?: Function;
	}
	const NavListComponent_base: import("vue-class-component/lib/declarations").VueClass<EvanComponent>;
	/**
	 * Displays navigation list in evan.network design using vue router integration for checking active
	 * and activating tabs (optimized for evan-dapp-wrapper-level-2)
	 *
	 * @class      NavListComponent @selector      evan-nav-list
	 */
	export default class NavListComponent extends NavListComponent_base {
	    /**
	     * Navigation entries that should be displayed (NavEntry can also be null to display a my-auto
	     * seperator)
	     */
	    entries: Array<NavEntryInterface | null>;
	    /**
	     * Shows the profile display in the top of the nav-list
	     */
	    showProfile: boolean;
	    /**
	     * Shows the logout button at the bottom of the nav list
	     */
	    showLogout: boolean;
	    /**
	     * Current as active marked tab
	     */
	    activeEntry: number;
	    /**
	     * Watch for hash updates and load digitaltwin detail, if a digitaltwin was laod
	     */
	    hashChangeWatcher: any;
	    /**
	     * Check for opened tab
	     */
	    created(): void;
	    /**
	     * Clear the hash change watcher
	     */
	    beforeDestroy(): void;
	    /**
	   * Check the active route and set the active tab status.
	   */
	    setTabStatus(): void;
	}
	export {};

	import EvanComponent from '../../component';
	/**
	 * Describes each tab that can be provided to the NavTabsComponent
	 */
	interface TabInterface {
	    /**
	     * Custom color code
	     */
	    color?: string;
	    /**
	     * Optional id that is added as tab id selector
	     */
	    id?: string;
	    /**
	     * i18n translation key
	     */
	    text: string;
	    /**
	     * Url that should be opened
	     */
	    href: string;
	}
	const NavTabsComponent_base: import("vue-class-component/lib/declarations").VueClass<EvanComponent>;
	/**
	 * Displays tabs in evan.network design using vue router integration for checking active and
	 * activating tabs.
	 *
	 * @class         NavTabsComponent
	 * @selector      evan-nav-tabs
	 */
	export default class NavTabsComponent extends NavTabsComponent_base {
	    /**
	     * List of tabs that should be displayed
	     *
	     * @class      Prop (name)
	     */
	    tabs: Array<TabInterface>;
	    /**
	     * Current as active marked tab
	     */
	    activeTab: number;
	    /**
	     * Watch for hash updates and load digitaltwin detail, if a digitaltwin was laod
	     */
	    hashChangeWatcher: any;
	    /**
	     * Check for opened tab
	     */
	    created(): void;
	    /**
	     * Clear the hash change watcher
	     */
	    beforeDestroy(): void;
	    /**
	   * Check the active route and set the active tab status.
	   */
	    setTabStatus(): void;
	}
	export {};

	import EvanComponent from '../../component';
	const ProfilePreviewComponent_base: import("vue-class-component/lib/declarations").VueClass<EvanComponent>;
	/**
	 * Shows a animated "check" icon.
	 *
	 * @class         SuccessComponent
	 * @selector      evan-success
	 */
	export default class ProfilePreviewComponent extends ProfilePreviewComponent_base {
	    /**
	     * Address of the specific account.
	     */
	    address: any;
	    /**
	     * Size of the profile preview (sm, lg)
	     */
	    size: any;
	    /**
	     * Show loading symbol
	     */
	    loading: boolean;
	    /**
	     * user information (alias, type, verification, ...)
	     */
	    userInfo: any;
	    /**
	     * Load user specific information
	     */
	    created(): Promise<void>;
	}
	export {};

	import EvanComponent from '../../component';
	/**
	 * Shape of each step object
	 */
	interface Step {
	    title: string;
	    disabled: boolean;
	}
	const StepsComponent_base: import("vue-class-component/lib/declarations").VueClass<EvanComponent>;
	/**
	 * Steps indicator component shows current step highlighted.
	 */
	export default class StepsComponent extends StepsComponent_base {
	    /**
	     * activeStep defines the current outlined step
	     */
	    activeStep: number;
	    /**
	     * The steps array, with the shape of Step interface:
	     *  { title: String, disabled: boolean }
	     */
	    steps: Array<Step>;
	    /**
	     * Use a minimal design and show only small step indicators.
	     */
	    minimal: boolean;
	    created(): void;
	    /**
	     * Activate a specific step
	     *
	     * @param      {number}  index     steps index
	     */
	    gotoStep(index: number): void;
	}
	export {};

	import EvanComponent from '../../component';
	const SuccessComponent_base: import("vue-class-component/lib/declarations").VueClass<EvanComponent>;
	/**
	 * Shows a animated "check" icon.
	 *
	 * @class         SuccessComponent
	 * @selector      evan-success
	 */
	export default class SuccessComponent extends SuccessComponent_base {
	}
	export {};

	import EvanComponent from '../../component';
	const SidePanelComponent_base: import("vue-class-component/lib/declarations").VueClass<EvanComponent>;
	/**
	 * Bootstrap dropdown menu wrapper in evan.network style.
	 *
	 * @class         SidePanelComponent
	 * @selector      evan-dropdown
	 */
	export default class SidePanelComponent extends SidePanelComponent_base {
	    /**
	     * Where should the popup should been attached? (left / right)
	     */
	    width: string;
	    /**
	     * Where should the popup should been attached? (left / right)
	     */
	    alignment: string;
	    /**
	     * shows the dom elements of the modal
	     */
	    isRendered: boolean;
	    /**
	     * animate them
	     */
	    isShown: boolean;
	    /**
	     * Wait until the swipe panel is rendered, so it can be shown using animation.
	     */
	    waitForRendered: any;
	    /**
	     * Renders the modal element and shows it animated.
	     */
	    show(): void;
	    /**
	     * Remove the modal element and hide it animated.
	     */
	    hide($event: any): void;
	}
	export {};

	import EvanComponent from '../../component';
	const EvanTooltip_base: import("vue-class-component/lib/declarations").VueClass<EvanComponent>;
	/**
	 * Bootstrap tooltip wrapper.
	 *
	 * @class         SuccessComponent
	 * @selector      evan-success
	 */
	export default class EvanTooltip extends EvanTooltip_base {
	    /**
	     * Tooltip placement
	     */
	    placement: any;
	    /**
	     * Timeout in ms, until the tooltip gets shown
	     */
	    delay: any;
	    /**
	     * Should it be a large tooltip?
	     */
	    multiline: any;
	    /**
	     * Is it displayed?
	     */
	    showTooltip: boolean;
	    /**
	     * tooltip toggle functions
	     */
	    onMouseEnter: Function;
	    onMouseLeave: Function;
	    /**
	     * bind parent element watchers
	     */
	    mounted(): void;
	    /**
	     * unbind parent element watchers
	     */
	    beforeDestroy(): void;
	}
	export {};

	import EvanComponent from '../../component';
	const UnderDevelopment_base: import("vue-class-component/lib/declarations").VueClass<EvanComponent>;
	/**
	 * Shows a ``under-development`` placeholder for enabling empty routes with maintenance or something
	 * else.
	 *
	 * @class         UnderDevelopment
	 * @selector      evan-under-development
	 */
	export default class UnderDevelopment extends UnderDevelopment_base {
	    /**
	     * ui.libs evan dapp base url
	     */
	    uiBaseUrl: string;
	    created(): Promise<void>;
	}
	export {};

	const _default: {
	    "_evan": {
	        "_routes": {
	            "actions": string;
	            "digitaltwins": string;
	            "explorer": string;
	            "favorites": string;
	            "help": string;
	            "profile": string;
	            "synchronization": string;
	            "verifications": string;
	        };
	        "address": {
	            "copied": string;
	            "copy": string;
	            "open-in-explorer": string;
	        };
	        "browser-not-supported": {
	            "desc": string;
	            "title": string;
	        };
	        "cancel": string;
	        "dapp-wrapper": {
	            "all-messages": string;
	            "dispatcher-status": {
	                "deleted": string;
	                "deleting": string;
	                "error": string;
	                "finished": string;
	                "running": string;
	                "stopped": string;
	                "stopping": string;
	                "starting": string;
	            };
	            "empty-queue": string;
	            "instance-accept": {
	                "desc": string;
	                "ok": string;
	                "title": string;
	            };
	            "instance-delete": {
	                "desc": string;
	                "ok": string;
	                "title": string;
	            };
	            "my-contacts": string;
	            "my-mailbox": string;
	            "my-profile": string;
	            "new-mails": string;
	            "queue": string;
	            "queue-continue": string;
	            "queue-error": string;
	            "sync-complete": string;
	        };
	        "dispatcher-not-found": string;
	        "file-input": {
	            "description": string;
	            "empty": string;
	            "remove-modal": {
	                "action": string;
	                "desc": string;
	                "title": string;
	            };
	        };
	        "invalid-password": string;
	        "login": string;
	        "logout": string;
	        "logout-desc": string;
	        "password": string;
	        "password-placeholder": string;
	        "please-login": string;
	        "profile": {
	            "types": {
	                "unspecified": string;
	            };
	        };
	        "under-development": {
	            "desc": string;
	            "title": string;
	        };
	        "use-password": string;
	        "view-profile": string;
	        "welcome-to-evan": string;
	    };
	};
	export default _default;

	const _default: {
	    "_evan": {
	        "_routes": {
	            "actions": string;
	            "digitaltwins": string;
	            "explorer": string;
	            "favorites": string;
	            "help": string;
	            "profile": string;
	            "synchronization": string;
	            "verifications": string;
	        };
	        "address": {
	            "copied": string;
	            "copy": string;
	            "open-in-explorer": string;
	        };
	        "browser-not-supported": {
	            "desc": string;
	            "title": string;
	        };
	        "cancel": string;
	        "dapp-wrapper": {
	            "all-messages": string;
	            "dispatcher-status": {
	                "deleted": string;
	                "deleting": string;
	                "error": string;
	                "finished": string;
	                "running": string;
	                "stopped": string;
	                "stopping": string;
	                "starting": string;
	            };
	            "empty-queue": string;
	            "instance-accept": {
	                "desc": string;
	                "ok": string;
	                "title": string;
	            };
	            "instance-delete": {
	                "desc": string;
	                "ok": string;
	                "title": string;
	            };
	            "my-contacts": string;
	            "my-mailbox": string;
	            "my-profile": string;
	            "new-mails": string;
	            "queue": string;
	            "queue-continue": string;
	            "queue-error": string;
	            "sync-complete": string;
	        };
	        "dispatcher-not-found": string;
	        "file-input": {
	            "description": string;
	            "empty": string;
	            "remove-modal": {
	                "action": string;
	                "desc": string;
	                "title": string;
	            };
	        };
	        "invalid-password": string;
	        "login": string;
	        "logout": string;
	        "logout-desc": string;
	        "password": string;
	        "password-placeholder": string;
	        "please-login": string;
	        "profile": {
	            "types": {
	                "unspecified": string;
	            };
	        };
	        "under-development": {
	            "desc": string;
	            "title": string;
	        };
	        "use-password": string;
	        "view-profile": string;
	        "welcome-to-evan": string;
	    };
	};
	export default _default;

	const _default: {
	    de: {
	        "_evan": {
	            "_routes": {
	                "actions": string;
	                "digitaltwins": string;
	                "explorer": string;
	                "favorites": string;
	                "help": string;
	                "profile": string;
	                "synchronization": string;
	                "verifications": string;
	            };
	            "address": {
	                "copied": string;
	                "copy": string;
	                "open-in-explorer": string;
	            };
	            "browser-not-supported": {
	                "desc": string;
	                "title": string;
	            };
	            "cancel": string;
	            "dapp-wrapper": {
	                "all-messages": string;
	                "dispatcher-status": {
	                    "deleted": string;
	                    "deleting": string;
	                    "error": string;
	                    "finished": string;
	                    "running": string;
	                    "stopped": string;
	                    "stopping": string;
	                    "starting": string;
	                };
	                "empty-queue": string;
	                "instance-accept": {
	                    "desc": string;
	                    "ok": string;
	                    "title": string;
	                };
	                "instance-delete": {
	                    "desc": string;
	                    "ok": string;
	                    "title": string;
	                };
	                "my-contacts": string;
	                "my-mailbox": string;
	                "my-profile": string;
	                "new-mails": string;
	                "queue": string;
	                "queue-continue": string;
	                "queue-error": string;
	                "sync-complete": string;
	            };
	            "dispatcher-not-found": string;
	            "file-input": {
	                "description": string;
	                "empty": string;
	                "remove-modal": {
	                    "action": string;
	                    "desc": string;
	                    "title": string;
	                };
	            };
	            "invalid-password": string;
	            "login": string;
	            "logout": string;
	            "logout-desc": string;
	            "password": string;
	            "password-placeholder": string;
	            "please-login": string;
	            "profile": {
	                "types": {
	                    "unspecified": string;
	                };
	            };
	            "under-development": {
	                "desc": string;
	                "title": string;
	            };
	            "use-password": string;
	            "view-profile": string;
	            "welcome-to-evan": string;
	        };
	    };
	    en: {
	        "_evan": {
	            "_routes": {
	                "actions": string;
	                "digitaltwins": string;
	                "explorer": string;
	                "favorites": string;
	                "help": string;
	                "profile": string;
	                "synchronization": string;
	                "verifications": string;
	            };
	            "address": {
	                "copied": string;
	                "copy": string;
	                "open-in-explorer": string;
	            };
	            "browser-not-supported": {
	                "desc": string;
	                "title": string;
	            };
	            "cancel": string;
	            "dapp-wrapper": {
	                "all-messages": string;
	                "dispatcher-status": {
	                    "deleted": string;
	                    "deleting": string;
	                    "error": string;
	                    "finished": string;
	                    "running": string;
	                    "stopped": string;
	                    "stopping": string;
	                    "starting": string;
	                };
	                "empty-queue": string;
	                "instance-accept": {
	                    "desc": string;
	                    "ok": string;
	                    "title": string;
	                };
	                "instance-delete": {
	                    "desc": string;
	                    "ok": string;
	                    "title": string;
	                };
	                "my-contacts": string;
	                "my-mailbox": string;
	                "my-profile": string;
	                "new-mails": string;
	                "queue": string;
	                "queue-continue": string;
	                "queue-error": string;
	                "sync-complete": string;
	            };
	            "dispatcher-not-found": string;
	            "file-input": {
	                "description": string;
	                "empty": string;
	                "remove-modal": {
	                    "action": string;
	                    "desc": string;
	                    "title": string;
	                };
	            };
	            "invalid-password": string;
	            "login": string;
	            "logout": string;
	            "logout-desc": string;
	            "password": string;
	            "password-placeholder": string;
	            "please-login": string;
	            "profile": {
	                "types": {
	                    "unspecified": string;
	                };
	            };
	            "under-development": {
	                "desc": string;
	                "title": string;
	            };
	            "use-password": string;
	            "view-profile": string;
	            "welcome-to-evan": string;
	        };
	    };
	};
	export default _default;

	import Component from './dapp-loader.ts';
	export default Component;

	import Component from './card.ts';
	export default Component;

	import Component from './address.ts';
	export default Component;

	import Component from './contact-batch.ts';
	export default Component;

	import Button from './button';
	export default Button;

	import Component from './breadcrumbs.ts';
	export default Component;

	import Component from './loading.ts';
	export default Component;

	import Component from './dropdown.ts';
	export default Component;

	import Component from './files.ts';
	export default Component;

	import Component from './iframe.ts';
	export default Component;

	import Component from './dapp-wrapper-level-2.ts';
	export default Component;

	import Component from './login.ts';
	export default Component;

	import Component from './logout.ts';
	export default Component;

	import Component from './modal.ts';
	export default Component;

	import Component from './nav-tabs.ts';
	export default Component;

	import Component from './success.ts';
	export default Component;

	import Component from './swipe-panel.ts';
	export default Component;

	import Component from './nav-list.ts';
	export default Component;

	import Component from './tooltip.ts';
	export default Component;

	import Component from './steps';
	export default Component;

	import Component from './under-development.ts';
	export default Component;

	import Component from './profile-preview.ts';
	export default Component;

	import Component from './dapp-wrapper.ts';
	export default Component;

}