# evan.networtk library wrapper

DApp wrapper for: [ajv-i18n](https://github.com/epoberezkin/ajv-i18n)

## Build
```
npm run build
```


## Usage
- exclude `ajv-i18n` from build job

- package.json
```
  ...
  "dependencies": {
    "i18n.ajv": "X.X.X"
  },
  ...
```

- dbcp.json
```
  ...
  "dapp": {
    "dependencies": {
      "i18n.ajv": "X.X.X"
    },
  }
  ...
```

- typescript
```
  import vue from 'ajv-i18n';
```
