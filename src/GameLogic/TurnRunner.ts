import {GameSession} from './GameSession';
import {PlayerAction, EntityType} from './Enums';
import {Level} from './Level';
import {Entity} from './Entity';
import {TurnState} from './TurnState';

export class TurnRunner {
	private readonly _gameSession: GameSession;

	constructor(gameSession: GameSession) {
		this._gameSession = gameSession;
	}

	public runTurn(playerInput: PlayerAction, level: Level): TurnState {
		const turnState = new TurnState(level);
		const player = level.entities.getPlayer();

		if (player) {
			player.movesQueue.push(playerInput);
		}

		level.entities.forEach(this.beforeUpdate);

		level.entities.getEntitiesOfType(EntityType.Protagonist).forEach(entity => entity.update(turnState));
		level.entities.getEntitiesOfType(EntityType.Fireball).forEach(entity => entity.update(turnState));
		level.entities.getEntitiesOfType(EntityType.Iceblock).forEach(entity => entity.update(turnState));

		return turnState;
	}

	public beforeUpdate(entity: Entity): void {
		entity.prevX = entity.x;
		entity.prevY = entity.y;
	}
}
