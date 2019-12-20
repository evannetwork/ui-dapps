# evan.networtk library wrapper

DApp wrapper for: [qrcodejs](https://qrcodejs.org/)

## Build
```
npm run build
```


## Usage
- exclude `qrcodejs` from build job

- package.json
```
  ...
  "dependencies": {
    "qrcodejs": "X.X.X"
  },
  ...
```

- dbcp.json
```
  ...
  "dapp": {
    "dependencies": {
      "qrcodejs.libs": "X.X.X"
    },
  }
  ...
```

- typescript
```
  import * as qrcodejs from 'qrcodejs';
```
