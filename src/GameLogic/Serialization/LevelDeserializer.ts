import {Level} from '../Level';
import {Entity} from '../Entity';
import {EntityType} from '../Enums';
import {Protagonist} from '../Entities/Protagonist';
import {ActionSequence} from '../DataStructures/ActionSequence';
import {Pushable} from '../Entities/Pushable';
import {Fireball} from '../Entities/Fireball';
import {Iceblock} from '../Entities/Iceblock';

export class LevelDeserializer {
	public static deserialize(levelObject: any): Level {
		const level = new Level({
			width: LevelDeserializer.getInteger(levelObject, 'width'),
			height: LevelDeserializer.getInteger(levelObject, 'height'),
			playerStartX: LevelDeserializer.getInteger(levelObject, 'playerStartX'),
			playerStartY: LevelDeserializer.getInteger(levelObject, 'playerStartY'),
		});

		LevelDeserializer.deserializeEntities(level, levelObject.entities);
		LevelDeserializer.deserializeFloorTiles(level, levelObject.tilesFloor);

		return level;
	}

	private static deserializeEntities(level: Level, entities: any[]): void {
		entities.forEach(data => {
			level.entities.addEntity(this.deserializeEntity(level, data));
		});
	}

	private static deserializeEntity(level: Level, data: any): Entity {
		let entity: any;
		switch (data.type) {
			case EntityType.Protagonist:
				entity = new Protagonist(data.isPlayerControlled, LevelDeserializer.deserializeActionSequence(data.sequence));
				break;

			case EntityType.Pushable:
				entity = new Pushable();
				break;

			case EntityType.Fireball:
				entity = new Fireball(data.direction);
				break;

			case EntityType.Iceblock:
				entity = new Iceblock(this.deserializeEntity(level, data.containedEntity));
				entity.melting = data.melting;
				entity.direction = data.direction;
				entity.justPushed = data.justPushed;
				break;

			default:
				throw new Error();
		}
		entity.x = data.x;
		entity.y = data.y;
		return entity;
	}

	private static deserializeFloorTiles(level: Level, tilesFloor: any[][]): void {
		level.tilesFloor.setAllCallback((x, y) => tilesFloor[x][y]);
	}

	private static deserializeActionSequence(data: any): ActionSequence {
		return new ActionSequence(data.sequence, data.position);
	}

	private static getNumber(object: any, key: string): number {
		const value = object[key];

		if (typeof value !== 'number') {
			throw new Error(`${key} expected to be a number.`);
		}

		return value;
	}

	private static getInteger(object: any, key: string): number {
		const value = LevelDeserializer.getNumber(object, key);

		if (!Number.isInteger(value)) {
			throw new Error(`${key} expected to be an integer.`);
		}

		return value;
	}
}
