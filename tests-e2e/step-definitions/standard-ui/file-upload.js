import { client } from 'nightwatch-api';
import { When, Then } from 'cucumber';
import {
  betterClearValue,
  getElementIdByLabel,
  getSelector,
  parseEnvVar
} from '../../test-utils/test-utils';
import path from 'path';

When('I upload file {string} to the dropzone with the id {string}', async(filePath, elementId) => {
  filePath = parseEnvVar(filePath);
  const resolvedPath = filePath.startsWith('/')
  ? filePath
  : path.resolve(path.join('test-files', filePath));

  await client.waitForElementPresent(`#${elementId}`, 1000);
  await client.setValue(`#${elementId}`, resolvedPath);
});

When('I clear files from the dropzone with the id {string}', async(elementId) => {
  await client.waitForElementPresent(`#${elementId}`, 1000);
  await betterClearValue(`#${elementId}`);
});

