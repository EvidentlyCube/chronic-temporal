import 'mocha';
import {EntityType} from '../../../../src/GameLogic/Enums/EntityType';
import {FloorType} from '../../../../src/GameLogic/Enums/FloorType';
import {PlayerAction} from '../../../../src/GameLogic/Enums/PlayerAction';
import {TestLevelBuilder} from '../../helpers/TestLevelBuilder';
import {Fireball} from '../../../../src/GameLogic/Entities/Fireball';
import {Direction8} from '../../../../src/GameLogic/Enums/Direction8';

describe('GameLogic.e2e - Water floor', () => {
	it('Protagonist should be removed when moving onto water', () => {
		TestLevelBuilder.newLevel()
			.plotFloor(10, 9, FloorType.Water)
			.run(PlayerAction.MoveUp)
			.assertEntityCount(EntityType.Protagonist, 0);
	});

	it('Fireball should be able to freely travel over water', () => {
		TestLevelBuilder
			.newLevel()
			.plotFloor(10, 9, FloorType.Water)
			.addEntity(new Fireball(Direction8.Right), 9, 10)
			.run(PlayerAction.Wait, PlayerAction.Wait, PlayerAction.Wait)
			.assertEntityCount(EntityType.Fireball, 1);
	});
});
