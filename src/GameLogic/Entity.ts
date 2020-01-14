import {EntityType} from './Enums/EntityType';
import {TurnState} from './TurnState';
import {EntityMovement} from './DataStructures/EntityMovement';

export interface Entity {
	readonly type: EntityType;
	x: number;
	y: number;
	prevX: number;
	prevY: number;

	update(turnState: TurnState): void;
	clone(): Entity;
	getNextMoveDetails(turnState: TurnState): EntityMovement;
}
