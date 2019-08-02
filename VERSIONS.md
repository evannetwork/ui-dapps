# evan.network ui-core-dapps

## Next Version
### Features
- update versions of `lodash`, `typescript`
- `dashboard.vue`
  - add new dashboard cards
- `terms-of-use`
  - add updated terms of use
- `mailbox.vue`
  - add new entry for accepting verifications
- `digitaltwin`, `digital-twin.data-container`, `digital-twin.lib`
  - remove defined factory contract addresses for `DigitalTwin` and `Container` creation and use default ens addresses

### Fixes
- `organizations`
  - update UI with additional feedback

### Deprecations


## Version 3.6.0
### Features
- `organizations`
  - add organizations dapp, including identification handling
- `explorer`
  - fix general page blockchain explorer links
- `dashboard.vue`
  - add testnet link for mainnet dashboard overview


## Version 3.5.0
### Features
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

### Fixes
- `datacontainer.digitaltwins`
  - fix `Container` detail entry switching
  - fix sharing `loadForAccount` key
  - fix `Container` dbcp saving flag
  - add `containerAddress` and `twinAddress` to the share b-mail


## Version 3.4.0
### Features
- add basic `technical-detail` component to `datacontainer.digitaltwins` and `digitaltwin`
- `datacontainer.digitaltwins`
  - add data container ajv object fields
  - add `permissions` component to `DataContainer` and `DigitalTwin`
  - add advanced sharing dialog including custom `b-mail` body
  - load dbcp title for `addresses` in text fields

### Fixes
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


## Version 3.3.1
### Features
- `datacontainer.digitaltwins`
  - add links to `datacontainer` `entries` for `string fields`
- `favorites`
  - add `dashboard` and `dashboard.vue` as featured dapps

### Fixes
- `datacontainer.digitaltwins`
  - fix empty min / max values
  - add responsive table class to `ajv` edit
  - fix list entry default value
  - add permission restrictions for `digitaltwins`, `context-menus`, `lists`
  - add missing entry texts

### Deprecations
- `dashboard.vue`
  - disable recoveryModal
- `digitaltwins`
  - disable last opened twins

## Version 3.3.0
### Features
- `digitaltwin`
  - add `do not ask again` to `Create Digital Twin` submit dialog
- `datacontainer.digitaltwins`
  - add plugin export / import
  - min, max values for ajv schema definitions
  - correct field validation using min max values
  - add `dc-field-boolean` field

### Fixes
- `datacontainer.digitaltwins`
  - `Container` save dispatcher do not load full plugin and check for changes, provide changes directly from the UI code to the dispatcher to increase load times
  - fix create stepper disabled status
  - multiple b-mail sharing texts
  - `ajv-values` show labels and values in the same line
  - fix list entries reloading
  - add `hideSidebar2` to `sidebar-level-2` tree links


## Version 3.2.0
### Features
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

### Fixes
- `datacontainer.digitaltwins`
  - remove flex-truncate and add correct text-overflow logic
  - fix plugin creation and saving
  - fix creation steps and validity checks
  - fix dataContainer.defaultSchema is used without copying
  - fix plugin sharing
  - fix reactive files
  - fix `Container` file caching and changes checks


## Version 3.1.0
### Features
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

### Fixes
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

### Deprecations
- `digitaltwins`, `datacontainer.digitaltwins`
  - rename `templates` to `plugins`


## Version 3.0.0
### Features
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

### Fixes
- fix `vue` dapps font-sizes and alignments


## Version 2.1.0
### Features
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


## Version 2.0.0
### Features
- onboarding
  - add mainnet text switches
- profile
  - new profile start page
  - send eve from profile

### Fixes
- dashboard
  - fix opening of standalone dapps from sidepanel
- verifications
  - remeber latest selected claim topics and account ids
  - support verifications for contracts
  - use EvanAddressInput component for verifications dappp

### Deprecations
- rename verifications to verifications
- onboarding
  - moved `createIdentity` to smart-agent profile creation logic


## Version 1.7.0
### Features
- onboarding
  - move sendCommKey to onboarded page
- onboarding
  - add salting for encryptionKeys accountId + password
- ens management DApp
- explorer
  - is now includable as a library
- add missing dbcpVersion to dbcp files
- add licenses to dbcp files

### Fixes
- addressbook
  - fix add account using accountId, when e-mail address is added
- onboarding
  - navigate to onboarded page, even if the user is currently logged in
  - fix toggle light theme design


## Version 1.6.0
### Features
- verifications
  - add claimId to accept / delete claim
- ens-selling
  -  add the ens selling DApp

### Fixes
- addressbook
  - fix contact creation using email address
- explorer
  - fix cannot opening address without dbcp


## Version 1.5.0
### Features
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

### Fixes
- mailbox
  - allow only one line preview of mail bodies in overview


## Version 1.4.0
### Features
- addressbook
  - add new styling
  - add manual contact grouping
- profile
  - theme selection
- support light theme

### Fixes
- favorites
  - trim spaces at start and end by adding new favorites, don't use toLowerCase on ens addresses
- task
  - use correct button style for create task
- demo-management
  - use correct ens addresses after rental demo was created
  - use correct bookmark definition for favorites
- onboarding
  - fix onboarding mail invitation by user import


## Version 1.3.0
### Features
- mailbox: add fullPath property to mailbox contract attachments to overwrite bc + contract url path opening
  - add storeKey / storeValue for contract mail attachments
  - be able to pass contract attachment without business center
  - new design
  - create new mails using UI
- Add new build job so each can dapp decide for its own, which build job should be used
- add demo-management DApp


## Version 1.2.1
### Features
- explorer: be able to analyse root DApps (favorites.evan)
- profile: add `evan-dev-dapps-domain` configuration

### Fixes
- fix goBack history stacking for mailbox contract opening and explorer `openRootDApp`


## Version 1.2.0
### Fixes
- fix dapp-wrapper title i18n within all dapps
- explorer: load ens addresses without an underlaying contract and only with dbcp
- mailbox: fix mailbox paging


## Version 1.1.0
### Fixes
- Remove deployment description and move it to the evan.network wik


## Version 1.0.2
### Features
- enable / disable notifications
- adjust favorites / addressbook big screen search

### Fixes
- add AsyncComponent to handle correct async OnInit and OnDestroy methods
- use lowercased ens addresses
- add explorer to featured dapps
- rename ui-core-dapps


## Version 1.0.1
### Features
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


## Version 0.9.0
- initial version