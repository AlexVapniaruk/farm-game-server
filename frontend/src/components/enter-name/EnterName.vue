<script setup>
import { defineEmits } from 'vue';

const emit = defineEmits(['saveName'])
const name = defineModel();

const nameRules = [
  v => !!v || 'Name is required',
  v => (v && v.length <= 50) || 'Name must be less than 50 characters',
];

const saveName = () => {
  localStorage.setItem('playerName', name.value);
  // Trigger the 'save-name' event using the emits object
  emit('saveName');
};
</script>

<template>
<div class="enter-name">
  <div class="enter-name__form">
    <v-text-field
        v-model="name"
        :rules="nameRules"
        hide-details="auto"
        label="Введіть ім'я:"
    ></v-text-field>
    <v-btn
        type="button"
        @click="saveName"
    >
      Ok
    </v-btn>
  </div>
</div>
</template>

<style lang="scss" scoped>
.enter-name {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 20vh;

  &__form {
    display: flex;
    flex-direction: column;
    flex: 0 0 200px;
    gap: 8px;
  }
}
</style>