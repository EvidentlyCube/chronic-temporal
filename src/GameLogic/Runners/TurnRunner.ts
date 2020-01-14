import {GameSession} from '../GameSession';
import {PlayerAction} from '../Enums/PlayerAction';
import {EntityType} from '../Enums/EntityType';
import {Level} from '../Level';
import {Entity} from '../Entity';
import {TurnState} from '../TurnState';
import {TurnEventType} from '../Enums/TurnEventType';
import {FloorType} from '../Enums/FloorType';
import {Iceblock} from '../Entities/Iceblock';
import {ProtagonistRunner} from './ProtagonistRunner';
import {FireballRunner} from './FireballRunner';
import {IceblockRunner} from './IceblockRunner';

export class TurnRunner {
	private readonly _gameSession: GameSession;

	constructor(gameSession: GameSession) {
		this._gameSession = gameSession;
	}

	public runTurn(playerInput: PlayerAction, session: GameSession): TurnState {
		const {level} = session;

		const turnState = new TurnState(level);
		turnState.addEvent(TurnEventType.TurnExecuted);

		const player = level.entities.getPlayer();

		if (player) {
			player.movesQueue.push(playerInput);
		}

		level.entities.forEach(this.beforeUpdate);

		ProtagonistRunner.run(turnState);
		FireballRunner.run(turnState);
		IceblockRunner.run(turnState);

		// @todo Issue #69: Cache floor tile coordinates for certain types
		for (let i = 0; i < level.width; i++) {
			for (let j = 0; j < level.height; j++) {
				if (level.tilesFloor.get(i, j) == FloorType.Exit) {
					const winningProtagonist = level.entities.getEntitiesAt(i, j).find(entity => entity.type === EntityType.Protagonist);

					if (winningProtagonist) {
						turnState.addEvent(TurnEventType.LevelComplete, winningProtagonist);
						// @todo When campaignieren are implementieren, implement a way to return that this level has been completed
					}
				}

				if (level.tilesFloor.get(i, j) == FloorType.IceTrap) {
					const entities = level.entities.getEntitiesAt(i, j);
					entities.forEach(entity => {
						switch (entity.type) {
							case EntityType.Protagonist:
							case EntityType.Pushable:
								const newIceBlock = new Iceblock(entity);
								newIceBlock.x = entity.x;
								newIceBlock.y = entity.y;
								newIceBlock.prevX = entity.x;
								newIceBlock.prevY = entity.y;
								turnState.level.entities.addEntity(newIceBlock);
								turnState.level.entities.removeEntity(entity);
								turnState.addEvent(TurnEventType.EntityFrozen, entity);
								turnState.addEvent(TurnEventType.EntityRemoved, entity);
								turnState.addEvent(TurnEventType.EntityAdded, newIceBlock);
								turnState.changeFloor(FloorType.FloorTile, i, j);
								break;
							case EntityType.Iceblock:
								turnState.changeFloor(FloorType.FloorTile, i, j);
								break;
						}
					});
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
