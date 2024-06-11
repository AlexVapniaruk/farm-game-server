<script setup lang="ts">
import StartGame from "@/components/room/game/StartGame.vue";
import {gameStatuses} from "@/api-sdk/game.ts";
import GameInProgress from "@/components/room/game/GameInProgress.vue";
const props = defineProps(['hostId', 'roomId', 'game']);
const playerId = localStorage.getItem('playerId');
</script>

<template>
<div class="game">
  <StartGame
      v-if="!props.game?.status || props.game?.status === gameStatuses.notStarted"
      :room-id="props.roomId"
      :host="props.hostId === playerId"
  />
  <GameInProgress
      v-else-if="!props.game?.status || props.game?.status === gameStatuses.running"
      :game="props.game"
  />
</div>
</template>

<style scoped lang="scss">
.game {
  user-select: none;
}
</style>