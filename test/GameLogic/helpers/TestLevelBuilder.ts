import {Level, LevelConfig} from "../../../src/GameLogic/Level";

export class TestLevelBuilder {
	public static newLevel(playerStartX = 10, playerStartY = 10, width: number = 20, height: number = 20): TestLevelBuilder {
		return new TestLevelBuilder({width, height, playerStartX, playerStartY});
	}

	private readonly _level: Level;

	private constructor(config: LevelConfig) {
		this._level = new Level(config);
	}

	public toLevel(): Level {
		return this._level;
	}
}