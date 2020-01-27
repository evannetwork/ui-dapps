<template>
  <div class="onpage-nav d-none d-md-block">
    <ul>
      <li
        v-for="entry of entries"
        :key="entry.id"
        class="pl-2 mt-2"
        :class="{active: activeItem === entry.id}"
        @click="scrollToElement(entry.id)"
      >
        {{ entry.label }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Component from './onpage-navigation';

export default Component;
</script>

<style lang="scss" scoped>
  @import './onpage-navigation.scss'
</style>
