import 'mocha';
import {assert} from 'chai';
import {EntityType, FloorType, PlayerAction} from '../../../../src/GameLogic/Enums';
import {SessionPlayer} from '../../helpers/SessionPlayer';
import {TestLevelBuilder} from '../../helpers/TestLevelBuilder';
import {Fireball} from '../../../../src/GameLogic/Entities/Fireball';
import {Direction8} from '../../../../src/GameLogic/Enums/Direction8';
import {levelAssert} from '../../helpers/levelAssert';

describe('GameLogic.e2e - Water floor', () => {
	it('Protagonist should be removed when moving onto water', () => {
		const [, level] = SessionPlayer.play(
			TestLevelBuilder.newLevel().plotFloor(10, 9, FloorType.Water),
			PlayerAction.MoveUp,
		);

		assert.isUndefined(level.entities.getPlayer());
	});

	it('Fireball should be able to freely travel over water', () => {
		const [, level] = SessionPlayer.play(
			TestLevelBuilder
				.newLevel()
				.plotFloor(10, 9, FloorType.Water)
				.addEntity(new Fireball(Direction8.Right), 9, 10),
			[PlayerAction.Wait, PlayerAction.Wait, PlayerAction.Wait],
		);

		levelAssert.assertEntityCount(level, EntityType.Fireball, 1);
	});
});
