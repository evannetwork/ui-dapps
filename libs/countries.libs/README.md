# @evan.network/ui-countries
This project includes a list of all iso countries and it's translations. 

## Build
```
npm run build
```


## Usage
- exclude `@evan.network/ui-countries` from build job

- package.json
```
  ...
  "dependencies": {
    "@evan.network/ui-countries": "X.X.X"
  },
  ...
```

- dbcp.json
```
  ...
  "dapp": {
    "dependencies": {
      "countries.libs": "X.X.X"
    },
  }
  ...
```

- typescript
```
  import * as evanUi from '@evan.network/ui-countries';
```
