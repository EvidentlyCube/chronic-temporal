import 'mocha';
import {assert} from 'chai';
import {Level, LevelConfig} from '../../src/GameLogic/Level';
import {FloorType, PlayerAction} from '../../src/GameLogic/Enums';
import {Protagonist} from '../../src/GameLogic/Entities/Protagonist';
import {ActionSequence} from '../../src/GameLogic/DataStructures/ActionSequence';
import * as levelJson from './helpers/level.json';
import {assertDeepJsonEqual} from '../helpers/assertDeepJsonEqual';

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
		level.entities.addEntity(new Protagonist(false, new ActionSequence([PlayerAction.MoveUpLeft], 1)));
		return level;
	}

	it('Level has not had new properties added', () => {
		const level = createTestLevel(levelConfig);

		console.log(JSON.stringify(level));
		assertDeepJsonEqual(level, levelJson, 'Level has changed, make sure to update the clone method and tests!');
	});

	describe('clone', () => {
		it('Returns an exact copy of the level.', () => {
			const level = createTestLevel(levelConfig);
			const levelClone = level.clone();

			assertDeepJsonEqual(level, levelClone);
			assert.notStrictEqual(level, levelClone);
			assertDeepJsonEqual(level.tilesFloor, levelClone.tilesFloor);
			assert.notStrictEqual(level.tilesFloor, levelClone.tilesFloor, 'tilesFloor is a reference to the original object');
			assertDeepJsonEqual(level.entities, levelClone.entities);
			assert.notStrictEqual(level.entities, levelClone.entities, 'entities is a reference to the original object');
		});

		it('Returns copies of each entity.', () => {
			const level = createTestLevel(levelConfig);
			const levelClone = level.clone();

			assert.equal(level.entities.size, levelClone.entities.size);
			for (let i = 0; i < level.entities.size; i++) {
				assert.deepEqual(level.entities.entities[i], levelClone.entities.entities[i]);
				const message = 'Entity ${i} is a reference to the original object';
				assert.notStrictEqual(level.entities.entities[i], levelClone.entities.entities[i], message);
			}
		});
	});
});
