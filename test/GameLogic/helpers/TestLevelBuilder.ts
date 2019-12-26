import {Level, LevelConfig} from '../../../src/GameLogic/Level';
import {FloorType} from '../../../src/GameLogic/Enums/FloorType';
import {PlayerAction} from '../../../src/GameLogic/Enums/PlayerAction';
import {Entity} from '../../../src/GameLogic/Entity';
import {SessionAsserter} from './SessionAsserter';
import {SessionPlayer} from './SessionPlayer';

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

	public addEntity(entity: Entity, x: number, y: number): TestLevelBuilder {
		this._level.entities.addEntity(entity);

		entity.x = x;
		entity.y = y;

		return this;
	}

	public run(actionString: string): SessionAsserter;

	public run(moves: PlayerAction[]): SessionAsserter;

	public run(...moves: PlayerAction[]): SessionAsserter;

	public run(...moves: PlayerAction[]|PlayerAction[][]|string[]): SessionAsserter {
		if (moves.length === 1) {
			if (Array.isArray(moves[0])) {
				return new SessionAsserter(...SessionPlayer.play(this.toLevel(), moves[0] as PlayerAction[]));
			} else if (typeof moves[0] === 'string') {
				return new SessionAsserter(...SessionPlayer.play(this.toLevel(), moves[0] as string));
			}
		}

		return new SessionAsserter(...SessionPlayer.play(this.toLevel(), moves as PlayerAction[]));
	}

	public toLevel(): Level {
		return this._level;
	}
}
