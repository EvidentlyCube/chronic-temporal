import {Entity} from '../Entity';

export class EntityMovement {
	public entity: Entity;

	public oldX: number;

	public oldY: number;

	public newX: number;

	public newY: number;

	public others: EntityMovement[];

	constructor(entity: Entity, oldX: number, oldY: number, newX: number = oldX, newY: number = oldY) {
		this.entity = entity;
		this.oldX = oldX;
		this.oldY = oldY;
		this.newX = newX;
		this.newY = newY;
		this.others = [];
	}
}
