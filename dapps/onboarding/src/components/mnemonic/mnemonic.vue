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
    <form
      v-if="!useTextArea">
      <div class="form-row">
        <div class="form-group col-md-6"
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
            @focus="wordInputChanged(index);"
            @blur="setDirty(index)">
          <div class="invalid-feedback" v-if="dirtyWords[index] && !correctWords[index]">
            {{ '_onboarding.invalid-mnemonic-word' | translate }}
          </div>
        </div>
      </div>
    </form>
    <form v-if="useTextArea">
      <div class="form-group">
        <label for="mnemonicInput0">
          {{ '_onboarding.sign-in.get-mnemonic' | translate }}
        </label>
        <input class="form-control" required
          ref="mnemonicInput0"
          :disabled="$props.disabled && !riddelStarted"
          v-model="mnemonicText"
          @keyup.enter.native="textAreaChanged(true)"
          @input="textAreaChanged()">
        <div class="invalid-feedback" v-if="allWordsCorrect && !mnemonicIntegrity">
          {{ '_onboarding.invalid-mnemonic-word' | translate }}
        </div>
      </div>
    </form>
    <div class="text-center d-block" v-if="!riddelStarted">
      <div class="custom-control custom-switch mt-2">
        <input type="checkbox" id="useTextArea"
          class="custom-control-input"
          v-model="useTextArea"
          @input="setInputFocus()">
        <label class="custom-control-label text-muted" for="useTextArea">
          {{ '_onboarding.free-input' | translate }}
        </label>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Mnemonic from './mnemonic.ts';
  export default Mnemonic;
</script>
