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
  <div class="white-box border-smooth rounded p-4 d-flex flex-wrap"
    :id="`org-ident-detail-${ $route.params.address }`">
    <evan-loading v-if="loading"></evan-loading>
    <template v-else>
      <div class="d-flex px-5 text-center justify-content-center flex-column">
        <img class="img-fluid p-3"
          v-if="$store.state.organization.img"
          :src="$store.state.organization.img">
        <i
          class="mdi mdi-domain text-muted"
          style="font-size: 80px;">
        </i>
        <h3 class="font-weight-semibold">
          {{ $store.state.organization.alias }}
        </h3>
      </div>
      <div class="ml-5" style="flex: 1">
        <div class="mt-3">
          <h5 class="d-block mb-0 font-weight-semibold">
            {{ '_org.ident.notary.account-id' | translate }}
          </h5>
          <span>{{ $route.params.address }}</span>
        </div>

        <div class="mt-3">
          <h5 class="d-block mb-0 font-weight-semibold">
            {{ '_org.ident.notary.status.title' | translate }}

            <i class="mdi mdi-information-outline text-muted clickable">
              <evan-tooltip
                ref="infoTooltip"
                :placement="'right'">
                <div class="p-3">
                  <span>{{ '_org.ident.notary.info' | translate }}</span>
                  <div class="w-100 text-center mt-3">
                    <u class="clickable"
                      @click="$refs.orgInfo.show(); $refs.infoTooltip.onMouseLeave();">
                      {{ '_org.ident.notary.learn-more' | translate }}
                    </u>
                  </div>
                </div>
              </evan-tooltip>
            </i>
          </h5>

          <org-ident-info-dialog ref="orgInfo"></org-ident-info-dialog>

          <p>{{ `_org.ident.notary.status.${ details.status }` | translate }}</p>

          <a class="btn btn-primary btn-rounded" target="_blank"
            v-if="statusActions.indexOf(details.status) !== -1"
            :id="`ident-request-${ details.status }`"
            :href="details.pdfUrl && details.status === 'confirming' ? pdfUrl : null"
            @click="runStatusAction()">
            {{ `_org.ident.notary.status-actions.${ details.status }` | translate }}
            <i class="mdi mdi-arrow-right label ml-3"></i>
          </a>
          <div class="row"
            v-else-if="details.status === 'issued'">
            <div class="col-lg-6"
              v-for="(topic, index) in details.verifications">
              <org-ident-notary-verification
                :address="$route.params.address"
                :title="(
                  topic.endsWith('company') ?
                    '_org.ident.notary.verification.company' :
                    '_org.ident.notary.verification.company-random'
                  ) | translate"
                :topic="topic">
              </org-ident-notary-verification>
            </div>
          </div>
        </div>
      </div>
      <org-ident-notary-request
        ref="identAction"
        v-if="details.status === 'unkown'">
      </org-ident-notary-request>

      <org-ident-notary-pin
        ref="identAction"
        v-if="details.status === 'requested'"
        :requestId="requestId">
      </org-ident-notary-pin>
    </template>
  </div>
</template>

<script lang="ts">
  import Component from './detail.ts';
  export default Component;
</script>
