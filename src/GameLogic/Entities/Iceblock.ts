import {Entity} from '../Entity';
import {EntityType} from '../Enums/EntityType';
import {FloorType} from '../Enums/FloorType';
import {Direction8, Direction8Utils} from '../Enums/Direction8';
import {Level} from '../Level';
import {Fireball} from './Fireball';
import {TurnState} from '../TurnState';
import {TurnEventType} from '../Enums/TurnEventType';
import {EntityMovement} from '../DataStructures/EntityMovement';

export class Iceblock implements Entity {
	public readonly type: EntityType;

	public x: number;

	public y: number;

	public prevX: number;

	public prevY: number;

	public direction: Direction8;

	public containedEntity: Entity | undefined;

	public melting: boolean;

	public justPushed: boolean;

	constructor(containedEntity: Entity | undefined = undefined) {
		this.type = EntityType.Iceblock;
		this.x = 0;
		this.y = 0;
		this.prevX = 0;
		this.prevY = 0;
		this.direction = Direction8.None;
		this.containedEntity = containedEntity;
		this.melting = containedEntity
			? containedEntity.type === EntityType.Fireball
			: false;
		this.justPushed = false;
	}

	public update(turnState: TurnState): void {
		const {level} = turnState;

		if (this.justPushed) {
			this.justPushed = false; //Don't update because we've just been moved via push()
		} else if (this.isMoveAllowed(level, this.direction) && !this.melting) {
			const newX = this.x + Direction8Utils.getX(this.direction);
			const newY = this.y + Direction8Utils.getY(this.direction);

			level.entities.updatePosition(this, newX, newY);

			this.postMoveProcessing(turnState);
		} else {
			this.direction = Direction8.None;
		}

		if (this.melting) {
			if (this.containedEntity !== undefined) {
				this.containedEntity.x = this.x;
				this.containedEntity.y = this.y;
				this.containedEntity.prevX = this.x;
				this.containedEntity.prevY = this.y;

				level.entities.addEntity(this.containedEntity);
				this.containedEntity = undefined;
			}
			turnState.killEntity(this, TurnEventType.EntityKilled);
		}
	}

	public clone(): Iceblock {
		const clone = new Iceblock(this.containedEntity?.clone());
		clone.x = this.x;
		clone.y = this.y;
		clone.prevX = this.prevX;
		clone.prevY = this.prevY;
		clone.direction = this.direction;
		clone.melting = this.melting;
		clone.justPushed = this.justPushed;
		return clone;
	}

	public getNextMoveDetails(turnState: TurnState): EntityMovement {
		const {level} = turnState;

		const entityMovement = new EntityMovement(this, this.x, this.y);

		if (!this.justPushed &&
		this.isMoveAllowed(level, this.direction) &&
		!this.melting &&
		this.direction != Direction8.None) {
			entityMovement.newX = this.x + Direction8Utils.getX(this.direction);
			entityMovement.newY = this.y + Direction8Utils.getY(this.direction);
		}

		return entityMovement;
	}

	public isMoveAllowed(level: Level, direction: Direction8): boolean {
		const newX = this.x + Direction8Utils.getX(direction);
		const newY = this.y + Direction8Utils.getY(direction);

		if (!level.isInBounds(newX, newY)) {
			return false;
		}

		const floor = level.tilesFloor.get(newX, newY);

		if (floor == FloorType.Wall) {
			return false;
		}

		const entities = level.entities.getEntitiesAt(newX, newY);

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
			this.direction = direction;
			this.justPushed = true;
			this.postMoveProcessing(turnState);
		}
	}

	private postMoveProcessing(turnState: TurnState): void {
		const {level} = turnState;

		const entities = level.entities.getEntitiesAt(this.x, this.y);
		const fireballs = entities.filter(entity => entity.type === EntityType.Fireball) as Fireball[];
		if (fireballs.length) {
			this.melting = true;
		}

		fireballs.forEach(f => turnState.killEntity(f, TurnEventType.EntityKilled));

		if (level.tilesFloor.get(this.x, this.y) == FloorType.Water) {
			turnState.killEntity(this, TurnEventType.EntityDrowned);
			this.melting = false; // Iceblock is sinking, so don't eject contents in any case
		}
	}
}
