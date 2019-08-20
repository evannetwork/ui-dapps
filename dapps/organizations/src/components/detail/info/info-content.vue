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
    <h4>{{'_org.ident.notary.request.why.title' | translate}}</h4>
    <p class="mb-4">{{ $t('_org.ident.notary.request.why.description', { accountId: $route.params.address }) }}
      <a href="https://evannetwork.github.io/docs/first_steps/power_apps/notary-verification.html"
        class="text-link" target="_blank" rel="noreferer noopener">
        {{'_org.ident.notary.request.why.link' | translate}}
      </a>
    </p>

    <h4>{{'_org.ident.notary.request.who.title' | translate}}</h4>
      <p class="mb-4">{{'_org.ident.notary.request.who.description' | translate}}
      <a href="https://evannetwork.github.io/docs/first_steps/power_apps/notary-verification.html"
        class="text-link" target="_blank" rel="noreferer noopener">
        {{'_org.ident.notary.request.who.link' | translate}}
      </a>
    </p>

    <h4>{{'_org.ident.notary.request.how.title' | translate}}</h4>
    <div class="row row-eq-height">
      <div v-for="(key) in ['1', '2', '3']" :key="key" class="step col-md-4">
        <div>
          <h5 class="bold">{{`_org.ident.notary.request.how.steps.${key}.title` | translate}}</h5>
          <p>{{`_org.ident.notary.request.how.steps.${key}.description` | translate}}</p>
        </div>
      </div>
    </div>

    <h4 class="mt-4 mb-4">{{'_org.ident.notary.request.costs.title' | translate}}</h4>
    <p class="mb-4">{{'_org.ident.notary.request.costs.description' | translate}}</p>
  </div>
</template>

<style lang="scss" scoped>
  @import './info-content.scss'
</style>

