<template>
  <div class="wrapper">
    <template v-if="contacts && contacts.length">
      <p>{{ `${i18nScope}.description` | translate }}</p>

      <evan-form-control-v-select
        id="shareContactSelect"
        v-model="selectedContact"
        class="loading"
        :disabled="contacts.length === 0"
        :label="$t('_evan.sharing.selectContact')"
        :options="contacts"
        required="true"
        @input="getPermissionsForContact"
      />

      <template v-if="selectedContact">
        <evan-loading v-if="isLoading" />
        <template v-else>
          <p
            v-if="selectedContact"
            class="mt-6 mb-0"
          >
            {{ $t('_evan.sharing.defineFor', { contactName: selectedUsername }) }}
          </p>

          <div
            v-for="address in Object.keys(containersPermissions)"
            :key="address"
          >
            <evan-permissions
              :label="containersPermissions[address].label"
              :permissions="containersPermissions[address].permissions"
              :contract-id="address"
              :update-permissions="updateContractPermissions"
              :i18n-scope="i18nScope"
              :sort-filter="getSortFilter(address)"
            />
          </div>
        </template>
      </template>
    </template>
    <div v-else>
      <p>{{ `${i18nScope}.description-no-contacts` | translate }}</p>
      <div class="text-center my-5">
        <evan-button
          type="primary"
          :href="`#/${dapp.rootEns}/assets.evan/contacts`"
        >
          {{ '_evan.sharing.add-contact' | translate }}
        </evan-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Component from './permissions-editor';

export default Component;
</script>
