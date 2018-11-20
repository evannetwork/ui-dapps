# evan-dapps

## Next Version
### Features
- Claims overview DApp (topic inspect, user inspect) including identity creation

### Fixes
- mailbox: allow only one line preview of mail bodies in overview

### Deprecations

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

### Deprecations

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

### Deprecations

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