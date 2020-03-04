<template>
  <div>
    <table
      v-if="permissions"
      class="permissions"
    >
      <thead>
        <th>
          <h4> {{ getTranslation('name') }} </h4>
        </th>
        <th>
          <small>{{ '_evan.read' | translate }}</small>
          <evan-form-control-checkbox
            :id="`${contractId}-read-all`"
            v-model="readAll"
            @input="val => updateAll('read', val)"
          />
        </th>
        <th>
          <small>{{ '_evan.write' | translate }}</small>
          <evan-form-control-checkbox
            :id="`${contractId}-write-all`"
            v-model="readWriteAll"
            @input="val => updateAll('readWrite', val)"
          />
        </th>
      </thead>
      <tbody>
        <tr
          v-for="property in computedSortFilter"
          :key="property"
        >
          <template v-if="permissions[property]">
            <td class="caption">
              <span>{{ getTranslation(`${property}.name`, property) }}</span>
              <span :title="getPropertyFieldDescription(permissions, property)">
                {{ getPropertyFieldDescription(permissions, property) }}
              </span>
            </td>
            <td>
              <evan-form-control-checkbox
                :id="`${contractId}-${property}-read`"
                :value="permissions[property].read"
                @input="val => setRead(property, val)"
              />
            </td>
            <td>
              <evan-form-control-checkbox
                :id="`${contractId}-${property}-write`"
                :value="permissions[property].readWrite"
                @input="val => setReadWrite(property, val)"
              />
            </td>
          </template>
        </tr>
      </tbody>
    </table>
    <div v-else>
      <p class="p-6 text-error">
        {{ 'evan.sharing.noPermissions' | translate }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import Component from './permissions';

export default Component;
</script>

<style lang="scss" scoped>
  @import './permissions.scss'
</style>
