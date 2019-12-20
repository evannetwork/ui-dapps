# evan.network UI

This project is a general container for evan.network ui core projects, dapp libraries and dapp implementations. DApps can be imported using it's module name (like `@evan.network/ui`) within nodejs or using the ens address within the `dbcp.json` file ([sample](./core/evancore.vue.libs/dbcp.json)).

## Whats in?
All evan.network dapps are seperated into to the following categories:

### [core](./core)
UI core libraries for building ui and vue applications on evan.network. 

| module name                        | ens address              |
|:-----------------------------------|:-------------------------|
| @evan.network/ui                   | ui.libs.evan             |
| bootstrap                          | evan.bootstrap.libs.evan |
| @evan.network/evancore.vue.libs    | evancore.vue.libs.evan   |

### [dapps](./dapps)
DApp implementations like Dashboard, Profile, Digitaltwin or Addressbook.

| module name                        | ens address                 |
|:-----------------------------------|:----------------------------|
| ---                                | addressbook.vue             |
| ---                                | assets                      |
| ---                                | components.vue              |
| ---                                | dashboard.vue               |
| ---                                | digital-twin                |
| ---                                | digital-twin.data-container |
| ---                                | digital-twin.lib            |
| ---                                | digital-twins               |
| ---                                | favorites.vue               |
| ---                                | help.vue                    |
| ---                                | mailbox.vue                 |
| ---                                | onboarding.vue              |
| ---                                | profile.vue                 |

### [evan-libs](./evan-libs)
DApps for wrapping evan.network core libraries (@evan.network/api-blockchain-core, @evan.network/smart-contracts-core)

| module name                                     | ens address              |
|:------------------------------------------------|:-------------------------|
| @evan.network/api-blockchain-core-browserified  | bcc                      |
| @evan.network/smart-contracts-core-browserified | smartcontracts           |

### [libs](./libs)
DApps for wrapping UI framework specific libraries (vue, d3, vuex, ...).

| module name                        | ens address              |
|:-----------------------------------|:-------------------------|
| axios                              | axios.vue.libs           |
| boostrap                           | boostrap.vue.libs        |
| countries                          | countries.libs           |
| d3                                 | d3.libs                  |
| dexie                              | dexie.libs               |
| fontawesome                        | fontawesome.libs         |
| i18n                               | i18n.vuex.libs           |
| leaflet                            | leaflet.vue.libs         |
| lodash                             | lodash.libs              |
| materialicons                      | materialicons.libs       |
| moment                             | moment.libs              |
| moment                             | moment.vue.libs          |
| qrcodejs                           | qrcodejs.libs            |
| recaptcha                          | recaptcha.vue.libs       |
| router                             | router.vue.libs          |
| select                             | select.vue.libs          |
| themify                            | themify.libs             |
| toasted                            | toasted.vue.libs         |
| vue                                | vue.libs                 |
| vuex                               | vuex.libs                |

## Usage
### Install
- use `yarn install` or `npm install`

### Development
- start an local development server [locally](http://localhost:3000/dev.html)
```bash
npm run serve
```

- build all dapps
```bash
npm run dapps-build
```

- serve for file change tracking
```bash
npm run dapps-serve
```

## Deployment
Have a look at the [deployment description](https://evannetwork.github.io/dev/deployment).

