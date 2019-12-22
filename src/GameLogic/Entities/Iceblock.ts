import {Entity} from '../Entity';
import {EntityType, FloorType} from '../Enums';
import {Direction8, Direction8Utils} from '../Enums/Direction8';
import {Level} from '../Level';
import {Fireball} from './Fireball';

export class Iceblock implements Entity {
	public readonly type: EntityType;

	public x: number;

	public y: number;

	public direction: Direction8;

	public contains: Entity;

	public melting: boolean;

	public justPushed: boolean;

	constructor(contains: Entity) {
		this.type = EntityType.Iceblock;
		this.x = 0;
		this.y = 0;
		this.direction = Direction8.None;
		this.contains = contains;
		this.melting = contains.type == EntityType.Fireball;
		this.justPushed = false;
	}

	public update(level: Level): void {
		if (this.justPushed) {
			this.justPushed = false; //Don't update because we've just been moved via push()
		} else if (this.isMoveAllowed(level, this.direction) && !this.melting) {
			this.x += Direction8Utils.getX(this.direction);
			this.y += Direction8Utils.getY(this.direction);
			this.postMoveProcessing(level);
		} else {
			this.direction = Direction8.None;
		}
		if (this.melting) {
			this.contains.x = this.x;
			this.contains.y = this.y;
			level.entities.addEntity(this.contains);
			level.entities.removeEntity(this);
		}
	}

	public clone(): Iceblock {
		const clone = new Iceblock(this.contains);
		clone.x = this.x;
		clone.y = this.y;
		clone.direction = this.direction;
		clone.melting = this.melting;
		clone.justPushed = this.justPushed;
		return clone;
	}

	public isMoveAllowed(level: Level, direction: Direction8): boolean {
		const newX = this.x + Direction8Utils.getX(direction);
		const newY = this.y + Direction8Utils.getY(direction);

		if (newX < 0 || newY < 0 || newX >= level.width || newY >= level.height) {
			return false;
		}

		const floor = level.tilesFloor.get(newX, newY);
		const entities = level.entities.getEntitiesAt(newX, newY);

		if (floor == FloorType.Wall) {
			return false;
		}

		if (entities.some(entity => entity.type === EntityType.Pushable)) {
			return false;
		}

		if (entities.some(entity => entity.type === EntityType.Iceblock)) {
			return false;
		}

		return true;
	}

	public push(level: Level, direction: Direction8): void {
		if (this.isMoveAllowed(level, direction)) {
			this.x += Direction8Utils.getX(direction);
			this.y += Direction8Utils.getY(direction);
			this.direction = direction;
			this.justPushed = true;
			this.postMoveProcessing(level);
		}
	}

	private postMoveProcessing(level: Level): void {
		const entities = level.entities.getEntitiesAt(this.x, this.y);
		const fireballs = entities.filter(entity => entity.type === EntityType.Fireball) as Fireball[];
		if (fireballs.length) {
			this.melting = true;
		}
		fireballs.forEach(f => level.entities.removeEntity(f));

		if (level.tilesFloor.get(this.x, this.y) == FloorType.Water) {
			level.entities.removeEntity(this);
			this.melting = false; // Iceblock is sinking, so don't eject contents in any case
		}
	}
}
