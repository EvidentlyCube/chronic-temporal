import {Level, LevelConfig} from '../../../src/GameLogic/Level';
import {FloorType} from '../../../src/GameLogic/Enums';
import {Entity} from '../../../src/GameLogic/Entity';

export class TestLevelBuilder {
	public static newLevel(playerStartX = 10, playerStartY = 10, width = 20, height = 20): TestLevelBuilder {
		return new TestLevelBuilder({width, height, playerStartX, playerStartY});
	}

	private readonly _level: Level;

	private constructor(config: LevelConfig) {
		this._level = new Level(config);
	}

	public plotFloor(x: number, y: number, floorType: FloorType): TestLevelBuilder {
		this._level.tilesFloor.set(x, y, floorType);

		return this;
	}

	public addEntity(entity: Entity): TestLevelBuilder {
		this._level.entities.addEntity(entity);

		return this;
	}

	public toLevel(): Level {
		return this._level;
	}
}
