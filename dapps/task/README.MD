# task

The task DApp is generalized project for creating and displaying TaskContracts. You can use the
components and services by initializing the DApp. 

## Installation
```sh
npm i @evan.network/task
```

## Usage
- typescript

tsconfig.json
```json
{
  "compilerOptions": {
    ...,
    "paths": {
      "angular-core": [
        "../node_modules/@evan.network/task/dist/task.js"
      ]
    }
    ...
  }
}
```

\*.ts file

```ts
import {
  TaskLibModule,
  TaskTranslations
} from 'task';
```
