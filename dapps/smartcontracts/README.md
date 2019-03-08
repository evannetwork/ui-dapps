# smartcontracts

Wrapper for the `@evan.network/smart-contracts-core` to be able to build this project as a browserify bundle.
This application will be bind to the following ENS path `smartcontracts.evan`. Within your dbcp.json, you will need to include `smartcontracts` as a dependency, if you want to use this paackage within an dapp. Within the ts files of the dapp, the usal import `@evan.network/smart-contracts-core` import can be used.

## Build
```
npm run build
```

## DApp

This is a evan.network DApp. To build and deploy your DApp, please visit the readme.md of your containing evan.network basic project.

For more details about how to program DApps have a look here:

- [DApp Tutorials](https://evannetwork.github.io/dapps/basics)
- [API Reference UI](https://ipfs.test.evan.network/ipns/QmReXE5YkiXviaHNG1ASfY6fFhEoiDKuSkgY4hxgZD9Gm8)
- [API Reference blockchain-core / DBCP](https://ipfs.test.evan.network/ipns/QmYmsPTdPPDLig6gKB1wu1De4KJtTqAXFLF1498umYs4M6)
