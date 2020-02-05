<template>
  <div>
    <evan-swipe-panel
      ref="listItemDetailPanel"
      alignment="right"
      type="default"
      class="light"
      :show-backdrop="true"
      :hide-close-button="false"
      :title="$t('_twin-detail.data.list.list-item-detail.title')"
    >
      <data-set-form
        :data-schema="schema.items"
        :editable="false"
        :shareable="false"
        :is-loading="$store.state.container.dispatcherStates.entries[name]"
        :name="name"
        :value="value"
        :only-form="true"
        @init="dataSetForm = $event"
      />

      <template v-slot:footer>
        <div class="d-flex">
          <evan-button
            type="primary"
            class="flex-grow-1"
            :label="'_twin-detail.data.list.list-item-detail.close' | translate"
            @click="closePanel"
          />
        </div>
      </template>
    </evan-swipe-panel>
  </div>
</template>

<script lang="ts">
import ListItemDetail from './ListItemDetail';

export default ListItemDetail;
</script>

<style lang="scss" scoped>

</style>
