# evan.network UI

This project is a general container for evan.network ui core projects, DApp libraries and implementations. DApps can be imported using their module name (e.g. `@evan.network/ui`) within nodejs or using the ens address within the `dbcp.json` file ([example](./core/evancore.vue.libs/dbcp.json)).

## Content

All evan.network DApps are separated into to the following categories:

### [Core](./core)

UI core libraries for building ui and vue applications on evan.network.

| module name                        | ens address              |
|:-----------------------------------|:-------------------------|
| @evan.network/ui                   | ui.libs.evan             |
| bootstrap                          | evan.bootstrap.libs.evan |
| @evan.network/evancore.vue.libs    | evancore.vue.libs.evan   |

### [DApps](./dapps)

DApp implementations like Dashboard, Profile, Digitaltwin or Addressbook.

| module name                        | ens address                 |
|:-----------------------------------|:----------------------------|
| ---                                | addressbook.vue             |
| ---                                | assets                      |
| ---                                | components.vue              |
| ---                                | dashboard.vue               |
| ---                                | digital-twin                |
| ---                                | digital-twin.data-container |
| ---                                | digital-twin-lib            |
| ---                                | digital-twins               |
| ---                                | favorites.vue               |
| ---                                | help.vue                    |
| ---                                | mailbox.vue                 |
| ---                                | onboarding.vue              |
| ---                                | profile.vue                 |

### [Evan-Libs](./evan-libs)

DApps for wrapping evan.network core libraries (@evan.network/api-blockchain-core, @evan.network/smart-contracts-core)

| module name                                     | ens address              |
|:------------------------------------------------|:-------------------------|
| @evan.network/api-blockchain-core-browserified  | bcc                      |
| @evan.network/smart-contracts-core-browserified | smartcontracts           |

### [Libs](./libs)

DApps for wrapping UI framework specific libraries (vue, d3, vuex, ...).

| module name                        | ens address              |
|:-----------------------------------|:-------------------------|
| axios                              | axios.vue.libs           |
| bootstrap                          | bootstrap.vue.libs       |
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

- use `yarn` or `npm install`

### Development

- build DApps without serving for changes

```bash
yarn build
```

- start an development server [locally](http://localhost:3000) and watch for changes within DApps

```bash
yarn serve
```

## Deployment

Have a look at the [deployment description](https://evannetwork.github.io/dev/deployment).

## Tests

Currently only [e2e tests](./tests-e2e) are implemented for the DApps. For instructions, please have a look at the separated [readme file](.tests-e2e).

For running the tests you can use the following commands:

```bash
yarn test-local
yarn test-local-only
yarn test-testnet
yarn test-testnet-only
yarn test-testnet-specific
```
