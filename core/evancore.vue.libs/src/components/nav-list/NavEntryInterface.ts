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
  icon: string;

  /**
   * i18n translation key
   */
  text: string;

  /**
   * Vue Router Path
   */
  to: string;

  /**
   * specify a custom action
   */
  action?: Function;

  disabled?: boolean;
}
