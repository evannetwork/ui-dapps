# evan.networtk library wrapper

DApp wrapper for: [@evan.network/api-blockchain-core](https://github.com/evannetwork/api-blockchain-core)

## Build
```
npm run build
```


## Usage
- exclude `@evan.network/api-blockchain-core` from build job

- package.json
```
  ...
  "dependencies": {
    "@evan.network/api-blockchain-core": "X.X.X"
  },
  ...
```

- dbcp.json
```
  ...
  "dapp": {
    "dependencies": {
      "bcc": "X.X.X"
    },
  }
  ...
```

- typescript
```
  import * as bcc from '@evan.network/api-blockchain-core';
```
