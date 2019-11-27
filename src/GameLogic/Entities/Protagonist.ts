import {Entity} from "../Entity";
import {EntityType, PlayerAction, PlayerActionUtils} from "../Enums";
import {ActionSequence} from "../DataStructures/ActionSequence";

// @todo I think we should only have a single class for the player entity, to ensure we never treat them differently based on how they move
export class Protagonist implements Entity {
	public readonly type: EntityType;
	public x: number;
	public y: number;

	public isPlayerControlled: boolean;
	public movesQueue: ActionSequence;

	constructor(isPlayerControlled: boolean = true) {
		this.type = EntityType.Protagonist;
		this.x = 0;
		this.y = 0;
		this.isPlayerControlled = isPlayerControlled;
		this.movesQueue = new ActionSequence;
	}

	public update(): void {
		const action = this.movesQueue.getNext();

		if (action === undefined) {
			// @todo figure out what should happen when there are no moves left
			return;
		}

		const direction = PlayerActionUtils.actionToDirection(action);
		this.x += direction.x;
		this.y += direction.y;
	}
}