import 'mocha';
import {assert} from 'chai';
import {EntityType} from '../../../../src/GameLogic/Enums/EntityType';
import {FloorType} from '../../../../src/GameLogic/Enums/FloorType';
import {PlayerAction} from '../../../../src/GameLogic/Enums/PlayerAction';
import {TestLevelBuilder} from '../../helpers/TestLevelBuilder';
import {Fireball} from '../../../../src/GameLogic/Entities/Fireball';
import {Direction8} from '../../../../src/GameLogic/Enums/Direction8';
import {Iceblock} from '../../../../src/GameLogic/Entities/Iceblock';
import {Pushable} from '../../../../src/GameLogic/Entities/Pushable';
import {Protagonist} from '../../../../src/GameLogic/Entities/Protagonist';
import {ActionSequence} from '../../../../src/GameLogic/DataStructures/ActionSequence';

describe('GameLogic.e2e - Ice Trap floor', () => {
	it('Protagonist should be frozen when moving onto an ice trap, and the ice trap should turn into floor', () => {
		TestLevelBuilder.newLevel()
			.plotFloor(10, 9, FloorType.IceTrap)
			.run(PlayerAction.MoveUp)

			.assertEntityCount(EntityType.Protagonist, 0)
			.assertEntityCount(EntityType.Iceblock, 1)
			.assertFloorTileAt(FloorType.FloorTile, 10, 9)
			.assertLevel(level => {
				const iceblock = level.entities.getFirstEntityOfType<Iceblock>(EntityType.Iceblock);
				assert.equal(iceblock?.containedEntity?.type, EntityType.Protagonist);
			});
	});

	it('Fireball should be able to freely travel over ice trap', () => {
		TestLevelBuilder
			.newLevel()
			.plotFloor(10, 9, FloorType.IceTrap)
			.addEntity(new Fireball(Direction8.Right), 9, 10)
			.run(PlayerAction.Wait, PlayerAction.Wait, PlayerAction.Wait)

			.assertEntityCount(EntityType.Fireball, 1);
	});

	describe('Movement order', () => {
		it('Protagonist moving onto ice trap with fireball already on it should kill the protagonist and not trigger the ice trap', () => {
			TestLevelBuilder.newLevel()
				.plotFloor(10, 9, FloorType.IceTrap)
				.addEntity(new Fireball(Direction8.Right), 10, 9)
				.run(PlayerAction.MoveUp)

				.assertEntityCount(EntityType.Protagonist, 0)
				.assertEntityCount(EntityType.Iceblock, 0)
				.assertEntityCount(EntityType.Fireball, 1)
				.assertFloorTileAt(FloorType.IceTrap, 10, 9);
		});

		it('Protagonist moving onto ice trap at the same time as a fireball should trigger the trap then immediately melt the iceblock', () => {
			TestLevelBuilder.newLevel()
				.plotFloor(10, 9, FloorType.IceTrap)
				.addEntity(new Fireball(Direction8.Right), 9, 9)
				.run(PlayerAction.MoveUp)

				.assertEntityCount(EntityType.Protagonist, 1)
				.assertEntityCount(EntityType.Iceblock, 0)
				.assertEntityCount(EntityType.Fireball, 0)
				.assertFloorTileAt(FloorType.FloorTile, 10, 9);
		});

		it('Pushable pushed onto ice trap at the same time as a fireball should trigger the trap then immediately melt the iceblock', () => {
			TestLevelBuilder.newLevel()
				.plotFloor(10, 8, FloorType.IceTrap)
				.addEntity(new Fireball(Direction8.Right), 9, 8)
				.addEntity(new Pushable(), 10, 9)
				.run(PlayerAction.MoveUp)

				.assertEntityCount(EntityType.Pushable, 1)
				.assertEntityCount(EntityType.Iceblock, 0)
				.assertEntityCount(EntityType.Fireball, 0)
				.assertFloorTileAt(FloorType.FloorTile, 10, 8);
		});
	});

	describe('Iceblock interactions', () => {
		it('Iceblock moved onto ice trap recursively stores old iceblock inside new one', () => {
			TestLevelBuilder.newLevel()
				.plotFloor(10, 8, FloorType.IceTrap)
				.addEntity(new Iceblock(new Pushable()), 10, 9)
				.run(PlayerAction.MoveUp)

				.assertLevel(level => {
					const iceblock = level.entities.getFirstEntityOfType<Iceblock>(EntityType.Iceblock);
					assert.equal(iceblock?.containedEntity?.type, EntityType.Iceblock);

					const iceblock2 = iceblock?.containedEntity as Iceblock | undefined;
					assert.equal(iceblock2?.containedEntity?.type, EntityType.Pushable);
				});
		});

		it('Iceblock pushed onto ice trap triggers trap and keeps moving', () => {
			TestLevelBuilder.newLevel()
				.plotFloor(10, 8, FloorType.IceTrap)
				.addEntity(new Iceblock(), 10, 9)
				.run([PlayerAction.MoveUp, PlayerAction.Wait, PlayerAction.Wait])

				.assertEntityAt(EntityType.Iceblock, 10, 6)
				.assertFloorTileAt(FloorType.FloorTile, 10, 8);
		});

		it('Iceblock moving onto ice trap triggers trap and keeps moving', () => {
			TestLevelBuilder.newLevel()
				.plotFloor(10, 7, FloorType.IceTrap)
				.addEntity(new Iceblock(), 10, 9)
				.run([PlayerAction.MoveUp, PlayerAction.Wait, PlayerAction.Wait])

				.assertEntityAt(EntityType.Iceblock, 10, 6)
				.assertFloorTileAt(FloorType.FloorTile, 10, 7);
		});

		it('Iceblock pushed onto ice trap with fireball already on it should trigger the trap and leave original iceblock in original state', () => {
			TestLevelBuilder.newLevel()
				.plotFloor(10, 8, FloorType.IceTrap)
				.addEntity(new Fireball(Direction8.Right), 10, 8)
				.addEntity(new Iceblock(new Pushable()), 10, 9)
				.run(PlayerAction.MoveUp)

				.assertEntityCount(EntityType.Pushable, 0)
				.assertEntityCount(EntityType.Iceblock, 1)
				.assertEntityCount(EntityType.Fireball, 0)
				.assertFloorTileAt(FloorType.FloorTile, 10, 8)
				.assertLevel(level => {
					const iceblock = level.entities.getFirstEntityOfType<Iceblock>(EntityType.Iceblock);
					assert.equal(iceblock?.containedEntity?.type, EntityType.Pushable);
					assert.equal(iceblock?.direction, Direction8.Up);
				});
		});

		it('Iceblock pushed onto ice trap at the same time as a fireball should trigger the trap and leave original iceblock in original state', () => {
			TestLevelBuilder.newLevel()
				.plotFloor(10, 8, FloorType.IceTrap)
				.addEntity(new Fireball(Direction8.Right), 9, 8)
				.addEntity(new Iceblock(new Pushable()), 10, 9)
				.run(PlayerAction.MoveUp)

				.assertEntityCount(EntityType.Pushable, 0)
				.assertEntityCount(EntityType.Iceblock, 1)
				.assertEntityCount(EntityType.Fireball, 0)
				.assertFloorTileAt(FloorType.FloorTile, 10, 8)
				.assertLevel(level => {
					const iceblock = level.entities.getFirstEntityOfType<Iceblock>(EntityType.Iceblock);
					assert.equal(iceblock?.containedEntity?.type, EntityType.Pushable);
					assert.equal(iceblock?.direction, Direction8.Up);
				});
		});
	});

	describe('Recording interactions', () => {
		it('Player-controlled Protagonist trapped inside Iceblock should not record inputs made while trapped', () => {
			TestLevelBuilder.newLevel()
				.plotFloor(10, 9, FloorType.IceTrap)
				.addEntity(new Protagonist(false, new ActionSequence([PlayerAction.Wait, PlayerAction.MoveRight])), 9, 9)
				.addEntity(new Fireball(Direction8.Up), 13, 13)
				.run(
					PlayerAction.MoveUp,
					// These should be ignored as trapped inside an iceblock
					PlayerAction.MoveDown,
					PlayerAction.MoveDownLeft,
					PlayerAction.MoveDownRight,
					// These should be executed and recorded
					PlayerAction.MoveUp,
					PlayerAction.MoveUp
				)

				.assertEntityAt(EntityType.Protagonist, 13, 7)
				.assertLevel(level => {
					const player = level.entities.getPlayer();
					assert.deepEqual(player?.movesQueue.actions, [PlayerAction.MoveUp, PlayerAction.MoveUp, PlayerAction.MoveUp]);
				});
		});

		it('Pre-recorded Protagonist trapped inside Iceblock should not execute actions while trapped', () => {
			TestLevelBuilder.newLevel()
				.plotFloor(10, 9, FloorType.IceTrap)
				.addEntity(new Protagonist(false, new ActionSequence([PlayerAction.MoveRight, PlayerAction.MoveRight, PlayerAction.MoveRight])), 9, 9)
				.addEntity(new Fireball(Direction8.Right), 6, 6)
				.run(
					PlayerAction.Wait,
					PlayerAction.MoveUp,
					PlayerAction.Wait,
					PlayerAction.Wait,
					PlayerAction.Wait,
					PlayerAction.Wait,
					PlayerAction.Wait,
					PlayerAction.Wait
				)

				.assertEntityAt(EntityType.Protagonist, 12, 6);
		});
	});
});
