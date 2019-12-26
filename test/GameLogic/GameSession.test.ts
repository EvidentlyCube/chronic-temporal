import 'mocha';
import {assert} from 'chai';
import {ActionSequence} from '../../src/GameLogic/DataStructures/ActionSequence';
import {GameSession} from '../../src/GameLogic/GameSession';
import {Level, LevelConfig} from '../../src/GameLogic/Level';
import {EntityType} from '../../src/GameLogic/Enums/EntityType';
import {PlayerAction} from '../../src/GameLogic/Enums/PlayerAction';
import {FloorType} from '../../src/GameLogic/Enums/FloorType';
import {Protagonist} from '../../src/GameLogic/Entities/Protagonist';
import {assertDeepJsonEqual} from '../helpers/assertDeepJsonEqual';

describe('GameLogic.GameSession', () => {
	const levelConfig: LevelConfig = {
		width: 20,
		height: 20,
		playerStartX: 10,
		playerStartY: 10,
	};

	//A helper function for these tests, as gameSession adds protagonists to the level
	function removeProtagonistsFromLevel(session: GameSession): void {
		const protagonists = session.level.entities.getEntitiesOfType(EntityType.Protagonist);
		protagonists.forEach(protagonist => session.level.entities.removeEntity(protagonist));
	}

	describe('constructor', () => {
		it('Creates and uses a copy of the level passed in', () => {
			//Arrange
			const level = new Level(levelConfig);

			//Act
			const session = new GameSession(level);

			//Assert
			removeProtagonistsFromLevel(session);
			assertDeepJsonEqual(session.level, level);
			assert.notStrictEqual(session.level, level);
		});

		it('Adds a player-controlled protagonist to the level.', () => {
			//Arrange
			const level = new Level(levelConfig);

			//Act
			const session = new GameSession(level);

			//Assert
			assert.exists(session.level.entities.getPlayer());
			assert.equal(session.level.entities.getPlayer()?.prevX, levelConfig.playerStartX);
			assert.equal(session.level.entities.getPlayer()?.prevY, levelConfig.playerStartY);
		});

		it('Adds only one protagonist if _recordings is empty.', () => {
			//Arrange
			const level = new Level(levelConfig);

			//Act
			const session = new GameSession(level);

			//Assert
			assert.equal(session.level.entities.getEntitiesOfType(EntityType.Protagonist).length, 1);
		});

		it('Adds 2 protagonists if _recordings has one entry.', () => {
			//Arrange
			const level = new Level(levelConfig);

			//Act
			const session = new GameSession(level, {recordings: [new ActionSequence()]});

			//Assert
			assert.equal(session.level.entities.getEntitiesOfType(EntityType.Protagonist).length, 2);
		});

		it('Adds X + 1 protagonists if _recordings has X entries.', () => {
			//Arrange
			const level = new Level(levelConfig);

			//Act
			const session = new GameSession(level, {
				recordings: [
					new ActionSequence(),
					new ActionSequence(),
					new ActionSequence(),
					new ActionSequence(),
					new ActionSequence(),
				],
			});

			//Assert
			assert.equal(session.level.entities.getEntitiesOfType(EntityType.Protagonist).length, 6);
		});

		it('Adds X not player-controlled protagonists if _recordings has X entries.', () => {
			//Arrange
			const level = new Level(levelConfig);

			//Act
			const session = new GameSession(level, {
				recordings: [
					new ActionSequence(),
					new ActionSequence(),
					new ActionSequence(),
				],
			});

			//Assert
			const result = session.level.entities.getEntitiesOfType(EntityType.Protagonist) as Protagonist[];
			let count = 0;
			result.forEach(protagonist => {
				if (!protagonist.isPlayerControlled) {
					count++;
				}
			});
			assert.equal(count, 3);
		});

		it('Should reset the sequences of recordings', () => {
			// Arrange
			const sequences = [
				new ActionSequence([PlayerAction.Wait, PlayerAction.Wait, PlayerAction.Wait]),
				new ActionSequence([PlayerAction.Wait, PlayerAction.Wait, PlayerAction.Wait]),
			];
			sequences[0].getNext();
			sequences[0].getNext();
			sequences[1].getNext();

			// Act
			const session = new GameSession(new Level(levelConfig), {recordings: sequences});

			// Assert
			session.level.entities.getEntitiesOfType<Protagonist>(EntityType.Protagonist).forEach(protagonist => {
				assert.equal(protagonist.movesQueue.position, 0);
			});
		});
	});

	describe('Recordings', () => {
		it('Should return empty recordings when none added', () => {
			const session = new GameSession(new Level(levelConfig));

			assert.lengthOf(session.getRecordings(), 0);
		});

		it('Should return recordings added in constructor', () => {
			const actionSequences = [
				new ActionSequence(),
				new ActionSequence(),
			];
			const session = new GameSession(new Level(levelConfig), {recordings: actionSequences});

			assert.lengthOf(session.getRecordings(), 2);
			assert.include(session.getRecordings(), actionSequences[0]);
			assert.include(session.getRecordings(), actionSequences[1]);
		});

		it('Should return recordings added after construction', () => {
			const actionSequences = [
				new ActionSequence(),
				new ActionSequence(),
			];

			const session = new GameSession(new Level(levelConfig));
			session.registerRecording(actionSequences[0]);
			session.registerRecording(actionSequences[1]);

			assert.lengthOf(session.getRecordings(), 2);
			assert.include(session.getRecordings(), actionSequences[0]);
			assert.include(session.getRecordings(), actionSequences[1]);
		});

		it('Should delete previously added recordings', () => {
			const actionSequence = new ActionSequence();

			const session = new GameSession(new Level(levelConfig));
			session.registerRecording(actionSequence);
			session.removeRecording(actionSequence);

			assert.lengthOf(session.getRecordings(), 0);
		});

		it('Should error when removing recording that is not added', () => {
			const actionSequence = new ActionSequence();

			const session = new GameSession(new Level(levelConfig));
			assert.throws(() => session.removeRecording(actionSequence));
		});
	});

	describe('levelReset', () => {
		it('Should use a copy of the level blueprint', () => {
			//Arrange
			const level = new Level(levelConfig);

			//Act
			const session = new GameSession(level);
			session.level.tilesFloor.set(5, 5, FloorType.Wall);
			session.level.tilesFloor.set(12, 5, FloorType.Wall);
			session.level.entities.addEntity({type: 21} as any);
			session.resetLevel();

			//Assert
			removeProtagonistsFromLevel(session);
			assertDeepJsonEqual(session.level, session.levelBlueprint);
			assert.notStrictEqual(session.level, session.levelBlueprint);
		});
	});
});
