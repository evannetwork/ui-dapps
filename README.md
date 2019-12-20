# ui-core
The @evan.network/ui-core is a container for the root evan network libraries and applications.

DApp wrappers for the blockchain core, the smart contracts core, ... are constructed simply, to exclude the wanted library and map the correct original package name. E.g.: The @evan.network/api-blockchain-core library is published using the ens address `bcc.evan`. Within the DBCP of the using DApp, this lib is referenced within the dbcp.json as dependency. Within the application it self, `@evan.network/api-blockchain-core` can be imported normally using `import * as bcc from '@evan.network/api-blockchain-core'`.

- [UI API Doc](https://ui-docs.readthedocs.io/en/latest/core/index.html)

Available libraries:

| original                           | ens address              |
|:-----------------------------------|:-------------------------|
| @evan.network/api-blockchain-core  | bcc.evan                 |
| @evan.network/smart-contracts-core | smartcontracts.evan      |
| @evan.network/ui                   | ui.libs.evan             |
| bootstrap 4                        | evan.bootstrap.libs.evan |
| d3                                 | d3.libs.evan             |
| dexie                              | dexie.libs.evan          |
| fontawesome                        | fontawesome.libs.evan    |
| themify                            | themify.libs.evan        |

## Install
- use `yarn install` or `npm install`

## UI Development
- build and serve the local dapp serve
- starts an local server at http://localhost:3000/dev.html
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
