import { Location } from 'vue-router';

/**
 * Describes each tab that can be provided to the NaveComponent
 */
export interface NavEntryInterface {
  /**
   * Optional id that is added as tab id selector
   */
  id?: string;

  /**
   * icon that should be displayed before the text
   */
  icon?: string;

  /**
   * i18n translation key
   */
  text: string;

  /**
   * Denotes the target route of the link
   * https://router.vuejs.org/api/#to
   */
  to: string | Location;

  /**
   * specify a custom action
   */
  action?: Function;

  disabled?: boolean;
}
