<template>
  <div class="content-card">
    <h2 class="card-heading">
      {{ '_twin-detail.overview.transactions-title' | translate }}
    </h2>

    <table class="mt-4 simple">
      <thead>
        <th>
          {{ '_twin-detail.overview.amount' | translate }}
        </th>
        <th>
          {{ '_twin-detail.overview.name' | translate }}
        </th>
        <th>
          {{ '_twin-detail.overview.date' | translate }}
        </th>
        <th class="action" />
      </thead>
      <tbody>
        <tr
          v-for="row in transactions"
          :key="row.id"
        >
          <td class="amount">
            {{ row.amount }}
          </td>
          <td>{{ row.name }}</td>
          <td>{{ row.date }}</td>
          <td>
            <evan-button
              type="icon-secondary"
              icon="mdi mdi-chevron-right"
            />
          </td>
        </tr>
      </tbody>
    </table>
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
  padding: 24px 32px;

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
    padding-left: 8px;
  }

  th.action {
    width: 48px;
  }

  td.amount {
    font-weight: 600;
  }
}
</style>
