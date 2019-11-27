import {Grid2D} from "../../src.common/DataStructures/Grid2D";
import {Entity} from "./Entity";
import {EntityType} from "./Enums";
import {Protagonist} from "./Entities/Protagonist";

export interface LevelConfig {
	width: number;
	height: number;

	playerStartX: number;
	playerStartY: number;
}

export class Level {
	public width: number;
	public height: number;

	public playerStartX: number;
	public playerStartY: number;

	public tilesFloor: Grid2D<boolean>; // Most likely will need an enum for floor types
	public entities: Entity[];

	constructor(config: LevelConfig) {
		this.width = config.width;
		this.height = config.height;

		this.playerStartX = config.playerStartX;
		this.playerStartY = config.playerStartY;

		this.tilesFloor = new Grid2D<boolean>(this.width, this.height);
		this.entities = [];
	}

	public getEntitiesOfType(type: EntityType): Entity[] {
		return this.entities.filter(entity => entity.type === type);
	}

	public getFirstEntityOfType(type: EntityType): Entity | undefined {
		return this.entities.find(entity => entity.type === type);
	}

	public getPlayer(): Protagonist | undefined {
		// @todo Once we have projections this will have to be updated to return the correct player
		return this.getFirstEntityOfType(EntityType.Protagonist) as Protagonist;
	}
}