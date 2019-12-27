import 'mocha';
import {FloorType} from '../../../../src/GameLogic/Enums/FloorType';
import {PlayerAction} from '../../../../src/GameLogic/Enums/PlayerAction';
import {TestLevelBuilder} from '../../helpers/TestLevelBuilder';
import {Fireball} from '../../../../src/GameLogic/Entities/Fireball';
import {Direction8} from '../../../../src/GameLogic/Enums/Direction8';
import {TurnEventType} from '../../../../src/GameLogic/Enums/TurnEventType';
import {Iceblock} from '../../../../src/GameLogic/Entities/Iceblock';
import {Protagonist} from '../../../../src/GameLogic/Entities/Protagonist';

describe('GameLogic.e2e - Level completing', () => {
	it('Level Complete event should be raised when a protagonist steps onto an exit tile', () => {
		TestLevelBuilder.newLevel()
			.plotFloor(10, 9, FloorType.Exit)
			.run(PlayerAction.MoveUp)
			.assertEventRaised(TurnEventType.LevelComplete);
	});

	it('Level Complete event should not be raised when a protagonist steps onto an exit tile but also dies', () => {
		TestLevelBuilder.newLevel()
			.plotFloor(10, 9, FloorType.Exit)
			.addEntity(new Fireball(Direction8.Down), 10, 8)
			.run(PlayerAction.MoveUp)
			.assertEventNotRaised(TurnEventType.LevelComplete);
	});

	it('Level Complete event should be raised when a protagonist in an iceblock melts on an exit tile', () => {
		TestLevelBuilder.newLevel()
			.plotFloor(5, 5, FloorType.Exit)
			.addEntity(new Iceblock(new Protagonist(false)), 5, 5)
			.addEntity(new Fireball(Direction8.Down), 5, 4)
			.run(PlayerAction.Wait)
			.assertEventRaised(TurnEventType.LevelComplete);
	});
});
