import {Level} from '../Level';
import {Entities} from '../DataStructures/Entities';
import {EntityType} from '../Enums';
import {Protagonist} from '../Entities/Protagonist';
import {ActionSequence} from '../DataStructures/ActionSequence';
import {Fireball} from '../Entities/Fireball';
import {Iceblock} from '../Entities/Iceblock';
import {Entity} from '../Entity';

export class LevelSerializer {
	public static serialize(level: Level): object {
		return {
			width: level.width,
			height: level.height,
			playerStartX: level.playerStartX,
			playerStartY: level.playerStartY,
			entities: LevelSerializer.serializeEntities(level.entities),
			tilesFloor: level.tilesFloor.toArray(),
		};
	}

	private static serializeEntities(entities: Entities): any[] {
		return entities.entities.map(entity => {
			return this.serializeEntity(entity);
		});
	}

	private static serializeEntity(entity: Entity): any[] {
		const base: any = {
			x: entity.x,
			y: entity.y,
			prevX: entity.prevX,
			prevY: entity.prevY,
			type: entity.type,
		};

		switch (entity.type) {
			case EntityType.Protagonist:
				const protagonist = entity as Protagonist;
				base.isPlayerControlled = protagonist.isPlayerControlled;
				base.sequence = LevelSerializer.serializeActionSequence(protagonist.movesQueue);
				return base;

			case EntityType.Pushable:
				return base;

			case EntityType.Fireball:
				const fireball = entity as Fireball;
				base.direction = fireball.direction;
				return base;

			case EntityType.Iceblock:
				const iceblock = entity as Iceblock;
				base.direction = iceblock.direction;
				base.containedEntity = iceblock.containedEntity === undefined ? undefined : LevelSerializer.serializeEntity(iceblock.containedEntity);
				base.melting = iceblock.melting;
				base.justPushed = iceblock.justPushed;
				return base;

			default:
				throw new Error();
		}
	}

	private static serializeActionSequence(action: ActionSequence): any {
		return {
			position: action.position,
			sequence: action.actions.concat(),
		};
	}
}
