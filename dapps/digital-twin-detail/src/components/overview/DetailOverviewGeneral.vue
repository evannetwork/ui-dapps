<template>
  <div class="evan-content-card">
    <h2 class="card-heading mb-3">
      {{ '_twin-detail.overview.general-title' | translate }}
    </h2>

    <table>
      <thead>
        <th class="label" />
        <th class="value" />
        <th class="action" />
      </thead>
      <tbody>
        <tr>
          <td class="property">
            {{ '_twin-detail.overview.did' | translate }}
          </td>
          <td class="value">
            {{ did }}
          </td>
          <td class="action">
            <evan-button
              size="sm"
              type="icon-secondary"
              icon="mdi mdi-content-copy"
              @click="copyToClipboard(did)"
            />
          </td>
        </tr>
        <tr>
          <td class="property">
            {{ '_twin-detail.overview.contract-address' | translate }}
          </td>
          <td class="value">
            {{ $route.params.twin }}
          </td>
          <td class="action">
            <evan-button
              size="sm"
              type="icon-secondary"
              icon="mdi mdi-content-copy"
              @click="copyToClipboard($route.params.twin)"
            />
          </td>
        </tr>
        <tr>
          <td class="property">
            {{ '_twin-detail.overview.owner' | translate }}
          </td>
          <td>{{ ownerName }}</td>
          <td class="action">
            <evan-button
              size="sm"
              type="icon-secondary"
              icon="mdi mdi-chevron-right"
              @click="routeToOwner"
            />
          </td>
        </tr>
        <tr v-if="isOwner">
          <td class="property">
            {{ '_twin-detail.overview.created-at' | translate }}
          </td>
          <td>{{ createdAt | moment('DD.MM.YYYY') }}</td>
          <td />
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import DetailOverviewGeneralComponent from './DetailOverviewGeneral';

export default DetailOverviewGeneralComponent;
</script>

<style lang="scss" scoped>
.property {
  font-weight: 600;
}
table {
  width: 100%;

  .label {
    width: 120px;
  }
  .value {
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 370px;
    overflow: hidden;
  }
  .action {
    width: 48px;
    text-align: right;
  }
  tr {
    height: 48px;
  }
}
</style>
