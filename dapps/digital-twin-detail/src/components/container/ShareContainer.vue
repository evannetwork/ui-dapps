<template>
  <div>
    <form @submit.prevent="onSave">
      <evan-swipe-panel
        ref="shareContainerPanel"
        alignment="right"
        type="default"
        class="light"
        :show-backdrop="true"
        :title="$t('_twin-detail.data.sharing.sharing-title')"
      >
        <evan-loading v-if="!loaded" />
        <evan-permissions-editor
          v-if="loaded"
          :b-mail-content="$store.state.twin.sharingContext.bMailContent"
          :contacts="$store.state.twin.sharingContext.contacts"
          :load-permissions="loadPermissions"
          :on-select="onSelectContact"
          :selected-contact="selectedContact"
          :update-permissions="onUpdatePermissions"
          i18n-scope="_twin-detail.data.sharing"
          @init="permissionsEditor = $event"
          @permissionsChanged="hasChange = $event"
        />

        <template v-slot:footer>
          <div class="d-flex">
            <evan-button
              type="secondary"
              class="flex-grow-1"
              :label="'_twin-detail.data.sharing.cancel' | translate"
              @click="closePanel"
            />

            <evan-button
              type="primary"
              native-type="submit"
              class="ml-3 flex-grow-1"
              :disabled="isUpdateDisabled"
              :label="'_twin-detail.data.sharing.update-sharing' | translate"
            />
          </div>
        </template>
      </evan-swipe-panel>
    </form>
  </div>
</template>

<script lang="ts">
import ShareContainerComponent from './ShareContainer';

export default ShareContainerComponent;
</script>

<style lang="scss" scoped>

</style>
