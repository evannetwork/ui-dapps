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
        class="simple clickable-rows"
        :items="transactions"
        :fields="columns"
        :show-empty="true"
        @row-clicked="onRowClicked"
      >
        <template v-slot:cell(timestamp)="data">
          {{ data.item.timestamp | moment('L') }}
          {{ data.item.timestamp | moment('LT') }}
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

  td.amount {
    font-weight: 600;
  }
}
</style>
