import {Entity} from '../Entity';
import {EntityType, FloorType} from '../Enums';
import {Direction8, Direction8Utils} from '../Enums/Direction8';
import {Level} from '../Level';
import {Protagonist} from './Protagonist';
import {Iceblock} from './Iceblock';

export class Fireball implements Entity {
	public readonly type: EntityType;

	public x: number;

	public y: number;

	public prevX: number;

	public prevY: number;

	public direction: Direction8;

	constructor(direction: Direction8) {
		this.type = EntityType.Fireball;
		this.x = 0;
		this.y = 0;
		this.prevX = 0;
		this.prevY = 0;
		this.direction = direction;
	}

	public update(level: Level): void {
		if (this.isMoveAllowed(level, this.direction)) { // Try moving forward
			this.move(level, this.direction);
		} else if (this.isMoveAllowed(level, Direction8Utils.cw90(this.direction))) { // Try moving clockwise 90 degrees
			this.move(level, Direction8Utils.cw90(this.direction));
		} else if (this.isMoveAllowed(level, Direction8Utils.ccw90(this.direction))) { // Try moving counterclockwise 90 degrees
			this.move(level, Direction8Utils.ccw90(this.direction));
		} else if (this.isMoveAllowed(level, Direction8Utils.opposite(this.direction))) { // Try moving backwards
			this.move(level, Direction8Utils.opposite(this.direction));
		}
	}

	public clone(): Fireball {
		const clone = new Fireball(this.direction);
		clone.x = this.x;
		clone.y = this.y;
		clone.prevX = this.prevX;
		clone.prevY = this.prevY;
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

		return true;
	}

	private move(level: Level, direction: Direction8): void {
		this.direction = direction;
		const newX = this.x + Direction8Utils.getX(direction);
		const newY = this.y + Direction8Utils.getY(direction);

		level.entities.updatePosition(this, newX, newY);

		const entities = level.entities.getEntitiesAt(this.x, this.y);
		const protagonists = entities.filter(entity => entity.type === EntityType.Protagonist) as Protagonist[];
		protagonists.forEach(p => level.entities.removeEntity(p));
		const iceblocks = entities.filter(entity => entity.type === EntityType.Iceblock) as Iceblock[];
		if (iceblocks.length) {
			level.entities.removeEntity(this);
		}
		iceblocks.forEach(i => i.melting = true);
	}
}
