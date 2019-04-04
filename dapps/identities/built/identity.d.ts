import Vue from 'vue';
import * as bcc from '@evan.network/api-blockchain-core';
/**
 * Represents the UI representation for a evan.network. Handles data management and so on.
 *
 * @class      EvanUIIdentity
 */
export default class EvanUIIdentity {
    /**
     * dbcp description of the identity (initially the most smallest subset of data)
     */
    dbcp: any;
    /**
     * current contract address
     */
    address: string;
    /**
     * bcc.DigitalIdentity.isValidDigitalIdentity result
     */
    validity: any;
    /**
     * Digital identity left navigation entries
     */
    navigation: Array<any>;
    /**
     * List of data containers.
     */
    containers: Array<any>;
    /**
     * watch for dispatcher updates
     */
    dispatcherListeners: Array<Function>;
    /**
     * is the identity currently loading?
     */
    loading: boolean;
    /**
     * creation is in progress
     */
    isCreating: boolean;
    /**
     * Was the identity adjusted and a save is needed?
     */
    dirty: boolean;
    dirtyObjects: any[];
    /**
     * is this identity is a favorite?
     */
    isFavorite: boolean;
    isFavoriteLoading: boolean;
    /**
     * show loading, when save process is running
     */
    saving: boolean;
    /**
     * Return the default identity config.
     */
    static getIdentityConfig(runtime: bcc.Runtime, address: string, dbcp?: any): {
        accountId: string;
        address: string;
        containerConfig: {
            accountId: string;
        };
        description: any;
        factoryAddress: string;
    };
    constructor(address: string);
    /**
     * Stops all dispatcher listeners and kill the vue store instance, if it's set
     *
     * @param      {any}  vueInstance  a vue instance
     */
    destroy(vueInstance?: Vue): void;
    /**
     * Return the DigitalIdentity instance for the current class instancew.
     *
     * @param      {bccRuntime}  runtime  The runtime
     */
    getIdentityInstance(runtime: bcc.Runtime): bcc.DigitalIdentity;
    /**
     * Check if currently an synchronisation is running for the favorites.
     */
    getFavoriteLoading(runtime: bcc.Runtime): Promise<boolean>;
    /**
     * Load the initial data for the digital identity
     */
    initialize(vueInstance: any, runtime: bcc.Runtime): Promise<void>;
    /**
     * Checks for changes and triggers the save dispatcher
     *
     * @param      {bccRuntime}  runtime  bcc runtime
     */
    saveChanges(runtime: bcc.Runtime): void;
    /**
     * Sets a data property and makes the identity dirty.
     *
     * @param      {string}  key     nested key (e.g. dbcp.name)
     * @param      {any}     value   value that should be set
     */
    setData(key: string, value: any): void;
    /**
     * Check if the current identity with the specific address is in creation
     */
    setIsCreating(vueInstance: any, runtime: bcc.Runtime): Promise<void>;
    /**
     * Set the translation for the current dbcp name, so the breadcrumbs will be displayed correctly.
     */
    setNameTranslations(vueInstance: any): void;
    /**
     * Toggle the current dispatcher state
     */
    toggleFavorite(runtime: any): Promise<void>;
    /**
     * Watch for favorite loading updates
     *
     * @param      {bccRuntime}  runtime  The runtime
     */
    watchFavoriteLoading(runtime: bcc.Runtime): void;
    /**
     * Watch for saving updates
     */
    watchSaving(runtime: bcc.Runtime): Promise<void>;
}
