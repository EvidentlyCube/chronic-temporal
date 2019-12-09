import 'mocha';
import {assert} from 'chai';
import {SessionPlayer} from '../helpers/SessionPlayer';
import {TestLevelBuilder} from '../helpers/TestLevelBuilder';
import {PlayerAction, FloorType} from '../../../src/GameLogic/Enums';

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

	it('Moves should not be recorded when there is no player', () => {
		//Arrange
		const actions: PlayerAction[] = [
			PlayerAction.MoveUp,
			PlayerAction.MoveUp,
			PlayerAction.MoveUp,
			PlayerAction.MoveUp,
			PlayerAction.MoveUp,
		];

		//Act
		const [session, , ] = SessionPlayer.play(
			TestLevelBuilder.newLevel().plotFloor(10, 8, FloorType.Water),
			actions
		);
		const result = session.actionRecorder.end().actions;

		//Assert
		assert.deepEqual(result, [PlayerAction.MoveUp, PlayerAction.MoveUp]);
	});
});
