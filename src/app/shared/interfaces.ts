export interface Player {
    id: number;
    name: string;
    score: number;
    isEliminated: boolean;
    rounds: number[];
}

export interface Round {
    id: number;
    scores: { playerId: number; score: number }[];
    timestamp: Date;
} 