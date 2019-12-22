import 'mocha';
import {assert} from 'chai';
import {SessionPlayer} from '../helpers/SessionPlayer';
import {TestLevelBuilder} from '../helpers/TestLevelBuilder';
import {PlayerAction, EntityType, FloorType, PlayerActionUtils} from '../../../src/GameLogic/Enums';
import {Pushable} from '../../../src/GameLogic/Entities/Pushable';
import {Direction8Utils, Direction8} from '../../../src/GameLogic/Enums/Direction8';
import {Fireball} from '../../../src/GameLogic/Entities/Fireball';
import {Iceblock} from '../../../src/GameLogic/Entities/Iceblock';

describe('GameLogic.e2e - Iceblock', () => {
	it('Iceblock should not move initiially', () => {
		const iceblock = new Iceblock(new Pushable());
		iceblock.x = 5;
		iceblock.y = 5;
		const [, level] = SessionPlayer.play(
			TestLevelBuilder.newLevel().addEntity(iceblock),
			[PlayerAction.Wait],
		);

		assert.equal(level.entities.getFirstEntityOfType(EntityType.Iceblock)?.x, 5);
		assert.equal(level.entities.getFirstEntityOfType(EntityType.Iceblock)?.y, 5);
	});

	PlayerActionUtils.moves.forEach((action) => {
		it(`Player should push the iceblock into empty floor with move ${PlayerAction[action]} and it should keep moving`, () => {
			const moveDirection = PlayerActionUtils.actionToDirection(action);
			const iceblock = new Iceblock(new Pushable());
			iceblock.x = 10 + Direction8Utils.getX(moveDirection);
			iceblock.y = 10 + Direction8Utils.getY(moveDirection);
			const [, level] = SessionPlayer.play(
				TestLevelBuilder.newLevel().addEntity(iceblock),
				[action, PlayerAction.Wait, PlayerAction.Wait],
			);

			assert.equal(level.entities.getFirstEntityOfType(EntityType.Iceblock)?.x, 10 + Direction8Utils.getX(moveDirection) * 4);
			assert.equal(level.entities.getFirstEntityOfType(EntityType.Iceblock)?.y, 10 + Direction8Utils.getY(moveDirection) * 4);
		});

		it(`No movement when trying to push iceblock ${PlayerAction[action]} into a wall`, () => {
			const moveDirection = PlayerActionUtils.actionToDirection(action);
			const iceblock = new Iceblock(new Pushable());
			const iceblockX = 10 + Direction8Utils.getX(moveDirection);
			const iceblockY = 10 + Direction8Utils.getY(moveDirection);
			iceblock.x = iceblockX;
			iceblock.y = iceblockY;
			const wallX = 10 + Direction8Utils.getX(moveDirection) * 2;
			const wallY = 10 + Direction8Utils.getY(moveDirection) * 2;
			const [, level, player] = SessionPlayer.play(
				TestLevelBuilder
					.newLevel()
					.plotFloor(wallX, wallY, FloorType.Wall)
					.addEntity(iceblock),
				action,
			);

			assert.equal(player.x, 10);
			assert.equal(player.y, 10);
			assert.equal(level.entities.getFirstEntityOfType(EntityType.Iceblock)?.x, iceblockX);
			assert.equal(level.entities.getFirstEntityOfType(EntityType.Iceblock)?.y, iceblockY);
		});

		it(`No movement when trying to push iceblock ${PlayerAction[action]} into a pushable`, () => {
			const moveDirection = PlayerActionUtils.actionToDirection(action);
			const iceblock = new Iceblock(new Pushable());
			const iceblockX = 10 + Direction8Utils.getX(moveDirection);
			const iceblockY = 10 + Direction8Utils.getY(moveDirection);
			iceblock.x = iceblockX;
			iceblock.y = iceblockY;
			const pushable = new Pushable();
			const pushableX = 10 + Direction8Utils.getX(moveDirection) * 2;
			const pushableY = 10 + Direction8Utils.getY(moveDirection) * 2;
			pushable.x = pushableX;
			pushable.y = pushableY;
			const [, level, player] = SessionPlayer.play(
				TestLevelBuilder
					.newLevel()
					.addEntity(iceblock)
					.addEntity(pushable),
				action,
			);

			assert.equal(player.x, 10);
			assert.equal(player.y, 10);
			assert.deepEqual(level.entities.getEntitiesAt(iceblockX, iceblockY), [iceblock]);
			assert.deepEqual(level.entities.getEntitiesAt(pushableX, pushableY), [pushable]);
		});

		it(`No movement when trying to push iceblock ${PlayerAction[action]} into another iceblock`, () => {
			const moveDirection = PlayerActionUtils.actionToDirection(action);
			const iceblock1 = new Iceblock(new Pushable());
			const iceblock1X = 10 + Direction8Utils.getX(moveDirection);
			const iceblock1Y = 10 + Direction8Utils.getY(moveDirection);
			iceblock1.x = iceblock1X;
			iceblock1.y = iceblock1Y;
			const iceblock2 = new Iceblock(new Pushable());
			const iceblock2X = 10 + Direction8Utils.getX(moveDirection) * 2;
			const iceblock2Y = 10 + Direction8Utils.getY(moveDirection) * 2;
			iceblock2.x = iceblock2X;
			iceblock2.y = iceblock2Y;
			const [, level, player] = SessionPlayer.play(
				TestLevelBuilder
					.newLevel()
					.addEntity(iceblock1)
					.addEntity(iceblock2),
				action,
			);

			assert.equal(player.x, 10);
			assert.equal(player.y, 10);
			assert.deepEqual(level.entities.getEntitiesAt(iceblock1X, iceblock1Y), [iceblock1]);
			assert.deepEqual(level.entities.getEntitiesAt(iceblock2X, iceblock2Y), [iceblock2]);
		});

		it(`Iceblock stops moving when it moves ${PlayerAction[action]} into a wall`, () => {
			const moveDirection = PlayerActionUtils.actionToDirection(action);
			const iceblock = new Iceblock(new Pushable());
			iceblock.x = 10 + Direction8Utils.getX(moveDirection);
			iceblock.y = 10 + Direction8Utils.getY(moveDirection);
			const wallX = 10 + Direction8Utils.getX(moveDirection) * 4;
			const wallY = 10 + Direction8Utils.getY(moveDirection) * 4;
			const [, level] = SessionPlayer.play(
				TestLevelBuilder
					.newLevel()
					.plotFloor(wallX, wallY, FloorType.Wall)
					.addEntity(iceblock),
				[action, PlayerAction.Wait, PlayerAction.Wait, PlayerAction.Wait],
			);

			assert.equal(level.entities.getFirstEntityOfType(EntityType.Iceblock)?.x, 10 + Direction8Utils.getX(moveDirection) * 3);
			assert.equal(level.entities.getFirstEntityOfType(EntityType.Iceblock)?.y, 10 + Direction8Utils.getY(moveDirection) * 3);
			assert.equal(iceblock.direction, Direction8.None);
		});

		it(`Iceblock stops moving when it moves ${PlayerAction[action]} into a pushable`, () => {
			const moveDirection = PlayerActionUtils.actionToDirection(action);
			const iceblock = new Iceblock(new Pushable());
			iceblock.x = 10 + Direction8Utils.getX(moveDirection);
			iceblock.y = 10 + Direction8Utils.getY(moveDirection);
			const pushable = new Pushable();
			pushable.x = 10 + Direction8Utils.getX(moveDirection) * 4;
			pushable.y = 10 + Direction8Utils.getY(moveDirection) * 4;
			const [, level] = SessionPlayer.play(
				TestLevelBuilder
					.newLevel()
					.addEntity(iceblock)
					.addEntity(pushable),
				[action, PlayerAction.Wait, PlayerAction.Wait, PlayerAction.Wait],
			);

			assert.equal(level.entities.getFirstEntityOfType(EntityType.Iceblock)?.x, 10 + Direction8Utils.getX(moveDirection) * 3);
			assert.equal(level.entities.getFirstEntityOfType(EntityType.Iceblock)?.y, 10 + Direction8Utils.getY(moveDirection) * 3);
			assert.equal(iceblock.direction, Direction8.None);
		});

		it(`Iceblock stops moving when it moves ${PlayerAction[action]} into another iceblock`, () => {
			const moveDirection = PlayerActionUtils.actionToDirection(action);
			const iceblock1 = new Iceblock(new Pushable());
			iceblock1.x = 10 + Direction8Utils.getX(moveDirection);
			iceblock1.y = 10 + Direction8Utils.getY(moveDirection);
			const iceblock2 = new Iceblock(new Pushable());
			iceblock2.x = 10 + Direction8Utils.getX(moveDirection) * 4;
			iceblock2.y = 10 + Direction8Utils.getY(moveDirection) * 4;
			const [, level] = SessionPlayer.play(
				TestLevelBuilder
					.newLevel()
					.addEntity(iceblock1)
					.addEntity(iceblock2),
				[action, PlayerAction.Wait, PlayerAction.Wait, PlayerAction.Wait],
			);

			assert.equal(level.entities.getFirstEntityOfType(EntityType.Iceblock)?.x, 10 + Direction8Utils.getX(moveDirection) * 3);
			assert.equal(level.entities.getFirstEntityOfType(EntityType.Iceblock)?.y, 10 + Direction8Utils.getY(moveDirection) * 3);
			assert.equal(iceblock1.direction, Direction8.None);
		});
	});

	const roomEdgeMoves: [number, number, PlayerAction][] = [
		[1,  1,  PlayerAction.MoveUpLeft],
		[10, 1,  PlayerAction.MoveUp],
		[18, 1,  PlayerAction.MoveUpRight],
		[1,  10, PlayerAction.MoveLeft],
		[18, 10, PlayerAction.MoveRight],
		[1,  18, PlayerAction.MoveDownLeft],
		[10, 18, PlayerAction.MoveDown],
		[18, 18, PlayerAction.MoveDownRight],
	];

	roomEdgeMoves.forEach(([x, y, action]) => {
		it(`No movement when trying to push iceblock ${PlayerAction[action]} out of bounds`, () => {
			const moveDirection = PlayerActionUtils.actionToDirection(action);
			const iceblock = new Iceblock(new Pushable());
			const iceblockX = x + Direction8Utils.getX(moveDirection);
			const iceblockY = y + Direction8Utils.getY(moveDirection);
			iceblock.x = iceblockX;
			iceblock.y = iceblockY;
			const [, level, player] = SessionPlayer.play(
				TestLevelBuilder.newLevel(x, y).addEntity(iceblock),
				[action],
			);

			assert.equal(player.x, x);
			assert.equal(player.y, y);
			assert.equal(level.entities.getFirstEntityOfType(EntityType.Iceblock)?.x, iceblockX);
			assert.equal(level.entities.getFirstEntityOfType(EntityType.Iceblock)?.y, iceblockY);
		});
	});

	const roomEdgeMoves2: [number, number, PlayerAction, number, number][] = [
		[3,  3,  PlayerAction.MoveUpLeft,    0,  0],
		[10, 3,  PlayerAction.MoveUp,        10, 0],
		[16, 3,  PlayerAction.MoveUpRight,   19, 0],
		[3,  10, PlayerAction.MoveLeft,      0,  10],
		[16, 10, PlayerAction.MoveRight,     19, 10],
		[3,  16, PlayerAction.MoveDownLeft,  0,  19],
		[10, 16, PlayerAction.MoveDown,      10, 19],
		[16, 16, PlayerAction.MoveDownRight, 19, 19],
	];

	roomEdgeMoves2.forEach(([x, y, action, expectedX, expectedY]) => {
		it(`Iceblock stops moving when it tries to move ${PlayerAction[action]} out of bounds`, () => {
			const moveDirection = PlayerActionUtils.actionToDirection(action);
			const iceblock = new Iceblock(new Pushable());
			iceblock.x = x + Direction8Utils.getX(moveDirection);
			iceblock.y = y + Direction8Utils.getY(moveDirection);
			const [, level] = SessionPlayer.play(
				TestLevelBuilder.newLevel(x, y).addEntity(iceblock),
				[action, PlayerAction.Wait, PlayerAction.Wait, PlayerAction.Wait],
			);

			assert.equal(level.entities.getFirstEntityOfType(EntityType.Iceblock)?.x, expectedX);
			assert.equal(level.entities.getFirstEntityOfType(EntityType.Iceblock)?.y, expectedY);
			assert.equal(iceblock.direction, Direction8.None);
		});
	});

	it('Iceblock should be removed when pushed onto water and its contained entity should be lost too', () => {
		const iceblock = new Iceblock(new Pushable());
		iceblock.x = 10;
		iceblock.y = 9;
		const [, level] = SessionPlayer.play(
			TestLevelBuilder
				.newLevel()
				.plotFloor(10, 8, FloorType.Water)
				.addEntity(iceblock),
			PlayerAction.MoveUp,
		);

		assert.isEmpty(level.entities.getEntitiesOfType(EntityType.Iceblock));
		assert.isEmpty(level.entities.getEntitiesOfType(EntityType.Pushable));
	});

	it('Iceblock should be removed when moving onto water and its contained entity should be lost too', () => {
		const iceblock = new Iceblock(new Pushable());
		iceblock.x = 10;
		iceblock.y = 9;
		const [, level] = SessionPlayer.play(
			TestLevelBuilder
				.newLevel()
				.plotFloor(10, 7, FloorType.Water)
				.addEntity(iceblock),
			[PlayerAction.MoveUp, PlayerAction.Wait],
		);

		assert.isEmpty(level.entities.getEntitiesOfType(EntityType.Iceblock));
		assert.isEmpty(level.entities.getEntitiesOfType(EntityType.Pushable));
	});

	it('Iceblock should extinguish Fireball and melt, ejecting its contents when it is pushed into it', () => {
		const pushable = new Pushable();
		const iceblock = new Iceblock(pushable);
		iceblock.x = 10;
		iceblock.y = 9;
		const fireball = new Fireball(Direction8.Left);
		fireball.x = 11;
		fireball.y = 8;
		const [, level] = SessionPlayer.play(
			TestLevelBuilder
				.newLevel()
				.addEntity(iceblock)
				.addEntity(fireball),
			PlayerAction.MoveUp,
		);

		assert.isEmpty(level.entities.getEntitiesOfType(EntityType.Fireball));
		assert.isEmpty(level.entities.getEntitiesOfType(EntityType.Iceblock));
		assert.equal(level.entities.getFirstEntityOfType(EntityType.Pushable)?.x, 10);
		assert.equal(level.entities.getFirstEntityOfType(EntityType.Pushable)?.y, 8);
	});

	it('Iceblock should extinguish Fireball and melt, ejecting its contents when it moves into it', () => {
		const pushable = new Pushable();
		const iceblock = new Iceblock(pushable);
		iceblock.x = 10;
		iceblock.y = 9;
		const fireball = new Fireball(Direction8.Left);
		fireball.x = 12;
		fireball.y = 7;
		const [, level] = SessionPlayer.play(
			TestLevelBuilder
				.newLevel()
				.addEntity(iceblock)
				.addEntity(fireball),
			[PlayerAction.MoveUp, PlayerAction.Wait],
		);

		assert.isEmpty(level.entities.getEntitiesOfType(EntityType.Fireball));
		assert.isEmpty(level.entities.getEntitiesOfType(EntityType.Iceblock));
		assert.equal(level.entities.getFirstEntityOfType(EntityType.Pushable)?.x, 10);
		assert.equal(level.entities.getFirstEntityOfType(EntityType.Pushable)?.y, 7);
	});

	it('Iceblock stops moving while melting', () => {
		const pushable = new Pushable();
		const iceblock = new Iceblock(pushable);
		iceblock.x = 10;
		iceblock.y = 9;
		const fireball = new Fireball(Direction8.Left);
		fireball.x = 13;
		fireball.y = 7;
		const [, level] = SessionPlayer.play(
			TestLevelBuilder
				.newLevel()
				.addEntity(iceblock)
				.addEntity(fireball),
			[PlayerAction.MoveUp, PlayerAction.Wait, PlayerAction.Wait],
		);

		assert.isEmpty(level.entities.getEntitiesOfType(EntityType.Iceblock));
		assert.equal(level.entities.getFirstEntityOfType(EntityType.Pushable)?.x, 10);
		assert.equal(level.entities.getFirstEntityOfType(EntityType.Pushable)?.y, 7);
	});
});
