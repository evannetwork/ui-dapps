<template>
  <div>
    <form @submit.prevent="onSave">
      <evan-swipe-panel
        ref="shareContainerPanel"
        alignment="right"
        type="default"
        class="light"
        :show-backdrop="true"
        :title="$t('_twin-detail.data.list.share.share-title')"
      >
        <evan-permissions-editor
          :contacts="contacts"
          :selected-contact="selectedSharedContacts"
          :load-permissions="loadPermissions"
          :update-permissions="updatePermissions"
          :on-select="handleOnSelect"
          :sort-filters="$store.state.profileDApp.sharingFilter"
          i18n-scope="_profile.sharing"
          @init="permissionsEditor = $event"
        />

        <template v-slot:footer>
          <div class="d-flex">
            <evan-button
              type="secondary"
              class="flex-grow-1"
              :label="'_twin-detail.data.list.share.cancel' | translate"
              @click="closePanel"
            />

            <evan-button
              type="primary"
              native-type="submit"
              class="flex-grow-1"
              :label="'_twin-detail.data.list.share.update-sharing' | translate"
            />
          </div>
        </template>
      </evan-swipe-panel>
    </form>
  </div>
</template>

<script lang="ts">
import ListItemDetail from './ListItemDetail';

export default ListItemDetail;
</script>

<style lang="scss" scoped>

</style>
