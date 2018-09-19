# evan-dapps

## Next Version
### Features
- explorer: be able to analyse root DApps (favorites.evan)
- profile: add `evan-dev-dapps-domain` configuration

### Fixes
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