import {EntityType} from './Enums';
import {TurnState} from './TurnState';

export interface Entity {
	readonly type: EntityType;
	x: number;
	y: number;
	prevX: number;
	prevY: number;

	update(turnState: TurnState): void;
	clone(): Entity;
}
