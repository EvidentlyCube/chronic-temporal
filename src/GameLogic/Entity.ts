import {EntityType} from './Enums';

export interface Entity {
	readonly type: EntityType;
	x: number;
	y: number;

	update(): void;
}
