import {Entity} from '../Entity';
import {EntityType, FloorType, PlayerActionUtils} from '../Enums';
import {ActionSequence} from '../DataStructures/ActionSequence';
import {Direction8} from '../../../src.common/Enums/Direction8';
import {Level} from '../Level';

// @todo I think we should only have a single class for the player entity, to ensure we never treat them differently based on how they move
export class Protagonist implements Entity {
	public readonly type: EntityType;

	public x: number;

	public y: number;

	public isPlayerControlled: boolean;

	public movesQueue: ActionSequence;

	constructor(isPlayerControlled = true) {
		this.type = EntityType.Protagonist;
		this.x = 0;
		this.y = 0;
		this.isPlayerControlled = isPlayerControlled;
		this.movesQueue = new ActionSequence();
	}

	public update(level: Level): void {
		const action = this.movesQueue.getNext();

		if (action === undefined) {
			// @todo figure out what should happen when there are no moves left
			return;
		}

		const direction = PlayerActionUtils.actionToDirection(action);

		if (this.isMoveAllowed(level, direction)) {
			this.x += direction.x;
			this.y += direction.y;
		}
	}

	public isMoveAllowed(level: Level, direction: Direction8): boolean {
		const newX = this.x + direction.x;
		const newY = this.y + direction.y;

		if (newX < 0 || newY < 0 || newX >= level.width || newY >= level.height) {
			return false;
		}

		const floor = level.tilesFloor.get(newX, newY);

		if (floor !== FloorType.FloorTile) {
			return false;
		}

		return true;
	}
}
