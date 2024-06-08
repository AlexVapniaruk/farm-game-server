import {Player} from './rooms';
import {getRandomInt, shuffleArray} from "./helpers";

enum gameStatuses {
    notStarted,
    running,
    finished
}

enum animals {
    rabbit,
    sheep,
    pig,
    cow,
    horse,
    dogLevel1,
    dogLevel2
};

interface Farm {
    rabbits: number;
    sheep: number;
    pigs: number;
    cows: number;
    horses: number;
    dogLevel1: boolean;
    dogLevel2: boolean;
}

interface GamePlayer extends Player {
    farm: Farm
}

export interface GameState {
    status: number;
    playingId: string | null;
    winnerId: string | null;
    moveNumber: number;
    cubesPlayed: boolean;
    redCubeNumber: number;
    blueCubeNumber: number;
    dogLevel1bought: number;
    dogLevel2bought: number;
    playingOrder: string[];
    players: GamePlayer[];
}

export interface Games {
    [key: string]: GameState;
}

const newGame: GameState = {
    status: gameStatuses.notStarted,
    playingId: '',
    winnerId: '',
    moveNumber: 0,
    redCubeNumber: 0,
    blueCubeNumber: 0,
    cubesPlayed: false,
    dogLevel1bought: 0,
    dogLevel2bought: 0,
    playingOrder: [],
    players: [],
};

const newFarm: Farm = {
    rabbits: 0,
    sheep: 0,
    pigs: 0,
    cows: 0,
    horses: 0,
    dogLevel1: false,
    dogLevel2: false,
};

const games: Games = {};

export function createGame(roomId: string) {
    games[roomId] = {...newGame};
}

export function getGame(roomId: string) {
    return games[roomId];
}

export function startGame(roomId: string, players: Player[]) {
    const game = games[roomId];
    const playersOrder = shuffleArray(players.map((player) => player.id));

    game.status = gameStatuses.running;
    game.playingId = playersOrder[0];
    game.blueCubeNumber = getRandomBlueAnimal();
    game.redCubeNumber = getRandomRedAnimal();
    game.moveNumber = 1;
    game.playingOrder = playersOrder;
    game.players = players.filter((player: Player) => player.online).map((player): GamePlayer => {
        return {
            ...player,
            farm: {...newFarm},
        };
    });

    games[roomId] = game;

    return games[roomId];
}

export function getRandomBlueAnimal() {
    // Generate a random number between 1 and 12
    const randomNum = Math.floor(Math.random() * 12) + 1;

    // Map the number to the corresponding animal
    let animal;
    switch (randomNum) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
            animal = 0;
            break;
        case 7:
        case 8:
        case 9:
            animal = 1;
            break;
        case 10:
            animal = 2;
            break;
        case 11:
            animal = 3;
            break;
        case 12:
            animal = 4;
            break;
        default:
            animal = 5;
    }

    return animal;
}

export function getRandomRedAnimal() {
    // Generate a random number between 1 and 12
    const randomNum = Math.floor(Math.random() * 12) + 1;

    // Map the number to the corresponding animal
    let animal;
    switch (randomNum) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
            animal = 0;
            break;
        case 7:
        case 8:
            animal = 1;
            break;
        case 9:
        case 10:
            animal = 2;
            break;
        case 11:
            animal = 3;
            break;
        case 12:
            animal = 4;
            break;
        default:
            animal = 5;
    }

    return animal;
}

function reproduceAnimal(animalCount:number, animalKey:number, blueAnimalKey:number, redAnimalKey:number) {
    let animalNew = 0;
    if (redAnimalKey === animalKey && blueAnimalKey === animalKey) {
        animalNew = animalCount + Math.floor(animalCount / 2);
        animalNew = animalCount + 1;
    } else if (redAnimalKey === animalKey || blueAnimalKey === animalKey) {
        animalNew = animalCount + Math.floor(animalCount / 2);
        if (animalCount % 2 === 1) {
            console.log(animalNew);
            animalNew = animalCount + 1;
        } else {
            console.log(animalNew, animalCount, animalKey, blueAnimalKey, redAnimalKey);
        }
    }
    return animalNew;
}

export function dropCubes(roomId: string) {
    let game = games[roomId];
    const blueAnimalKey = getRandomBlueAnimal();
    const redAnimalKey = getRandomRedAnimal();
    game.blueCubeNumber = blueAnimalKey;
    game.redCubeNumber = redAnimalKey;
    const farm = getFarm(game);

    if (farm) {
        farm.rabbits = reproduceAnimal(farm.rabbits, 0, blueAnimalKey, redAnimalKey);
        farm.sheep = reproduceAnimal(farm.sheep, 1, blueAnimalKey, redAnimalKey);
        farm.pigs = reproduceAnimal(farm.pigs, 2, blueAnimalKey, redAnimalKey);
        farm.cows = reproduceAnimal(farm.cows, 3, blueAnimalKey, redAnimalKey);
        farm.horses = reproduceAnimal(farm.horses, 4, blueAnimalKey, redAnimalKey);

        if(redAnimalKey === 4 && !farm.dogLevel1) {//fox
            farm.rabbits = 0;
        } else {
            farm.dogLevel1 = false;
        }

        if(blueAnimalKey === 4 && !farm.dogLevel2) {//wolf
            farm.rabbits = 0;
            farm.pigs = 0;
            farm.sheep = 0;
            farm.cows = 0;
        } else {
            farm.dogLevel2 = false;
        }

        game = updateFarm(game, farm);
    }

    return game;
}

export function getFarm(game:GameState) {
    return game.players.find((player) => {
        if(player.id === game.playingId) {
            return player;
        }
    })?.farm;
}

export function updateFarm(game:GameState, farm:Farm) {
    game.players = game.players.map((player:GamePlayer) => {
        if (player.id === game.playingId) {
            player.farm = farm;
        }
        return player;
    });
    return game;
}
export function buyAnimal(roomId:string, animalKey:number) {
    let game = games[roomId];
    const farm = getFarm(game);

    if(farm) {
        if (animalKey === animals.sheep) {
            farm.rabbits = farm.rabbits - 6;
            farm.sheep = farm.sheep + 1;
        }

        if(animalKey === animals.pig) {
            farm.sheep = farm.sheep - 2;
            farm.pigs = farm.pigs + 1;
        }

        if(animalKey === animals.cow) {
            farm.pigs = farm.pigs - 3;
            farm.cows = farm.cows + 1;
        }

        if(animalKey === animals.horse) {
            farm.cows = farm.cows - 2;
            farm.horses = farm.horses + 1;
        }

        if(animalKey === animals.dogLevel1) {
            farm.sheep = farm.sheep - 1;
            farm.dogLevel1 = true;
        }

        if(animalKey === animals.dogLevel2) {
            farm.cows = farm.cows - 1;
            farm.dogLevel2 = true;
        }

        game = updateFarm(game, farm);
    }

    return game;

}