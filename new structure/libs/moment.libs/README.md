# evan.networtk library wrapper

DApp wrapper for: [moment](http://momentjs.com)

## Build
```
npm run build
```


## Usage
- exclude `moment` from build job

- package.json
```
  ...
  "dependencies": {
    "moment": "X.X.X"
  },
  ...
```

- dbcp.json
```
  ...
  "dapp": {
    "dependencies": {
      "moment.libs": "X.X.X"
    },
  }
  ...
```

- typescript
```
  import * as moment from 'moment';
```
