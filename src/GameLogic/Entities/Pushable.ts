import {Entity} from '../Entity';
import {EntityType} from '../Enums/EntityType';
import {FloorType} from '../Enums/FloorType';
import {Direction8, Direction8Utils} from '../Enums/Direction8';
import {Level} from '../Level';
import {Fireball} from './Fireball';
import {TurnState} from '../TurnState';
import {TurnEventType} from '../Enums/TurnEventType';
import {EntityMovement} from '../DataStructures/EntityMovement';

export class Pushable implements Entity {
	public readonly type: EntityType;

	public x: number;

	public y: number;

	public prevX: number;

	public prevY: number;

	constructor() {
		this.type = EntityType.Pushable;
		this.x = 0;
		this.y = 0;
		this.prevX = 0;
		this.prevY = 0;
	}

	public update(): void {
		// Do nothing
	}

	public clone(): Pushable {
		const clone = new Pushable();
		clone.x = this.x;
		clone.y = this.y;
		clone.prevX = this.prevX;
		clone.prevY = this.prevY;
		return clone;
	}

	public getNextMoveDetails(): EntityMovement {
		// Do nothing
		return new EntityMovement(this, this.x, this.y, this.x, this.y);
	}

	public isMoveAllowed(level: Level, direction: Direction8): boolean {
		const newX = this.x + Direction8Utils.getX(direction);
		const newY = this.y + Direction8Utils.getY(direction);

		if (!level.isInBounds(newX, newY)) {
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

	public push(turnState: TurnState, direction: Direction8): void {
		const {level} = turnState;

		if (this.isMoveAllowed(level, direction)) {
			const newX = this.x + Direction8Utils.getX(direction);
			const newY = this.y + Direction8Utils.getY(direction);

			level.entities.updatePosition(this, newX, newY);

			const entities = level.entities.getEntitiesAt(this.x, this.y);
			const fireballs = entities.filter(entity => entity.type === EntityType.Fireball) as Fireball[];
			fireballs.forEach(f => turnState.killEntity(f, TurnEventType.EntityKilled));

			if (level.tilesFloor.get(this.x, this.y) == FloorType.Water) {
				turnState.killEntity(this, TurnEventType.EntityDrowned);
			}
		}
	}
}
