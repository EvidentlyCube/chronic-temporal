import {EntityType} from './Enums';
import {Level} from './Level';

export interface Entity {
	readonly type: EntityType;
	x: number;
	y: number;

	update(level: Level): void;

	clone(): Entity;
}
