import { client } from 'nightwatch-api';
import { When } from 'cucumber';
import path from 'path';
import {
  betterClearValue,
  parseEnvVar,
} from '../../test-utils/test-utils';

When('I upload file {string} to the dropzone with the id {string}', async (filePath, elementId) => {
  const envFilePath = parseEnvVar(filePath);
  const resolvedPath = envFilePath.startsWith('/')
    ? envFilePath
    : path.resolve(path.join('test-files', envFilePath));

  await client.waitForElementPresent(`#${elementId}`, 1000);
  await client.setValue(`#${elementId}`, resolvedPath);
});

When('I clear files from the dropzone with the id {string}', async (elementId) => {
  await client.waitForElementPresent(`#${elementId}`, 1000);
  await betterClearValue(`#${elementId}`);
});
