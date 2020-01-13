import {Entity} from '../Entity';

export class EntityMovement {
	public Entity: Entity;

	public OldX: number;

	public OldY: number;

	public NewX: number | undefined;

	public NewY: number | undefined;

	public Others: EntityMovement[];

	constructor(entity: Entity, oldX: number, oldY: number, newX: number | undefined = undefined, newY: number | undefined = undefined) {
		this.Entity = entity;
		this.OldX = oldX;
		this.OldY = oldY;
		this.NewX = newX;
		this.NewY = newY;
		this.Others = [];
	}
}
