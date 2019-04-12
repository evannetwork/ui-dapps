# @evan.network/ui
This project include general and global, framework independent, evan.network functionallities and stylings.

The following stylings are per default included:
- [evan bootstrap](https://github.com/evannetwork/ui-core/tree/master/dapps/evan.bootstrap.libs)
- [fontawesome](https://github.com/evannetwork/ui-core/tree/master/dapps/fontawesome.libs)

The following functionalities are included:
- configuration values for runtime environments
- Dispatcher & Queue Logic for a batch / step data synchronization


## Build
```
npm run build
```


## Usage
- exclude `@evan.network/ui` from build job

- package.json
```
  ...
  "dependencies": {
    "@evan.network/ui": "X.X.X"
  },
  ...
```

- dbcp.json
```
  ...
  "dapp": {
    "dependencies": {
      "ui.libs": "X.X.X"
    },
  }
  ...
```

- typescript
```
  import * as evanUi from '@evan.network/ui';
```
