<script setup lang="ts">
import socket from "@/api-sdk/sockets.ts";

const props = defineProps(['host', 'roomId']);

const startHandler = () => {
  socket.emit('startGame', { roomId: props.roomId });
};
</script>

<template>
  <div class="start-game">
    <div v-if="props.host">
      <v-btn class="start-button" color="secondary" width="500px" height="50px" @click="startHandler">Почати гру</v-btn>
    </div>
    <div v-else>
      Чекаємо... хост розпочне гру
    </div>
  </div>
</template>

<style scoped lang="scss">
.start-game {
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 600px;
  height: 100vh;
  padding: 16px;
  border-radius: 8px;
  margin: 0 auto;
}

.start-button {
  font-size: 24px;
}
</style>