import {Level} from '../Level';
import {Entity} from '../Entity';
import {EntityType} from '../Enums';
import {Protagonist} from '../Entities/Protagonist';
import {ActionSequence} from '../DataStructures/ActionSequence';
import {Pushable} from '../Entities/Pushable';

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
			switch (data.type) {
				case EntityType.Protagonist:
					LevelDeserializer.insertEntity(
						level,
						new Protagonist(data.isPlayerControlled, LevelDeserializer.deserializeActionSequence(data.sequence)),
						data,
					);
					break;

				case EntityType.Pushable:
					LevelDeserializer.insertEntity(
						level,
						new Pushable(),
						data,
					);
					break;
			}
		});
	}

	private static deserializeFloorTiles(level: Level, tilesFloor: any[][]): void {
		level.tilesFloor.setAllByCallback((x, y) => tilesFloor[x][y]);
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

	private static insertEntity(level: Level, entity: Entity, data: any): void {
		entity.x = data.x;
		entity.y = data.y;

		level.entities.addEntity(entity);
	}
}
