<template>
  <div class="evan-content-card">
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
        <template v-slot:head(feeInEve)="data">
          {{ data.label | translate }} <br>
          <span>(EVE)</span>
        </template>
        <template v-slot:cell(timestamp)="data">
          {{ data.item.timestamp | moment('L') }} {{ data.item.timestamp | moment('LT') }}
        </template>
      </evan-table>
    </div>
  </div>
</template>

<script lang="ts">
import DetailOverviewTransactionsComponent from './DetailOverviewTransactions';

export default DetailOverviewTransactionsComponent;
</script>
