import {Level} from '../Level';
import {Entities} from '../DataStructures/Entities';
import {EntityType} from '../Enums';
import {Protagonist} from '../Entities/Protagonist';
import {ActionSequence} from '../DataStructures/ActionSequence';

export class LevelSerializer {
	public static serialize(level: Level): object {
		return {
			width: level.width,
			height: level.height,
			playerStartX: level.playerStartX,
			playerStartY: level.playerStartY,
			entities: LevelSerializer.serializeEntities(level.entities),
			tilesFloor: level.tilesFloor.toArray,
		};
	}

	private static serializeEntities(entities: Entities): object[] {
		return entities.entities.map(entity => {
			const base: any = {
				x: entity.x,
				y: entity.y,
				type: entity.type,
			};

			switch (entity.type) {
				case EntityType.Protagonist:
					const protagonist = entity as Protagonist;
					base.isPlayerControlled = protagonist.isPlayerControlled;
					base.sequence = LevelSerializer.serializeActionSequence(protagonist.movesQueue);

					return base;

				default:
					throw new Error();
			}
		});
	}

	private static serializeActionSequence(action: ActionSequence): any {
		return {
			position: action.position,
			sequence: action.actions.concat(),
		};
	}
}
