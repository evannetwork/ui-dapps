# ui-vue-core

## Next Version
### Features

### Fixes

### Deprecations


## Version 1.5.0
### Features
- `evancore.vue.libs`
  - add `right` / `left` property to `DropdownComponent`
  - check for browser support and block not supported browsers
  - add `agent-executor` provider support
- increase build time for dapp only apps that does not needs a d.ts file


## Version 1.4.0
### Features
- update versions of `lodash`, `typescript`
- `evancore.vue.libs`
  - add `evan-test-mode` local storage configuration and extend `EvanComponent` with `testtestMode` flag
  
### Fixes
- `evancore.vue.libs`
  - remove organizations as default dapp
  - fix `nav-tabs` active recognition for nested routes loaded within tabs


## Version 1.3.0
### Features
- `evancore.vue.libs`
  - add organizations as default dapp
  - add missing id's for login tests


## Version 1.2.4
### Fixes
- `evancore.vue.libs`
  - fix `evan-dapp-wrapper` new mail reload time interval and flickering notification icon


## Version 1.2.3
### Fixes
- `evancore.vue.libs`
  - fix `evan-dapp-wrapper` level 2 responsive


## Version 1.2.2
### Fixes
- `evancore.vue.libs`
  - move mail loading indicator into dropdown
  - only register components one time and do not overwrite previous one
  - `evan-files` correct file batch text-overflow
  - `EvanForm` validate formular after all values were set, not during initial set
  - fix `dapp-wrapper-sidebar-2` style on small devices


## Version 1.2.1
### Features
- `evancore.vue.libs`
  - add `modalClasses` param to `EvanModal` so each modal part class can be disabled 
  - add `$emit('init')` to `evan-nav-tabs`
  - add `$emit('init')` to `evan-modal`

### Fixes
- `evancore.vue.libs`
  - fix endless mail loading in `DAppWrapper`
  - fix `evan-files` remove file reloads page 
  - send `change` event when removing a file from `evan-files` component


## Version 1.2.0
### Features
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


## Version 1.1.0
### Features
- show warning icons on dispatcher errors
- add `recovery url` mechanism
- `evan-file` component
- Add modal Prop maxWidth prop
- add html id selectors to `dapp-wrapper`, `file-input`, `evan-modal`

### Fixes
- use material icons for vue dapps
- do not use contract address for dapp routings
- fix dapp-loader getNextDApp clear previous container
- allow empty content for dapp-wrapper-level-2
- fix routing redirect path fil…
- fix mutation observer for vue instance destroy
- Add vuex.i18n fallback language
- add decodeURIComponent to breadcrumb titles


## Version 1.0.0
### Features
- initial version
- add vue dependency libraries
- add `evancore.vue.libs` library to handle vue dapp creation
