import 'mocha';
import {assert} from 'chai';
import {SessionPlayer} from '../helpers/SessionPlayer';
import {TestLevelBuilder} from '../helpers/TestLevelBuilder';
import {PlayerAction, EntityType, FloorType} from '../../../src/GameLogic/Enums';
import {Pushable} from '../../../src/GameLogic/Entities/Pushable';
import {Direction8Utils, Direction8} from '../../../src/GameLogic/Enums/Direction8';
import {Fireball} from '../../../src/GameLogic/Entities/Fireball';

describe('GameLogic.e2e - Fireball', () => {
	Direction8Utils.allDirectional.forEach((direction) => {
		it(`Fireball should move ${Direction8Utils.getName(direction)}`, () => {
			const fireball = new Fireball(direction);
			fireball.x = 5;
			fireball.y = 5;
			const [, level] = SessionPlayer.play(
				TestLevelBuilder.newLevel().addEntity(fireball),
				[PlayerAction.Wait],
			);

			assert.equal(level.entities.getFirstEntityOfType(EntityType.Fireball)?.x, 5 + Direction8Utils.getX(direction));
			assert.equal(level.entities.getFirstEntityOfType(EntityType.Fireball)?.y, 5 + Direction8Utils.getY(direction));
		});

		it(`Fireball should turn clockwise when it encounters a wall while moving ${Direction8Utils.getName(direction)}`, () => {
			const fireball = new Fireball(direction);
			fireball.x = 5;
			fireball.y = 5;
			const expectedX = 5 + Direction8Utils.getX(Direction8Utils.cw90(direction));
			const expectedY = 5 + Direction8Utils.getY(Direction8Utils.cw90(direction));
			const [, level] = SessionPlayer.play(
				TestLevelBuilder
					.newLevel()
					.addEntity(fireball)
					.plotFloor(5 + Direction8Utils.getX(direction), 5 + Direction8Utils.getY(direction), FloorType.Wall),
				[PlayerAction.Wait],
			);

			assert.equal(level.entities.getFirstEntityOfType(EntityType.Fireball)?.x, expectedX);
			assert.equal(level.entities.getFirstEntityOfType(EntityType.Fireball)?.y, expectedY);
		});

		it(`Fireball should turn clockwise when it encounters a pushable while moving ${Direction8Utils.getName(direction)}`, () => {
			const fireball = new Fireball(direction);
			fireball.x = 5;
			fireball.y = 5;
			const pushable = new Pushable();
			pushable.x = 5 + Direction8Utils.getX(direction);
			pushable.y = 5 + Direction8Utils.getY(direction);
			const expectedX = 5 + Direction8Utils.getX(Direction8Utils.cw90(direction));
			const expectedY = 5 + Direction8Utils.getY(Direction8Utils.cw90(direction));
			const [, level] = SessionPlayer.play(
				TestLevelBuilder
					.newLevel()
					.addEntity(fireball)
					.addEntity(pushable),
				[PlayerAction.Wait],
			);

			assert.equal(level.entities.getFirstEntityOfType(EntityType.Fireball)?.x, expectedX);
			assert.equal(level.entities.getFirstEntityOfType(EntityType.Fireball)?.y, expectedY);
		});

		it(`Fireball should turn ccw when it encounters a wall when trying to turn clockwise while moving ${Direction8Utils.getName(direction)}`, () => {
			const fireball = new Fireball(direction);
			fireball.x = 5;
			fireball.y = 5;
			const expectedX = 5 + Direction8Utils.getX(Direction8Utils.ccw90(direction));
			const expectedY = 5 + Direction8Utils.getY(Direction8Utils.ccw90(direction));
			const [, level] = SessionPlayer.play(
				TestLevelBuilder
					.newLevel()
					.addEntity(fireball)
					.plotFloor(5 + Direction8Utils.getX(direction), 5 + Direction8Utils.getY(direction), FloorType.Wall)
					.plotFloor(
						5 + Direction8Utils.getX(Direction8Utils.cw90(direction)),
						5 + Direction8Utils.getY(Direction8Utils.cw90(direction)),
						FloorType.Wall
					),
				[PlayerAction.Wait],
			);

			assert.equal(level.entities.getFirstEntityOfType(EntityType.Fireball)?.x, expectedX);
			assert.equal(level.entities.getFirstEntityOfType(EntityType.Fireball)?.y, expectedY);
		});

		it(`Fireball should turn ccw when it encounters a pushable when trying to turn clockwise while moving ${Direction8Utils.getName(direction)}`, () => {
			const fireball = new Fireball(direction);
			fireball.x = 5;
			fireball.y = 5;
			const pushable1 = new Pushable();
			pushable1.x = 5 + Direction8Utils.getX(direction);
			pushable1.y = 5 + Direction8Utils.getY(direction);
			const pushable2 = new Pushable();
			pushable2.x = 5 + Direction8Utils.getX(Direction8Utils.cw90(direction));
			pushable2.y = 5 + Direction8Utils.getY(Direction8Utils.cw90(direction));
			const expectedX = 5 + Direction8Utils.getX(Direction8Utils.ccw90(direction));
			const expectedY = 5 + Direction8Utils.getY(Direction8Utils.ccw90(direction));
			const [, level] = SessionPlayer.play(
				TestLevelBuilder
					.newLevel()
					.addEntity(fireball)
					.addEntity(pushable1)
					.addEntity(pushable2),
				[PlayerAction.Wait],
			);

			assert.equal(level.entities.getFirstEntityOfType(EntityType.Fireball)?.x, expectedX);
			assert.equal(level.entities.getFirstEntityOfType(EntityType.Fireball)?.y, expectedY);
		});

		it(`Fireball should turn opposite when it encounters a wall when trying to turn ccw while moving ${Direction8Utils.getName(direction)}`, () => {
			const fireball = new Fireball(direction);
			fireball.x = 5;
			fireball.y = 5;
			const expectedX = 5 + Direction8Utils.getX(Direction8Utils.opposite(direction));
			const expectedY = 5 + Direction8Utils.getY(Direction8Utils.opposite(direction));
			const [, level] = SessionPlayer.play(
				TestLevelBuilder
					.newLevel()
					.addEntity(fireball)
					.plotFloor(5 + Direction8Utils.getX(direction), 5 + Direction8Utils.getY(direction), FloorType.Wall)
					.plotFloor(
						5 + Direction8Utils.getX(Direction8Utils.cw90(direction)),
						5 + Direction8Utils.getY(Direction8Utils.cw90(direction)),
						FloorType.Wall
					)
					.plotFloor(
						5 + Direction8Utils.getX(Direction8Utils.ccw90(direction)),
						5 + Direction8Utils.getY(Direction8Utils.ccw90(direction)),
						FloorType.Wall
					),
				[PlayerAction.Wait],
			);

			assert.equal(level.entities.getFirstEntityOfType(EntityType.Fireball)?.x, expectedX);
			assert.equal(level.entities.getFirstEntityOfType(EntityType.Fireball)?.y, expectedY);
		});

		it(`Fireball should turn opposite when it encounters a pushable when trying to turn ccw while moving ${Direction8Utils.getName(direction)}`, () => {
			const fireball = new Fireball(direction);
			fireball.x = 5;
			fireball.y = 5;
			const pushable1 = new Pushable();
			pushable1.x = 5 + Direction8Utils.getX(direction);
			pushable1.y = 5 + Direction8Utils.getY(direction);
			const pushable2 = new Pushable();
			pushable2.x = 5 + Direction8Utils.getX(Direction8Utils.cw90(direction));
			pushable2.y = 5 + Direction8Utils.getY(Direction8Utils.cw90(direction));
			const pushable3 = new Pushable();
			pushable3.x = 5 + Direction8Utils.getX(Direction8Utils.ccw90(direction));
			pushable3.y = 5 + Direction8Utils.getY(Direction8Utils.ccw90(direction));
			const expectedX = 5 + Direction8Utils.getX(Direction8Utils.opposite(direction));
			const expectedY = 5 + Direction8Utils.getY(Direction8Utils.opposite(direction));
			const [, level] = SessionPlayer.play(
				TestLevelBuilder
					.newLevel()
					.addEntity(fireball)
					.addEntity(pushable1)
					.addEntity(pushable2)
					.addEntity(pushable3),
				[PlayerAction.Wait],
			);

			assert.equal(level.entities.getFirstEntityOfType(EntityType.Fireball)?.x, expectedX);
			assert.equal(level.entities.getFirstEntityOfType(EntityType.Fireball)?.y, expectedY);
		});

		it(`Fireball should not move when it encounters a wall when trying to turn opposite while moving ${Direction8Utils.getName(direction)}`, () => {
			const fireball = new Fireball(direction);
			fireball.x = 5;
			fireball.y = 5;
			const [, level] = SessionPlayer.play(
				TestLevelBuilder
					.newLevel()
					.addEntity(fireball)
					.plotFloor(5 + Direction8Utils.getX(direction), 5 + Direction8Utils.getY(direction), FloorType.Wall)
					.plotFloor(
						5 + Direction8Utils.getX(Direction8Utils.cw90(direction)),
						5 + Direction8Utils.getY(Direction8Utils.cw90(direction)),
						FloorType.Wall
					)
					.plotFloor(
						5 + Direction8Utils.getX(Direction8Utils.ccw90(direction)),
						5 + Direction8Utils.getY(Direction8Utils.ccw90(direction)),
						FloorType.Wall
					)
					.plotFloor(
						5 + Direction8Utils.getX(Direction8Utils.opposite(direction)),
						5 + Direction8Utils.getY(Direction8Utils.opposite(direction)),
						FloorType.Wall
					),
				[PlayerAction.Wait],
			);

			assert.equal(level.entities.getFirstEntityOfType(EntityType.Fireball)?.x, 5);
			assert.equal(level.entities.getFirstEntityOfType(EntityType.Fireball)?.y, 5);
		});

		it(`Fireball should not move when it encounters a pushable when trying to turn opposite while moving ${Direction8Utils.getName(direction)}`, () => {
			const fireball = new Fireball(direction);
			fireball.x = 5;
			fireball.y = 5;
			const pushable1 = new Pushable();
			pushable1.x = 5 + Direction8Utils.getX(direction);
			pushable1.y = 5 + Direction8Utils.getY(direction);
			const pushable2 = new Pushable();
			pushable2.x = 5 + Direction8Utils.getX(Direction8Utils.cw90(direction));
			pushable2.y = 5 + Direction8Utils.getY(Direction8Utils.cw90(direction));
			const pushable3 = new Pushable();
			pushable3.x = 5 + Direction8Utils.getX(Direction8Utils.ccw90(direction));
			pushable3.y = 5 + Direction8Utils.getY(Direction8Utils.ccw90(direction));
			const pushable4 = new Pushable();
			pushable4.x = 5 + Direction8Utils.getX(Direction8Utils.opposite(direction));
			pushable4.y = 5 + Direction8Utils.getY(Direction8Utils.opposite(direction));
			const [, level] = SessionPlayer.play(
				TestLevelBuilder
					.newLevel()
					.addEntity(fireball)
					.addEntity(pushable1)
					.addEntity(pushable2)
					.addEntity(pushable3)
					.addEntity(pushable4),
				[PlayerAction.Wait],
			);

			assert.equal(level.entities.getFirstEntityOfType(EntityType.Fireball)?.x, 5);
			assert.equal(level.entities.getFirstEntityOfType(EntityType.Fireball)?.y, 5);
		});
	});

	const roomEdgeMoves: [number, number, Direction8, number, number][] = [
		[0,   0, Direction8.UpLeft,    1,  1],
		[10,  0, Direction8.Up,        11, 0],
		[19,  0, Direction8.UpRight,   18, 1],
		[0,  10, Direction8.Left,      0,  9],
		[19, 10, Direction8.Right,     19, 11],
		[0,  19, Direction8.DownLeft,  1,  18],
		[10, 19, Direction8.Down,      9,  19],
		[19, 19, Direction8.DownRight, 18, 18],
	];

	roomEdgeMoves.forEach(([x, y, direction, expectedX, expectedY]) => {
		it(`Fireball should turn correctly when trying to move ${direction} out of bounds`, () => {
			const fireball = new Fireball(direction);
			fireball.x = x;
			fireball.y = y;
			const [, level] = SessionPlayer.play(
				TestLevelBuilder.newLevel().addEntity(fireball),
				[PlayerAction.Wait],
			);

			assert.equal(level.entities.getFirstEntityOfType(EntityType.Fireball)?.x, expectedX);
			assert.equal(level.entities.getFirstEntityOfType(EntityType.Fireball)?.y, expectedY);
		});
	});

	it('Fireball should destroy Protagonist when Fireball moves', () => {
		const fireball = new Fireball(Direction8.Down);
		fireball.x = 10;
		fireball.y = 9;
		const [, level] = SessionPlayer.play(
			TestLevelBuilder
				.newLevel()
				.addEntity(fireball),
			PlayerAction.Wait,
		);

		assert.isUndefined(level.entities.getPlayer());
	});

	it('Fireball should destroy Protagonist when Protagonist moves', () => {
		const fireball = new Fireball(Direction8.Left);
		fireball.x = 10;
		fireball.y = 9;
		const [, level] = SessionPlayer.play(
			TestLevelBuilder
				.newLevel()
				.addEntity(fireball),
			PlayerAction.MoveUp,
		);

		assert.isUndefined(level.entities.getPlayer());
	});
});
