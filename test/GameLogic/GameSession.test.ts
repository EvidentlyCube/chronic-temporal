import 'mocha';
import {assert} from 'chai';
import {ActionSequence} from '../../src/GameLogic/DataStructures/ActionSequence';
import {GameSession} from '../../src/GameLogic/GameSession';
import {LevelConfig, Level} from '../../src/GameLogic/Level';
import {EntityType} from '../../src/GameLogic/Enums';
import {Protagonist} from '../../src/GameLogic/Entities/Protagonist';

describe('GameLogic.GameSession', () => {
	describe('loadLevel', () => {
		const levelConfig: LevelConfig = {
			width: 20,
			height: 20,
			playerStartX: 10,
			playerStartY: 10,
		};

		it('Adds a player-controlled protagonist to the level.', () => {
			//Arrange
			const level = new Level(levelConfig);
			const gameSession = new GameSession();

			//Act
			gameSession.loadLevel(level);

			//Assert
			assert.exists(level.entities.getPlayer());
		});

		it('Adds only one protagonist if recordings is empty.', () => {
			//Arrange
			const level = new Level(levelConfig);
			const gameSession = new GameSession();

			//Act
			gameSession.loadLevel(level);

			//Assert
			assert.equal(level.entities.getEntitiesOfType(EntityType.Protagonist).length, 1);
		});

		it('Adds 2 protagonists if recordings has one entry.', () => {
			//Arrange
			const level = new Level(levelConfig);
			const gameSession = new GameSession();

			//Act
			gameSession.recordings.push(new ActionSequence());
			gameSession.loadLevel(level);

			//Assert
			assert.equal(level.entities.getEntitiesOfType(EntityType.Protagonist).length, 2);
		});

		it('Adds X + 1 protagonists if recordings has X entries.', () => {
			//Arrange
			const level = new Level(levelConfig);
			const gameSession = new GameSession();

			//Act
			gameSession.recordings.push(new ActionSequence());
			gameSession.recordings.push(new ActionSequence());
			gameSession.recordings.push(new ActionSequence());
			gameSession.recordings.push(new ActionSequence());
			gameSession.recordings.push(new ActionSequence());
			gameSession.loadLevel(level);

			//Assert
			assert.equal(level.entities.getEntitiesOfType(EntityType.Protagonist).length, 6);
		});

		it('Adds X not player-controlled protagonists if recordings has X entries.', () => {
			//Arrange
			const level = new Level(levelConfig);
			const gameSession = new GameSession();

			//Act
			gameSession.recordings.push(new ActionSequence());
			gameSession.recordings.push(new ActionSequence());
			gameSession.recordings.push(new ActionSequence());
			gameSession.loadLevel(level);

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
	});
});
