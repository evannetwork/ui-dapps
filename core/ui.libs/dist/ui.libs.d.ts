declare module '@evan.network/ui'
{
	import * as bcc from '@evan.network/api-blockchain-core';
	import EvanQueue from './Queue';
	/**
	 * The Dispatcher handles batched data processing and saves the data within the EvanQueue. Within
	 * the dispatcher, the several steps can be defined. From this, instances can be generated, that
	 * will process the provided steps.
	 *
	 * @class      Dispatcher
	 */
	export class Dispatcher {
	    /**
	     * Original dapp ens address.
	     */
	    dappEns: string;
	    /**
	     * Technical exported class member of the dispatcher within the dapp.
	     */
	    name: string;
	    /**
	     * Combination of dapp ens and the name
	     */
	    id: string;
	    /**
	     * I18N display key.
	     */
	    title: string;
	    /**
	     * estimated gas price for one full steps run.
	     */
	    gas: number;
	    /**
	     * estimated eve price for one full steps run.
	     */
	    evePrice: number;
	    /**
	     * Steps that should be runned everytime at synchrnisation beginning
	     */
	    startupSteps: Array<Function>;
	    /**
	     * List of step functions.
	     */
	    steps: Array<Function>;
	    /**
	     * Were the instances loaded before?
	     */
	    initialized: boolean;
	    /**
	     * Queue instances mapped to account id's and running dispatcher instances.
	     */
	    queues: {};
	    /**
	     * Dynamic watch for dispatcher updates within a dapp. Per default, it watches for everything.
	     * Optional, other dapp ens addresses or dispatcher names can be listened.
	     *
	     * @param      {any}  func    callback function that should be called
	     * @param      {string}  dappEns  ens address that should be watched
	     * @param      {string}  name     dispatcher name that should be watched
	     */
	    static watch(func: ($event: CustomEvent) => any, dappEns?: string, name?: string): () => void;
	    constructor(dappEns: string, name: string, gas: number, title?: string);
	    /**
	     * Add a step, that should be runned every time at the begging and ignore the state.
	     *
	     * @param      {Function}  stepFunc   Function that should be called.
	     */
	    startup(stepFunc: Function): this;
	    /**
	     * Adds a step into the step array
	     *
	     * @param      {Function}  stepFunc   Function that should be called.
	     */
	    step(stepFunc: Function): this;
	    /**
	     * Get the current running instances.
	     *
	     * @param      {bccRuntime}  runtime  bcc runtime
	     * @param      {boolean}     asArray  should be the result an array?
	     */
	    getInstances(runtime: bcc.Runtime, asArray?: boolean): Promise<any>;
	    /**
	     * Starts this dispatcher with an specific runtime, an data object at an specific point.
	     *
	     * @param      {any}     runtime    bcc runtime
	     * @param      {any}     data       Any option that should passed into the steps
	     * @param      {number}  stepIndex  step index to start at
	     * @param      {number}  price      The custom calculated price
	     */
	    start(runtime: bcc.Runtime, data: any, stepIndex?: number, price?: number): Promise<DispatcherInstance>;
	    /**
	     * Watch for instance updates
	     *
	     * @param      {Function}  func    function that should be called on an update
	     */
	    watch(func: ($event: CustomEvent) => any): () => void;
	}
	interface DispatcherInstanceOptions {
	    queue: EvanQueue;
	    dispatcher: Dispatcher;
	    runtime: bcc.Runtime;
	    data: any;
	    stepIndex?: number;
	    customPrice?: number;
	    id?: any;
	    error?: any;
	}
	/**
	 * A DispatcherInstance is generated, when a Dispatcher was started. This instance runs the startup
	 * and step functions and holds the data. Also it contains several status flags, which step is
	 * currently running and it saves it's states and data into the queue.
	 *
	 * @class      DispatcherInstance
	 */
	export class DispatcherInstance {
	    /**
	     * Queue for the current runtime and dispatcher
	     */
	    queue: EvanQueue;
	    /**
	     * Dispatcher that should be runned.
	     */
	    dispatcher: Dispatcher;
	    /**
	     * A initialized bcc runtime.
	     */
	    runtime: bcc.Runtime;
	    /**
	     * Data that should be passed to the steps
	     */
	    data: any;
	    /**
	     * Active step.
	     */
	    stepIndex: number;
	    /**
	     * dispatcher runtime id
	     */
	    id: any;
	    /**
	     * Current running status
	     */
	    _status: string;
	    /**
	     * Error message.
	     */
	    error: any;
	    /**
	     * If the instance must be accepted, the eve price will be estimated and saved to this instance.
	     */
	    evePrice: number;
	    /**
	     * Custom applied eve price that will overwrite the dispatcher one
	     */
	    customEvePrice: number;
	    /**
	     * Set the current status.
	     */
	    set status(value: string);
	    /**
	     * Current status
	     */
	    get status(): string;
	    constructor(options: DispatcherInstanceOptions);
	    /**
	     * Run the startup and run functions. If the evePrice is higher than the eve-treshold (0.5), it
	     * will send an event that this transaction must be accepted, before it can be started.
	     *
	     * @param      {boolean}  accept  should the dispatcher started directly?
	     */
	    start(accept?: boolean): Promise<string>;
	    /**
	     * Run all the startup functions.
	     */
	    startup(): Promise<void>;
	    /**
	     * Accept the dispatcher instance and start the synchronisation. Used to accept the eve-treshold
	     */
	    accept(): Promise<void>;
	    /**
	     * Run the next step in the queue and persist the data.
	     */
	    run(): Promise<void>;
	    /**
	     * Set the stopping status to break synchronisation at the next dispatcher status.
	     */
	    stop(): void;
	    /**
	     * Stops the current synchronisation and deletes the instance from the queue.
	     */
	    delete(): Promise<void>;
	    /**
	     * Run all watchers with an specific status
	     */
	    triggerWatchers(status: any): void;
	    /**
	     * Send an event with an status for this instance.
	     *
	     * @param      {string}  eventName  event name to trigger
	     * @param      {any}     status     status that should be sent
	     */
	    sendEvent(eventName: string, status: any): void;
	    /**
	     * Take the current data and saves it into the queue db.
	     */
	    save(): Promise<void>;
	    /**
	     * Set the status to finished and remove the queue entry data.
	     */
	    finish(): Promise<void>;
	    /**
	     * Watch for instance updates
	     *
	     * @param      {Function}  func    function that should be called on an update
	     */
	    watch(func: ($event: CustomEvent) => any): () => void;
	}
	export {};

	import * as bcc from '@evan.network/api-blockchain-core';
	export interface UIContainerFile extends bcc.ContainerFile {
	    /**
	     * The file size in bytes
	     */
	    size?: number;
	    /**
	     * Size parsed to kb, md, ...
	     */
	    readableSize?: string;
	    /**
	     * downloadable url
	     */
	    blobUri: string;
	    /**
	     * blob instance
	     */
	    blob: Blob;
	}
	/**
	 * Takes an usual File object (e.g. File from HTML 5 file input) and transforms it into an
	 * blockchain-core understandable file.
	 *
	 * @param      {File}  file    html 5 input result file
	 */
	export function fileToContainerFile(file: any): Promise<UIContainerFile>;
	/**
	 * Upload a file that were selected with an HTML 5 <input type="file"> selector or using the
	 * evan-file-select component and transforms them into an encryption object
	 *
	 * @param      {File}  file    array of files
	 * @return     {Promise<any>}  uploaded files transformed into an encryption object
	 */
	export function readFileAsArrayBuffer(file: File): Promise<any>;
	/**
	 * Parse the file size to a human readable format
	 *
	 * @param      {number}  size    size in B
	 * @return     {string}  XXX KB / XXX MB
	 */
	export function getReadableFileSize(size: number): string;
	/**
	 * Takes an dataUri and resizes the img to an maximum px ratio of 1000px:1000px.
	 *
	 * @param      {string}  dataUri     Data Uri
	 * @param      {any}     dimensions  dimensions to transform the picture to (default max_width:
	 *                                   1000, max_height: 1000)
	 * @return     {blob}    Returns the resized img as a blob.
	 */
	export function resizeImage(dataUri: string, dimensions?: {
	    max_width: number;
	    max_height: number;
	}): Promise<unknown>;

	/**
	 * Structure for handling dispatcher instances and managing data of them. It will start and register
	 * dispatchers and offers the possiblity to save the dispatchers runtime data within the browsers
	 * IndexDB.
	 *
	 * @class      EvanQueue
	 */
	export default class EvanQueue {
	    /**
	     * global available queue instance
	     */
	    entries: {};
	    /**
	     * save the last account id to check, for which account the queue was loaded
	     */
	    accountId: string;
	    /**
	     * Promise to handle queueDB loading finish
	     */
	    initializing: Promise<void>;
	    /**
	     * Storage name for the current user.
	     */
	    storageName: string;
	    constructor(accountId: string);
	    /**
	     * Open the correct index db for the current user. Checks also for upgrades.
	     *
	     * @param      {number}  version  current db version
	     */
	    openDB(version?: number): Promise<unknown>;
	    /**
	     * Creates a queueDB if missing and open all connections. Is called by the Queue interaction
	     * functions itself.
	     */
	    initialize(): Promise<any>;
	    /**
	     * gets the queue db storage name for the active account
	     *
	     * @return     {string}  The storage name.
	     */
	    getStorageName(): string;
	    /**
	     * Gets the "evan-queue" IndexDB object store.
	     *
	     * @param      {any}  option  additional options for queueDB.transaction
	     * @return     {any}  The IDBObjectStore.
	     */
	    getObjectStore(option?: any): any;
	    /**
	     * Loads the queue db for the current user and updates all global queue entries from the index db
	     * @param      {string}  dispatcherId  The dispatcher identifier
	     * @return     {Promise<Array<any>>}  global queue entry array
	     */
	    load(dispatcherId: string): Promise<any>;
	    /**
	     * Store for the current user its current global entries to the queue db.  It loads all current
	     * saved entries and checks for the provided entryId. If the entryId is empty, the entry will be
	     * deleted.
	     *
	     * @param      {string}  dispatcherId  dispatcher identifier (dappEns + dispatcher name)
	     * @param      {string}  entryId       random id string
	     * @param      {any}     data          any data that should be saved, leave empty to remove the
	     *                                     entry
	     * @return     {Promise<any>}  objectStore.put result
	     */
	    save(dispatcherId: string, entryId: string, data?: any): Promise<any>;
	}

	import * as bcc from '@evan.network/api-blockchain-core';
	/**
	 * Returns the users alias, depending on it's profile type. If it's an old profile, resolve alias
	 * from address book.
	 *
	 * @param      {bccProfile}  profile         profile to load the data for
	 * @param      {any}         accountDetails  already laoded accountDetails, to prevent duplicated
	 *                                           loading
	 * @param      {any}         registration    company registration data, to prevent duplicated data
	 *                                           loading
	 */
	export function getUserAlias(profile: bcc.Profile, accountDetails?: any, registration?: any): Promise<any>;
	/**
	 * Returns all contacts from current user addressbook
	 *
	 * @param {any} runtime
	 * @param {boolean} unfiltered default "false", if true response containing own contact and test entries, as well.
	 */
	export function getContacts(runtime: any, unfiltered?: boolean): Promise<{
	    'label': any;
	    'value': string;
	}[]>;

	/**
	 * base url of the evan.network smart agents server
	 */
	export const agentUrl = "https://agents.test.evan.network";

	import EvanQueue from './Queue';
	import { Dispatcher, DispatcherInstance } from './Dispatcher';
	import './index.scss';
	import * as FileHandler from './Files';
	import * as bccUtils from './bccUtils';
	export * from './config';
	export * from './utils';
	export { EvanQueue, Dispatcher, DispatcherInstance, FileHandler, bccUtils, };
	/**
	 * if the ui.evan dapp is loaded as an normal dapp, show the style preview.
	 *
	 * @param      {any}  container  html container where the dapp should be rendered to
	 * @param      {any}  dbcpName   dbcp name of the dapp
	 */
	export function startDApp(container: any, dbcpName: any, dappEns: any, dappBaseUrl: any): Promise<void>;

	/**
	 * Deep equal for objects (https://github.com/epoberezkin/fast-deep-equal/blob/master/index.js)
	 *
	 * @param      {any}     a          object a
	 * @param      {any}     b          object b
	 */
	export function deepEqual(a: any, b: any): boolean;
	/**
	 * Lodash cloneDeep wrapper including ignoreFiles flag.
	 *
	 * @param      {any}  lodash       lodash instance
	 * @param      {any}  obj          object that should be cloned
	 * @param      {any}  ignoreFiles  should file entries be ignored?
	 */
	export function cloneDeep(lodash: any, obj: any, ignoreFiles?: boolean): any;

}