# evan.network ui-dapps

## Next Version
### Features
- combine vue, core, dapps and e2e tests within this project 

### Fixes

### Deprecations


- [ui-vue](https://github.com/evannetwork/ui-vue)
- [ui-core](https://github.com/evannetwork/ui-core)
- [ui-core-dapps](https://github.com/evannetwork/ui-core-dapps)
- [ui-tests](https://github.com/evannetwork/ui-core-dapps)

# Archived repository history
DApps were previously organized in several github projects. Please have a look at the following projects for previous dapp versions

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


