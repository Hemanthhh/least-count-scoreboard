import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Player } from '../../shared/interfaces';

@Component({
    selector: 'app-game-end',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './game-end.component.html',
    styleUrls: ['./game-end.component.css']
})
export class GameEndComponent {
    @Input() players: Player[] = [];
    @Input() winner: Player | null = null;
    @Output() resetGameEvent = new EventEmitter<void>();
    @Output() clearAllPlayersEvent = new EventEmitter<void>();

    getPlayerStatus(player: Player): string {
        if (player.isEliminated) {
            return 'Eliminated';
        } else if (player.score > 100) {
            return 'Over Limit';
        } else {
            return 'Active';
        }
    }

    getPlayerStatusClass(player: Player): string {
        if (player.isEliminated) {
            return 'eliminated';
        } else if (player.score > 100) {
            return 'over-limit';
        } else {
            return 'active';
        }
    }

    resetGame() {
        this.resetGameEvent.emit();
    }

    clearAllPlayers() {
        this.clearAllPlayersEvent.emit();
    }
} 