# ui-vue-core

The ui-vue-core for evan.network includes specific vue components, helper functions and utilities. By using the vue initialization helper functions, it's very easy to setup a vue application including everything:

- features
  - global vue components
  - i18n
  - routing
  - Form building
  - evan.network blockchain-core runtime integration
  - DApp initialization && nested DApp loading
  - Sidebar integrations
  - login / logout mechanisms
- documentation
  - How to use it for creating DApps: [Wiki](https://evannetwork.github.io/docs/developers/ui/vue.html)
  - [UI API Doc](https://ui-docs.readthedocs.io/en/latest/vue/evancore.vue.libs.html)
  - Reference Projects:
    - [addressbook.vue](https://github.com/evannetwork/ui-dapps/tree/master/dapps/addressbook.vue)
    - [digital-twin-detail](https://github.com/evannetwork/ui-dapps/tree/master/dapps/digital-twin-detail)
    - [digital-twin-lib](https://github.com/evannetwork/ui-dapps/tree/master/dapps/digital-twin-lib)
    - [favorites.vue](https://github.com/evannetwork/ui-dapps/tree/master/dapps/favorites.vue)
    - [mailbox.vue](https://github.com/evannetwork/ui-dapps/tree/master/dapps/mailbox.vue)
    - [onboarding.vue](https://github.com/evannetwork/ui-dapps/tree/master/dapps/onboarding.vue)

## Installation
```sh
npm i @evan.network/ui-vue-core
```

## Usage
The [vue-core.ts](https://github.com/evannetwork/ui-vue/blob/master/dapps/evancore.vue.libs/src/vue-core.ts) is the main entry point for all vue applications. For a detailed usage explanation have a look at the [evannnetwork wiki](https://evannetwork.github.io/docs/developers/ui/vue).

```ts
import Vue from 'vue';
import { initializeVue } from '@evan.network/ui-vue-core';

import Main from './components/root/root.vue';
import translations from './i18n/translations';
import routes from './routes';
import components from './components/registry';

export async function startDApp(container: any, dbcpName: any, dappEnsOrContract: any, dappBaseUrl: any) {
  await initializeVue({
    components,
    container,
    dappBaseUrl,
    dappEnsOrContract,
    dbcpName,
    RootComponent: Main,
    routes,
    state: { },
    translations: translations,
    Vue: Vue,
  });
}

```

## HTML Selectors for tests
### dapp-wrapper
- #dapp-home
- #dapp-digitaltwins
- #dapp-favorites
- #dapp-addressbook
- #dapp-mailbox
- #dapp-faq
- #dapp-documentation
- #toggle-sidebar

- #dropdown-mailbox
  - #dapp-mailbox
  - #dropdown-mailbox-${ index }

- #dropdown-queue
  - #dropdown-queue-${ index }

- #dropdown-profile
  - #dapp-contacts
  - #dapp-favorites
  - #dapp-mailbox
  - #dapp-profile
  - #logout

### Breadcrumbs
- #breadcrumb-goback

### Modals
- #modal-cancel

### evan-file-input
- #file-input-remove-modal
  - #file-input-remove-accept
  - [Modals](###Modals)
- #file-input-remove
- #file-input-download-${ index }
- #file-input-upload