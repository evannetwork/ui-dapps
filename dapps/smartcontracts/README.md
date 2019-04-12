# evan.networtk library wrapper

DApp wrapper for: [@evan.network/smart-contracts-core](https://github.com/evannetwork/smart-contracts-core)

## Build
```
npm run build
```


## Usage
- exclude `@evan.network/smart-contracts-core` from build job

- package.json
```
  ...
  "dependencies": {
    "@evan.network/smart-contracts-core": "X.X.X"
  },
  ...
```

- dbcp.json
```
  ...
  "dapp": {
    "dependencies": {
      "smartcontracts": "X.X.X"
    },
  }
  ...
```

- typescript
```
  import * as smartcontracts from '@evan.network/smart-contracts-core';
```
