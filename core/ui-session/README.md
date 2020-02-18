# @evan.network/ui-session
This project include general helpers for active account / identity handling

## Build
```
npm run build
```

## Usage
- exclude `@evan.network/ui-session` from build job

- package.json
```
  ...
  "dependencies": {
    "@evan.network/ui-session": "X.X.X"
  },
  ...
```

- dbcp.json
```
  ...
  "dapp": {
    "dependencies": {
      "uisession.libs": "X.X.X"
    },
  }
  ...
```

- typescript
```
  import * as evanUi from '@evan.network/ui-session';
```
