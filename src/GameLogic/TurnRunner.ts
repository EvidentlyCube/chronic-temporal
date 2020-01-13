import {GameSession} from './GameSession';
import {PlayerAction} from './Enums/PlayerAction';
import {EntityType} from './Enums/EntityType';
import {Level} from './Level';
import {Entity} from './Entity';
import {TurnState} from './TurnState';
import {TurnEventType} from './Enums/TurnEventType';
import {FloorType} from './Enums/FloorType';
import {Iceblock} from './Entities/Iceblock';
import {EntityMovement} from './DataStructures/EntityMovement';

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

		const protagonists = level.entities.getEntitiesOfType(EntityType.Protagonist);
		const protagonistMovements: EntityMovement[] = [];
		protagonists.forEach(entity => protagonistMovements.push(entity.getNextMoveDetails(turnState)));
		protagonistMovements.forEach(movement => protagonistMovements.forEach(pairedMovement => {
			if (movement.entity !== pairedMovement.entity) {
				// @todo Cross-examine each movement with each other
			}
		}));
		protagonists.forEach(entity => entity.update(turnState));

		level.entities.getEntitiesOfType(EntityType.Fireball).forEach(entity => entity.update(turnState));

		const iceblocks = level.entities.getEntitiesOfType(EntityType.Iceblock);
		const iceblockMovements: EntityMovement[] = [];
		iceblocks.forEach(entity => iceblockMovements.push(entity.getNextMoveDetails(turnState)));
		iceblockMovements.forEach(movement => iceblockMovements.forEach(pairedMovement => {
			if (movement.entity !== pairedMovement.entity) {
				// @todo Cross-examine each movement with each other
			}
		}));
		iceblocks.forEach(entity => entity.update(turnState));

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
