import 'mocha';
import {assert} from 'chai';
import {Level, LevelConfig} from '../../src/GameLogic/Level';
import {FloorType} from '../../src/GameLogic/Enums';
import {Protagonist} from '../../src/GameLogic/Entities/Protagonist';

describe('GameLogic.Level', () => {
	const levelConfig: LevelConfig = {
		width: 20,
		height: 20,
		playerStartX: 10,
		playerStartY: 10,
	};
	const level = new Level(levelConfig);
	level.tilesFloor.set(5, 5, FloorType.Wall);
	level.entities.addEntity(new Protagonist());

	it('Level has not had new properties added', () => {
		//console.log(JSON.stringify(level));
		const levelJson = '{"width":20,"height":20,"playerStartX":10,"playerStartY":10,"tilesFloor":{"_width":20,"_height":20,"_squares":[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]]},"entities":{"_entities":[{"type":0,"x":0,"y":0,"isPlayerControlled":true,"movesQueue":{"_position":0,"_actionSequence":[]}}]}}';

		assert.equal(JSON.stringify(level), levelJson, 'Level has changed, make sure to update the clone method and tests!');
	});

	describe('clone', () => {
		it('Returns an exact copy of the level.', () => {
			const levelClone = level.clone();

			assert.deepEqual(level, levelClone);
			assert.notStrictEqual(level, levelClone);
			assert.equal(JSON.stringify(level), JSON.stringify(levelClone));
		});
	});
});
