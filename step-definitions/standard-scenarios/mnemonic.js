import { client } from 'nightwatch-api';
import { When } from 'cucumber';

When('I enter the mnemonic {string}', async mnemonic => {
  let words = mnemonic.split(' ');
  for (let i = 0; i < words.length; i++) {
    await client.setValue(`#mnemonicInput${i}`, words[i]);
  }
});
