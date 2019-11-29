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
		let result = undefined;
		for (let i = 0; i < protagonists.length; i++) {
			if (protagonists[i].isPlayerControlled) {
				if (!result) {
					result = protagonists[i];
				} else {
					throw new Error('More than one player-controlled Protagonist was found.');
				}
			}
		}
		return result;
	}

	public get entities(): readonly Entity[] {
		return this._entities;
	}
}
