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

/*
  usage:
    <steps-indicator
      :steps="steps"                    // steps array
      :active-step="currentActiveStep"  // currently active step number
      @updatestep="myupdatelistener"    // update function: myupdatelistener(nextStep)
    ></steps-indicator>
 */

<template>
  <div class="evan-steps" v-if="steps && steps.length !== 0">
    <div class="evan-step-header mt-3">
        <button class="btn"
        v-for="(step, index) of steps"
        :class="{
          [`evan-container-create-step-${ index }`]: true,
          'active': activeStep === index,
          'disabled': step.disabled,
        }"
        :disabled="step.disabled"
        @click="gotoStep(index)"
        v-bind:key="index"
      >
        <span class="stepper-circle">
          {{ index + 1}}
        </span>
        <span>{{ step.title | translate }}</span>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
  import Component from './steps-indicator';
  export default Component;
</script>

<style lang="scss" scoped>
  @import './steps-indicator.scss'
</style>

