import 'mocha';
import {assert} from 'chai';
import {FloorType, PlayerAction, EntityType} from '../../../../src/GameLogic/Enums';
import {SessionPlayer} from '../../helpers/SessionPlayer';
import {TestLevelBuilder} from '../../helpers/TestLevelBuilder';
import {Fireball} from '../../../../src/GameLogic/Entities/Fireball';
import {Direction8} from '../../../../src.common/Enums/Direction8';

describe('GameLogic.e2e - Water floor', () => {
	it('Protagonist should be removed when moving onto water', () => {
		const [, level] = SessionPlayer.play(
			TestLevelBuilder.newLevel().plotFloor(10, 9, FloorType.Water),
			PlayerAction.MoveUp,
		);

		assert.isUndefined(level.entities.getPlayer());
	});

	it('Fireball should be able to freely travel over water', () => {
		const fireball = new Fireball(Direction8.Right);
		fireball.x = 9;
		fireball.y = 10;
		const [, level] = SessionPlayer.play(
			TestLevelBuilder
				.newLevel()
				.plotFloor(10, 9, FloorType.Water)
				.addEntity(fireball),
			[PlayerAction.Wait, PlayerAction.Wait, PlayerAction.Wait],
		);

		assert.isNotEmpty(level.entities.getEntitiesOfType(EntityType.Fireball));
	});
});
