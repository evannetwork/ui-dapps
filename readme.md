# evan-dapps

## Install
- you very likely will need `nvm` installed
- you definitely need `lerna` and `gulp` installed

```bash
npm install
lerna bootstrap --hoist
```

## Basic Development
- build and serve the local dapp serve
- starts an local server at http://localhost:3000/dev.html
```bash
npm run serve
```

- build all dapps
```bash
npm run dapps-build
```

- serve for change tracking
```bash
npm run dapps-serve
```

## Deployment
Each DApp can be deployed to the evan.network, so it can be accessed from anywhere, not only from a localhost server. This is handle by an wrapped library, to handle the deployment as simple as possible. To deploy your application run the following command. To deploy DApps to ens paths, you need one configuration file, that specifies which accounts and which configurations should be used for the deployment.
This file must be js / json files that exports specific values:

- accounts.js
```js
const bcConfig = {
  nameResolver: {
    ensAddress: process.env.ENS_ADDRESS || '0x937...',
    ensResolver: process.env.ENS_RESOLVER || '0xDC18...',
    labels: {
      businessCenterRoot: process.env.BC_ROOT || 'testbc.test',
      ensRoot: process.env.ENS_ROOT || 'test',
      factory: 'factory',
      admin: 'admin',
      eventhub: 'eventhub',
      profile: 'profile',
      mailbox: 'mailbox'
    },
    domains: {
      root: ['ensRoot'],
      factory: ['factory', 'businessCenterRoot'],
      adminFactory: ['admin', 'factory', 'ensRoot'],
      businessCenter: ['businessCenterRoot'],
      eventhub: process.env.ENS_EVENTS || ['eventhub', 'ensRoot'],
      profile: process.env.ENS_PROFILES || ['profile', 'ensRoot'],
      profileFactory: ['profile', 'factory', 'ensRoot'],
      mailbox: process.env.ENS_MAILBOX || ['mailbox', 'ensRoot'],
    },
  },
  smartAgents: {
    onboarding: {
      accountId: '0x063fB42cCe4CA5448D69b4418cb89E663E71A139',
    },
  },
  alwaysAutoGasLimit: 1.1
}

const runtimeConfig = {
  accountMap: {
    '0x001...': '01734...', // deploymentAccount: 'privateKey'
  },
  ipfs: { host: 'ipfs.evan.network', port: '443', protocol: 'https' },
  web3Provider: 'wss://testcore.evan.network/ws'
}

module.exports = { bcConfig, runtimeConfig }
```

```bash
npm run deploy --config pathToConfig
```

** Be sure that "pathToConfig" is the absolute path to your deployment configuration! **

Now, you can open the ens address to your application on https://dashboard.evan.network#/my-ens-address.evan. (my-ens-address = dbcp.name)