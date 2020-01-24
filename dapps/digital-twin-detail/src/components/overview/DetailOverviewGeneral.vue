<template>
  <div class="content-card">
    <h2 class="card-heading">
      {{ '_twin-detail.general' | translate }}
    </h2>

    <table>
      <tbody>
        <tr>
          <td>{{ '_twin-detail.did' | translate }}</td>
          <td>{{ 'did' }}</td>
          <td>
            <evan-button
              type="icon-secondary"
              icon="mdi mdi-content-copy"
            />
          </td>
        </tr>
        <tr>
          <td>{{ '_twin-detail.owner' | translate }}</td>
          <td>{{ 'owner' }}</td>
          <td>
            <evan-button
              type="icon-secondary"
              icon="mdi mdi-chevron-right"
            />
          </td>
        </tr>
        <tr>
          <td>{{ '_twin-detail.created-at' | translate }}</td>
          <td>{{ 'createdAt' }}</td>
          <td />
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import { EvanComponent } from '@evan.network/ui-vue-core';
// import { Prop } from 'vue-property-decorator';

@Component({
  name: 'detail-overview-general',
})
export default class DetailOverviewGeneralComponent extends mixins(EvanComponent) {
  // @Prop() did: string = null;

  // @Prop() owner: string = null;

  // @Prop() createdAt: string = null;

  /* created(): void {
         console.log(this.did, this.owner, this.createdAt);
       } */
}

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
</style>
