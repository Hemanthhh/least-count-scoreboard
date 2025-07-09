import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Player } from '../../shared/interfaces';

@Component({
    selector: 'app-game-progress',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './game-progress.component.html',
    styleUrls: ['./game-progress.component.css']
})
export class GameProgressComponent {
    @Input() players: Player[] = [];
    @Input() currentRound = 1;
    @Input() roundScores: { [playerId: number]: number | undefined } = {};
    @Input() editingRound: number | null = null;
    @Output() submitRoundEvent = new EventEmitter<void>();
    @Output() saveRoundEditEvent = new EventEmitter<void>();
    @Output() cancelRoundEditEvent = new EventEmitter<void>();

    getActivePlayers(): Player[] {
        return this.players.filter(p => !p.isEliminated);
    }

    getPlayerTotalScore(playerId: number): number {
        const player = this.players.find(p => p.id === playerId);
        return player ? player.score : 0;
    }

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

    submitRound() {
        this.submitRoundEvent.emit();
    }

    saveRoundEdit() {
        this.saveRoundEditEvent.emit();
    }

    cancelRoundEdit() {
        this.cancelRoundEditEvent.emit();
    }
} 