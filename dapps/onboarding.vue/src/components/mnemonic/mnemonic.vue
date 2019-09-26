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
*/

<template>
  <div>
    <form
      v-if="!useTextArea"
      @paste="handlePaste($event)">
      <div class="form-row">
        <div class="form-group col-md-4"
          v-for="(word, index) in words">
          <input class="form-control" required
            :id="'mnemonicInput' + index" :ref="'mnemonicInput' + index"
            :placeholder="$t('_onboarding.mnemonic-word', {'index': index + 1})"
            :class="{
              'is-invalid': dirtyWords[index] && !correctWords[index],
              'is-valid': dirtyWords[index] && correctWords[index]
            }"
            :disabled="$props.disabled && !riddelStarted"
            v-model="words[index]"
            @keyup.enter.native="onSubmit()"
            @input="wordInputChanged(index)"
            @blur="setDirty(index)">
        </div>
      </div>
    </form>
    <div class="text-danger" v-if="anyWordDirty && !mnemonicIntegrity">
      {{ (allWordsCorrect ?
          '_onboarding.invalid-mnemonic-integrity' :
          '_onboarding.invalid-mnemonic-words-incorrect'
         ) | translate }}
    </div>
  </div>
</template>

<script lang="ts">
  import Mnemonic from './mnemonic.ts';
  export default Mnemonic;
</script>
