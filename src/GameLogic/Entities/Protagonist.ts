import {Entity} from "../Entity";
import {EntityType} from "../Enums";

// @todo I think we should only have a single class for the player entity, to ensure we never treat them differently based on how they move
export class Protagonist implements Entity {
	public readonly type: EntityType;
	public x: number;
	public y: number;

	constructor() {
		this.type = EntityType.Protagonist;
		this.x = 0;
		this.y = 0;
	}

	public update(): void {
		// @todo need some logic here
	}
}