import 'mocha';
import {TestLevelBuilder} from '../../../GameLogic/helpers/TestLevelBuilder';
import {Protagonist} from '../../../../src/GameLogic/Entities/Protagonist';
import {PlayerAction} from '../../../../src/GameLogic/Enums/PlayerAction';
import {EntityType} from '../../../../src/GameLogic/Enums/EntityType';
import {ActionSequence} from '../../../../src/GameLogic/DataStructures/ActionSequence';
import {Pushable} from '../../../../src/GameLogic/Entities/Pushable';

describe('GameLogic.e2e.Runners - ProtagonistRunner', () => {
	describe('Basic moves', () => {
		it('Protagonist stepping into a square another protagonist is leaving should not paradox either', () => {
			TestLevelBuilder.newLevel()
				.addEntity(new Protagonist(false, new ActionSequence([PlayerAction.MoveDown, PlayerAction.MoveUp])), 10, 11)
				.run(PlayerAction.MoveDown, PlayerAction.MoveUp)
				.assertEntityCount(EntityType.Protagonist, 2);
		});

		it('Protagonist stepping into a waiting protagonist should paradox both', () => {
			TestLevelBuilder.newLevel()
				.addEntity(new Protagonist(false, new ActionSequence([PlayerAction.Wait])), 10, 11)
				.run(PlayerAction.MoveDown)
				.assertEntityCount(EntityType.Protagonist, 0);
		});

		it('Protagonist stepping into the same square as another protagonist should paradox both', () => {
			TestLevelBuilder.newLevel()
				.addEntity(new Protagonist(false, new ActionSequence([PlayerAction.MoveUp])), 10, 12)
				.run(PlayerAction.MoveDown)
				.assertEntityCount(EntityType.Protagonist, 0);
		});

		it('Protagonists trying to move through each other should paradox both', () => {
			TestLevelBuilder.newLevel()
				.addEntity(new Protagonist(false, new ActionSequence([PlayerAction.MoveUp])), 10, 11)
				.run(PlayerAction.MoveDown)
				.assertEntityCount(EntityType.Protagonist, 0);
		});

		it('An odd number > 1 of protagonists stepping into the same square should paradox all', () => {
			TestLevelBuilder.newLevel()
				.addEntity(new Protagonist(false, new ActionSequence([PlayerAction.MoveUp])), 10, 12)
				.addEntity(new Protagonist(false, new ActionSequence([PlayerAction.MoveLeft])), 11, 11)
				.run(PlayerAction.MoveDown)
				.assertEntityCount(EntityType.Protagonist, 0);
		});
	});

	describe('Pushing', () => {
		it('Protagonist pushing into a square another protagonist is leaving should not paradox anything', () => {
			TestLevelBuilder.newLevel()
				.addEntity(new Protagonist(false, new ActionSequence([PlayerAction.MoveDown])), 10, 12)
				.addEntity(new Pushable(), 10, 11)
				.run(PlayerAction.MoveDown)
				.assertEntityCount(EntityType.Protagonist, 2)
				.assertEntityCount(EntityType.Pushable, 1);
		});

		it('Protagonist pushing into a waiting protagonist should paradox all', () => {
			TestLevelBuilder.newLevel()
				.addEntity(new Protagonist(false, new ActionSequence([PlayerAction.Wait])), 10, 12)
				.addEntity(new Pushable(), 10, 11)
				.run(PlayerAction.MoveDown)
				.assertEntityCount(EntityType.Protagonist, 0)
				.assertEntityCount(EntityType.Pushable, 0);
		});

		it('Protagonist pushing into the same square as another protagonist is moving into should paradox all', () => {
			TestLevelBuilder.newLevel()
				.addEntity(new Protagonist(false, new ActionSequence([PlayerAction.MoveUp])), 10, 13)
				.addEntity(new Pushable(), 10, 11)
				.run(PlayerAction.MoveDown)
				.assertEntityCount(EntityType.Protagonist, 0)
				.assertEntityCount(EntityType.Pushable, 0);
		});

		it('Protagonists trying to push from opposite sides should paradox all', () => {
			TestLevelBuilder.newLevel()
				.addEntity(new Protagonist(false, new ActionSequence([PlayerAction.MoveUp])), 10, 12)
				.addEntity(new Pushable(), 10, 11)
				.run(PlayerAction.MoveDown)
				.assertEntityCount(EntityType.Protagonist, 0)
				.assertEntityCount(EntityType.Pushable, 0);
		});

		it('Many Protagonists trying to push from many sides should paradox all', () => {
			TestLevelBuilder.newLevel()
				.addEntity(new Protagonist(false, new ActionSequence([PlayerAction.MoveLeft])), 11, 11)
				.addEntity(new Protagonist(false, new ActionSequence([PlayerAction.MoveDownLeft])), 11, 10)
				.addEntity(new Pushable(), 10, 11)
				.run(PlayerAction.MoveDown)
				.assertEntityCount(EntityType.Protagonist, 0)
				.assertEntityCount(EntityType.Pushable, 0);
		});

		it('Protagonists trying to push into the same square should paradox all', () => {
			TestLevelBuilder.newLevel()
				.addEntity(new Protagonist(false, new ActionSequence([PlayerAction.MoveUp])), 10, 14)
				.addEntity(new Pushable(), 10, 13)
				.addEntity(new Pushable(), 10, 11)
				.run(PlayerAction.MoveDown)
				.assertEntityCount(EntityType.Protagonist, 0)
				.assertEntityCount(EntityType.Pushable, 0);
		});

		it('Protagonists trying to push against each other should not paradox anything', () => {
			TestLevelBuilder.newLevel()
				.addEntity(new Protagonist(false, new ActionSequence([PlayerAction.MoveUp])), 10, 13)
				.addEntity(new Pushable(), 10, 12)
				.addEntity(new Pushable(), 10, 11)
				.run(PlayerAction.MoveDown)
				.assertEntityCount(EntityType.Protagonist, 2)
				.assertEntityCount(EntityType.Pushable, 2);
		});
	});
});
