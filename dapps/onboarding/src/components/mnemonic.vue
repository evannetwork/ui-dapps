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

<template>
  <div>
    <div class="md-layout md-gutter md-alignment-center-center"
      v-if="mode === 'words'">
      <div class="md-layout-item md-size-50"
        v-for="(word, index) in words">
        <md-autocomplete
          :md-fuzzy-search="false"
          :md-options="mnemonicWords"
          md-dense
          md-layout="box"
          v-bind:class="{ 'correct-word': correctWords[index] }"
          v-model="words[index]"
          v-on:md-changed="wordInputChanged(index)"
          v-on:md-opened="wordInputChanged(index)">
          <label>{{ $t('_onboarding.mnemonic-word', {'index': index + 1}) }}</label>
        </md-autocomplete>
      </div>
    </div>
    <div v-if="mode === 'textarea'">
      textarea
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import * as bcc from 'bcc';
  import { System, core, dapp, getDomainName, lightwallet } from 'dapp-browser';

  export default Vue.extend({
    props: {
      // incoming mnemonic, if empty, input will automatically enabled
      value: String,
      // only available if a valid mnemonic is inserted, includes the amount of riddle questions,
      // that should be used.
      riddle: Boolean,
      // words, textarea
      mode: {
        default: function(value) {
          return 'words';
        },
        validator: function(value) {
          return ['words', 'textarea'].indexOf(value) !== -1;
        }
      }
    },
    data: function () {
      return {
        // initial words
        initial: [ ] as Array<string>,
        // current mnemonic splitted
        words: [ ] as Array<string>,
        // all words concadinated into a single string, so we can insert the mnemonic also using
        // textarea
        mnemonic: '',
        // all words that are available for our mnemonics
        lightWalletWords: lightwallet.getMnemonicLib().Words.ENGLISH,
        // current words that will be selectable by the autocompletion
        mnemonicWords: [ ] as Array<string>,
        // which words are correcxt?
        correctWords: [ ] as Array<boolean>
      }
    },
    created () {
      // split initial mnemonic
      if (this.mnemonic) {
        this.initial = this.mnemonic.split(' ');
      } else {
        // fill empty words
        this.initial = [ '', '', '', '', '', '', '', '', '', '', '', '' ];

        // set initial correct words, so the inputs can drawn correctly
        this.initial.forEach((word, index) => {
          this.correctWords[index] = this.isCorrectWord(index);
        });
      }

      // set values for edition (copy reference)
      this.words = ([ ] as Array<string>).concat(this.initial);
      this.mnemonic = this.words.join(' ');
    },
    methods: {
      triggerChange() {
        this.$emit('change', this.mnemonic);
      },
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
      },
      /**
       * When an autocompletion input gets selected or changed, prefilter the mnemonic words, so the
       * browser wont die.
       *
       * @param      {number}  index   the active index of the mnemonic word
       */
      wordInputChanged(index) {
        // if the word has only 1 character, don't show the preview 
        if (this.words[index].length < 2) {
          this.mnemonicWords = [ ];
          this.correctWords[index] = false;
        // if the word exists within the lightwallet words array, its a correct word!
        } else if (this.isCorrectWord(index)) {
          this.mnemonicWords = [ ];
          this.correctWords[index] = true;
        // set new list of suggestions
        } else {
          this.mnemonicWords = this.lightWalletWords
            .filter(word => word.indexOf(this.words[index]) !== -1 && word !== this.words[index])
            .splice(0, 10);
          this.correctWords[index] = false;
        }
      }
    }
  });
</script>

<style lang="scss" scoped>
  @import '~@evan.network/vue-core/src/style/themes/themes.scss';

  // start all themes
  @each $name, $theme in $evanThemes {
    $colors: map-get($theme, colors);

    .evan-theme-#{$name} {
      .md-field.md-autocomplete {
        background-color: rgba(map-get($colors, danger), 0.6);

        &.correct-word {
          background-color: rgba(map-get($colors, success), 0.6);
        }
      }
    }
  }
</style>

