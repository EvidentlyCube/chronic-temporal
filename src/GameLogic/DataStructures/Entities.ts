import {EntityType} from '../Enums/EntityType';
import {Entity} from '../Entity';
import {Protagonist} from '../Entities/Protagonist';
import {SpatialGrid2D} from 'evidently-data-structures';
import {TurnState} from '../TurnState';
import {TurnEventType} from '../Enums/TurnEventType';

export class Entities {
	private readonly _entities: SpatialGrid2D<Entity>;

	constructor(width: number, height: number, entities: Entity[] = []) {
		this._entities = new SpatialGrid2D<Entity>(width, height, 3, 3);
		entities.forEach(entity => this._entities.insert(entity));
	}

	public addEntity(entity: Entity, turnState?: TurnState): void {
		turnState?.addEvent(TurnEventType.EntityAdded, entity);
		this._entities.insert(entity);
	}

	public removeEntity(entity: Entity, turnState?: TurnState): void {
		turnState?.addEvent(TurnEventType.EntityRemoved, entity);
		this._entities.remove(entity);
	}

	public getEntitiesOfType<T extends Entity = Entity>(type: EntityType): T[] {
		return this._entities.getFiltered(entity => entity.type === type) as T[];
	}

	public getFirstEntityOfType<T extends Entity>(type: EntityType): T | undefined {
		return this._entities.getFirst(entity => entity.type === type) as T;
	}

	public getEntitiesAt(x: number, y: number): Entity[] {
		return this._entities.get(x, y);
	}

	public hasEntityAt(x: number, y: number, type: EntityType): boolean {
		return this.getEntitiesAt(x, y).some(entity => entity.type === type);
	}

	public getPlayer(): Protagonist | undefined {
		const protagonists = this.getEntitiesOfType(EntityType.Protagonist) as Protagonist[];
		const result = protagonists.filter(x => x.isPlayerControlled);
		if (result.length > 1) {
			throw new Error('More than one player-controlled Protagonist was found.');
		}
		return result.pop();
	}

	public get entities(): readonly Entity[] {
		return this._entities.getAll();
	}

	public get size(): number {
		return this._entities.size;
	}

	public updatePosition(entity: Entity, x: number, y: number): void {
		this._entities.move(entity.x, entity.y, x, y, entity);
		entity.x = x;
		entity.y = y;
	}

	public forEach(callback: { (entity: Entity): void }): void {
		this._entities.forEach(callback);
	}
}
