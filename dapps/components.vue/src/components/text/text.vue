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

  You can be released from the requirements of the GNU Affero General Public
  License by purchasing a commercial license.
  Buying such a license is mandatory as soon as you use this software or parts
  of it on other blockchains than evan.network.

  For more information, please contact evan GmbH at this address:
  https://evan.network/license/
*/

<template>
  <div>
    <div class="white-box border border-sm mt-3">
      <h3 class="header">Headers</h3>

      <div class="content">
        <div class="d-flex" v-for="(type) in [ 'h6', 'h5', 'h4', 'h3', 'h2', 'h1', ]">
          <component class="p-3" :is="type">{{ type }}</component>
          <component class="p-3" :is="type">normal</component>
          <component class="p-3 font-weight-semibold" :is="type">font-weight-semibold</component>
          <component class="p-3 font-weight-bold" :is="type">font-weight-bold</component>
        </div>
      </div>
    </div>

    <div class="white-box border border-sm mt-3">
      <h3 class="header">Texts</h3>

      <div class="content">
        <div class="d-flex" v-for="(type) in [ 'a', 'em', 'strong', 'small', 's',  'cite', 'q', 'dfn', 'abbr', 'data', 'time', 'code', 'var', 'samp', 'kbd', 'sub', 'su', 'i', 'b', 'u', 'mark', 'ruby', 'rt',  'rp',  'bdi', 'bdo', 'span',]">
          <component class="p-3" :is="type">{{ type }}</component>
          <component class="p-3" :is="type">normal</component>
          <component class="p-3 font-weight-semibold" :is="type">font-weight-semibold</component>
          <component class="p-3 font-weight-bold" :is="type">font-weight-bold</component>
        </div>
      </div>
    </div>

    <div class="white-box border border-sm mt-3">
      <h3 class="header">Links</h3>

      <div class="content">
        <a href="https://evan.network" target="_blank">I'm a link</a>
      </div>
    </div>
  </div>
</template>

