import {Entity} from '../Entity';

export class EntityMovement {
	public entity: Entity;

	public oldX: number;

	public oldY: number;

	public newX: number | undefined;

	public newY: number | undefined;

	public others: EntityMovement[];

	constructor(entity: Entity, oldX: number, oldY: number, newX: number | undefined = undefined, newY: number | undefined = undefined) {
		this.entity = entity;
		this.oldX = oldX;
		this.oldY = oldY;
		this.newX = newX;
		this.newY = newY;
		this.others = [];
	}
}
