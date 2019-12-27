import {GameSession} from './GameSession';
import {PlayerAction} from './Enums/PlayerAction';
import {EntityType} from './Enums/EntityType';
import {Level} from './Level';
import {Entity} from './Entity';
import {TurnState} from './TurnState';
import {TurnEventType} from './Enums/TurnEventType';
import {FloorType} from './Enums/FloorType';

export class TurnRunner {
	private readonly _gameSession: GameSession;

	constructor(gameSession: GameSession) {
		this._gameSession = gameSession;
	}

	public runTurn(playerInput: PlayerAction, level: Level): TurnState {
		const turnState = new TurnState(level);
		turnState.addEvent(TurnEventType.TurnExecuted);

		const player = level.entities.getPlayer();

		if (player) {
			player.movesQueue.push(playerInput);
		}

		level.entities.forEach(this.beforeUpdate);

		level.entities.getEntitiesOfType(EntityType.Protagonist).forEach(entity => entity.update(turnState));
		level.entities.getEntitiesOfType(EntityType.Fireball).forEach(entity => entity.update(turnState));
		level.entities.getEntitiesOfType(EntityType.Iceblock).forEach(entity => entity.update(turnState));

		for (let i = 0; i < level.width; i++) {
			for (let j = 0; j < level.height; j++) {
				if (level.tilesFloor.get(i, j) == FloorType.Exit) {
					if (level.entities.getEntitiesAt(i, j).some(entity => entity.type === EntityType.Protagonist)) {
						turnState.addEvent(TurnEventType.LevelComplete);
						// @todo When campaigns are implement, implement a way to return that this level has been completed
					}
				}
			}
		}

		return turnState;
	}

	public beforeUpdate(entity: Entity): void {
		entity.prevX = entity.x;
		entity.prevY = entity.y;
	}
}
