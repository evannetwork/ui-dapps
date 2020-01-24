<template>
  <div class="content-card">
    <h2 class="card-heading">
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
          <td>{{ '_twin-detail.overview.did' | translate }}</td>
          <td class="value">
            {{ did }}
          </td>
          <td>
            <evan-button
              type="icon-secondary"
              icon="mdi mdi-content-copy"
            />
          </td>
        </tr>
        <tr>
          <td>{{ '_twin-detail.overview.owner' | translate }}</td>
          <td>{{ owner }}</td>
          <td>
            <evan-button
              type="icon-secondary"
              icon="mdi mdi-chevron-right"
            />
          </td>
        </tr>
        <tr>
          <td>{{ '_twin-detail.overview.created-at' | translate }}</td>
          <td>{{ createdAt }}</td>
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
.content-card {
  background: white;
  border-radius: 4px;
  width: 604px;
  padding: 24px 32px;

  .card-heading {
    font-size: 18px;
    font-weight: bold;
  }
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
    width: 50px;
  }
}
</style>
