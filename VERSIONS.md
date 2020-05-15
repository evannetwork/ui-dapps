# evan.network ui-dapps


## Next Version
### Features
- `assets`
  - add data sharing selection to `Add Contact` section
  - show loading indicator, when contact gets invited
- add technical info section to `settings` dapp

### Fixes
- fix e-mail invitation
- fix `profile.vue` overwrites translations of `wallet`
- add support for custom dispatcher step and status translations
- scope `read-mail-count` to identity

### Deprecations

## Version 5.0.1
### Features
- use new `@evan.network/ui-dapp-browser`
- use activeIdentity
- be able to use `@evan.network/api-blockchain-core`  with identities
- automatic useIdentity detection
- dapps
  - add `ui-session` for handling logged in users
  - add `olddappbrowser.evan` dapp, to enable backwards compatibility
  - `digital-twin-detail`
    - add address to twin detail
  - add `settings` dapp
    - includes private / encryption key export
    - includes runtime config export
    - includes browser settings
- core
  - add new sidebar / bottom bar design with active identity display
- add DID Document section to profile DApp
- libs
  - add `vee-validate` as dapp library (`validate.vee.libs`)
- use identity for profile encryption salting
- seperate `payment.evan` dapp
  - moved eve top up / eve sent to seperate dapp
  - payment channel handling and status display for ipfs payment channels

### Fixes
- Last transactions for twins created by identities are now appearing
- fix old-dapp-browser `createDefaultRuntime` without initial created core runtime
- fix profile design
- fix login for rly old profiles


## Version 4.0.1
- general bug fixes and small improvements

### Features
- dapps
  - `digital-twin-detail`
    - add UI for twins where current user has no or only partial permissions

### Fixes
- dapps
  - `onboarding.vue`
    - allow contact accept after `sign-up` / `sign-in` / already logged in account
    - fix `sign-up` password repeat checks

### Deprecations
- core
  - `ui.libs`, `evancore.vue.libs`
    - remove `.evan-nav-list` css class in favor of `<evan-nav-list>` component


## Version 4.0.0
### Features
- combine vue, core, dapps and e2e tests within this project
- add`i18n-ajv` library
- general performance increase of dapp loading
- core
  - add `bootstrap.vue.libs` (v2.1.0)
    - add bootstrap-vue import and expose it as dapp (currently only TableLitePlugin, TablePlugin, TableSimplePlugin exported)
  - `evancore.vue.libs` (v1.10.0)
    - add `callbackUrl` support for `Dispatcher`, so user will get sticky toast to open this url when dispatcher finished
  - `ui.libs`
    - add `profileUtils` with new functions `getUserAlias`, `getUserAliasFromAddress`, `getProfileType`, `getProfileTypeIcon`

### Fixes
- fix browserify map files
- dapps
  - `profile.vue` (v3.5.1)
    - fix sharing sidebar removes contact selection on permission checkbox select
  - `onboarding.vue` (3.3.1)
    - onboarding formulars exceeded screen width on small devices
- core
  - `evancore.vue.libs` (v1.10.0)
    - fix unchecking all read properties are not unchecking all readWrite fields in `evan-permission-editor`

### Deprecations
- core
  - `evancore.vue.libs` (v1.10.0)
    - disable default contract address routing detect, can be enabled by passing `contractRouting` to vueCore initialization
  - `ui.libs`
    - add `downloadObject` function
- dapps
  - remove old digital twins dapps
  - `digital-twin-lib` (v2.0.0)
    - refactor old digital twin lib for new twin functions

# Archived repository history
DApps were previously organized in several github projects. Please have a look at the following projects for previous dapp versions:

- [ui-core](https://github.com/evannetwork/ui-core)
- [ui-core-dapps](https://github.com/evannetwork/ui-core-dapps)
- [ui-vue](https://github.com/evannetwork/ui-vue)

## [ui-core](https://github.com/evannetwork/ui-core)

### Version 1.12.0
#### Features
- `@evan.networtk/api-blockchain-core-browserified` (v2.15.0)
- `@evan.networtk/smart-contracts-core-browserified` (v2.7.0)

#### Fixesx
- `@evan.network/ui-libs` (v1.8.0)
  - hide optional text from formulars, when transparent mode is enabled
  - add `bccUtils` and `getUserAlias` function
  - update toast design
  - use `red` as `danger` color
- `qrcodejs.libs` (v1.0.0)
  - add qrcodejs lib
- `evan.bootstrap.libs`
  - add `text-red` class


### Version 1.11.0
#### Features

#### Fixes
- `@evan.network/ui-libs` (v1.8.0)
  - hide optional text from formulars, when transparent mode is enabled
  - add `bccUtils` and `getUserAlias` function
  - update toast design
  - use `red` as `danger` color
- `qrcodejs.libs` (v1.0.0)
  - add qrcodejs lib
- `evan.bootstrap.libs`
  - add `text-red` class

#### Deprecations


### Version v1.10.0
#### Features
- `@evan.networtk/api-blockchain-core-browserified` (v2.14.0)
- `@evan.network/ui-countries` (v1.1.0)
  - restrict countries to only eu countries
- `@evan.network/ui-libs` (v1.7.3)
  - style btn-icon-primary

#### Fixes
- update gulp build scripts to be compatible node 12
- fix smart-contracts-browserified compilation


### Version (v1.9.0)
#### Features
- `@evan.network/ui-countries` (v1.0.0)
  - add countries dapp that includes all iso countries and it's translations
  - adjust `text-muted` to `#a2b0b4`
  - fix `Dispatcher` and `Queue` logic for Microsoft `Edge browser`
  - add `resizeImage` to `FileHandler`
- `meterialicons.libs` (v4.4.0)
  - update `@mdi/font` to version 4.4.0
- `@evan.networtk/api-blockchain-core-browserified` (v2.13.0)

#### Fixes
- remove custom agpl appendix


### Version 1.8.0
#### Features
- `@evan.network/ui` (v1.7.1)
  - add new dapp-wrapper design for small left panel
  - add new tooltip design
  - add `.evan-swipe-panel` class
  - add new button designs
  - add new `.nav-list` design
  - add `toasted` design
  - add `.evan-card` design
  - add `xxl` and `xxxl` breakpoint for bootstrap
  - add `evan-form` style
- `@evan.network/api-blockchain-core-browserified` (v2.12.0)
- `@evan.network/smart-contracts-core-browserified` (v2.6.1)


### Version 1.7.1
#### Features
- `@evan.network/api-blockchain-core` (v2.11.0)
- `@evan.network/smart-contracts-core` (v2.6.0)

#### Fixes
- `@evan.network/ui` (v1.7.1)
  - add correct `line-height` to `evan-dropdown` children
  - add `scrypt` adjustments for `browserify` build
- increase build time for dapp only apps that does not needs a d.ts file


### Version 1.7.0
#### Features
- update versions of `lodash`, `ts-node`, `typescript`
- `ui.libs`
  - add `evan-highlight` support for `bg-level-2`
  - add plus svg icon
  - add styling for `btn-outline-primary`
  - add correct `a.text-link` style
  - add correct `.bold` style
  - add correct `.emphasized` style
- `evan.bootstrap.libs`
  - add css variable support for `input-placeholder-color`


### Version 1.6.0
#### Features
- add `testcore.svg`

#### Fixes
- `ui.libs`
  - add correct tooltip design
  - add more tooltip css variables
  - fix link button primary text-color
  - fix .border.border-sm
  - use correct theme colors (cyan, dark)
- `evan.bootstrap.libs`
  - add more tooltip css variables


### Version 1.5.0
#### Features
- update bcc and smartcontracts version

#### Fixes
- `ui.libs`
  - add table hover class
  - fix steps for only a few steps
  - fix tabs `z-index`


### Version 1.4.0
#### Features
- `ui.libs`
  - add split `evan-table` from `evan-flex-style` style
  - add `responsive-table`, `no-wrap`, `static-first` classes to `table`
  - add `cloneDeep`
  - exclude files from `deepEqual` checks

#### Fixes
- `ui.libs`
  - dapp-wrapper flex overflow horizontal sizing


### Version 1.3.2
#### Features
- `ui.libs`
  - add correct `dapp-wrapper-level-2` responsive style
  - add `responsive-table` class to `evan-flex-table`


### Version 1.3.1
#### Fixes
- `ui.libs`
  - correct steps style
  - fix `dapp-wrapper-sidebar-2` style on small devices


### Version 1.3.0
#### Features
- `ui.libs`
  - add `bg-gray` class
  - add new stepper style
  - add correct styling to `overflow-multiline`
    - add `line-1`, `line-2`, `line-3`, `line-4` class support
    - add `bg-level-1`, `bg-level-2`, `bg-level-3` support
  - add tabs animation design and correct height

#### Fixes
- `ui.libs`
  - fix tooltip position in small containers


### Version 1.2.0
#### Features
- `ui.libs`
  - add tooltip stylings
  - add `btn-tertiary` style
  - add `dapp-wrapper-header` style
  - add `under-construction.svg`
  - add `tabs` colors
  - add `mini` class to buttons
  - add `border-smooth` class
  - load `Dispatcher` definition from original ens address before starting

#### Fixes
- rename dapp containers for `@evan.network/api-blockchain-core` and `@evan.network/smart-contracts-core` to end with `-browserfied`
- add support for using `bcc` and `smartcontracts` to run without `ui-dapp-browser`
- `evan.bootstrap.libs`
  - fix tooltip design


### Version 1.1.0
#### Features
- add material icons as `materialicons.libs` dapp
- add moment js as `moment.libs` dapp
- add lodash js as `lodash.libs` dapp
- use correct font-sizes
- `ui.libs`
  - add file handling
  - add correct open sans
  - Add correct table layout; add tabs layout; add correct typography
  - fix breadcrumb design
- `evan.bootstrap.libs`
  - fix loading symbols wrapped in flex containers


### Version 1.0.0
#### Features
- add browserify builds
- add dapp lib builds for `@evan.network/api-blockchain-core` and `@evan.network/smart-contracts-core`
- add `d3.libs`
- add `dexie.libs`
- add `evan.bootstrap.libs`
- add `fontawesome.libs`
- add `themify.libs`
- add `ui.libs`


## [ui-vue](https://github.com/evannetwork/ui-vue)

### Version 1.9.0
#### Features
- `evancore.vue.libs` (v1.9.0)
  - add required flag to `evan-control`
  - add configurable `no-contacts` text to the `evan-permission-editor`
  - add `evan-wallet` component
  - added `evan-qr-code` component
  - add `mail` toast message
  - add hint to `evan-control`
  - add `evan-form-control-textarea`
  - add `mnemonic-export` component ui after onboarding
  - add `closeAction` parameter to `evan-modal`
  - add `evan-form-control-countries` component as predefined `v-select` component
  - make `evan-base-list` item `isSelectedCallback` and `itemClickedCallback` functions optional

#### Fixes
- `evancore.vue.libs` (v1.9.0)
  - fix `evan-control` without label width
  - add correct `evan-button` href handling
  - fix `evan-dapp-loader` loading symbol is removed
  - disable number input select option
  - fix `profile-preview` for foreign profiles

#### Deprecations
- `evancore.vue.libs` (v1.9.0)
  - remove company name from registration entry


### Version 1.8.0
#### Features
- `evancore.vue.libs` (v1.8.0)
  - add `enableCancel` parameter to forms
  - add `evan-form-control-checkbox` component with custom checkbox styles
  - add `evan-permissions` component to handle permissions UI for single data set
  - add `evan-permissions-editor` component to handle permissions UI for a set of data sets
  - allow functions in `evan-steps` disabled steps
  - add `editable` and `shareable` flag to formulars
  - add swipe panel event handling and persistent `mountId` management

#### Fixes
- `evancore.vue.libs` (v1.8.0)
  - fix profile preview default design
  - add vuex store for handling uiStates
- update gulp build scripts to be compatible node 12


### Version 1.7.0
#### Features
- `evancore.vue.libs` (v1.7.0)
  - add automatic vue dispatcher handling that fills `vuex` store
  - add `v-select` form control for inputs and options selection as well
- `select.vue.libs` (v3.2.0)
  - added [v-select](https://vue-select.org/) as dapp library

#### Fixes
- `evancore.vue.libs` (v1.7.0)
  - add card `icon` to overwrite default one
  - set card `highlight` property's default value to false
  - better profile img style
- remove custom agpl appendix


### Version 1.6.0
#### Features
- `evancore.vue.libs` (v1.6.0)
  - `evan-dropdown` allows inner `customStyle` param (left, right props are removed)
  - new `dapp-wrapper` design
  - support `multiline` property in tooltips
  - add default `<slot>` for `evan-dapp-wrapper-level-2` so template container do not must be used
  - new components
    - `evan-button` to handle generalized boostrap button definitions
    - add `nav-list` component for using easy navigation in `evan-dapp-wrapper-level-2`
    - `evan-swipe-panel` to animate side content
    - `evan-profile-preview` to show account name and it's type
    - `evan-account-address` to show account address with generalized interactions
    - `evan-steps` to show step by step content
    - `evan-card` to show generalized cards with highlight parameters
    - `evan-form` components
      - `evan-form`
      - `evan-control-input`
      - `evan-control-select`
      - `evan-control-files`
  - add `vue-toasted` and show toast messaged for address copy and running dispatchers


### Version 1.5.0
#### Features
- `evancore.vue.libs`
  - add `right` / `left` property to `DropdownComponent`
  - check for browser support and block not supported browsers
  - add `agent-executor` provider support
- increase build time for dapp only apps that does not needs a d.ts file


### Version 1.4.0
#### Features
- update versions of `lodash`, `typescript`
- `evancore.vue.libs`
  - add `evan-test-mode` local storage configuration and extend `EvanComponent` with `testtestMode` flag

#### Fixes
- `evancore.vue.libs`
  - remove organizations as default dapp
  - fix `nav-tabs` active recognition for nested routes loaded within tabs


### Version 1.3.0
#### Features
- `evancore.vue.libs`
  - add organizations as default dapp
  - add missing id's for login tests


### Version 1.2.4
#### Fixes
- `evancore.vue.libs`
  - fix `evan-dapp-wrapper` new mail reload time interval and flickering notification icon


### Version 1.2.3
#### Fixes
- `evancore.vue.libs`
  - fix `evan-dapp-wrapper` level 2 responsive


### Version 1.2.2
#### Fixes
- `evancore.vue.libs`
  - move mail loading indicator into dropdown
  - only register components one time and do not overwrite previous one
  - `evan-files` correct file batch text-overflow
  - `EvanForm` validate formular after all values were set, not during initial set
  - fix `dapp-wrapper-sidebar-2` style on small devices


### Version 1.2.1
#### Features
- `evancore.vue.libs`
  - add `modalClasses` param to `EvanModal` so each modal part class can be disabled
  - add `$emit('init')` to `evan-nav-tabs`
  - add `$emit('init')` to `evan-modal`

#### Fixes
- `evancore.vue.libs`
  - fix endless mail loading in `DAppWrapper`
  - fix `evan-files` remove file reloads page
  - send `change` event when removing a file from `evan-files` component


### Version 1.2.0
#### Features
- `evancore.vue.libs`
  - add `evan-tooltip` component
  - `evan-loading`
    - add className
  - Add `.vue` namespace to core vue dapps, so vue versions and angular versions exists side by side
  - adjust breadcrumb back button
  - `dapp-wrapper`
    - add `content-header` slot
  - `breadcrumbs`
    - `attachToDAppWrapper` param to host breadcrumbs add to level over `dapp-wrapper-sidebar-2`
    - add `ignored` array to remove blank path's from breadcrumbs
  - add `under-development` component
  - add `nav-tabs` component
  - add `renderOnlyContent` param to `evan-breadcrumb` to disable the dropdown functionality
    (used to handle dropdowns and single buttons within the same component)
  - add `baseUrl` to dapp routing definition


### Version 1.1.0
#### Features
- show warning icons on dispatcher errors
- add `recovery url` mechanism
- `evan-file` component
- Add modal Prop maxWidth prop
- add html id selectors to `dapp-wrapper`, `file-input`, `evan-modal`

#### Fixes
- use material icons for vue dapps
- do not use contract address for dapp routings
- fix dapp-loader getNextDApp clear previous container
- allow empty content for dapp-wrapper-level-2
- fix routing redirect path fil…
- fix mutation observer for vue instance destroy
- Add vuex.i18n fallback language
- add decodeURIComponent to breadcrumb titles


### Version 1.0.0
#### Features
- initial version
- add vue dependency libraries
- add `evancore.vue.libs` library to handle vue dapp creation


### [ui-core-dapps](https://github.com/evannetwork/ui-core-dapps)
### Version 3.12.0
#### Features
- `onboarding.vue` (v3.3.0)
  - add onboarding with twin creation
  - add new images and texts to onboarding
  - new order for company profile creation
  - hide company registration form in onboarding for non german companies
- `profile.vue` (v3.5.0)
  - add eve sending
  - add wallet page
  - move profile switch to profile detail page

#### Fixes
- `profile.vue` (v3.5.0)
  - fix company contact control order
  - fix i18n texts
- `onboarding.vue` (v3.2.1)
  - change terms of use and captcha checkbox
- `addressbook.vue` (v3.1.2)
  - contact click redirects to profile detail
  - fix "ugly" eve number input
  - fix i18n texts
- `mailbox.vue` (v3.3.1)
  - fix open attachment for comKeys

#### Deprecations
- `onboarding.vue` (v3.3.0)
  - remove company name from registration entry


### Version 3.11.0
#### Features
- use `user` profile instead of `unspecified`
- `profile.vue` (v3.4.0)
  - add sharing for profile categories
  - use correct route handling
  - add verification detail side panel
  - make company form data components usable from extern
  - support that external profiles can opened
- `onboarding.vue` (v3.2.0)
  - add company account type creation
- `addressbook.vue` (v3.1.1)
  - fix empty alias contact loading

#### Fixes
- update gulp build scripts to be compatible node 12


### Version 3.10.0
#### Features
- add v-select form control for inputs and options selection as well

#### Fixes
- `onboarding.vue` (v3.1.1)
  - new login paste logic
  - style optimizations
- `profile.vue` (v3.3.0)
  - profile type handling
  - profile data management
  - profile img handling
- `components.vue` (v0.0.2)
  - add swipe panel sample
  - add v-select sample
- remove custom agpl appendix


### Version 3.9.0
#### Features
- use new color specifications
- `organizations` (moved to profile.vue)
  - only allow `pdf` files for notary identification
  - add file rename hint
  - add mainnet account
  - move organizations dapp to `profile.vue.evan`
- add `explorer.vue`, `verifications.vue` and `help.vue` dapps (v0.0.1)
- `dashboard.vue` (v3.2.0)
  - move docs components to `help.vue`
- `digital-twin.data-container` (v1.8.2)
  - use correct step active class
- `components.vue` (v0.0.1)
  - add dapp for displaying evan components
- `profile` (v1.6.0)
  - add updates for customer country based vat checks
- `onboarding.vue` (v3.1.0)
  - add new onboarding design

#### Fixes
- `organizations` (moved to profile.vue)
  - use new `getSmartAgentAuthHeaders` to build `EvanAuth` header for smart-agent requests
  - fix steppers
- `profile` (v1.6.0)
  - use new `getSmartAgentAuthHeaders` to build `EvanAuth` header for smart-agent requests


### Version 3.7.1
#### Fixes
- `addressbook.vue` (3.1.1)
  - do not try to display verifications for email addresses
- `digital-twin.data-container` (1.8.1)
  - fill empty `type` in plugin template before creating `DataContainer`
- `favorites` (3.0.2)
  - fix `popover-content` size of favorite action callouts
- `organization` (1.2.1)
  - change wordings, make headlines bold, show request button also in testmode
  - better help dialog
- `profile` (1.5.1)
  - SEPA i18n and styling fixes
- `terms-of-use` (1.6.1)
  - fix typo of testnet terms of use
- add missing dependencies (`@evan.network/ui`, `@evan.network/ui-vue-core`)
- increase build time for dapp only apps that does not needs a d.ts file


### Version 3.7.0
#### Features
- update versions of `lodash`, `typescript`
- `dashboard.vue`
  - add new dashboard cards
- `terms-of-use`
  - add updated terms of use
- `mailbox.vue`
  - add new entry for accepting verifications
- `digitaltwin`, `digital-twin.data-container`, `digital-twin-lib`
  - remove defined factory contract addresses for `DigitalTwin` and `Container` creation and use default ens addresses
  - use environment specific links for `technical` detail view
- `organizations`
  - allow private / public files for identification verification issuing
  - split `issued` and `finished` state, so the user do not must enter his mailbox
  - add correct state management and reloading logic
- `explorer`
  - fix base contract details loading for `web3 beta 55`
- `task`
  - fix contract state handling for `web3 beta 55`
- `profile.vue`
  - add `organizations` tab

#### Fixes
- `organizations`
  - update UI with additional feedback
  - add error handling for identification overview
  - fix typos
- `ensmanagement`
  - use `evan` as root address and default `ens resolver` for mainnet
- `mailbox.vue`
  - add missing translations


### Version 3.6.0
#### Features
- `organizations`
  - add organizations dapp, including identification handling
- `explorer`
  - fix general page blockchain explorer links
- `dashboard.vue`
  - add testnet link for mainnet dashboard overview


### Version 3.5.0
#### Features
- `addressbook.vue`
  - add correct addressbook vue design
  - add missing invitation logic
  - add dispatcher logic
- `favorites.vue`
  - add new design for favorites
- `mailbox.vue`
  - switch to tabs
- `profile.vue`
  - add profile details (alias, accountId balance) and application settings (language, dev-mode, dev-dapps-domain)
- `dashboard.vue`
  - add tabs for docs navigation
  - fix overview addressbook link
- `datacontainer.digitaltwins`
  - add img display for string ajv fields

#### Fixes
- `datacontainer.digitaltwins`
  - fix `Container` detail entry switching
  - fix sharing `loadForAccount` key
  - fix `Container` dbcp saving flag
  - add `containerAddress` and `twinAddress` to the share b-mail


### Version 3.4.0
#### Features
- add basic `technical-detail` component to `datacontainer.digitaltwins` and `digitaltwin`
- `datacontainer.digitaltwins`
  - add data container ajv object fields
  - add `permissions` component to `DataContainer` and `DigitalTwin`
  - add advanced sharing dialog including custom `b-mail` body
  - load dbcp title for `addresses` in text fields

#### Fixes
- `datacontainer.digitaltwins`
  - fix `schema` / `value` caching and saving
  - fix list entries permission checks and paging
  - remove obsolete `under development` tabs
  - use `deepClone` instead of `JSON.parse(JSON.stringify())` and ignore files
  - fix translations
  - use horizontal scrollable tables
  - fix active tree entries
- `favorites.vue`
  - add temporary lindig icon color invert


### Version 3.3.1
#### Features
- `datacontainer.digitaltwins`
  - add links to `datacontainer` `entries` for `string fields`
- `favorites`
  - add `dashboard` and `dashboard.vue` as featured dapps

#### Fixes
- `datacontainer.digitaltwins`
  - fix empty min / max values
  - add responsive table class to `ajv` edit
  - fix list entry default value
  - add permission restrictions for `digitaltwins`, `context-menus`, `lists`
  - add missing entry texts

#### Deprecations
- `dashboard.vue`
  - disable recoveryModal
- `digitaltwins`
  - disable last opened twins

### Version 3.3.0
#### Features
- `digitaltwin`
  - add `do not ask again` to `Create Digital Twin` submit dialog
- `datacontainer.digitaltwins`
  - add plugin export / import
  - min, max values for ajv schema definitions
  - correct field validation using min max values
  - add `dc-field-boolean` field

#### Fixes
- `datacontainer.digitaltwins`
  - `Container` save dispatcher do not load full plugin and check for changes, provide changes directly from the UI code to the dispatcher to increase load times
  - fix create stepper disabled status
  - multiple b-mail sharing texts
  - `ajv-values` show labels and values in the same line
  - fix list entries reloading
  - add `hideSidebar2` to `sidebar-level-2` tree links


### Version 3.2.0
#### Features
- `digitaltwins`
  - move open twin and create twin to modal dialog
  - add context menu to twins, plugins overview
  - ask before toggle twin favorite
- `datacontainer.digitaltwins`
  - add new `UiContainer` structure including easy data loading update watching
  - remove flex-truncate and add correct text-overflow logic
  - add `dc-ajv-values` component for displaying ajv formular without schema specifications
  - add editSchema for splitting schema mode and value view mode
  - move plugin default values to dataSchema `default` property
  - add plugin selection as first page on creating a new `plugin` / `container` / move dbcp edit to create steps
  - add seperated value / schema view for `twin.container.entries`
  - disable default values for files
  - add context menu to containers, sets overview
  - add plugin delete
- `mailbox`, `mailbox.vue`
  - add attachments of type `url`

#### Fixes
- `datacontainer.digitaltwins`
  - remove flex-truncate and add correct text-overflow logic
  - fix plugin creation and saving
  - fix creation steps and validity checks
  - fix dataContainer.defaultSchema is used without copying
  - fix plugin sharing
  - fix reactive files
  - fix `Container` file caching and changes checks


### Version 3.1.0
#### Features
- Add `.vue` namespace to core vue dapps, so vue versions and angular versions exists side by side
  - dashboard.vue.evan
  - addressbook.vue.evan
  - favorites.vue.evan
  - mailbox.vue.evan
  - profile.vue.evan
- `termsoufuse`
  - use latest terms of use and data protection specifications
- `digitaltwin.lib`
  - add global repo for shared twin sources
  - add `dt-bread` component for ignoring breadcrumb paths
  - add `dt-dbcp` component for editing dbcp
  - move `UIDigitalTwin` from `digitaltwin` to `digitaltwin.lib` dapp
  - move utils from `digitaltwin` and `datacontainer.digitaltwin` dapp to `digitaltwin.lib` dapp
  - add `tree-root-component` for displaying dt, dc, plugin left tree top with same logic
  - add components for displaying standalone data-sets
  - add seperated actions components for sets, plugins and containers

#### Fixes
- `vue dapps`
  - disable left panel for standalone dapps
- `digitaltwins`, `datacontainer.digitaltwins`
  - use correct html selector id's
  - reorder twin overview and template overview
- `digitaltwin`
  - standalone `dt-create` page
  - overwork dt-edit page
    - move dbcp edit to modal
    - move ens map to modal
    - add detail tabs for future features
    - map containers overview to dt-edit sub navigation
  - add `dt-actions-component`
  - add new tree side panel
- `datacontainer.digitaltwins`
  - `ajv-editor` use `parseFieldValue` value on save
  - increase `ajv-editor` name td size to 300px

#### Deprecations
- `digitaltwins`, `datacontainer.digitaltwins`
  - rename `templates` to `plugins`


### Version 3.0.0
#### Features
- fix `vue` dapps font-sizes and alignments
- `dashboard`
  - use evan images for dashboard start page
- `mailbox`
  - add dispatcher for mailbox attachments
- `digitaltwin`
  - restructure digital twins ui
  - add ens address mapping on twin create
  - `ens-form` refactoring
  - add html selector id's
- `datacontainer.digitaltwin`
  - correct data container formular handling (entries / containers can only be saved when the full formular is valid)
  - add file handling
  - add correct container link logic
  - add html selector id's

#### Fixes
- fix `vue` dapps font-sizes and alignments


### Version 2.1.0
#### Features
- use correct imports for evan.network projects (e.g. replace `import * as bcc from 'bcc'` with `import * as bcc from '@evan.network/api-blockchain-core;`)
- support `iconic` and evan.network angular dapps wrapped in `.evan-angular` class
- load terms of use from external `termsofuse.evan` dapp
- onboarding
  - add `termsofuse` dapp
- verifications
  - support ENS addresses
- profile
  - add payment channel management
  - credit card eve buy process


### Version 2.0.0
#### Features
- onboarding
  - add mainnet text switches
- profile
  - new profile start page
  - send eve from profile

#### Fixes
- dashboard
  - fix opening of standalone dapps from sidepanel
- verifications
  - remeber latest selected claim topics and account ids
  - support verifications for contracts
  - use EvanAddressInput component for verifications dappp

#### Deprecations
- rename verifications to verifications
- onboarding
  - moved `createIdentity` to smart-agent profile creation logic


### Version 1.7.0
#### Features
- onboarding
  - move sendCommKey to onboarded page
- onboarding
  - add salting for encryptionKeys accountId + password
- ens management DApp
- explorer
  - is now includable as a library
- add missing dbcpVersion to dbcp files
- add licenses to dbcp files

#### Fixes
- addressbook
  - fix add account using accountId, when e-mail address is added
- onboarding
  - navigate to onboarded page, even if the user is currently logged in
  - fix toggle light theme design


### Version 1.6.0
#### Features
- verifications
  - add claimId to accept / delete claim
- ens-selling
  -  add the ens selling DApp

#### Fixes
- addressbook
  - fix contact creation using email address
- explorer
  - fix cannot opening address without dbcp


### Version 1.5.0
#### Features
- addressbook (Version 1.3.1)
  - add profile activated verifications display
- verifications (Version 1.0.0)
  - overview DApp (topic inspect, user inspect) including identity creation
- explorer (Version 1.3.0)
  - add detailed verifications view for the opened address
- mailbox (Version 1.3.2)
  - add profile activated verifications display
- onboarding (Version 1.3.0)
  - create identity for new profile
- profile (Version 1.5.0)
  - new design
  - activated verifications management and display

#### Fixes
- mailbox
  - allow only one line preview of mail bodies in overview


### Version 1.4.0
#### Features
- addressbook
  - add new styling
  - add manual contact grouping
- profile
  - theme selection
- support light theme

#### Fixes
- favorites
  - trim spaces at start and end by adding new favorites, don't use toLowerCase on ens addresses
- task
  - use correct button style for create task
- demo-management
  - use correct ens addresses after rental demo was created
  - use correct bookmark definition for favorites
- onboarding
  - fix onboarding mail invitation by user import


### Version 1.3.0
#### Features
- mailbox: add fullPath property to mailbox contract attachments to overwrite bc + contract url path opening
  - add storeKey / storeValue for contract mail attachments
  - be able to pass contract attachment without business center
  - new design
  - create new mails using UI
- Add new build job so each can dapp decide for its own, which build job should be used
- add demo-management DApp


### Version 1.2.1
#### Features
- explorer: be able to analyse root DApps (favorites.evan)
- profile: add `evan-dev-dapps-domain` configuration

#### Fixes
- fix goBack history stacking for mailbox contract opening and explorer `openRootDApp`


### Version 1.2.0
#### Fixes
- fix dapp-wrapper title i18n within all dapps
- explorer: load ens addresses without an underlaying contract and only with dbcp
- mailbox: fix mailbox paging


### Version 1.1.0
#### Fixes
- Remove deployment description and move it to the evan.network wik


### Version 1.0.2
#### Features
- enable / disable notifications
- adjust favorites / addressbook big screen search

#### Fixes
- add AsyncComponent to handle correct async OnInit and OnDestroy methods
- use lowercased ens addresses
- add explorer to featured dapps
- rename ui-core-dapps


### Version 1.0.1
#### Features
- use @evan.network for package name and dependencies scopes
- add .npmignore
- remove build jobs for core modules and move them dev-environment
- rename *contractus* variables to *evan*
- rename bcc-core bundle to bcc
  - rename BCCCore to CoreRuntime
  - rename BCCProfile to ProfileRuntime
  - rename BCCBC to BCRuntime
- add code documentation
- remove angular-bc
- add logging dapp


### Version 0.9.0
- initial version

