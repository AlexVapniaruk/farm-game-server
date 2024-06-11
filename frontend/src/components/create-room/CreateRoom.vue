<script setup lang="ts">
import {createRoom} from "@/api-sdk/room.ts";
import { useRouter } from 'vue-router'

const router = useRouter();
const playerId = localStorage.getItem('playerId') as string;
const createRoomHandler = async () => {
  const { data } = await createRoom(playerId);

  if(data?.roomId) {
    router.push(`/room/${data.roomId}`)
  }
}
</script>

<template>
<div>
  <v-btn @click="createRoomHandler">Створити Кімнату</v-btn>
</div>
</template>

<style scoped>

</style>