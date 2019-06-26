# evan.networtk library wrapper

DApp wrapper for: [bootstrap 4 style](https://getbootstrap.com/).

Includes an adjusted bootstrap style, including support for css variables. For all variables have a look at [ui.libs](https://github.com/evannetwork/ui-core/blob/master/dapps/ui.libs/src/style/definitions/evan.theme.scss).

## Build
```
npm run build
```


## Usage
- dbcp.json
```
  ...
  "dapp": {
    "dependencies": {
      "evan.bootstrap.libs": "X.X.X"
    },
  }
  ...
```

- package.json
```
  ...
  "dapp": {
    "dependencies": {
      "@evan.network/bootstrap-theme-evan": "X.X.X"
    },
  }
  ...
```
