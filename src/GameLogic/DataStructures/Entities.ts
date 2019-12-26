import {EntityType} from '../Enums';
import {Entity} from '../Entity';
import {Protagonist} from '../Entities/Protagonist';

export class Entities {
	private readonly _entities: Entity[];

	constructor(entities: Entity[] = []) {
		this._entities = Array.from(entities);
	}

	public addEntity(entity: Entity): void {
		this._entities.push(entity);
	}

	public removeEntity(entity: Entity): void {
		const index = this._entities.indexOf(entity);
		if (index == -1) {
			throw new Error('Could not remove entity.');
		}
		this._entities.splice(index, 1);
	}

	public getEntitiesOfType<T extends Entity = Entity>(type: EntityType): T[] {
		return this._entities.filter(entity => entity.type === type) as T[];
	}

	public getFirstEntityOfType<T extends Entity>(type: EntityType): T | undefined {
		return this._entities.find(entity => entity.type === type) as T;
	}

	public getEntitiesAt(x: number, y: number): Entity[] {
		return this._entities.filter(entity => entity.x == x && entity.y == y);
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
		return this._entities;
	}

	public get length(): number {
		return this._entities.length;
	}
}
