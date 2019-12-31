import {EntityType} from './Enums/EntityType';
import {TurnState} from './TurnState';
import {Iceblock} from './Entities/Iceblock';
import {TurnEventType} from './Enums/TurnEventType';

export interface Entity {
	readonly type: EntityType;
	x: number;
	y: number;
	prevX: number;
	prevY: number;

	update(turnState: TurnState): void;
	clone(): Entity;
}

export class EntityUtils {
	public static freeze(entity: Entity, turnState: TurnState): Iceblock {
		const newIceBlock = new Iceblock(entity);
		newIceBlock.x = entity.x;
		newIceBlock.y = entity.y;
		turnState.level.entities.addEntity(newIceBlock);
		turnState.level.entities.removeEntity(entity); // update this to trigger an event
		return newIceBlock;
	}
}
