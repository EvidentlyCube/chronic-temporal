import 'mocha';
import {assert} from 'chai';
import {FloorType, PlayerAction, PlayerActionUtils} from '../../../../src/GameLogic/Enums';
import {SessionPlayer} from '../../helpers/SessionPlayer';
import {TestLevelBuilder} from '../../helpers/TestLevelBuilder';

describe('GameLogic.e2e - basic movement', () => {
	PlayerActionUtils.moves.forEach((action) => {
		it(`Player should not move ${PlayerAction[action]} into a wall`, () => {
			const moveDirection = PlayerActionUtils.actionToDirection(action);
			const [, , player] = SessionPlayer.play(
				TestLevelBuilder.newLevel().plotFloor(10 + moveDirection.x, 10 + moveDirection.y, FloorType.Wall),
				action,
			);

			assert.equal(player.x, 10);
			assert.equal(player.y, 10);
		});
	});
});
