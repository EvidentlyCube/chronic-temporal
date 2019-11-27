import 'mocha';
import {assert} from 'chai';
import {SessionPlayer} from '../helpers/SessionPlayer';
import {TestLevelBuilder} from '../helpers/TestLevelBuilder';
import {PlayerAction} from '../../../src/GameLogic/Enums';

describe('GameLogic.e2e - action recording', () => {
	it('Recording should return correct move sequence when recording ends', () => {
		//Arrange
		const actions: PlayerAction[] = [
			PlayerAction.MoveLeft,
			PlayerAction.MoveDownLeft,
			PlayerAction.MoveDownLeft,
			PlayerAction.MoveUp,
			PlayerAction.MoveRight,
		];

		//Act
		const [session, , ] = SessionPlayer.play(
			TestLevelBuilder.newLevel(),
			actions
		);
		const result = session.actionRecorder.end().actions;

		//Assert
		assert.deepEqual(result, actions);
	});
});
