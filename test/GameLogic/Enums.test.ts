import 'mocha';
import {assert} from 'chai';
import {Direction8, Direction8Utils} from '../../src.common/Enums/Direction8';
import {PlayerAction, PlayerActionUtils} from '../../src/GameLogic/Enums';

describe('GameLogic.Enums', () => {
	const actionDirectionPairs: [Direction8, PlayerAction][] = [
		[Direction8.UpLeft, PlayerAction.MoveUpLeft],
		[Direction8.Up, PlayerAction.MoveUp],
		[Direction8.UpRight, PlayerAction.MoveUpRight],
		[Direction8.Left, PlayerAction.MoveLeft],
		[Direction8.None, PlayerAction.Wait],
		[Direction8.Right, PlayerAction.MoveRight],
		[Direction8.DownLeft, PlayerAction.MoveDownLeft],
		[Direction8.Down, PlayerAction.MoveDown],
		[Direction8.DownRight, PlayerAction.MoveDownRight],
	];

	actionDirectionPairs.forEach(([direction, action]) => {
		it(`PlayerActionUtils.directionToAction(${Direction8Utils.getName(direction)}) should return ${PlayerAction[action]}`, () => {
			assert.equal(PlayerActionUtils.directionToAction(direction), action);
		});
		it(`PlayerActionUtils.actionToDirection(${PlayerAction[action]}) should return ${Direction8Utils.getName(direction)}`, () => {
			assert.equal(PlayerActionUtils.actionToDirection(action), direction);
		});
	});
});
