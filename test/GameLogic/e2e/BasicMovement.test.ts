import 'mocha';
import {assert} from 'chai';
import {SessionPlayer} from '../helpers/SessionPlayer';
import {TestLevelBuilder} from '../helpers/TestLevelBuilder';
import {PlayerAction, PlayerActionUtils} from '../../../src/GameLogic/Enums';
import {Direction8Utils} from '../../../src/GameLogic/Enums/Direction8';

describe('GameLogic.e2e - basic movement', () => {
	PlayerActionUtils.all.forEach((action) => {
		it(`Player should move once with move ${PlayerAction[action]}`, () => {
			const moveDirection = PlayerActionUtils.actionToDirection(action);
			const [, , player] = SessionPlayer.play(
				TestLevelBuilder.newLevel(),
				action,
			);

			assert.equal(player.x, 10 + Direction8Utils.getX(moveDirection));
			assert.equal(player.y, 10 + Direction8Utils.getY(moveDirection));
		});

		it(`Player should move twice with move ${PlayerAction[action]}`, () => {
			const moveDirection = PlayerActionUtils.actionToDirection(action);
			const [, , player] = SessionPlayer.play(
				TestLevelBuilder.newLevel(),
				[action, action],
			);

			assert.equal(player.x, 10 + Direction8Utils.getX(moveDirection) * 2);
			assert.equal(player.y, 10 + Direction8Utils.getY(moveDirection) * 2);
		});
	});

	const roomEdgeMoves: [number, number, PlayerAction][] = [
		[0,  0, PlayerAction.MoveUpLeft],
		[10, 0, PlayerAction.MoveUp],
		[19, 0, PlayerAction.MoveUpRight],
		[0,  10, PlayerAction.MoveLeft],
		[19,  10, PlayerAction.MoveRight],
		[0,  19, PlayerAction.MoveDownLeft],
		[10, 19, PlayerAction.MoveDown],
		[19, 19, PlayerAction.MoveDownRight],
	];

	roomEdgeMoves.forEach(([x, y, action]) => {
		it(`Player should stay in place when trying to move ${PlayerAction[action]} out of bounds`, () => {
			const [, , player] = SessionPlayer.play(
				TestLevelBuilder.newLevel(x, y),
				[action],
			);

			assert.equal(player.x, x);
			assert.equal(player.y, y);
		});
	});
});
