# ui-core

## Next Version
### Features
- `@evan.network/ui`
  - add new dapp-wrapper design for small left panel
  - add new tooltip design
  - add `.evan-swipe-panel` class

### Fixes

### Deprecations


## Version 1.7.1
### Features
- `@evan.network/api-blockchain-core` Version 2.11.0
- `@evan.network/smart-contracts-core` Version 2.6.0

### Fixes
- `@evan.network/ui` Version 1.7.1
  - add correct `line-height` to `evan-dropdown` children
  - add `scrypt` adjustments for `browserify` build
- increase build time for dapp only apps that does not needs a d.ts file


## Version 1.7.0
### Features
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


## Version 1.6.0
### Features
- add `testcore.svg`

### Fixes
- `ui.libs`
  - add correct tooltip design
  - add more tooltip css variables
  - fix link button primary text-color
  - fix .border.border-sm
  - use correct theme colors (cyan, dark)
- `evan.bootstrap.libs`
  - add more tooltip css variables


## Version 1.5.0
### Features
- update bcc and smartcontracts version

### Fixes
- `ui.libs`
  - add table hover class
  - fix steps for only a few steps
  - fix tabs `z-index`


## Version 1.4.0
### Features
- `ui.libs`
  - add split `evan-table` from `evan-flex-style` style
  - add `responsive-table`, `no-wrap`, `static-first` classes to `table`
  - add `cloneDeep`
  - exclude files from `deepEqual` checks

### Fixes
- `ui.libs`
  - dapp-wrapper flex overflow horizontal sizing 


## Version 1.3.2
### Features
- `ui.libs`
  - add correct `dapp-wrapper-level-2` responsive style
  - add `responsive-table` class to `evan-flex-table`


## Version 1.3.1
### Fixes
- `ui.libs`
  - correct steps style
  - fix `dapp-wrapper-sidebar-2` style on small devices


## Version 1.3.0
### Features
- `ui.libs`
  - add `bg-gray` class
  - add new stepper style
  - add correct styling to `overflow-multiline`
    - add `line-1`, `line-2`, `line-3`, `line-4` class support
    - add `bg-level-1`, `bg-level-2`, `bg-level-3` support
  - add tabs animation design and correct height

### Fixes
- `ui.libs`
  - fix tooltip position in small containers


## Version 1.2.0
### Features
- `ui.libs`
  - add tooltip stylings
  - add `btn-tertiary` style
  - add `dapp-wrapper-header` style
  - add `under-construction.svg`
  - add `tabs` colors
  - add `mini` class to buttons
  - add `border-smooth` class
  - load `Dispatcher` definition from original ens address before starting

### Fixes
- rename dapp containers for `@evan.network/api-blockchain-core` and `@evan.network/smart-contracts-core` to end with `-browserfied`
- add support for using `bcc` and `smartcontracts` to run without `ui-dapp-browser`
- `evan.bootstrap.libs`
  - fix tooltip design


## Version 1.1.0
### Features
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


## Version 1.0.0
### Features
- add browserify builds
- add dapp lib builds for `@evan.network/api-blockchain-core` and `@evan.network/smart-contracts-core`
- add `d3.libs`
- add `dexie.libs`
- add `evan.bootstrap.libs`
- add `fontawesome.libs`
- add `themify.libs`
- add `ui.libs`
