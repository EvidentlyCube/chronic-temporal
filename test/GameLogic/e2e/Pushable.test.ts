import 'mocha';
import {TestLevelBuilder} from '../helpers/TestLevelBuilder';
import {EntityType, FloorType, PlayerAction, PlayerActionUtils} from '../../../src/GameLogic/Enums';
import {Pushable} from '../../../src/GameLogic/Entities/Pushable';
import {Direction8, Direction8Utils} from '../../../src/GameLogic/Enums/Direction8';
import {Fireball} from '../../../src/GameLogic/Entities/Fireball';
import {Iceblock} from '../../../src/GameLogic/Entities/Iceblock';

const {getX, getY} = Direction8Utils;

describe('GameLogic.e2e - Pushable', () => {
	PlayerActionUtils.moves.forEach((action) => {
		it(`Player should push the pushable into empty floor with move ${PlayerAction[action]}`, () => {
			const moveDirection = PlayerActionUtils.actionToDirection(action);
			TestLevelBuilder.newLevel()
				.addEntity(new Pushable(), 10 + getX(moveDirection), 10 + getY(moveDirection))
				.run(action)

				.assertEntityAt(EntityType.Pushable, 10 + getX(moveDirection) * 2, 10 + getY(moveDirection) * 2);
		});

		it(`No movement when trying to push pushable ${PlayerAction[action]} into a wall`, () => {
			const moveDirection = PlayerActionUtils.actionToDirection(action);
			const pushableX = 10 + getX(moveDirection);
			const pushableY = 10 + getY(moveDirection);
			const wallX = 10 + getX(moveDirection) * 2;
			const wallY = 10 + getY(moveDirection) * 2;
			TestLevelBuilder
				.newLevel()
				.plotFloor(wallX, wallY, FloorType.Wall)
				.addEntity(new Pushable(), pushableX, pushableY)
				.run(action)

				.assertEntityAt(EntityType.Protagonist, 10, 10)
				.assertEntityAt(EntityType.Pushable, pushableX, pushableY);
		});

		it(`No movement when trying to push pushable ${PlayerAction[action]} into another pushable`, () => {
			const moveDirection = PlayerActionUtils.actionToDirection(action);

			const pushable1X = 10 + getX(moveDirection);
			const pushable1Y = 10 + getY(moveDirection);

			const pushable2X = 10 + getX(moveDirection) * 2;
			const pushable2Y = 10 + getY(moveDirection) * 2;
			TestLevelBuilder
				.newLevel()
				.addEntity(new Pushable(), pushable1X, pushable1Y)
				.addEntity(new Pushable(), pushable2X, pushable2Y)
				.run(action)
				.assertEntityAt(EntityType.Protagonist, 10, 10)
				.assertEntityAt(EntityType.Pushable, pushable1X, pushable1Y)
				.assertEntityAt(EntityType.Pushable, pushable2X, pushable2Y);
		});

		it(`No movement when trying to push pushable ${PlayerAction[action]} into an iceblock`, () => {
			const moveDirection = PlayerActionUtils.actionToDirection(action);
			const pushableX = 10 + getX(moveDirection);
			const pushableY = 10 + getY(moveDirection);
			const iceblockX = 10 + getX(moveDirection) * 2;
			const iceblockY = 10 + getY(moveDirection) * 2;
			TestLevelBuilder
				.newLevel()
				.addEntity(new Pushable(), pushableX, pushableY)
				.addEntity(new Iceblock(new Pushable()), iceblockX, iceblockY)
				.run(action)

				.assertEntityAt(EntityType.Protagonist, 10, 10)
				.assertEntityAt(EntityType.Pushable, pushableX, pushableY)
				.assertEntityAt(EntityType.Iceblock, iceblockX, iceblockY);
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
		it(`No movement when trying to push pushable ${PlayerAction[action]} out of bounds`, () => {
			const moveDirection = PlayerActionUtils.actionToDirection(action);
			const pushable = new Pushable();
			const pushableX = x + getX(moveDirection);
			const pushableY = y + getY(moveDirection);
			TestLevelBuilder.newLevel(x, y)
				.addEntity(pushable, x + getX(moveDirection), y + getY(moveDirection))
				.run(action)

				.assertEntityAt(EntityType.Protagonist, x, y)
				.assertEntityAt(EntityType.Pushable, pushableX, pushableY);
		});
	});

	it('Pushable should be removed when pushed onto water', () => {
		TestLevelBuilder.newLevel()
			.plotFloor(10, 8, FloorType.Water)
			.addEntity(new Pushable(), 10, 9)
			.run(PlayerAction.MoveUp)

			.assertEntityCount(EntityType.Pushable, 0);
	});

	it('Pushable should extinguish Fireball when it is pushed into it', () => {
		TestLevelBuilder
			.newLevel()
			.addEntity(new Pushable(), 10, 9)
			.addEntity(new Fireball(Direction8.Left), 10, 8)
			.run(PlayerAction.MoveUp)

			.assertEntityCount(EntityType.Fireball, 0);
	});
});
