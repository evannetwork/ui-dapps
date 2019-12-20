# evan.networtk library wrapper

DApp wrapper for: [lodash](https://lodash.org/)

## Build
```
npm run build
```


## Usage
- exclude `lodash` from build job

- package.json
```
  ...
  "dependencies": {
    "lodash": "X.X.X"
  },
  ...
```

- dbcp.json
```
  ...
  "dapp": {
    "dependencies": {
      "lodash.libs": "X.X.X"
    },
  }
  ...
```

- typescript
```
  import * as lodash from 'lodash';
```
