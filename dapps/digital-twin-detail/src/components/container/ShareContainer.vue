<template>
  <div>
    <form>
      <evan-swipe-panel
        ref="shareContainerPanel"
        alignment="right"
        type="default"
        class="light"
        :show-backdrop="true"
        :title="$t('_twin-detail.data.sharing.sharing-title')"
      >
        <evan-permissions-editor
          :contacts="contacts"
          :load-permissions="loadPermissions"
          :update-permissions="updatePermissions"
          i18n-scope="_twin-detail.data.sharing"
          @init="permissionsEditor = $event"
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
              class="flex-grow-1"
              :label="'_twin-detail.data.sharing.update-sharing' | translate"
              @click="permissionsEditor.writePermissions()"
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
