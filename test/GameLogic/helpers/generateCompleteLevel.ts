import {Level} from '../../../src/GameLogic/Level';
import {EntityType, FloorType, PlayerAction} from '../../../src/GameLogic/Enums';
import {Protagonist} from '../../../src/GameLogic/Entities/Protagonist';
import {ActionSequence} from '../../../src/GameLogic/DataStructures/ActionSequence';
import {Entity} from '../../../src/GameLogic/Entity';
import {Pushable} from '../../../src/GameLogic/Entities/Pushable';
import {Direction8} from '../../../src.common/Enums/Direction8';
import {Fireball} from '../../../src/GameLogic/Entities/Fireball';

export function generateCompleteLevel(): Level {
	const level = new Level({
		width: 17,
		height: 31,
		playerStartX: 13,
		playerStartY: 7,
	});

	addEveryEntity(level);
	addEveryFloorTile(level);

	return level;
}

function addEveryEntity(level: Level): void {
	Object.keys(EntityType).map(parseFloat).filter(key => !isNaN(key)).forEach((type: EntityType) => {
		switch (type) {
			case EntityType.Protagonist:
				insertEntity(level, new Protagonist(true));
				insertEntity(level, new Protagonist(false, new ActionSequence([PlayerAction.MoveDown, PlayerAction.MoveUpLeft], 1)));
				break;

			case EntityType.Pushable:
				insertEntity(level, new Pushable());
				break;

			case EntityType.Fireball:
				insertEntity(level, new Fireball(Direction8.Up));
				break;

			default:
				throw new Error(`generateCompleteLevel() does not handle creation of entity ${EntityType[type]}.`);
		}
	});
}

function addEveryFloorTile(level: Level): void {
	Object.keys(FloorType).map(parseFloat).filter(key => !isNaN(key)).forEach((type: FloorType) => {
		level.tilesFloor.set(type % level.width, type / level.height | 0, type);
	});
}

function insertEntity(level: Level, entity: Entity): void {
	entity.x = level.entities.length % level.width;
	entity.y = Math.floor(level.entities.length / level.width);
	level.entities.addEntity(entity);
}
