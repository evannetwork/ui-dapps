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
    <div class="evan-logo"></div>

    <evan-hello></evan-hello>

    <div class="card-container">
      <md-card class="sign-up">
        <md-card-media>
          <img src="/assets/examples/card-image-1.jpg" alt="People">
        </md-card-media>

        <md-card-header>
          <div class="md-title">Sign up</div>
          <div class="md-subhead">Subtitle here</div>
        </md-card-header>

        <md-card-expand>
          <md-card-actions md-alignment="space-between">
            <div>
              <md-button>Register</md-button>
              <md-button>Action</md-button>
            </div>

            <md-card-expand-trigger>
              <md-button class="md-icon-button">
                <md-icon>keyboard_arrow_down</md-icon>
              </md-button>
            </md-card-expand-trigger>
          </md-card-actions>

          <md-card-expand-content>
            <md-card-content>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Optio itaque ea, nostrum odio. Dolores, sed accusantium quasi non, voluptas eius illo quas, saepe voluptate pariatur in deleniti minus sint. Excepturi.
            </md-card-content>
          </md-card-expand-content>
        </md-card-expand>
      </md-card>
      <md-card class="sign-in">
        <md-card-media>
          <img src="/assets/examples/card-image-1.jpg" alt="People">
        </md-card-media>

        <md-card-header>
          <div class="md-title">Sign up</div>
          <div class="md-subhead">Subtitle here</div>
        </md-card-header>

        <md-card-expand>
          <md-card-actions md-alignment="space-between">
            <div>
              <md-button>Register</md-button>
              <md-button>Action</md-button>
            </div>

            <md-card-expand-trigger>
              <md-button class="md-icon-button">
                <md-icon>keyboard_arrow_down</md-icon>
              </md-button>
            </md-card-expand-trigger>
          </md-card-actions>

          <md-card-expand-content>
            <md-card-content>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Optio itaque ea, nostrum odio. Dolores, sed accusantium quasi non, voluptas eius illo quas, saepe voluptate pariatur in deleniti minus sint. Excepturi.
            </md-card-content>
          </md-card-expand-content>
        </md-card-expand>
      </md-card>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import * as bcc from 'bcc';
  import { System, core, } from 'dapp-browser';

  export default Vue.extend({
    name: 'evan-onboarding-welcome',
    data: function () {
      return { }
    },
    methods: {

    }
  });
</script>

<style lang="scss" scoped>
  .evan-logo {
    width: 600px;
    height: 250px;
    max-width: 90%;
    margin-top: 5%;
    left: 0;
    right: 0;
    margin: 5% auto 0 auto;
    position: relative;
  }

  .card-container {
    display: flex;

    .md-card {
      max-width: 100%;
      height: 300px;
      border-radius: 20px;
      opacity: 0.7;
      transition: 0.5s ease-out opacity;

      &:hover {
        opacity: 1;
      }
    }

    @media (min-width: 769px) {
      padding: 0 5%;

      .md-card {
        width: 45%;

        &.sign-up {
          margin-right: 5%;
        }

        &.sign-in {
          margin-left: 5%;
        }
      }
    }

    @media (min-width: 993px) {
      padding: 0 10%;
    }

    @media (min-width: 1201px) {
      padding: 0 15%;
    }

    @media (min-width: 1501px) {
      padding: 0 20%;
    }

    @media (max-width: 768px) {
      .md-card {
        width: 30%;
        margin: 10% 0;
      }
    }
  }
</style>

