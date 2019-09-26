/*
  Copyright (C) 2018-present evan GmbH.

  This program is free software: you can redistribute it and/or modify it
  under the terms of the GNU Affero General Public License, version 3,
  as published by the Free Software Foundation.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
  See the GNU Affero General Public License for more details.

  You should have received a copy of the GNU Affero General Public License
  along with this program. If not, see http://www.gnu.org/licenses/ or
  write to the Free Software Foundation, Inc., 51 Franklin Street,
  Fifth Floor, Boston, MA, 02110-1301 USA, or download the license from
  the following URL: https://evan.network/license/

  You can be released from the requirements of the GNU Affero General Public
  License by purchasing a commercial license.
  Buying such a license is mandatory as soon as you use this software or parts
  of it on other blockchains than evan.network.

  For more information, please contact evan GmbH at this address:
  https://evan.network/license/
*/

// vue imports
import Vue from 'vue';
import Component, { mixins } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

// evan.network imports
import { EvanComponent } from '@evan.network/ui-vue-core';
import * as bcc from '@evan.network/api-blockchain-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';

@Component({ })
export default class Mnemonic extends mixins(EvanComponent) {
  /**
   * incoming mnemonic, if empty, input will automatically enabled
   */
  @Prop({
    type: String,
    default: function() {
      return '';
    }
  }) mnemonic;

  /**
   * should everything be disabled?
   */
  @Prop({
    type: Boolean,
    default: function() {
      return false;
    }
  }) disabled;

  /**
   * words, textarea
   */
  @Prop({
    type: String,
    default: function() {
      return 'words';
    }
  }) mode;

  // initial words
  initial: Array<string> = [ ];

  // current mnemonic splitted
  words: Array<string> = [ ];

  /**
   * Which words were adjusted?
   */
  dirtyWords: Array<boolean> = [ ];

  // all words concadinated into a single string, so we can insert the mnemonic also using
  // textarea
  mnemonicText = '';

  // all words that are available for our mnemonics
  lightWalletWords = dappBrowser.lightwallet.getMnemonicLib().Words.ENGLISH;

  // current words that will be selectable by the autocompletion
  mnemonicWords = [ ] as any;

  // which words are correcxt?
  correctWords = [ ] as Array<boolean>;

  // should the textarea used?
  useTextArea = false;

  // check if the mnemonic integrity is correct
  mnemonicIntegrity = false;

  // check if the
  allWordsCorrect = false;

  // is currently a riddle started?
  riddelStarted = false;

  // any mnemonic word has been modified
  anyWordDirty = false;

  created () {
    // check the initial mode
    this.useTextArea = this.$props.mode === 'textarea';

    // split initial mnemonic
    if (this.$props.mnemonic) {
      this.initial = this.$props.mnemonic.split(' ');
    } else {
      // fill empty words
      this.initial = [ '', '', '', '', '', '', '', '', '', '', '', '' ];
    }

    // fill empty words
    this.fillEmptyWords(this.initial);

    // set values for edition (copy reference)
    this.words = ([ ] as Array<string>).concat(this.initial);
    this.mnemonicText = this.words.join(' ').replace(/\s+$/, '');

    // if a riddle value is provided, start it!
    if (this.$props.riddle) {
      this.startRiddle(this.$props.riddle);
    }

    // set initial correct words, so the inputs can drawn correctly
    this.initial.forEach((word, index) => {
      this.correctWords[index] = this.isCorrectWord(index);
      this.mnemonicWords[index] = this.getFilteredMnemonicWords(index);
    });

    // set initial mnemonic valid and integrity states
    this.updateParent();
  }

  mounted() {
    // set initial focus
    this.setInputFocus();
  }

  /**
   * Takes an arraoy of strings and fills them, until itls length is 12
   *
   * @param      {Array<string>}  words   words to fill
   */
  fillEmptyWords(words) {
    // fill empty words
    while (words.length < 12) {
      words.push('');
    }
  }

  async getFilteredMnemonicWords(index) {
    if (!this.words[index] || this.words[index].length < 2) {
      return [ ];
    } else {
      const lowerCase = this.words[index].toLowerCase();

      return this.lightWalletWords
        .filter(word => word.indexOf(lowerCase) === 0 && word !== lowerCase)
        .slice(0, 10);
    }
  }

  /**
   * Check if the word at the mnemonic position is a valid mnemonic word.
   *
   * @param      {number}   index   The index
   * @return     {boolean}  True if correct word, False otherwise.
   */
  isCorrectWord(index) {
    if (this.lightWalletWords.indexOf(this.words[index]) !== -1) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Check if all words are correct and emits the corresponding event
   */
  updateParent() {
    // check if all words are correct Mnemonic words
    this.allWordsCorrect = !this.words.filter((word, index) =>
      !this.correctWords[index]).length;

    try {
      // set current mnemonic integrity, to show a warning within the ui
      this.mnemonicIntegrity = dappBrowser.lightwallet.getMnemonicLib()
        .isValid(this.mnemonicText, this.lightWalletWords);
    } catch (ex) {
      this.mnemonicIntegrity = false;
    }

    // update parent to handle the latest mnemonic text and send event, the the mnemonic is
    // valid or not
    this.$emit('update:mnemonic', this.mnemonicText);
    this.$emit('update:valid', this.allWordsCorrect && this.mnemonicIntegrity);
  }

  /**
   * Send submit event to parent if all words are correct.
   */
  onSubmit() {
    // on keypress enter trigger the submit event
    if (this.allWordsCorrect && this.mnemonicIntegrity) {
      this.$emit('submit', this.allWordsCorrect && this.mnemonicIntegrity);
    }
  }

  /**
   * When an autocompletion input gets selected or changed, prefilter the mnemonic words, so the
   * browser wont die.
   *
   * @param      {number}  index   the active index of the mnemonic word
   */
  wordInputChanged(index) {
    // check current words
    this.checkCorrectWords([ index ]);
    this.mnemonicText = this.words.join(' ').replace(/\s+$/, '');
    this.anyWordDirty = true;

    // update the original value
    this.updateParent();
  }

  /**
   * Takes an array of indexes of words within the list, that should be checked.
   *
   * @param      {Array<number>}  indexes  indexes to check
   */
  checkCorrectWords(indexes) {
    indexes.forEach(index => {
      // if the word has only 1 character, don't show the preview
      if (this.words[index] && this.words[index].length < 2) {
        this.correctWords[index] = false;
      // if a riddle is started (a initial value is available) and the same word was entered,
      // its correct if no riddle is start, check if the word exists within the lightwallet
      // words array, its a correct word!
      } else if ((this.initial[index] && this.initial[index] === this.words[index]) ||
        (!this.initial[index] && this.isCorrectWord(index))) {
        this.correctWords[index] = true;
        this.dirtyWords[index] = true;
      // set new list of suggestions
      } else {
        this.correctWords[index] = false;
      }

      // update autocompletion
      this.mnemonicWords[index] = this.getFilteredMnemonicWords(index);
    });
  }

  /**
   * Set the focus for initial inputs.
   */
  setInputFocus() {
    setTimeout(() => {
      if (this.useTextArea) {
        (this.$refs['mnemonicInput0'] as any).focus();
      } else {
        // select the first uncorrect word input
        for (let i = 0; i < 12; i++) {
          if (!this.correctWords[i]) {
            return (this.$refs[`mnemonicInput${ i }`][0] as any).focus();
          }
        }
      }
    });
  }

  /**
   * Remove randomized words that should be the same as the original ones.
   *
   * @param      {number}  amount  amount of words that should be asked
   */
  startRiddle(amount) {
    this.riddelStarted = true;
    this.useTextArea = false;

    // remove words until the amount is reached
    for (let i = 0; i < amount; i++) {
      // search for a not removed word
      let randomNumber;
      do {
        randomNumber = Math.round(Math.random() * 12);
      } while (!this.words[randomNumber]);

      // and clear it!
      this.words[randomNumber] = '';
      this.correctWords[randomNumber] = false;
    }

    // calculate the new mnemonicText
    this.mnemonicText = this.words.join(' ').replace(/\s+$/, '');

    // make all words dirty, so the form validation will triggered
    this.words.forEach((word, index) => this.setDirty(index));

    // update the original value
    this.updateParent();
    // set initial focus
    this.setInputFocus();
  }

  handlePaste(e) {
    // Stop data actually being pasted into div
    e.stopPropagation();
    e.preventDefault();

    // Get pasted data via clipboard API
    const clipboardData = e.clipboardData || (window as any).clipboardData;
    const pastedData = clipboardData
      .getData('Text')
      .trim()
    ;

    // split mnemonic
    if (pastedData) {
      const splitData = pastedData.split(' ');
      if (splitData.length <= 12) {
        // add empty strings for fields at the end of the array
        this.words = splitData.concat([...Array(12 - splitData.length)].map(() => ''));
        this.mnemonicText = this.words.join(' ').replace(/\s+$/, '');

        // update the original value
        this.checkCorrectWords([ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, ]);
        this.updateParent();
      }
    }
  }

  /**
   * Stops a riddle and resets all values.
   */
  cancelRiddle() {
    this.words = this.initial;
    this.mnemonicText = this.initial.join(' ');
    this.riddelStarted = false;
  }

  setDirty(index) {
    this.dirtyWords[index] = true
  }
}

