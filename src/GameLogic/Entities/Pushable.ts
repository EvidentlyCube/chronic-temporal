import {Entity} from '../Entity';
import {EntityType, FloorType} from '../Enums';
import {Direction8, Direction8Utils} from '../Enums/Direction8';
import {Level} from '../Level';
import {Fireball} from './Fireball';

export class Pushable implements Entity {
	public readonly type: EntityType;

	public x: number;

	public y: number;

	constructor() {
		this.type = EntityType.Pushable;
		this.x = 0;
		this.y = 0;
	}

	public update(): void {
		// Do nothing
	}

	public clone(): Pushable {
		const clone = new Pushable();
		clone.x = this.x;
		clone.y = this.y;
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
			const newX = this.x + Direction8Utils.getX(direction);
			const newY = this.y + Direction8Utils.getY(direction);

			level.entities.updatePosition(this, newX, newY);

			if (level.tilesFloor.get(this.x, this.y) == FloorType.Water) {
				level.entities.removeEntity(this);
			}

			const entities = level.entities.getEntitiesAt(this.x, this.y);
			const fireballs = entities.filter(entity => entity.type === EntityType.Fireball) as Fireball[];
			fireballs.forEach(f => level.entities.removeEntity(f));
		}
	}
}
