<script setup lang="ts">
import EnterName from "@/components/enter-name/EnterName.vue";
import { reactive, onMounted } from 'vue';

const state = reactive({
  hasName: false,
});

onMounted(() => {
  isPlayerName();
  isPlayerId();
});

const generateUuid = () => {
  return Math.random().toString(36).substring(2, 10); // Generate a random alphanumeric string
}

const isPlayerName = () => {
  const playerName = localStorage.getItem('playerName');
  if(playerName && playerName !== '') {
    state.hasName = true;
  }
}

const isPlayerId = () => {
  const playerId = localStorage.getItem('playerId');
  if(!playerId || playerId === '') {
    localStorage.setItem('playerId', generateUuid())
  }
}
const saveNameHandler = () => {
  isPlayerId();
  isPlayerName();
}
</script>

<template>
  <v-app class="app">
    <EnterName v-if="!state.hasName" @save-name="saveNameHandler"/>
    <router-view v-else/>
  </v-app>
</template>

<style lang="scss" scoped>
.app {
  width: 100%;
  height: 100vh;
  background: url("@/assets/img/background.jpg");
  background-size: cover;
  display: flex;
  justify-content: center;
}
</style>
