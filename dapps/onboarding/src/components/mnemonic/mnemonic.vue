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
    <div class="md-layout md-gutter md-alignment-space-between-center"
      v-if="!useTextArea">
      <div class="md-layout-item md-size-50"
        v-for="(word, index) in words">
        <md-autocomplete
          md-dense
          md-layout="box"
          v-model="words[index]"
          :class="{ 'correct-word': correctWords[index] }"
          :disabled="$props.disabled && !riddelStarted"
          :md-input-id="'mnemonicInput' + index"
          :md-options="mnemonicWords[index]"
          :ref="'mnemonicInput' + index"
          @md-changed="wordInputChanged(index)"
          @md-opened="autocompleteOpened(index)"
          @md-selected="setInputFocus()">
          <label>{{ $t('_onboarding.mnemonic-word', {'index': index + 1}) }}</label>
        </md-autocomplete>
      </div>
    </div>
    <div v-if="useTextArea">
      <md-field>
        <label>{{ '_onboarding.sign-in.get-mnemonic' | translate }}</label>
        <md-input
          :disabled="$props.disabled && !riddelStarted"
          ref="mnemonicInput0"
          v-model="mnemonicText"
          @keyup.enter.native="textAreaChanged(true)"
          @input="textAreaChanged()">
        </md-input>
      </md-field>
    </div>
    <div class="md-layout md-gutter md-alignment-space-between-center"
      v-if="allWordsCorrect && !mnemonicIntegrity">
      <span class="md-error">
        {{ '_onboarding.invalid-mnemonic-integrity' | translate }}
      </span>
    </div>
    <div class="md-layout md-gutter md-alignment-space-between-center"
      v-if="!riddelStarted">
      <md-switch class="md-primary"
        v-model="useTextArea"
        v-on:change="setInputFocus()">
        {{ '_onboarding.free-input' | translate }}
      </md-switch>
    </div>
  </div>
</template>

<script lang="ts">
  import Mnemonic from './mnemonic.ts';
  export default Mnemonic;
</script>
