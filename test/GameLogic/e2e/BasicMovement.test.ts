import 'mocha';
import {TestLevelBuilder} from '../helpers/TestLevelBuilder';
import {EntityType} from '../../../src/GameLogic/Enums/EntityType';
import {PlayerAction, PlayerActionUtils} from '../../../src/GameLogic/Enums/PlayerAction';
import {Direction8Utils} from '../../../src/GameLogic/Enums/Direction8';

const {getX, getY} = Direction8Utils;

describe('GameLogic.e2e - basic movement', () => {
	PlayerActionUtils.all.forEach((action) => {
		it(`Player should move once with move ${PlayerAction[action]}`, () => {
			const moveDirection = PlayerActionUtils.actionToDirection(action);

			TestLevelBuilder.newLevel()
				.run(action)
				.assertEntityAt(EntityType.Protagonist, 10 + getX(moveDirection), 10 + getY(moveDirection));
		});

		it(`Player should move twice with move ${PlayerAction[action]}`, () => {
			const moveDirection = PlayerActionUtils.actionToDirection(action);

			TestLevelBuilder.newLevel()
				.run(action, action)
				.assertEntityAt(EntityType.Protagonist, 10 + getX(moveDirection) * 2, 10 + getY(moveDirection) * 2);
		});
	});

	const roomEdgeMoves: [number, number, PlayerAction][] = [
		[0, 0, PlayerAction.MoveUpLeft],
		[10, 0, PlayerAction.MoveUp],
		[19, 0, PlayerAction.MoveUpRight],
		[0, 10, PlayerAction.MoveLeft],
		[19, 10, PlayerAction.MoveRight],
		[0, 19, PlayerAction.MoveDownLeft],
		[10, 19, PlayerAction.MoveDown],
		[19, 19, PlayerAction.MoveDownRight],
	];

	roomEdgeMoves.forEach(([x, y, action]) => {
		it(`Player should stay in place when trying to move ${PlayerAction[action]} out of bounds`, () => {
			TestLevelBuilder.newLevel(x, y)
				.run(action)
				.assertEntityAt(EntityType.Protagonist, x, y);
		});
	});
});
