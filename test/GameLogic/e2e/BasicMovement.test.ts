import 'mocha';
import {assert} from 'chai';
import {SessionPlayer} from '../helpers/SessionPlayer';
import {TestLevelBuilder} from '../helpers/TestLevelBuilder';
import {PlayerAction, PlayerActionUtils} from '../../../src/GameLogic/Enums';

describe('GameLogic.e2e - basic movement', () => {
	PlayerActionUtils.all.forEach((action) => {
		it(`Player should move once with move ${PlayerAction[action]}`, () => {
			const moveDirection = PlayerActionUtils.actionToDirection(action);
			const [, , player] = SessionPlayer.play(
				TestLevelBuilder.newLevel(),
				action,
			);

			assert.equal(player.x, 10 + moveDirection.x);
			assert.equal(player.y, 10 + moveDirection.y);
		});

		it(`Player should move twice with move ${PlayerAction[action]}`, () => {
			const moveDirection = PlayerActionUtils.actionToDirection(action);
			const [, , player] = SessionPlayer.play(
				TestLevelBuilder.newLevel(),
				[action, action],
			);

			assert.equal(player.x, 10 + moveDirection.x * 2);
			assert.equal(player.y, 10 + moveDirection.y * 2);
		});
	});
});
