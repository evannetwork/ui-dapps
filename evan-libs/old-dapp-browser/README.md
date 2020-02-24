# evan.networtk library wrapper

DApp wrapper for the old ui-dapp-browser version: [@evan.network/ui-dapp-browser](https://github.com/evannetwork/ui-dapp-browser/tree/v2.8.0)

## Build
```
npm run build
```


## Usage
- exclude `@evan.network/api-blockchain-core-browserified` from build job

- dbcp.json
```
  ...
  "dapp": {
    "dependencies": {
      "dappbrowserold": "X.X.X"
    },
  }
  ...
```

- typescript
```
  import * as bcc from 'dapp-browser';
```
