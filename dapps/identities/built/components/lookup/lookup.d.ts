import { EvanForm, EvanFormControl } from '@evan.network/ui-vue-core';
interface LookupFormInterface extends EvanForm {
    address: EvanFormControl;
}
declare const LookupComponent_base: import("vue-class-component/lib/declarations").VueClass<{}>;
export default class LookupComponent extends LookupComponent_base {
    /**
     * formular specific variables
     */
    lookupForm: LookupFormInterface;
    /**
     * Switch the texts for the current lookup modal.
     */
    lookupModalScope: string;
    /**
     * params for the modal display
     */
    modalParams: any;
    /**
     * Check if the currenrt user is purchasing an ens address
     */
    purchasingInstances: {};
    /**
     * Show loading during ens check
     */
    checking: boolean;
    /**
     * Setup the Lookup form.
     */
    created(): void;
    /**
     * Check if the user is currently buyin an ens address.
     */
    checkPurchasing(): Promise<void>;
    /**
     * Check, if an identity exists for the address. If not, ask the user to create one. If the user
     * is not the owner of the ens address
     */
    checkAddress(): Promise<void>;
    /**
     * Gets the parent owner.
     *
     * @param      {any}     runtime  bcc runtime
     * @param      {string}  address  ens address
     */
    getParentRecursive(address: string, owner?: string): any;
    /**
     * Buy the current address.
     */
    purchaseAdress(): void;
    /**
     * open identity address
     */
    createIdentity(): void;
}
export {};
