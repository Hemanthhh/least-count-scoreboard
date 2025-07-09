import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Player {
  id: number;
  name: string;
  score: number;
  isEliminated: boolean;
  rounds: number[];
}

interface Round {
  id: number;
  scores: { playerId: number; score: number }[];
  timestamp: Date;
}

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'Least Count Score Board';

  players: Player[] = [];
  rounds: Round[] = [];
  currentRound = 1;
  gameInProgress = false;
  gameEnded = false;
  winner: Player | null = null;

  newPlayerName = '';
  roundScores: { [playerId: number]: number | undefined } = {};
  editingRound: number | null = null;

  addPlayer() {
    if (this.newPlayerName.trim() && !this.gameInProgress) {
      const player: Player = {
        id: Date.now(),
        name: this.newPlayerName.trim(),
        score: 0,
        isEliminated: false,
        rounds: []
      };
      this.players.push(player);
      this.newPlayerName = '';
    }
  }

  removePlayer(playerId: number) {
    if (!this.gameInProgress) {
      this.players = this.players.filter(p => p.id !== playerId);
    }
  }

  startGame() {
    if (this.players.length >= 2) {
      this.gameInProgress = true;
      this.gameEnded = false;
      this.winner = null;
      this.currentRound = 1;
      this.rounds = [];

      // Reset all players (keep them but reset scores)
      this.players.forEach(player => {
        player.score = 0;
        player.isEliminated = false;
        player.rounds = [];
      });

      // Initialize round scores
      this.initializeRoundScores();
    }
  }

  initializeRoundScores() {
    this.roundScores = {};
    this.players.filter(p => !p.isEliminated).forEach(player => {
      this.roundScores[player.id] = undefined;
    });
  }

  submitRound() {
    const activePlayers = this.players.filter(p => !p.isEliminated);
    const roundData: Round = {
      id: this.currentRound,
      scores: [],
      timestamp: new Date()
    };

    // Process scores for each active player
    activePlayers.forEach(player => {
      const score = this.roundScores[player.id] ?? 0;
      roundData.scores.push({ playerId: player.id, score });

      // Update player score
      player.score += score;
      player.rounds.push(score);

      // Check if player is eliminated
      if (player.score > 100) {
        player.isEliminated = true;
      }
    });

    this.rounds.push(roundData);

    // Check if game is over
    const remainingPlayers = this.players.filter(p => !p.isEliminated);
    if (remainingPlayers.length === 1) {
      this.endGame(remainingPlayers[0]);
    } else if (remainingPlayers.length === 0) {
      this.endGame(null);
    } else {
      this.currentRound++;
      this.initializeRoundScores();
    }
  }

  editRound(roundId: number) {
    this.editingRound = roundId;
    const round = this.rounds.find(r => r.id === roundId);
    if (round) {
      // Load the round scores into the input fields
      this.roundScores = {};
      round.scores.forEach(score => {
        this.roundScores[score.playerId] = score.score;
      });
    }
  }

  saveRoundEdit() {
    if (this.editingRound === null) return;

    const round = this.rounds.find(r => r.id === this.editingRound);
    if (!round) return;

    // Reset all player scores to before this round
    this.players.forEach(player => {
      // Remove scores from this round onwards
      const roundsBeforeEdit = player.rounds.slice(0, round.id - 1);
      player.score = roundsBeforeEdit.reduce((sum, score) => sum + score, 0);
      player.rounds = roundsBeforeEdit;
      player.isEliminated = false;
    });

    // Update the round with new scores
    round.scores = [];
    this.players.forEach(player => {
      const score = this.roundScores[player.id] ?? 0;
      round.scores.push({ playerId: player.id, score });

      // Update player score
      player.score += score;
      player.rounds.push(score);

      // Check if player is eliminated
      if (player.score > 100) {
        player.isEliminated = true;
      }
    });

    // Recalculate all subsequent rounds
    const roundsAfterEdit = this.rounds.filter(r => r.id > this.editingRound!);
    roundsAfterEdit.forEach(r => {
      // Reset players for this round
      this.players.forEach(player => {
        const roundsBeforeThis = player.rounds.slice(0, r.id - 1);
        player.score = roundsBeforeThis.reduce((sum, score) => sum + score, 0);
        player.rounds = roundsBeforeThis;
        player.isEliminated = false;
      });

      // Reapply this round's scores
      r.scores.forEach(score => {
        const player = this.players.find(p => p.id === score.playerId);
        if (player) {
          player.score += score.score;
          player.rounds.push(score.score);
          if (player.score > 100) {
            player.isEliminated = true;
          }
        }
      });
    });

    // Check if game is over after edit
    const remainingPlayers = this.players.filter(p => !p.isEliminated);
    if (remainingPlayers.length === 1) {
      this.endGame(remainingPlayers[0]);
    } else if (remainingPlayers.length === 0) {
      this.endGame(null);
    }

    this.editingRound = null;
    this.initializeRoundScores();
  }

  cancelRoundEdit() {
    this.editingRound = null;
    this.initializeRoundScores();
  }

  endGame(winner: Player | null) {
    this.gameInProgress = false;
    this.gameEnded = true;
    this.winner = winner;
  }

  resetGame() {
    this.gameInProgress = false;
    this.gameEnded = false;
    this.winner = null;
    this.currentRound = 1;
    this.rounds = [];
    // Keep players but reset their scores
    this.players.forEach(player => {
      player.score = 0;
      player.isEliminated = false;
      player.rounds = [];
    });
    this.roundScores = {};
  }

  getActivePlayers() {
    return this.players.filter(p => !p.isEliminated);
  }

  getPlayerScore(playerId: number): number {
    return this.roundScores[playerId] ?? 0;
  }

  getPlayerTotalScore(playerId: number): number {
    const player = this.players.find(p => p.id === playerId);
    return player ? player.score : 0;
  }

  getPlayerStatus(player: Player): string {
    if (player.isEliminated) {
      return 'Eliminated';
    }
    if (player.score > 100) {
      return 'Over 100';
    }
    return 'Active';
  }

  getPlayerStatusClass(player: Player): string {
    if (player.isEliminated) {
      return 'eliminated';
    }
    if (player.score > 100) {
      return 'over-limit';
    }
    return 'active';
  }

  getPlayerName(playerId: number): string {
    const player = this.players.find(p => p.id === playerId);
    return player ? player.name : 'Unknown Player';
  }

  clearAllPlayers() {
    this.players = [];
    this.roundScores = {};
  }
}
