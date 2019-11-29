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

	public getEntitiesOfType(type: EntityType): Entity[] {
		return this._entities.filter(entity => entity.type === type);
	}

	public getFirstEntityOfType(type: EntityType): Entity | undefined {
		return this._entities.find(entity => entity.type === type);
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
}
