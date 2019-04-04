declare const OverviewComponent_base: import("vue-class-component/lib/declarations").VueClass<{}>;
export default class OverviewComponent extends OverviewComponent_base {
    /**
     * show loading symbol
     */
    loading: boolean;
    /**
     * mapped for better iteration
     */
    categories: any;
    /**
     * Loaded descriptions
     */
    descriptions: any;
    /**
     * Load dbcp descriptions for the last identities, so we can display more informations.
     */
    created(): Promise<void>;
}
export {};
