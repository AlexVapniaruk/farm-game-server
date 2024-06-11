<script setup lang="ts">
import PlayerList from "@/components/room/sidebar/PlayerList.vue";

const props = defineProps(['players']);
</script>

<template>
<div class="sidebar">
  <div>
    <PlayerList :players="props.players"/>
  </div>
</div>
</template>

<style scoped>
.sidebar {
  padding: 16px;
}
</style>