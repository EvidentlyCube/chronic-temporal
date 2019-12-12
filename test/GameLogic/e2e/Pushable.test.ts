import 'mocha';
import {assert} from 'chai';
import {SessionPlayer} from '../helpers/SessionPlayer';
import {TestLevelBuilder} from '../helpers/TestLevelBuilder';
import {PlayerAction, PlayerActionUtils, EntityType, FloorType} from '../../../src/GameLogic/Enums';
import {Pushable} from '../../../src/GameLogic/Entities/Pushable';

describe('GameLogic.e2e - pushable', () => {
	PlayerActionUtils.moves.forEach((action) => {
		it(`Player should push the pushable into empty floor with move ${PlayerAction[action]}`, () => {
			const moveDirection = PlayerActionUtils.actionToDirection(action);
			const pushable = new Pushable();
			pushable.x = 10 + moveDirection.x;
			pushable.y = 10 + moveDirection.y;
			const [, level] = SessionPlayer.play(
				TestLevelBuilder.newLevel().addEntity(pushable),
				action,
			);

			assert.equal(level.entities.getFirstEntityOfType(EntityType.Pushable)?.x, 10 + moveDirection.x * 2);
			assert.equal(level.entities.getFirstEntityOfType(EntityType.Pushable)?.y, 10 + moveDirection.y * 2);
		});

		it(`No movement when trying to push pushable ${PlayerAction[action]} into a wall`, () => {
			const moveDirection = PlayerActionUtils.actionToDirection(action);
			const pushable = new Pushable();
			const pushableX = 10 + moveDirection.x;
			const pushableY = 10 + moveDirection.y;
			pushable.x = pushableX;
			pushable.y = pushableY;
			const wallX = 10 + moveDirection.x * 2;
			const wallY = 10 + moveDirection.y * 2;
			const [, level, player] = SessionPlayer.play(
				TestLevelBuilder
					.newLevel()
					.plotFloor(wallX, wallY, FloorType.Wall)
					.addEntity(pushable),
				action,
			);

			assert.equal(player.x, 10);
			assert.equal(player.y, 10);
			assert.equal(level.entities.getFirstEntityOfType(EntityType.Pushable)?.x, pushableX);
			assert.equal(level.entities.getFirstEntityOfType(EntityType.Pushable)?.y, pushableY);
		});

		it(`No movement when trying to push pushable ${PlayerAction[action]} into another pushable`, () => {
			const moveDirection = PlayerActionUtils.actionToDirection(action);
			const pushable1 = new Pushable();
			const pushable1X = 10 + moveDirection.x;
			const pushable1Y = 10 + moveDirection.y;
			pushable1.x = pushable1X;
			pushable1.y = pushable1Y;
			const pushable2 = new Pushable();
			const pushable2X = 10 + moveDirection.x * 2;
			const pushable2Y = 10 + moveDirection.y * 2;
			pushable2.x = pushable2X;
			pushable2.y = pushable2Y;
			const [, level, player] = SessionPlayer.play(
				TestLevelBuilder
					.newLevel()
					.addEntity(pushable1)
					.addEntity(pushable2),
				action,
			);

			assert.equal(player.x, 10);
			assert.equal(player.y, 10);
			assert.deepEqual(level.entities.getEntitiesAt(pushable1X, pushable1Y), [pushable1]);
			assert.deepEqual(level.entities.getEntitiesAt(pushable2X, pushable2Y), [pushable2]);
		});
	});

	const roomEdgeMoves: [number, number, PlayerAction][] = [
		[1,  1, PlayerAction.MoveUpLeft],
		[10, 1, PlayerAction.MoveUp],
		[18, 1, PlayerAction.MoveUpRight],
		[1,  10, PlayerAction.MoveLeft],
		[18,  10, PlayerAction.MoveRight],
		[1,  18, PlayerAction.MoveDownLeft],
		[10, 18, PlayerAction.MoveDown],
		[18, 18, PlayerAction.MoveDownRight],
	];

	roomEdgeMoves.forEach(([x, y, action]) => {
		it(`No movement when trying to push pushable ${PlayerAction[action]} out of bounds`, () => {
			const moveDirection = PlayerActionUtils.actionToDirection(action);
			const pushable = new Pushable();
			const pushableX = x + moveDirection.x;
			const pushableY = y + moveDirection.y;
			pushable.x = pushableX;
			pushable.y = pushableY;
			const [, level, player] = SessionPlayer.play(
				TestLevelBuilder.newLevel(x, y).addEntity(pushable),
				[action],
			);

			assert.equal(player.x, x);
			assert.equal(player.y, y);
			assert.equal(level.entities.getFirstEntityOfType(EntityType.Pushable)?.x, pushableX);
			assert.equal(level.entities.getFirstEntityOfType(EntityType.Pushable)?.y, pushableY);
		});
	});

	it('Pushable should be removed when pushed onto water', () => {
		const pushable = new Pushable();
		pushable.x = 10;
		pushable.y = 9;
		const [, level] = SessionPlayer.play(
			TestLevelBuilder
				.newLevel()
				.plotFloor(10, 8, FloorType.Water)
				.addEntity(pushable),
			PlayerAction.MoveUp,
		);

		assert.isEmpty(level.entities.getEntitiesOfType(EntityType.Pushable));
	});
});
