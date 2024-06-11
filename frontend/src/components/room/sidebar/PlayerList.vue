<script setup lang="ts">
const props = defineProps(['players']);

const currectPlayerId = localStorage.getItem('playerId')
</script>

<template>
<div class="player-list">
  <div>Гравці:</div>
  <div
      v-for="player in props.players"
      :key="player.id" class="player-list__player"
      :class="{
        'player-list__player--current': currectPlayerId === player.id
  }">
      <div>{{ player.name }}</div>
      <div v-if="player.host">(host)</div>
      <div v-if="player.farm">{{ player.points }}</div>
      <div v-if="player.farm && player.farm.dogLevel1">
        <img src="@/assets/img/doglevel1.png" width="40" height="40"/>
      </div>
      <div v-if="player.farm && player.farm.dogLevel2">
        <img src="@/assets/img/doglevel2.png" width="40" height="40"/>
      </div>
      <div
          class="player-list__player-status"
          :class="{
        'player-list__player-status--online': player.online,
        'player-list__player-status--offline': !player.online
      }"></div>
  </div>
</div>
</template>

<style scoped lang="scss">
.player-list {
  background: lightgray;
  padding: 16px;
  border-radius: 8px;

  &__player {
    display: flex;
    align-items: center;
    padding: 4px;
    gap: 4px;

    &--current {
      color: palevioletred;
    }

    &-status {
      width: 10px;
      height: 10px;
      border-radius: 50%;

      &--online {
        background: green;
      }

      &--offline {
        background: grey;
      }
    }
  }
}
</style>