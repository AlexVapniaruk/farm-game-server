<script setup lang="ts">
import socket from "@/api-sdk/sockets.ts";
import {onMounted, reactive, watch} from "vue";
import {GamePlayer} from "@/api-sdk/game.ts";


const props = defineProps(['game']);
const playerId = localStorage.getItem('playerId');
let playing = props.game.players.find((player:GamePlayer) => player.id === props.game.playingId);
let winner = props.game.players.find((player:GamePlayer) => player.id === props.game.winnerId);

const state = reactive({
  isRotating: false
})

watch(() => props.game, () => {
  playing = props.game.players.find((player:GamePlayer) => player.id === props.game.playingId)
  winner = props.game.players.find((player:GamePlayer) => player.id === props.game.winnerId)
});

enum animals {
  rabbit,
  sheep,
  pig,
  cow,
  horse,
  dogLevel1,
  dogLevel2,
  fox,
  wolf
};

const redCubeList = [
  'rabbit', 'sheep', 'pig', 0, 'horse', 0, 0, 'fox', 0
];

const blueCubeList = [
  'rabbit', 'sheep', 'pig', 'cow', 0, 0, 0, 0, 'wolf'
];

onMounted(async () => {
  socket.on('playCubesAnimation', () => startRotation());
});

const startRotation = () => {
  state.isRotating = true;
  setTimeout(() => {
    state.isRotating = false;
  }, 2000); // 2 seconds
};

const playCubes = () => {
  startRotation();
  socket.emit('playCubes', {})
};

const buyAnimal = (animalKey:number) => {
  socket.emit('buyAnimal', { animalKey })
};

const endMove = () => {
  socket.emit('endMove', {})
};
</script>

<template>
<div class="game-in-progress">
  <div>
  <div class="player-move">
    <div v-if="!game.winnerId">
      <div v-if="playing.id !== playerId">Виконує хід: {{ playing.name }}</div>
      <div v-else>Ваш хід</div>
    </div>
    <div v-else>
      Переміг {{ winner.name}}!!!
    </div>
  </div>
  <div class="cubes">
    <div>
      <div class="cubes-list">
        <div class="cube red-cube rotatable" :class="{ 'rotate': state.isRotating }">
          <img width="60" height="60" :src="`/src/assets/img/cube/${redCubeList[props.game.redCubeNumber]}.png`"/>
        </div>
        <div class="cube blue-cube rotatable" :class="{ 'rotate': state.isRotating }">
          <img width="60" height="60" :src="`/src/assets/img/cube/${blueCubeList[props.game.blueCubeNumber]}.png`"/>
        </div>
      </div>
      <div v-if="!winner && playing.id === playerId" class="controls">
        <div class="buttons-list">
          <v-btn
              class="drop-cubes-button"
              color="secondary"
              :disabled="props.game.cubesPlayed"
              @click="playCubes"
          >
            Кинути кубіки
          </v-btn>
          <v-btn
              :disabled="playing.farm.dogLevel1 || game.dogLevel1bought === 4 || playing.farm.sheep === 0"
              @click="() => buyAnimal(animals.dogLevel1)"
          >
            Купити дворнягу
          </v-btn>
          <v-btn
              :disabled="playing.farm.dogLevel2 || game.dogLevel2bought === 2 || playing.farm.cows === 0"
              @click="() => buyAnimal(animals.dogLevel2)"
          >
            Купити вовкодава
          </v-btn>
          <v-btn
              :disabled="playing.farm.rabbits < 6"
              @click="() => buyAnimal(animals.sheep)"
          >
            Купити вівцю
          </v-btn>
          <v-btn
              :disabled="playing.farm.sheep < 2"
              @click="() => buyAnimal(animals.pig)"
          >
            Купити свиню
          </v-btn>
          <v-btn
              :disabled="playing.farm.pigs < 3"
              @click="() => buyAnimal(animals.cow)"
          >
            Купити корову
          </v-btn>
          <v-btn
              :disabled="playing.farm.cows < 2"
              @click="() => buyAnimal(animals.horse)"
          >
            Купити коня
          </v-btn>
          <v-btn
              color="error"
              :disabled="!props.game.cubesPlayed"
              @click="() => endMove()"
          >
            Завершити хід
          </v-btn>
        </div>
      </div>
    </div>
  </div>
  </div>
  <div class="animal-board">
    <div class="exchange">
      <div class="exchange-row">
        <div>6</div>
        <div>
        <img src="@/assets/img/rabbit.png">
        </div>
        <div>
          =
        </div>
        <div>1</div>
        <div>
          <img src="@/assets/img/sheep.png">
        </div>
      </div>
      <div class="exchange-row">
        <div>2</div>
        <div>
          <img src="@/assets/img/sheep.png">
        </div>
        <div>
          =
        </div>
        <div>1</div>
        <div>
          <img src="@/assets/img/pig.png">
        </div>
      </div>
      <div class="exchange-row">
        <div>3</div>
        <div>
          <img src="@/assets/img/pig.png">
        </div>
        <div>
          =
        </div>
        <div>1</div>
        <div>
          <img src="@/assets/img/cow.png">
        </div>
      </div>
      <div class="exchange-row">
        <div>2</div>
        <div>
          <img src="@/assets/img/cow.png">
        </div>
        <div>
          =
        </div>
        <div>1</div>
        <div>
          <img src="@/assets/img/horse.png">
        </div>
      </div>
    </div>
    <div class="exchange exchange-dog">
      <div class="exchange-row">
        <div>1</div>
        <div>
          <img src="@/assets/img/sheep.png">
        </div>
        <div>
          =
        </div>
        <div>1</div>
        <div>
          <img src="@/assets/img/doglevel1.png">
        </div>
      </div>
      <div class="exchange-row">
        <div>1</div>
        <div>
          <img src="@/assets/img/cow.png">
        </div>
        <div>
          =
        </div>
        <div>1</div>
        <div>
          <img src="@/assets/img/doglevel2.png">
        </div>
      </div>
    </div>
    <div class="animal-list">
      <div v-if="playing.farm.dogLevel1" class="dog">
        <img src="@/assets/img/doglevel1.png"/>
      </div>
      <div class="animal-count" v-if="playing.farm.rabbits > 5">{{ playing.farm.rabbits }}</div>
      <div v-for="n in 5" class="animal">
        <img v-if="n <= playing.farm.rabbits" src="@/assets/img/rabbit.png" class="animal rabbit no-filter"/>
        <div v-else class="animal rabbit hue-filter"/>
      </div>
    </div>
    <div class="animal-list">
      <div v-if="playing.farm.dogLevel2" class="dog">
        <img src="@/assets/img/doglevel2.png"/>
      </div>
      <div class="animal-count" v-if="playing.farm.sheep > 4">{{ playing.farm.sheep }}</div>
      <div v-for="n in 4" class="animal">
        <img v-if="n <= playing.farm.sheep" src="@/assets/img/sheep.png" class="animal sheep no-filter"/>
        <div v-else class="animal sheep hue-filter"/>
      </div>
    </div>
    <div class="animal-list">
      <div class="animal-count" v-if="playing.farm.pigs > 3">{{ playing.farm.pigs }}</div>
      <div v-for="n in 3" class="animal">
        <img v-if="n <= playing.farm.pigs" src="@/assets/img/pig.png" class="animal pig no-filter"/>
        <div v-else class="animal pig hue-filter"/>
      </div>
    </div>
    <div class="animal-list">
      <div class="animal-count" v-if="playing.farm.cows > 2">{{ playing.farm.cows }}</div>
      <div v-for="n in 2" class="animal">
        <img v-if="n <= playing.farm.cows" src="@/assets/img/cow.png" class="animal cow no-filter"/>
        <div v-else class="animal cow hue-filter"/>
      </div>
    </div>
    <div class="animal-list">
      <div class="animal-count" v-if="playing.farm.horses > 1">{{ playing.farm.horses }}</div>
      <div v-for="n in 1" class="animal">
        <img v-if="n <= playing.farm.horses" src="@/assets/img/horse.png" class="animal horse no-filter"/>
        <div v-else class="animal horse hue-filter"/>
      </div>
    </div>
    <div class="animal-list">
      <div v-if="playing.dogLevel1" class="dog-level-1">
        dog 1
      </div>
      <div v-if="playing.dogLevel2" class="dog-level-2">
        dog 2
      </div>
    </div>
  </div>
</div>
</template>

<style scoped lang="scss">
.game-in-progress {
  display: flex;
}

.player-move {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
  background: lightgoldenrodyellow;
  border-radius: 8px;
  width: 350px;
  margin: 0 auto 20px;
}

.animal-board {
  flex-grow: 1;
  align-items: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  position: relative;
}

.exchange {
  position: absolute;
  bottom: 0;
  left: 0;
  font-size: 40px;
  background: lightgray;
  padding: 8px;
  border-radius: 8px;
}

.exchange-dog {
  right: 0;
  left: auto;
}

.exchange-row {
  display: flex;
  align-items: center;
  gap: 8px;

  img {
    width: 50px;
    height: 50px;
  }

  div {
    display: flex;
    align-items: center;
  }
}

.animal-list {
  display: flex;
  justify-content: center;
  gap: 16px;
  position: relative;
}

.dog {
  position: absolute;
  right: -120px;

  & img {
    width: 125px;
    height: 125px;
  }
}
.cubes {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 20px;
}

.animal {
  width: 125px;
  height: 125px;
  border-radius: 50%;
  background-size: cover;
  background-position: center center;

  img {
    filter: none !important;
  }
}

.cubes-list {
  display: flex;
  justify-content: center;
}

.drop-cubes-button {
  margin-bottom: 30px;
}
.cube {
  width: 150px;
  height: 150px;
  background-size: cover;
  background-position: center center;
  background-color: black;
  display: flex;
  justify-content: center;
  align-items: center;
}

.red-cube {
  background: url('@/assets/img/red-cube.png');
}

.blue-cube {
  background: url('@/assets/img/blue-cube.png');
}

.hue-filter {
  filter: grayscale(90%) hue-rotate(30deg);
}

.no-filter {
  filter: none !important;
  position: relative;
  z-index: 1;
}

.rabbit {
  background-image: url('@/assets/img/rabbit.png');
}
.sheep {
  background-image: url('@/assets/img/sheep.png');
}
.pig {
  background-image: url('@/assets/img/pig.png');
}
.cow {
  background-image: url('@/assets/img/cow.png');
}
.horse {
  background-image: url('@/assets/img/horse.png');
}

.buttons-list {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
  margin-top: 10px;
}

.animal-count {
  position: absolute;
  top: 0;
  color: red;
  font-weight: 500;
  font-size: 26px;
  z-index: 10;
  background: white;
  border-radius: 50px;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.controls {
  margin-top: 10px;
  display: flex;
  justify-content: center;
  flex-direction: column;
}

.rotate {
  animation: shakeRotate 2s linear;
  filter: blur(3px);

  & img {
    filter: blur(10px);
  }
}

@keyframes shakeRotate {
  0% {
    transform: rotate(0deg) translate3d(0, 0, 0);
  }
  10%, 90% {
    transform: rotate(108deg) translate3d(-1px, 0, 0);
  }
  20%, 80% {
    transform: rotate(216deg) translate3d(2px, 0, 0);
  }
  30%, 70% {
    transform: rotate(324deg) translate3d(-4px, 0, 0);
  }
  40%, 60% {
    transform: rotate(432deg) translate3d(4px, 0, 0);
  }
  50% {
    transform: rotate(540deg) translate3d(0, 0, 0);
  }
  100% {
    transform: rotate(1080deg) translate3d(0, 0, 0);
  }
}
</style>