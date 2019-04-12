# evan.networtk library wrapper

DApp wrapper for: [dexie](https://dexie.org/)

## Build
```
npm run build
```


## Usage
- exclude `dexie` from build job

- package.json
```
  ...
  "dependencies": {
    "dexie": "X.X.X"
  },
  ...
```

- dbcp.json
```
  ...
  "dapp": {
    "dependencies": {
      "dexie.libs": "X.X.X"
    },
  }
  ...
```

- typescript
```
  import * as dexie from 'dexie';
```
