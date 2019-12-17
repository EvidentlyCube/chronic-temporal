import {Entity} from '../Entity';
import {EntityType, FloorType, PlayerActionUtils} from '../Enums';
import {ActionSequence} from '../DataStructures/ActionSequence';
import {Direction8, Direction8Utils} from '../../../src.common/Enums/Direction8';
import {Level} from '../Level';
import {Pushable} from './Pushable';

// @todo I think we should only have a single class for the player entity, to ensure we never treat them differently based on how they move
export class Protagonist implements Entity {
	public readonly type: EntityType;

	public x: number;

	public y: number;

	public isPlayerControlled: boolean;

	public movesQueue: ActionSequence;

	constructor(isPlayerControlled = true, movesQueue: ActionSequence = new ActionSequence()) {
		this.type = EntityType.Protagonist;
		this.x = 0;
		this.y = 0;
		this.isPlayerControlled = isPlayerControlled;
		if (isPlayerControlled) {
			this.movesQueue = new ActionSequence();
		} else {
			this.movesQueue = movesQueue;
		}
	}

	public update(level: Level): void {
		const action = this.movesQueue.getNext();

		if (action === undefined) {
			// @todo figure out what should happen when there are no moves left
			return;
		}

		const direction = PlayerActionUtils.actionToDirection(action);

		if (this.isMoveAllowed(level, direction)) {
			this.x += Direction8Utils.getX(direction);
			this.y += Direction8Utils.getY(direction);

			const entities = level.entities.getEntitiesAt(this.x, this.y);

			const pushables = entities.filter(entity => entity.type === EntityType.Pushable) as Pushable[];
			pushables.forEach(p => p.push(level, direction));

			if (entities.some(entity => entity.type === EntityType.Fireball)) {
				level.entities.removeEntity(this);
			}
		}

		if (level.tilesFloor.get(this.x, this.y) == FloorType.Water) {
			level.entities.removeEntity(this);
		}
	}

	public clone(): Protagonist {
		const clone = new Protagonist(this.isPlayerControlled, this.movesQueue.copy());
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

		const pushable = entities.find(entity => entity.type === EntityType.Pushable) as Pushable;
		if (pushable && !pushable.isMoveAllowed(level, direction)) {
			return false;
		}

		return true;
	}
}
