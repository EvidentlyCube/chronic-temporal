import 'mocha';
import {assert} from 'chai';
import {TestLevelBuilder} from '../helpers/TestLevelBuilder';

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
					.run('5'.repeat(turns))
					.assertSession(session => {
						assert.equal(session.turnNumber, turns);
					});
			});
		});

		it('Turn number resets on level reset', () => {
			TestLevelBuilder.newLevel()
				.run('55555')
				.assertSession(session => {
					session.resetLevel();
					assert.equal(session.turnNumber, 0);
				});
		});
	});
	describe('ActionRecorder', () => {
		it('Reset level should clear action queue', () => {
			TestLevelBuilder.newLevel()
				.run('55555')
				.assertSession(session => {
					session.resetLevel();
					assert.equal(session.actionRecorder.end().length, 0);
				});
		});
	});
});
