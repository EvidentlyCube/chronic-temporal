import 'mocha';
import {assert} from 'chai';
import {TestLevelBuilder} from '../helpers/TestLevelBuilder';
import {PlayerAction} from '../../../src/GameLogic/Enums/PlayerAction';

describe('GameLogic.e2e - Session State', () => {
	describe('Turn number', () => {
		it('Sessions starts on turn 0', () => {
			TestLevelBuilder.newLevel()
				.run([])
				.assertSession(session => {
					assert.equal(session.turnNumber, 0);
				});
		});

		[1, 2, 10, 100].forEach(turns => {
			it(`Correct turn number after ${turns} turn(s)`, () => {
				TestLevelBuilder.newLevel()
					.run(Array(turns).fill(PlayerAction.Wait))
					.assertSession(session => {
						assert.equal(session.turnNumber, turns);
					});
			});
		});
	});
});
