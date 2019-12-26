import {GameSession} from './GameSession';
import {PlayerAction} from './Enums/PlayerAction';
import {EntityType} from './Enums/EntityType';
import {Level} from './Level';
import {Entity} from './Entity';
import {TurnState} from './TurnState';
import {TurnEventType} from './Enums/TurnEventType';

export class TurnRunner {
	private readonly _gameSession: GameSession;

	constructor(gameSession: GameSession) {
		this._gameSession = gameSession;
	}

	public runTurn(playerInput: PlayerAction, level: Level): TurnState {
		const turnState = new TurnState(level);
		turnState.addEvent(TurnEventType.TurnPassed);

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
