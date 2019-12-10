/*
  Copyright (C) 2018-present evan GmbH.

  This program is free software: you can redistribute it and/or modify it
  under the terms of the GNU Affero General Public License, version 3,
  as published by the Free Software Foundation.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
  See the GNU Affero General Public License for more details.

  You should have received a copy of the GNU Affero General Public License
  along with this program. If not, see http://www.gnu.org/licenses/ or
  write to the Free Software Foundation, Inc., 51 Franklin Street,
  Fifth Floor, Boston, MA, 02110-1301 USA, or download the license from
  the following URL: https://evan.network/license/
*/

<template>
  <div>
    <div class="row mt-5">
      <div class="col-3">
        <h1 class="h4">{{ '_assets.contacts.contacts-title' | translate }}</h1>
      </div>
      <div class="col-9 text-right">
        <evan-button :type="'text'">{{'_assets.contacts.favorites' | translate }}</evan-button>
        <evan-button :type="'text'">{{'_assets.contacts.users' | translate }}</evan-button>
        <evan-button :type="'text'">{{'_assets.contacts.companies' | translate }}</evan-button>
        <evan-button :type="'text'">{{'_assets.contacts.iot-devices' | translate }}</evan-button>
        <evan-button :type="'text'">{{'_assets.contacts.all' | translate }}</evan-button>
      </div>
    </div>
    <b-table
      class="evan-table"
      hover
      :items="data"
      :fields="columns"
      :tbody-tr-class="'evan-table-body-row'"
      :thead-tr-class="'evan-table-head-row'"
      :thead-class="'evan-table-head'"
      @row-clicked="handleRowClicked"
      sticky-header="80vh"
    >
      <template v-slot:cell(alias)="data">{{ data.item.alias ? data.item.alias: data.item.address }}</template>
      <template v-slot:cell(icon)="data">
        <i class="table-icon" :class="data.item.icon"></i>
      </template>
      <template v-slot:cell(favorite)="data">
        <i class="table-icon" :class="{'mdi mdi-star': data.item.favorite}"></i>
      </template>
    </b-table>
    <evan-loading v-if="isLoading" :classes="'mt-3'"></evan-loading>

    <evan-button
      :type="'icon-primary'"
      size="lg"
      class="add-contact-btn"
      icon="mdi mdi-plus"
      @click="$refs.addContact.showPanel()"
    ></evan-button>

    <add-contact ref="addContact" />
  </div>
</template>

<script lang="ts">
import ContactsComponent from './Contacts';
export default ContactsComponent;
</script>

<style lang="scss" scoped>
.add-contact-btn {
  position: fixed;
  bottom: 40px;
  right: 60px;
}

/deep/ .evan-swipe-panel.light {
  .light & {
    background-color: cssVar('body-bg');

    &,
    h1,
    h2,
    h3,
    h4,
    h5,
    span,
    p,
    li,
    b,
    label,
    small {
      color: cssVar('text-color');
    }
  }
}
</style>
