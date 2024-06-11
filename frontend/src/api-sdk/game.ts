export interface Player {
    id:string;
    name:string;
    online:boolean,
}
export enum gameStatuses {
    notStarted,
    running,
    finished
}

export interface Farm {
    rabbits: number;
    sheep: number;
    pigs: number;
    cows: number;
    horses: number;
    dogLevel1: boolean;
    dogLevel2: boolean;
}

export interface GamePlayer extends Player {
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