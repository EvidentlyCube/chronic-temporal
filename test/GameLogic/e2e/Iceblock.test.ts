import 'mocha';
import {assert} from 'chai';
import {TestLevelBuilder} from '../helpers/TestLevelBuilder';
import {EntityType, FloorType, PlayerAction, PlayerActionUtils} from '../../../src/GameLogic/Enums';
import {Pushable} from '../../../src/GameLogic/Entities/Pushable';
import {Direction8, Direction8Utils} from '../../../src/GameLogic/Enums/Direction8';
import {Fireball} from '../../../src/GameLogic/Entities/Fireball';
import {Iceblock} from '../../../src/GameLogic/Entities/Iceblock';

const {getX, getY} = Direction8Utils;

describe('GameLogic.e2e - Iceblock', () => {
	it('Iceblock should not move initiially', () => {
		TestLevelBuilder.newLevel()
			.addEntity(new Iceblock(new Pushable()), 5, 5)
			.run(PlayerAction.Wait)

			.assertEntityAt(EntityType.Iceblock, 5, 5);
	});

	PlayerActionUtils.moves.forEach((action) => {
		it(`Player should push the iceblock into empty floor with move ${PlayerAction[action]} and it should keep moving`, () => {
			const moveDirection = PlayerActionUtils.actionToDirection(action);
			TestLevelBuilder.newLevel()
				.addEntity(new Iceblock(new Pushable()), 10 + getX(moveDirection), 10 + getY(moveDirection))
				.run(action, PlayerAction.Wait, PlayerAction.Wait)

				.assertEntityAt(EntityType.Iceblock, 10 + getX(moveDirection) * 4, 10 + getY(moveDirection) * 4);
		});

		it(`No movement when trying to push iceblock ${PlayerAction[action]} into a wall`, () => {
			const moveDirection = PlayerActionUtils.actionToDirection(action);
			const iceblockX = 10 + Direction8Utils.getX(moveDirection);
			const iceblockY = 10 + Direction8Utils.getY(moveDirection);
			const wallX = 10 + Direction8Utils.getX(moveDirection) * 2;
			const wallY = 10 + Direction8Utils.getY(moveDirection) * 2;
			TestLevelBuilder
				.newLevel()
				.plotFloor(wallX, wallY, FloorType.Wall)
				.addEntity(new Iceblock(new Pushable()), iceblockX, iceblockY)
				.run(action)

				.assertEntityAt(EntityType.Protagonist, 10, 10)
				.assertEntityAt(EntityType.Iceblock, iceblockX, iceblockY);
		});

		it(`No movement when trying to push iceblock ${PlayerAction[action]} into a pushable`, () => {
			const moveDirection = PlayerActionUtils.actionToDirection(action);
			const iceblockX = 10 + Direction8Utils.getX(moveDirection);
			const iceblockY = 10 + Direction8Utils.getY(moveDirection);
			const pushableX = 10 + Direction8Utils.getX(moveDirection) * 2;
			const pushableY = 10 + Direction8Utils.getY(moveDirection) * 2;

			TestLevelBuilder
				.newLevel()
				.addEntity(new Iceblock(new Pushable()), iceblockX, iceblockY)
				.addEntity(new Pushable(), pushableX, pushableY)
				.run(action)

				.assertEntityAt(EntityType.Protagonist, 10, 10)
				.assertEntityAt(EntityType.Iceblock, iceblockX, iceblockY)
				.assertEntityAt(EntityType.Pushable, pushableX, pushableY);
		});

		it(`No movement when trying to push iceblock ${PlayerAction[action]} into another iceblock`, () => {
			const moveDirection = PlayerActionUtils.actionToDirection(action);
			const iceblock1X = 10 + Direction8Utils.getX(moveDirection);
			const iceblock1Y = 10 + Direction8Utils.getY(moveDirection);
			const iceblock2X = 10 + Direction8Utils.getX(moveDirection) * 2;
			const iceblock2Y = 10 + Direction8Utils.getY(moveDirection) * 2;
			TestLevelBuilder
				.newLevel()
				.addEntity(new Iceblock(new Pushable()), iceblock1X, iceblock1Y)
				.addEntity(new Iceblock(new Pushable()), iceblock2X, iceblock2Y)
				.run(action)

				.assertEntityAt(EntityType.Protagonist, 10, 10)
				.assertEntityAt(EntityType.Iceblock, iceblock1X, iceblock1Y)
				.assertEntityAt(EntityType.Iceblock, iceblock2X, iceblock2Y);
		});

		it(`Iceblock stops moving when it moves ${PlayerAction[action]} into a wall`, () => {
			const moveDirection = PlayerActionUtils.actionToDirection(action);
			const wallX = 10 + Direction8Utils.getX(moveDirection) * 4;
			const wallY = 10 + Direction8Utils.getY(moveDirection) * 4;

			TestLevelBuilder
				.newLevel()
				.plotFloor(wallX, wallY, FloorType.Wall)
				.addEntity(new Iceblock(new Pushable()), 10 + getX(moveDirection), 10 + getY(moveDirection))
				.run(action, PlayerAction.Wait, PlayerAction.Wait, PlayerAction.Wait)

				.assertEntityAt(EntityType.Iceblock, 10 + getX(moveDirection) * 3, 10 + getY(moveDirection) * 3)
				.assertLevel(level => {
					const iceblock = level.entities.getFirstEntityOfType<Iceblock>(EntityType.Iceblock);
					assert.equal(iceblock?.direction, Direction8.None);
				});
		});

		it(`Iceblock stops moving when it moves ${PlayerAction[action]} into a pushable`, () => {
			const moveDirection = PlayerActionUtils.actionToDirection(action);
			TestLevelBuilder
				.newLevel()
				.addEntity(new Iceblock(new Pushable()), 10 + getX(moveDirection), 10 + getY(moveDirection))
				.addEntity(new Pushable(), 10 + getX(moveDirection) * 4, 10 + getY(moveDirection) * 4)
				.run(action, PlayerAction.Wait, PlayerAction.Wait, PlayerAction.Wait)

				.assertEntityAt(EntityType.Iceblock, 10 + getX(moveDirection) * 3, 10 + getY(moveDirection) * 3)
				.assertLevel(level => {
					const iceblock = level.entities.getFirstEntityOfType<Iceblock>(EntityType.Iceblock);
					assert.equal(iceblock?.direction, Direction8.None);
				});
		});

		it(`Iceblock stops moving when it moves ${PlayerAction[action]} into another iceblock`, () => {
			const moveDirection = PlayerActionUtils.actionToDirection(action);
			TestLevelBuilder
				.newLevel()
				.addEntity(new Iceblock(new Pushable()), 10 + getX(moveDirection), 10 + getY(moveDirection))
				.addEntity(new Iceblock(new Pushable()), 10 + getX(moveDirection) * 4, 10 + getY(moveDirection) * 4)
				.run(action, PlayerAction.Wait, PlayerAction.Wait, PlayerAction.Wait)
				.assertEntityAt(EntityType.Iceblock, 10 + getX(moveDirection) * 3, 10 + getY(moveDirection) * 3)
				.assertLevel(level => {
					const iceblock = level.entities.getFirstEntityOfType<Iceblock>(EntityType.Iceblock);
					assert.equal(iceblock?.direction, Direction8.None);
				});
		});
	});

	const roomEdgeMoves: [number, number, PlayerAction][] = [
		[1, 1, PlayerAction.MoveUpLeft],
		[10, 1, PlayerAction.MoveUp],
		[18, 1, PlayerAction.MoveUpRight],
		[1, 10, PlayerAction.MoveLeft],
		[18, 10, PlayerAction.MoveRight],
		[1, 18, PlayerAction.MoveDownLeft],
		[10, 18, PlayerAction.MoveDown],
		[18, 18, PlayerAction.MoveDownRight],
	];

	roomEdgeMoves.forEach(([x, y, action]) => {
		it(`No movement when trying to push iceblock ${PlayerAction[action]} out of bounds`, () => {
			const moveDirection = PlayerActionUtils.actionToDirection(action);
			const iceblockX = x + Direction8Utils.getX(moveDirection);
			const iceblockY = y + Direction8Utils.getY(moveDirection);
			TestLevelBuilder.newLevel(x, y)
				.addEntity(new Iceblock(new Pushable()), iceblockX, iceblockY)
				.run(action)

				.assertEntityAt(EntityType.Protagonist, x, y)
				.assertEntityAt(EntityType.Iceblock, iceblockX, iceblockY);
		});
	});

	const roomEdgeMoves2: [number, number, PlayerAction, number, number][] = [
		[3, 3, PlayerAction.MoveUpLeft, 0, 0],
		[10, 3, PlayerAction.MoveUp, 10, 0],
		[16, 3, PlayerAction.MoveUpRight, 19, 0],
		[3, 10, PlayerAction.MoveLeft, 0, 10],
		[16, 10, PlayerAction.MoveRight, 19, 10],
		[3, 16, PlayerAction.MoveDownLeft, 0, 19],
		[10, 16, PlayerAction.MoveDown, 10, 19],
		[16, 16, PlayerAction.MoveDownRight, 19, 19],
	];

	roomEdgeMoves2.forEach(([x, y, action, expectedX, expectedY]) => {
		it(`Iceblock stops moving when it tries to move ${PlayerAction[action]} out of bounds`, () => {
			const moveDirection = PlayerActionUtils.actionToDirection(action);
			TestLevelBuilder.newLevel(x, y)
				.addEntity(new Iceblock(new Pushable()), x + getX(moveDirection), y + getY(moveDirection))
				.run(action, PlayerAction.Wait, PlayerAction.Wait, PlayerAction.Wait)

				.assertEntityAt(EntityType.Iceblock, expectedX, expectedY)
				.assertLevel(level => {
					const iceblock = level.entities.getFirstEntityOfType<Iceblock>(EntityType.Iceblock);
					assert.equal(iceblock?.direction, Direction8.None);
				});
		});
	});

	it('Iceblock should be removed when pushed onto water and its contained entity should be lost too', () => {
		TestLevelBuilder
			.newLevel()
			.plotFloor(10, 8, FloorType.Water)
			.addEntity(new Iceblock(new Pushable()), 10, 9)
			.run(PlayerAction.MoveUp)

			.assertEntityCount(EntityType.Iceblock, 0)
			.assertEntityCount(EntityType.Pushable, 0);
	});

	it('Iceblock should extinguish Fireball and melt, ejecting its contents when it is pushed into it', () => {
		TestLevelBuilder
			.newLevel()
			.addEntity(new Iceblock(new Pushable()), 10, 9)
			.addEntity(new Fireball(Direction8.Left), 11, 8)
			.run(PlayerAction.MoveUp)

			.assertEntityCount(EntityType.Fireball, 0)
			.assertEntityCount(EntityType.Iceblock, 0)
			.assertEntityAt(EntityType.Pushable, 10, 8);
	});

	it('Iceblock should extinguish Fireball and melt, ejecting its contents when it moves into it', () => {
		TestLevelBuilder
			.newLevel()
			.addEntity(new Iceblock(new Pushable()), 10, 9)
			.addEntity(new Fireball(Direction8.Left), 12, 7)
			.run(PlayerAction.MoveUp, PlayerAction.Wait)

			.assertEntityCount(EntityType.Fireball, 0)
			.assertEntityCount(EntityType.Iceblock, 0)
			.assertEntityAt(EntityType.Pushable, 10, 7);
	});

	it('Iceblock stops moving while melting', () => {
		TestLevelBuilder
			.newLevel()
			.addEntity(new Iceblock(new Pushable()), 10, 9)
			.addEntity(new Fireball(Direction8.Left), 13, 7)
			.run(PlayerAction.MoveUp, PlayerAction.Wait, PlayerAction.Wait)

			.assertEntityCount(EntityType.Iceblock, 0)
			.assertEntityAt(EntityType.Pushable, 10, 7);
	});
});
