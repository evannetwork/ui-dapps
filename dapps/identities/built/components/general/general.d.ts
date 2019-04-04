import { EvanForm, EvanFormControl } from '@evan.network/ui-vue-core';
interface GeneralFormInterface extends EvanForm {
    description: EvanFormControl;
    img: EvanFormControl;
    name: EvanFormControl;
    type: EvanFormControl;
}
declare const GeneralComponent_base: import("vue-class-component/lib/declarations").VueClass<{}>;
export default class GeneralComponent extends GeneralComponent_base {
    /**
     * formular specific variables
     */
    generalForm: GeneralFormInterface;
    /**
     * Setup the form.
     */
    created(): void;
    /**
     * Create the new identity
     */
    createIdentity(): void;
}
export {};
