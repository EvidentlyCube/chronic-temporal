import 'mocha';
import {assert} from 'chai';
import {ActionSequence} from '../../src/GameLogic/DataStructures/ActionSequence';
import {GameSession} from '../../src/GameLogic/GameSession';
import {Level, LevelConfig} from '../../src/GameLogic/Level';
import {EntityType, PlayerAction} from '../../src/GameLogic/Enums';
import {Protagonist} from '../../src/GameLogic/Entities/Protagonist';

describe('GameLogic.GameSession', () => {
	describe('constructor', () => {
		const levelConfig: LevelConfig = {
			width: 20,
			height: 20,
			playerStartX: 10,
			playerStartY: 10,
		};

		it('Adds a player-controlled protagonist to the level.', () => {
			//Arrange
			const level = new Level(levelConfig);

			//Act
			new GameSession(() => level);

			//Assert
			assert.exists(level.entities.getPlayer());
		});

		it('Adds only one protagonist if _recordings is empty.', () => {
			//Arrange
			const level = new Level(levelConfig);

			//Act
			new GameSession(() => level);

			//Assert
			assert.equal(level.entities.getEntitiesOfType(EntityType.Protagonist).length, 1);
		});

		it('Adds 2 protagonists if _recordings has one entry.', () => {
			//Arrange
			const level = new Level(levelConfig);

			//Act
			new GameSession(() => level, {recordings: [new ActionSequence()]});

			//Assert
			assert.equal(level.entities.getEntitiesOfType(EntityType.Protagonist).length, 2);
		});

		it('Adds X + 1 protagonists if _recordings has X entries.', () => {
			//Arrange
			const level = new Level(levelConfig);

			//Act
			new GameSession(() => level, {
				recordings: [
					new ActionSequence(),
					new ActionSequence(),
					new ActionSequence(),
					new ActionSequence(),
					new ActionSequence(),
				],
			});

			//Assert
			assert.equal(level.entities.getEntitiesOfType(EntityType.Protagonist).length, 6);
		});

		it('Adds X not player-controlled protagonists if _recordings has X entries.', () => {
			//Arrange
			const level = new Level(levelConfig);

			//Act
			new GameSession(() => level, {
				recordings: [
					new ActionSequence(),
					new ActionSequence(),
					new ActionSequence(),
				],
			});

			//Assert
			const result = level.entities.getEntitiesOfType(EntityType.Protagonist) as Protagonist[];
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
			const session = new GameSession(() => new Level(levelConfig), {recordings: sequences});

			// Assert
			session.level.entities.getEntitiesOfType<Protagonist>(EntityType.Protagonist).forEach(protagonist => {
				assert.equal(protagonist.movesQueue.position, 0);
			});
		});
	});
});
