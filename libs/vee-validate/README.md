# evan.networtk library wrapper

DApp wrapper for: [validate.vee.libs](https://logaretm.github.io/vee-validate)

## Build
```
npm run build
```


## Usage
- exclude `validate.vee.libs` from build job

- package.json
```
  ...
  "dependencies": {
    "validate.vee.libs": "X.X.X"
  },
  ...
```

- dbcp.json
```
  ...
  "dapp": {
    "dependencies": {
      "validate.vee.libs": "X.X.X"
    },
  }
  ...
```

- typescript
```
  import vue from 'validate.vee.libs';
```
