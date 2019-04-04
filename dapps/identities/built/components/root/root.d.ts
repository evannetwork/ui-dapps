declare const IdentitiesRootComponent_base: import("vue-class-component/lib/declarations").VueClass<{}>;
export default class IdentitiesRootComponent extends IdentitiesRootComponent_base {
    /**
     * show general loading
     */
    loading: boolean;
    /**
     * Watch for hash updates and load identity detail, if a identity was laod
     */
    hashChangeWatcher: any;
    /**
     * Was the component destroyed, before the hash change event was bind?
     */
    wasDestroyed: boolean;
    /**
     * Show left panel overview or is an detail is opened?
     */
    sideNav: number;
    /**
     * Categories of the left navigation
     */
    navigation: any;
    /**
     * Initialize when the user has logged in.
     */
    initialize(): Promise<void>;
    /**
     * Clear the hash change watcher
     */
    beforeDestroy(): void;
    /**
     * Load the identity favorites for the current user.
     */
    loadFavorites(): Promise<void>;
    /**
     * Load identity data. Checks for identity changes and if a identity is opened.
     */
    loadIdentity(): Promise<void>;
    /**
     * Activate a category and close all others.
     *
     * @param      {Arrayany}  categories  List of categories that should be closed
     * @param      {any}       category    Category that should be activated
     */
    toggleLeftCategory(categories: Array<any>, category: any): void;
    /**
     * Checks for localStorage, which addresses were opened before.
     */
    setLastOpenedIdentities(): void;
}
export {};
