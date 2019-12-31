import {Entity} from '../Entity';
import {EntityType} from '../Enums/EntityType';
import {FloorType} from '../Enums/FloorType';
import {PlayerActionUtils} from '../Enums/PlayerAction';
import {ActionSequence} from '../DataStructures/ActionSequence';
import {Direction8, Direction8Utils} from '../Enums/Direction8';
import {Level} from '../Level';
import {Pushable} from './Pushable';
import {Iceblock} from './Iceblock';
import {TurnState} from '../TurnState';
import {TurnEventType} from '../Enums/TurnEventType';

export class Protagonist implements Entity {
	public readonly type: EntityType;

	public x: number;

	public y: number;

	public prevX: number;

	public prevY: number;

	public isPlayerControlled: boolean;

	public movesQueue: ActionSequence;

	constructor(isPlayerControlled = true, movesQueue: ActionSequence = new ActionSequence()) {
		this.type = EntityType.Protagonist;
		this.x = 0;
		this.y = 0;
		this.prevX = 0;
		this.prevY = 0;
		this.isPlayerControlled = isPlayerControlled;
		if (isPlayerControlled) {
			this.movesQueue = new ActionSequence();
		} else {
			this.movesQueue = movesQueue;
		}
	}

	public update(turnState: TurnState): void {
		const {level} = turnState;
		const action = this.movesQueue.getNext();

		if (action === undefined) {
			// @todo figure out what should happen when there are no moves left
			return;
		}

		const direction = PlayerActionUtils.actionToDirection(action);

		if (this.isMoveAllowed(level, direction)) {
			const newX = this.x + Direction8Utils.getX(direction);
			const newY = this.y + Direction8Utils.getY(direction);

			level.entities.updatePosition(this, newX, newY);

			const entities = level.entities.getEntitiesAt(this.x, this.y);
			const pushables = entities.filter(entity => entity.type === EntityType.Pushable) as Pushable[];
			pushables.forEach(p => p.push(turnState, direction));

			const iceblocks = entities.filter(entity => entity.type === EntityType.Iceblock) as Iceblock[];
			iceblocks.forEach(i => i.push(turnState, direction));

			if (entities.some(entity => entity.type === EntityType.Fireball)) {
				turnState.killEntity(this, TurnEventType.EntityKilled);
				return;
			}
		}

		if (level.tilesFloor.get(this.x, this.y) == FloorType.Water) {
			turnState.killEntity(this, TurnEventType.EntityDrowned);
		}
	}

	public clone(): Protagonist {
		const clone = new Protagonist(this.isPlayerControlled, this.movesQueue.copy());
		clone.x = this.x;
		clone.y = this.y;
		clone.prevX = this.prevX;
		clone.prevY = this.prevY;
		return clone;
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

		const pushable = entities.find(entity => entity.type === EntityType.Pushable) as Pushable;
		if (pushable && !pushable.isMoveAllowed(level, direction)) {
			return false;
		}

		const iceblock = entities.find(entity => entity.type === EntityType.Iceblock) as Iceblock;
		if (iceblock && !iceblock.isMoveAllowed(level, direction)) {
			return false;
		}

		return true;
	}
}
