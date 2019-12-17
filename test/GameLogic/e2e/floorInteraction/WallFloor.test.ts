import 'mocha';
import {assert} from 'chai';
import {FloorType, PlayerAction, PlayerActionUtils} from '../../../../src/GameLogic/Enums';
import {SessionPlayer} from '../../helpers/SessionPlayer';
import {TestLevelBuilder} from '../../helpers/TestLevelBuilder';
import {Direction8Utils} from '../../../../src.common/Enums/Direction8';

describe('GameLogic.e2e - Wall floor', () => {
	PlayerActionUtils.moves.forEach((action) => {
		it(`Player should not move ${PlayerAction[action]} into a wall`, () => {
			const moveDirection = PlayerActionUtils.actionToDirection(action);
			const [, , player] = SessionPlayer.play(
				TestLevelBuilder
					.newLevel()
					.plotFloor(
						10 + Direction8Utils.getX(moveDirection),
						10 + Direction8Utils.getY(moveDirection),
						FloorType.Wall
					),
				action,
			);

			assert.equal(player.x, 10);
			assert.equal(player.y, 10);
		});
	});
});
