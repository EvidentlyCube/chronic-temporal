import {Entities} from './DataStructures/Entities';
import {FloorType} from './Enums';
import {Grid2D} from 'evidently-data-structures';

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

	public tilesFloor: Grid2D<FloorType>;

	public entities: Entities;

	constructor(config: LevelConfig) {
		this.width = config.width;
		this.height = config.height;

		this.playerStartX = config.playerStartX;
		this.playerStartY = config.playerStartY;

		this.tilesFloor = new Grid2D<FloorType>(this.width, this.height, () => FloorType.FloorTile);
		this.entities = new Entities();
	}

	public clone(): Level {
		const clonedLevel = new Level({
			width: this.width,
			height: this.height,
			playerStartX: this.playerStartX,
			playerStartY: this.playerStartY,
		});
		clonedLevel.tilesFloor.setAllCallback((x, y) => this.tilesFloor.get(x, y));
		this.entities.entities.forEach(entity => clonedLevel.entities.addEntity(entity.clone()));

		return clonedLevel;
	}
}
