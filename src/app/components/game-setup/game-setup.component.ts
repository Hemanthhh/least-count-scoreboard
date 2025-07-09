import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Player } from '../../shared/interfaces';

@Component({
    selector: 'app-game-setup',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './game-setup.component.html',
    styleUrls: ['./game-setup.component.css']
})
export class GameSetupComponent {
    @Input() players: Player[] = [];
    @Input() gameInProgress = false;
    @Output() addPlayerEvent = new EventEmitter<string>();
    @Output() removePlayerEvent = new EventEmitter<number>();
    @Output() clearAllPlayersEvent = new EventEmitter<void>();
    @Output() startGameEvent = new EventEmitter<void>();

    newPlayerName = '';

    addPlayer() {
        if (this.newPlayerName.trim() && !this.gameInProgress) {
            this.addPlayerEvent.emit(this.newPlayerName.trim());
            this.newPlayerName = '';
        }
    }

    removePlayer(playerId: number) {
        if (!this.gameInProgress) {
            this.removePlayerEvent.emit(playerId);
        }
    }

    clearAllPlayers() {
        this.clearAllPlayersEvent.emit();
    }

    startGame() {
        if (this.players.length >= 2) {
            this.startGameEvent.emit();
        }
    }
} 