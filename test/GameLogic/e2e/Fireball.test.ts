import 'mocha';
import {TestLevelBuilder} from '../helpers/TestLevelBuilder';
import {EntityType, FloorType, PlayerAction} from '../../../src/GameLogic/Enums';
import {Pushable} from '../../../src/GameLogic/Entities/Pushable';
import {Direction8, Direction8Utils} from '../../../src/GameLogic/Enums/Direction8';
import {Fireball} from '../../../src/GameLogic/Entities/Fireball';
import {Iceblock} from '../../../src/GameLogic/Entities/Iceblock';
import {Protagonist} from '../../../src/GameLogic/Entities/Protagonist';
import {ActionSequence} from '../../../src/GameLogic/DataStructures/ActionSequence';

const {getX, getY, cw90, ccw90, opposite} = Direction8Utils;

describe('GameLogic.e2e - Fireball', () => {
	Direction8Utils.allDirectional.forEach((direction) => {
		it(`Fireball should move ${Direction8Utils.getName(direction)}`, () => {
			TestLevelBuilder.newLevel()
				.addEntity(new Fireball(direction), 5, 5)
				.run(PlayerAction.Wait)
				.assertEntityAt(EntityType.Fireball, 5 + getX(direction), 5 + getY(direction));
		});

		it(`Fireball should turn clockwise when it encounters a wall while moving ${Direction8Utils.getName(direction)}`, () => {
			const expectedX = 5 + getX(cw90(direction));
			const expectedY = 5 + getY(cw90(direction));

			TestLevelBuilder
				.newLevel()
				.addEntity(new Fireball(direction), 5, 5)
				.plotFloor(5 + getX(direction), 5 + getY(direction), FloorType.Wall)
				.run(PlayerAction.Wait)
				.assertEntityAt(EntityType.Fireball, expectedX, expectedY);
		});

		it(`Fireball should turn clockwise when it encounters a pushable while moving ${Direction8Utils.getName(direction)}`, () => {
			const expectedX = 5 + getX(cw90(direction));
			const expectedY = 5 + getY(cw90(direction));

			TestLevelBuilder
				.newLevel()
				.addEntity(new Fireball(direction), 5, 5)
				.addEntity(new Pushable(), 5 + getX(direction), 5 + getY(direction))
				.run(PlayerAction.Wait)
				.assertEntityAt(EntityType.Fireball, expectedX, expectedY);
		});

		it(`Fireball should turn ccw when it encounters a wall when trying to turn clockwise while moving ${Direction8Utils.getName(direction)}`, () => {
			const expectedX = 5 + getX(ccw90(direction));
			const expectedY = 5 + getY(ccw90(direction));
			TestLevelBuilder
				.newLevel()
				.addEntity(new Fireball(direction), 5, 5)
				.plotFloor(5 + getX(direction), 5 + getY(direction), FloorType.Wall)
				.plotFloor(
					5 + getX(cw90(direction)),
					5 + getY(cw90(direction)),
					FloorType.Wall,
				)
				.run(PlayerAction.Wait)
				.assertEntityAt(EntityType.Fireball, expectedX, expectedY);
		});

		it(`Fireball should turn ccw when it encounters a pushable when trying to turn clockwise while moving ${Direction8Utils.getName(direction)}`, () => {
			const expectedX = 5 + getX(ccw90(direction));
			const expectedY = 5 + getY(ccw90(direction));

			TestLevelBuilder
				.newLevel()
				.addEntity(new Fireball(direction), 5, 5)
				.addEntity(new Pushable(), 5 + getX(direction), 5 + getY(direction))
				.addEntity(new Pushable(), 5 + getX(cw90(direction)), 5 + getY(cw90(direction)))
				.run(PlayerAction.Wait)
				.assertEntityAt(EntityType.Fireball, expectedX, expectedY);
		});

		it(`Fireball should turn opposite when it encounters a wall when trying to turn ccw while moving ${Direction8Utils.getName(direction)}`, () => {
			const expectedX = 5 + getX(opposite(direction));
			const expectedY = 5 + getY(opposite(direction));

			TestLevelBuilder.newLevel()
				.addEntity(new Fireball(direction), 5, 5)
				.plotFloor(5 + getX(direction), 5 + getY(direction), FloorType.Wall)
				.plotFloor(5 + getX(cw90(direction)), 5 + getY(cw90(direction)), FloorType.Wall)
				.plotFloor(5 + getX(ccw90(direction)), 5 + getY(ccw90(direction)), FloorType.Wall)
				.run(PlayerAction.Wait)
				.assertEntityAt(EntityType.Fireball, expectedX, expectedY);
		});

		it(`Fireball should turn opposite when it encounters a pushable when trying to turn ccw while moving ${Direction8Utils.getName(direction)}`, () => {
			const expectedX = 5 + getX(opposite(direction));
			const expectedY = 5 + getY(opposite(direction));

			TestLevelBuilder.newLevel()
				.addEntity(new Fireball(direction), 5, 5)
				.addEntity(new Pushable(), 5 + getX(direction), 5 + getY(direction))
				.addEntity(new Pushable(), 5 + getX(cw90(direction)), 5 + getY(cw90(direction)))
				.addEntity(new Pushable(), 5 + getX(ccw90(direction)), 5 + getY(ccw90(direction)))
				.run(PlayerAction.Wait)
				.assertEntityAt(EntityType.Fireball, expectedX, expectedY);
		});

		it(`Fireball should not move when it encounters a wall when trying to turn opposite while moving ${Direction8Utils.getName(direction)}`, () => {
			TestLevelBuilder.newLevel()
				.addEntity(new Fireball(direction), 5, 5)
				.plotFloor(5 + getX(direction), 5 + getY(direction), FloorType.Wall)
				.plotFloor(5 + getX(cw90(direction)), 5 + getY(cw90(direction)), FloorType.Wall)
				.plotFloor(5 + getX(ccw90(direction)), 5 + getY(ccw90(direction)), FloorType.Wall)
				.plotFloor(5 + getX(opposite(direction)), 5 + getY(opposite(direction)), FloorType.Wall)
				.run(PlayerAction.Wait)
				.assertEntityAt(EntityType.Fireball, 5, 5);
		});

		it(`Fireball should not move when it encounters a pushable when trying to turn opposite while moving ${Direction8Utils.getName(direction)}`, () => {
			TestLevelBuilder.newLevel()
				.addEntity(new Fireball(direction), 5, 5)
				.addEntity(new Pushable(), 5 + getX(direction), 5 + getY(direction))
				.addEntity(new Pushable(), 5 + getX(cw90(direction)), 5 + getY(cw90(direction)))
				.addEntity(new Pushable(), 5 + getX(ccw90(direction)), 5 + getY(ccw90(direction)))
				.addEntity(new Pushable(), 5 + getX(opposite(direction)), 5 + getY(opposite(direction)))
				.run(PlayerAction.Wait)
				.assertEntityAt(EntityType.Fireball, 5, 5);
		});
	});

	const roomEdgeMoves: [number, number, Direction8, number, number][] = [
		[0, 0, Direction8.UpLeft, 1, 1],
		[10, 0, Direction8.Up, 11, 0],
		[19, 0, Direction8.UpRight, 18, 1],
		[0, 10, Direction8.Left, 0, 9],
		[19, 10, Direction8.Right, 19, 11],
		[0, 19, Direction8.DownLeft, 1, 18],
		[10, 19, Direction8.Down, 9, 19],
		[19, 19, Direction8.DownRight, 18, 18],
	];

	roomEdgeMoves.forEach(([x, y, direction, expectedX, expectedY]) => {
		it(`Fireball should turn correctly when trying to move ${Direction8Utils.getName(direction)} out of bounds`, () => {
			TestLevelBuilder.newLevel()
				.addEntity(new Fireball(direction), x, y)
				.run(PlayerAction.Wait)
				.assertEntityAt(EntityType.Fireball, expectedX, expectedY);
		});
	});

	it('Fireball should destroy Protagonist when Fireball moves into the player', () => {
		TestLevelBuilder.newLevel()
			.addEntity(new Fireball(Direction8.Down), 10, 9)
			.run(PlayerAction.Wait)
			.assertEntityCount(EntityType.Protagonist, 0);
	});

	it('Fireball should destroy Protagonist when Protagonist moves into the fireball', () => {
		TestLevelBuilder.newLevel()
			.addEntity(new Fireball(Direction8.Left), 10, 9)
			.run(PlayerAction.MoveUp)
			.assertEntityCount(EntityType.Protagonist, 0);
	});

	it('Single fireball should exitinguish when it moves into an iceblock and melt it', () => {
		TestLevelBuilder
			.newLevel()
			.addEntity(new Fireball(Direction8.Left), 6, 5)
			.addEntity(new Iceblock(new Pushable()), 5, 5)
			.run(PlayerAction.Wait)
			.assertEntityCount(EntityType.Fireball, 0)
			.assertEntityCount(EntityType.Iceblock, 0)
			.assertEntityAt(EntityType.Pushable, 5, 5);
	});

	it('Multiple fireballs should exitinguish when they move into an iceblock and melt it, but contents are ejected safely', () => {
		TestLevelBuilder
			.newLevel()
			.addEntity(new Fireball(Direction8.Left), 6, 5)
			.addEntity(new Fireball(Direction8.Right), 4, 5)
			.addEntity(new Iceblock(new Protagonist(false, new ActionSequence([]))), 5, 5)
			.run(PlayerAction.Wait)
			.assertEntityCount(EntityType.Fireball, 0)
			.assertEntityCount(EntityType.Iceblock, 0)
			.assertEntityAt(EntityType.Protagonist, 5, 5);
	});
});
