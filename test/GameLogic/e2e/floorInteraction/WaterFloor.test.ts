import 'mocha';
import {assert} from 'chai';
import {FloorType, PlayerAction} from '../../../../src/GameLogic/Enums';
import {SessionPlayer} from '../../helpers/SessionPlayer';
import {TestLevelBuilder} from '../../helpers/TestLevelBuilder';

describe('GameLogic.e2e - Water floor', () => {
	it('Protagonist should be removed when moving onto water', () => {
		const [, level] = SessionPlayer.play(
			TestLevelBuilder.newLevel().plotFloor(10, 9, FloorType.Water),
			PlayerAction.MoveUp,
		);

		assert.isUndefined(level.entities.getPlayer());
	});
});
