import 'mocha';
import {assert} from 'chai';
import {Level, LevelConfig} from '../../src/GameLogic/Level';
import {FloorType} from '../../src/GameLogic/Enums';
import {Protagonist} from '../../src/GameLogic/Entities/Protagonist';
import * as levelJson from './helpers/level.json';

describe('GameLogic.Level', () => {
	const levelConfig: LevelConfig = {
		width: 20,
		height: 20,
		playerStartX: 10,
		playerStartY: 10,
	};

	function createTestLevel(levelConfig: LevelConfig): Level {
		const level = new Level(levelConfig);
		level.tilesFloor.set(5, 5, FloorType.Wall);
		level.entities.addEntity(new Protagonist());
		return level;
	}

	it('Level has not had new properties added', () => {
		const level = createTestLevel(levelConfig);

		//console.log(JSON.stringify(level));
		assert.deepEqual(JSON.parse(JSON.stringify(level)), levelJson, 'Level has changed, make sure to update the clone method and tests!');
	});

	describe('clone', () => {
		it('Returns an exact copy of the level.', () => {
			const level = createTestLevel(levelConfig);
			const levelClone = level.clone();

			assert.deepEqual(level, levelClone);
			assert.notStrictEqual(level, levelClone);
		});
	});
});
