import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Round, Player } from '../../shared/interfaces';

@Component({
    selector: 'app-game-history',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './game-history.component.html',
    styleUrls: ['./game-history.component.css']
})
export class GameHistoryComponent {
    @Input() rounds: Round[] = [];
    @Input() gameEnded = false;
    @Input() editingRound: number | null = null;
    @Input() players: Player[] = [];
    @Output() editRoundEvent = new EventEmitter<number>();

    editRound(roundId: number) {
        this.editRoundEvent.emit(roundId);
    }

    getPlayerName(playerId: number): string {
        const player = this.players.find(p => p.id === playerId);
        return player ? player.name : `Player ${playerId}`;
    }
} 