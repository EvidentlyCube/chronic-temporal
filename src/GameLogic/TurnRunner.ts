import {GameSession} from './GameSession';
import {PlayerAction, EntityType} from './Enums';
import {Level} from './Level';

export class TurnRunner {
	private readonly _gameSession: GameSession;

	constructor(gameSession: GameSession) {
		this._gameSession = gameSession;
	}

	public runTurn(playerInput: PlayerAction, level: Level): void {
		const player = level.entities.getPlayer();

		if (player) {
			player.movesQueue.push(playerInput);
		}

		level.entities.getEntitiesOfType(EntityType.Protagonist).forEach(entity => entity.update(level));
		level.entities.getEntitiesNotOfType(EntityType.Protagonist).forEach(entity => entity.update(level));
	}
}
