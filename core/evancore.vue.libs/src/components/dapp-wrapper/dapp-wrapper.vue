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
  <div
    :id="id"
    class="evan-dapp-wrapper"
    :class="{
      'show-sidebar': showSideBar && enabledSideBar2,
    }"
  >
    <evan-logout
      ref="evanLogout"
      :disable-button="true"
    />

    <template v-if="!loading">
      <div
        class="dapp-wrapper-body"
        :class="{
          'pt-0': onboarding || login,
          'h-100': !topLevel || onboarding || login,
        }"
      >
        <div
          v-if="!supportedBrowser"
          class="container w-100"
        >
          <div
            class="white-box border-smooth rounded"
            style="margin-top: 25%; width: 500px; margin-left: auto; margin-right: auto;"
          >
            <div class="header">
              <h3 class="m-0 font-weight-semibold">
                {{ '_evan.browser-not-supported.title' | translate }}
              </h3>
            </div>
            <p
              class="content mb-0"
              v-html="$t('_evan.browser-not-supported.desc')"
            />
          </div>
        </div>
        <template v-else-if="!login">
          <div
            v-if="!onboarding && enableSidebar"
            class="dapp-wrapper-sidebar"
          >
            <slot name="sidebar">
              <ul
                id="evan-dapp-sidepanel-toggle"
                class="nav"
              >
                <li>
                  <a
                    v-if="enabledSideBar2"
                    :class="{ active: showSideBar }"
                    @click="showSideBar = !showSideBar"
                  >
                    <i
                      v-if="!showSideBar"
                      class="mdi mdi-menu"
                    />
                    <i
                      v-if="showSideBar"
                      class="mdi mdi-close"
                    />
                  </a>
                </li>
              </ul>
              <ul class="nav top-nav">
                <li
                  v-for="route in routes.topLeft"
                  :key="route.path"
                >
                  <a
                    :id="`evan-dapp-${ (route.path || route.id).split('.')[0] }`"
                    :class="{ active: route.path && $route.path.startsWith(route.fullPath) }"
                    :href="route.path ? `${ dapp.fullUrl }/${ route.path }` : null"
                    @click="routeActivated(route)"
                  >
                    <i :class="route.icon" />
                    <evan-tooltip :placement="'right'">
                      {{ route.title | translate }}
                    </evan-tooltip>
                  </a>
                </li>
              </ul>
              <ul class="nav bottom-nav">
                <ul class="nav">
                  <li
                    v-for="(route, index) in routes.centerLeft"
                    :key="route.path"
                    :style="{ order: (index + 1) * 10 }"
                  >
                    <a
                      :id="`evan-dapp-${ (route.path || route.id).split('.')[0] }`"
                      :class="{ active: route.path && $route.path.startsWith(route.fullPath) }"
                      :href="route.path ? `${ dapp.fullUrl }/${ route.path }` : null"
                      @click="routeActivated(route)"
                    >
                      <i
                        class="position-relative"
                        :class="route.icon"
                      >
                        <span
                          v-if="route.path.startsWith('mailbox.vue') && userInfo.newMailCount > 0"
                          class="notification-dot"
                        />
                      </i>
                      <evan-tooltip :placement="'right'">
                        {{ route.title | translate }}
                      </evan-tooltip>
                    </a>
                  </li>
                </ul>
              </ul>
            </slot>
          </div>

          <div class="dapp-wrapper-main">
            <!-- use the breadcrumb slot for fixed breadcrumbs -->
            <div class="dapp-wrapper-content-header">
              <div class="dapp-wrapper-breadcrumbs">
                <!-- will be filled by using the breadcrumbs component and the attachToDAppWrapper
                  param -->
              </div>
              <slot name="header" />
            </div>
            <div class="dapp-wrapper-content-wrapper flex-row">
              <template v-if="!onboarding">
                <div class="dapp-wrapper-sidebar-2-wrapper">
                  <div class="dapp-wrapper-sidebar-2">
                    <!-- will be filled by using the dapp-wrapper-sidebar-level-2 component -->
                  </div>
                </div>
              </template>

              <div
                v-if="topLevel"
                id="dapp-wrapper-sidebar-left"
              />
              <div class="dapp-wrapper-content">
                <evan-modal ref="instanceInteraction">
                  <template v-slot:header>
                    <h5 class="modal-title">
                      {{ `_evan.dapp-wrapper.instance-${ instanceInteraction.type }.title` | translate }}
                    </h5>
                  </template>
                  <template v-slot:body>
                    <p
                      class="text-left"
                      v-html="$t(`_evan.dapp-wrapper.instance-${ instanceInteraction.type }.desc`,
                                 instanceInteraction.instance)"
                    />
                  </template>
                  <template v-slot:footer>
                    <button
                      type="button"
                      class="btn btn-rounded"
                      :class="{
                        'btn-danger': instanceInteraction.type === 'delete',
                        'btn-primary': instanceInteraction.type === 'accept',
                      }"
                      @click="
                        instanceInteraction.instance[instanceInteraction.type]();
                        $refs.instanceInteraction.hide();
                      "
                    >
                      {{ `_evan.dapp-wrapper.instance-${ instanceInteraction.type }.ok` | translate }}
                    </button>
                  </template>
                </evan-modal>
                <slot name="content" />
                <!-- if the user gone through the sign-up, but never exported his mnemonic -->
                <evan-mnemonic-export v-if="createRuntime && topLevel && isLoggedin" />
              </div>
              <div
                v-if="topLevel"
                id="dapp-wrapper-sidebar-right"
              />
            </div>
          </div>
        </template>

        <evan-login
          v-else
          :account-id="userInfo.address"
          @logged-in="login"
        />
      </div>
      <div
        v-if="topLevel && !onboarding && !login"
        class="dapp-wrapper-bottom-bar"
      >
        <evan-user-callout />
        <div class="mx-auto" />
        <ul class="nav">
          <li
            v-for="route in routes.bottomRight"
            :key="route.path"
            @click="route.action && route.action()"
          >
            <a
              :id="`evan-dapp-${ (route.path || route.id).split('.')[0] }`"
              :href="route.path ? `${ dapp.fullUrl }/${ route.path }` : null"
              @click="routeActivated(route)"
            >
              <template v-if="route.id === 'synchronization'">
                <div
                  v-if="queueLoading || queueCount"
                  class="spinner-border spinner-border-sm"
                />
                <template v-else>
                  <i
                    v-if="queueErrorCount"
                    class="mdi mdi-alert text-danger"
                  />
                  <i
                    v-else
                    class="mdi mdi-sync"
                  />
                </template>
              </template>
              <i
                v-else
                :class="route.icon"
              />
              <evan-tooltip :placement="'top'">
                {{ route.title | translate }}
              </evan-tooltip>
            </a>
          </li>
        </ul>
        <evan-swipe-panel
          ref="queuePanel"
          alignment="right"
          class="light"
          show-backdrop="true"
        >
          <template v-slot:header>
            <div class="d-flex align-items-center">
              <h5 class="m-0 font-weight-bold text-truncate">
                {{ '_evan.dapp-wrapper.queue' | translate }}
              </h5>
            </div>
          </template>
          <span
            v-if="queueCount === 0 && queueErrorCount === 0"
            class="p-3 d-block"
          >
            {{ '_evan.dapp-wrapper.empty-queue' | translate }}
          </span>
          <div
            v-for="(instance, index) in queueInstances"
            :id="`evan-panel-queue-${ index }`"
            :key="instance.stepIndex"
            class="p-3"
          >
            <template v-if="instance.dispatcher">
              <div class="d-flex">
                <strong class="d-flex align-items-center mb-2">
                  <i
                    v-if="queueErrorCount"
                    class="mdi mdi-alert text-danger mr-2"
                  />
                  {{ instance.dispatcher.title | translate }}
                </strong>
                <span class="mx-auto" />
                <span>
                  {{ `${ ~~((instance.stepIndex / instance.dispatcher.steps.length) * 100) } %` }}
                </span>
              </div>

              <div class="d-flex align-items-end">
                <div
                  v-if="instance.dispatcher"
                  class="w-100 d-flex align-items-center"
                >
                  <div
                    class="progress w-100"
                    style="height: 1.3em"
                  >
                    <div
                      class="progress-bar bg-primary"
                      :class="{ 'progress-bar-animated progress-bar-striped': instance.running }"
                      :style="{ 'width': `${ (instance.stepIndex / instance.dispatcher.steps.length) * 100 }%` }"
                    />
                  </div>
                  <i
                    v-if="instance.status === 'running' && instance.stepIndex < instance.dispatcher.steps.length - 1"
                    class="mdi mdi-pause ml-3 text-muted clickable"
                    style="font-size: 1.5em"
                    @click="instance.stop()"
                  />
                  <div
                    v-if="instance.status === 'running' || instance.status === 'stopping'"
                    class="spinner-grow spinner-grow-sm ml-3"
                  />
                  <template v-if="instance.status !== 'running' && instance.status !== 'stopping'">
                    <i
                      class="mdi mdi-play-circle-outline ml-3 clickable"
                      style="font-size: 1.5em"
                      @click="startDispatcherInstance(instance);"
                    />
                    <i
                      class="mdi mdi-close-circle-outline ml-3 clickable"
                      style="font-size: 1.5em"
                      @click="
                        instanceInteraction = { type: 'delete', instance: instance };
                        $refs.instanceInteraction.show();
                      "
                    />
                  </template>
                </div>
              </div>
              <span
                v-if="instance.error"
                class="mt-3 text-wrap"
              >
                {{ '_evan.dapp-wrapper.queue-error' | translate }}
              </span>
            </template>
            <div v-else>
              <strong class="m-0 font-weight-bold mb-2">
                {{ '_evan.dispatcher-not-found' | translate }}
              </strong>
            </div>
          </div>
        </evan-swipe-panel>
      </div>
    </template>
    <div
      v-else
      class="dapp-wrapper-body bg-level-3 h-100"
    >
      <evan-loading />
    </div>
  </div>
</template>

<script lang="ts">
import Component from './dapp-wrapper';

export default Component;
</script>
