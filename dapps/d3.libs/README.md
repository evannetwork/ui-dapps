# evan.networtk library wrapper

DApp wrapper for: [d3](https://d3js.org/)

## Build
```
npm run build
```


## Usage
- exclude `d3` from build job

- package.json
```
  ...
  "dependencies": {
    "d3": "X.X.X"
  },
  ...
```

- dbcp.json
```
  ...
  "dapp": {
    "dependencies": {
      "d3": "X.X.X"
    },
  }
  ...
```

- typescript
```
  import * as d3 from 'd3';
```
