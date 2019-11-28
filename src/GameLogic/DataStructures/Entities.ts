import {EntityType} from '../Enums';
import {Entity} from '../Entity';
import {Protagonist} from '../Entities/Protagonist';


export class Entities {
	private _entities: Entity[];

	constructor(entities: Entity[] = []) {
		this._entities = Array.from(entities);
	}

	public push(entity: Entity): void {
		this._entities.push(entity);
	}

	public getEntitiesOfType(type: EntityType): Entity[] {
		return this._entities.filter(entity => entity.type === type);
	}

	public getFirstEntityOfType(type: EntityType): Entity | undefined {
		return this._entities.find(entity => entity.type === type);
	}

	public getPlayer(): Protagonist | undefined {
		// @todo Once we have projections this will have to be updated to return the correct player
		return this.getFirstEntityOfType(EntityType.Protagonist) as Protagonist;
	}

	public get entities(): readonly Entity[] {
		return this._entities;
	}
}
