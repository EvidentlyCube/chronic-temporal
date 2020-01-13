import {Entity} from '../Entity';
import {EntityType} from '../Enums/EntityType';
import {FloorType} from '../Enums/FloorType';
import {Direction8, Direction8Utils} from '../Enums/Direction8';
import {Level} from '../Level';
import {Protagonist} from './Protagonist';
import {Iceblock} from './Iceblock';
import {TurnState} from '../TurnState';
import {TurnEventType} from '../Enums/TurnEventType';
import {EntityMovement} from '../DataStructures/EntityMovement';

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

	public update(turnState: TurnState): void {
		if (this.isMoveAllowed(turnState.level, this.direction)) { // Try moving forward
			this.move(turnState, this.direction);
		} else if (this.isMoveAllowed(turnState.level, Direction8Utils.cw90(this.direction))) { // Try moving clockwise 90 degrees
			this.move(turnState, Direction8Utils.cw90(this.direction));
		} else if (this.isMoveAllowed(turnState.level, Direction8Utils.ccw90(this.direction))) { // Try moving counterclockwise 90 degrees
			this.move(turnState, Direction8Utils.ccw90(this.direction));
		} else if (this.isMoveAllowed(turnState.level, Direction8Utils.opposite(this.direction))) { // Try moving backwards
			this.move(turnState, Direction8Utils.opposite(this.direction));
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

	public getNextMoveDetails(): EntityMovement {
		// Do nothing
		return new EntityMovement(this, -1, -1);
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

		return true;
	}

	private move(turnState: TurnState, direction: Direction8): void {
		const {level} = turnState;

		this.direction = direction;
		const newX = this.x + Direction8Utils.getX(direction);
		const newY = this.y + Direction8Utils.getY(direction);

		level.entities.updatePosition(this, newX, newY);

		const entities = level.entities.getEntitiesAt(this.x, this.y);
		const protagonists = entities.filter(entity => entity.type === EntityType.Protagonist) as Protagonist[];
		protagonists.forEach(p => turnState.killEntity(p, TurnEventType.EntityKilled));

		const iceblocks = entities.filter(entity => entity.type === EntityType.Iceblock) as Iceblock[];
		if (iceblocks.length) {
			turnState.killEntity(this, TurnEventType.EntityKilled);
		}
		iceblocks.forEach(i => i.melting = true);
	}
}
