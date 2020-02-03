<template>
  <div class="content-card">
    <h2 class="card-heading">
      {{ '_twin-detail.overview.transactions-title' | translate }}
    </h2>

    <evan-loading
      v-if="!transactions"
    />
    <div
      v-else
      class="d-flex flex-row mt-3"
    >
      <evan-table
        class="simple"
        :items="transactions"
        :fields="columns"
        :show-empty="true"
      >
        <template v-slot:cell(timestamp)="data">
          {{ data.item.timestamp | moment('DD.MM.YYYY') }}
        </template>
        <template v-slot:cell(action)="data">
          <evan-button
            size="sm"
            type="icon-secondary"
            icon="mdi mdi-chevron-right"
            target="_blank"
            class="visible-on-row-hover"
            :href="getRouteToTransactionExplorer(data.item.blockHash)"
          />
        </template>
      </evan-table>
    </div>
  </div>
</template>

<script lang="ts">
import DetailOverviewTransactionsComponent from './DetailOverviewTransactions';

export default DetailOverviewTransactionsComponent;
</script>

<style lang="scss" scoped>
@import '~@evan.network/ui/src/style/utils';

.content-card {
  background: white;
  border-radius: 4px;
  width: 604px;
  padding: 24px 24px;

  .card-heading {
    font-size: 18px;
    font-weight: bold;
  }
}
table.simple {
  width: 100%;

  thead {
    background-color: cssVar('gray-200');
    th {
      font-weight: 600;
      padding: 8px;
    }
  }

  td {
    padding: 8px;
  }

  th.action {
    width: 48px;
  }

  td.amount {
    font-weight: 600;
  }

  .show-on-hover {
    opacity: 0;
  }

  // 'hover' would be nicer, but collides with ui.libs
  &.hasHover {
    tr:hover {
      background-color: cssVar('gray-100');
      & .show-on-hover {
        opacity: 1;
      }
    }
  }
}
</style>
