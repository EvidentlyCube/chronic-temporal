import 'mocha';
import {assert} from 'chai';
import {SessionPlayer} from '../helpers/SessionPlayer';
import {TestLevelBuilder} from '../helpers/TestLevelBuilder';
import {EntityType, FloorType, PlayerAction} from '../../../src/GameLogic/Enums';
import {Pushable} from '../../../src/GameLogic/Entities/Pushable';
import {Direction8, Direction8Utils} from '../../../src/GameLogic/Enums/Direction8';
import {Fireball} from '../../../src/GameLogic/Entities/Fireball';
import {Iceblock} from '../../../src/GameLogic/Entities/Iceblock';
import {Protagonist} from '../../../src/GameLogic/Entities/Protagonist';
import {ActionSequence} from '../../../src/GameLogic/DataStructures/ActionSequence';
import {levelAssert} from '../helpers/levelAssert';

const {getX, getY, cw90, ccw90, opposite} = Direction8Utils;

describe('GameLogic.e2e - Fireball', () => {
	Direction8Utils.allDirectional.forEach((direction) => {
		it(`Fireball should move ${Direction8Utils.getName(direction)}`, () => {
			const [, level] = SessionPlayer.play(
				TestLevelBuilder.newLevel().addEntity(new Fireball(direction), 5, 5),
				[PlayerAction.Wait],
			);

			levelAssert.assertEntityAt(level, EntityType.Fireball, 5 + getX(direction), 5 + getY(direction));
		});

		it(`Fireball should turn clockwise when it encounters a wall while moving ${Direction8Utils.getName(direction)}`, () => {
			const expectedX = 5 + getX(cw90(direction));
			const expectedY = 5 + getY(cw90(direction));
			const [, level] = SessionPlayer.play(
				TestLevelBuilder
					.newLevel()
					.addEntity(new Fireball(direction), 5, 5)
					.plotFloor(5 + getX(direction), 5 + getY(direction), FloorType.Wall),
				[PlayerAction.Wait],
			);

			levelAssert.assertEntityAt(level, EntityType.Fireball, expectedX, expectedY);
		});

		it(`Fireball should turn clockwise when it encounters a pushable while moving ${Direction8Utils.getName(direction)}`, () => {
			const expectedX = 5 + getX(cw90(direction));
			const expectedY = 5 + getY(cw90(direction));
			const [, level] = SessionPlayer.play(
				TestLevelBuilder
					.newLevel()
					.addEntity(new Fireball(direction), 5, 5)
					.addEntity(new Pushable(), 5 + getX(direction), 5 + getY(direction)),
				[PlayerAction.Wait],
			);

			levelAssert.assertEntityAt(level, EntityType.Fireball, expectedX, expectedY);
		});

		it(`Fireball should turn ccw when it encounters a wall when trying to turn clockwise while moving ${Direction8Utils.getName(direction)}`, () => {
			const expectedX = 5 + getX(ccw90(direction));
			const expectedY = 5 + getY(ccw90(direction));
			const [, level] = SessionPlayer.play(
				TestLevelBuilder
					.newLevel()
					.addEntity(new Fireball(direction), 5, 5)
					.plotFloor(5 + getX(direction), 5 + getY(direction), FloorType.Wall)
					.plotFloor(
						5 + getX(cw90(direction)),
						5 + getY(cw90(direction)),
						FloorType.Wall,
					),
				[PlayerAction.Wait],
			);

			levelAssert.assertEntityAt(level, EntityType.Fireball, expectedX, expectedY);
		});

		it(`Fireball should turn ccw when it encounters a pushable when trying to turn clockwise while moving ${Direction8Utils.getName(direction)}`, () => {
			const expectedX = 5 + getX(ccw90(direction));
			const expectedY = 5 + getY(ccw90(direction));
			const [, level] = SessionPlayer.play(
				TestLevelBuilder
					.newLevel()
					.addEntity(new Fireball(direction), 5, 5)
					.addEntity(new Pushable(), 5 + getX(direction), 5 + getY(direction))
					.addEntity(new Pushable(), 5 + getX(cw90(direction)), 5 + getY(cw90(direction))),
				[PlayerAction.Wait],
			);

			levelAssert.assertEntityAt(level, EntityType.Fireball, expectedX, expectedY);
		});

		it(`Fireball should turn opposite when it encounters a wall when trying to turn ccw while moving ${Direction8Utils.getName(direction)}`, () => {
			const expectedX = 5 + getX(opposite(direction));
			const expectedY = 5 + getY(opposite(direction));
			const [, level] = SessionPlayer.play(
				TestLevelBuilder
					.newLevel()
					.addEntity(new Fireball(direction), 5, 5)
					.plotFloor(5 + getX(direction), 5 + getY(direction), FloorType.Wall)
					.plotFloor(
						5 + getX(cw90(direction)),
						5 + getY(cw90(direction)),
						FloorType.Wall,
					)
					.plotFloor(
						5 + getX(ccw90(direction)),
						5 + getY(ccw90(direction)),
						FloorType.Wall,
					),
				[PlayerAction.Wait],
			);

			levelAssert.assertEntityAt(level, EntityType.Fireball, expectedX, expectedY);
		});

		it(`Fireball should turn opposite when it encounters a pushable when trying to turn ccw while moving ${Direction8Utils.getName(direction)}`, () => {
			const expectedX = 5 + getX(opposite(direction));
			const expectedY = 5 + getY(opposite(direction));
			const [, level] = SessionPlayer.play(
				TestLevelBuilder
					.newLevel()
					.addEntity(new Fireball(direction), 5, 5)
					.addEntity(new Pushable(), 5 + getX(direction), 5 + getY(direction))
					.addEntity(new Pushable(), 5 + getX(cw90(direction)), 5 + getY(cw90(direction)))
					.addEntity(new Pushable(), 5 + getX(ccw90(direction)), 5 + getY(ccw90(direction))),
				[PlayerAction.Wait],
			);

			levelAssert.assertEntityAt(level, EntityType.Fireball, expectedX, expectedY);
		});

		it(`Fireball should not move when it encounters a wall when trying to turn opposite while moving ${Direction8Utils.getName(direction)}`, () => {
			const [, level] = SessionPlayer.play(
				TestLevelBuilder
					.newLevel()
					.addEntity(new Fireball(direction), 5, 5)
					.plotFloor(5 + getX(direction), 5 + getY(direction), FloorType.Wall)
					.plotFloor(
						5 + getX(cw90(direction)),
						5 + getY(cw90(direction)),
						FloorType.Wall,
					)
					.plotFloor(
						5 + getX(ccw90(direction)),
						5 + getY(ccw90(direction)),
						FloorType.Wall,
					)
					.plotFloor(
						5 + getX(opposite(direction)),
						5 + getY(opposite(direction)),
						FloorType.Wall,
					),
				[PlayerAction.Wait],
			);

			levelAssert.assertEntityAt(level, EntityType.Fireball, 5, 5);
		});

		it(`Fireball should not move when it encounters a pushable when trying to turn opposite while moving ${Direction8Utils.getName(direction)}`, () => {
			const [, level] = SessionPlayer.play(
				TestLevelBuilder
					.newLevel()
					.addEntity(new Fireball(direction), 5, 5)
					.addEntity(new Pushable(), 5 + getX(direction), 5 + getY(direction))
					.addEntity(new Pushable(), 5 + getX(cw90(direction)), 5 + getY(cw90(direction)))
					.addEntity(new Pushable(), 5 + getX(ccw90(direction)), 5 + getY(ccw90(direction)))
					.addEntity(new Pushable(), 5 + getX(opposite(direction)), 5 + getY(opposite(direction))),
				[PlayerAction.Wait],
			);

			levelAssert.assertEntityAt(level, EntityType.Fireball, 5, 5);
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
			const [, level] = SessionPlayer.play(
				TestLevelBuilder.newLevel().addEntity(new Fireball(direction), x, y),
				[PlayerAction.Wait],
			);

			levelAssert.assertEntityAt(level, EntityType.Fireball, expectedX, expectedY);
		});
	});

	it('Fireball should destroy Protagonist when Fireball moves into the player', () => {
		const [, level] = SessionPlayer.play(
			TestLevelBuilder
				.newLevel()
				.addEntity(new Fireball(Direction8.Down), 10, 9),
			PlayerAction.Wait,
		);

		assert.isUndefined(level.entities.getPlayer());
	});

	it('Fireball should destroy Protagonist when Protagonist moves into the fireball', () => {
		const [, level] = SessionPlayer.play(
			TestLevelBuilder
				.newLevel()
				.addEntity(new Fireball(Direction8.Left), 10, 9),
			PlayerAction.MoveUp,
		);

		assert.isUndefined(level.entities.getPlayer());
	});

	it('Single fireball should exitinguish when it moves into an iceblock and melt it', () => {
		const fireball = new Fireball(Direction8.Left);
		fireball.x = 6;
		fireball.y = 5;
		const pushable = new Pushable();
		const iceblock = new Iceblock(pushable);
		iceblock.x = 5;
		iceblock.y = 5;
		const [, level] = SessionPlayer.play(
			TestLevelBuilder
				.newLevel()
				.addEntity(fireball)
				.addEntity(iceblock),
			PlayerAction.Wait,
		);

		assert.isEmpty(level.entities.getEntitiesOfType(EntityType.Fireball));
		assert.isEmpty(level.entities.getEntitiesOfType(EntityType.Iceblock));
		assert.equal(level.entities.getFirstEntityOfType(EntityType.Pushable)?.x, 5);
		assert.equal(level.entities.getFirstEntityOfType(EntityType.Pushable)?.y, 5);
	});

	it('Multiple fireballs should exitinguish when they move into an iceblock and melt it, but contents are ejected safely', () => {
		const fireball1 = new Fireball(Direction8.Left);
		fireball1.x = 6;
		fireball1.y = 5;
		const fireball2 = new Fireball(Direction8.Right);
		fireball2.x = 4;
		fireball2.y = 5;
		const protagonist = new Protagonist(false, new ActionSequence([PlayerAction.Wait, PlayerAction.Wait]));
		protagonist.x = 5;
		protagonist.y = 5;
		const iceblock = new Iceblock(protagonist);
		iceblock.x = 5;
		iceblock.y = 5;
		const [, level] = SessionPlayer.play(
			TestLevelBuilder
				.newLevel()
				.addEntity(fireball1)
				.addEntity(fireball2)
				.addEntity(iceblock),
			PlayerAction.Wait,
		);

		assert.isEmpty(level.entities.getEntitiesOfType(EntityType.Fireball));
		assert.isEmpty(level.entities.getEntitiesOfType(EntityType.Iceblock));
		assert.deepEqual(level.entities.getEntitiesAt(5, 5), [protagonist]);
	});
});
