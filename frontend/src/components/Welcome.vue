<script setup lang="ts">

import CreateRoom from "@/components/create-room/CreateRoom.vue";
</script>

<template>
<div class="welcome">
  <div>
    Для початку гри створіть кімнату і пошарьте друзям посилання:
  </div>
  <CreateRoom/>
</div>
</template>

<style lang="scss" scoped>
.welcome {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  width: 700px;
  margin: 60vh auto 20vh;
  padding: 16px;
  background: rgba(225, 169, 44, 0.9);
  border-radius: 8px;
  border: 2px dashed black;
  height: 100vh;
}
</style>