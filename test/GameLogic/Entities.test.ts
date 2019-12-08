import 'mocha';
import {assert} from 'chai';
import {EntityType} from '../../src/GameLogic/Enums';
import {Protagonist} from '../../src/GameLogic/Entities/Protagonist';
import {Entities} from '../../src/GameLogic/DataStructures/Entities';

describe('GameLogic.DataStructures.Entities', () => {
	describe('addEntity', () => {
		it('addEntity adds new entities', () => {
			//Arrange
			const entities = new Entities();
			const protagonist1 = new Protagonist();
			const protagonist2 = new Protagonist();

			//Act
			entities.addEntity(protagonist1);
			entities.addEntity(protagonist2);

			//Assert
			assert.deepEqual(entities.entities, [protagonist1, protagonist2]);
		});
	});

	describe('removeEntity', () => {
		it('removeEntity removes entity', () => {
			//Arrange
			const protagonist1 = new Protagonist();
			const protagonist2 = new Protagonist();
			const protagonist3 = new Protagonist();
			const entities = new Entities([protagonist1, protagonist2, protagonist3]);

			//Act
			entities.removeEntity(protagonist2);

			//Assert
			assert.deepEqual(entities.entities, [protagonist1, protagonist3]);
		});

		it('removeEntity throws an error if entity does not exist', () => {
			//Arrange
			const protagonist1 = new Protagonist();
			const protagonist2 = new Protagonist();
			const entities = new Entities([protagonist1]);

			//Act & Assert
			assert.throws(() => entities.removeEntity(protagonist2));
		});
	});

	describe('getEntitiesOfType', () => {
		it('Return empty collection when no entity found', () => {
			//Arrange & Act
			const entities = new Entities();

			//Assert
			assert.isEmpty(entities.getEntitiesOfType(EntityType.Protagonist));
		});

		it('Return empty collection when no matching entity found', () => {
			//Arrange
			const entities = new Entities();

			//Act
			entities.addEntity({type: 21} as any); // @todo replace this dummy value with another entity once we have any other entity
			entities.addEntity({type: 17} as any);

			//Assert
			assert.isEmpty(entities.getEntitiesOfType(EntityType.Protagonist));
		});

		it('Return all matching entities (one match)', () => {
			//Arrange
			const entities = new Entities();
			const protagonist = new Protagonist();

			//Act
			entities.addEntity({type: 21} as any);
			entities.addEntity(protagonist);
			entities.addEntity({type: 17} as any);

			//Assert
			assert.deepEqual(entities.getEntitiesOfType(EntityType.Protagonist), [protagonist]);
		});

		it('Return all matching entities (many match)', () => {
			//Arrange
			const entities = new Entities();
			const protagonist1 = new Protagonist();
			const protagonist2 = new Protagonist();
			const protagonist3 = new Protagonist();

			//Act
			entities.addEntity({type: 21} as any);
			entities.addEntity(protagonist1);
			entities.addEntity(protagonist2);
			entities.addEntity(protagonist3);
			entities.addEntity({type: 17} as any);

			//Assert
			assert.deepEqual(entities.getEntitiesOfType(EntityType.Protagonist), [protagonist1, protagonist2, protagonist3]);
		});
	});

	describe('getFirstEntityOfType', () => {
		it('Return undefined when no entity in level', () => {
			//Arrange & Act
			const entities = new Entities();

			//Assert
			assert.equal(entities.getFirstEntityOfType(EntityType.Protagonist), undefined);
		});

		it('Return undefined when no matching entity in level', () => {
			//Arrange
			const entities = new Entities();

			//Act
			entities.addEntity({type: 21} as any);

			//Assert
			assert.equal(entities.getFirstEntityOfType(EntityType.Protagonist), undefined);
		});

		it('Return first entity (only valid entity)', () => {
			//Arrange
			const entities = new Entities();
			const protagonist = new Protagonist();

			//Act
			entities.addEntity(protagonist);

			//Assert
			assert.equal(entities.getFirstEntityOfType(EntityType.Protagonist), protagonist);
		});

		it('Return first entity (wrong entity first)', () => {
			//Arrange
			const entities = new Entities();
			const protagonist = new Protagonist();

			//Act
			entities.addEntity({type: 21} as any);
			entities.addEntity(protagonist);

			//Assert
			assert.equal(entities.getFirstEntityOfType(EntityType.Protagonist), protagonist);
		});

		it('Return first entity (multiple valid entities order 1-2)', () => {
			//Arrange
			const entities = new Entities();
			const protagonist1 = new Protagonist();
			const protagonist2 = new Protagonist();

			//Act
			entities.addEntity({type: 21} as any);
			entities.addEntity(protagonist1);
			entities.addEntity(protagonist2);
			entities.addEntity({type: 17} as any);

			//Assert
			assert.equal(entities.getFirstEntityOfType(EntityType.Protagonist), protagonist1);
		});

		it('Return first entity (multiple valid entities order 2-1)', () => {
			//Arrange
			const entities = new Entities();
			const protagonist1 = new Protagonist();
			const protagonist2 = new Protagonist();

			//Act
			entities.addEntity({type: 21} as any);
			entities.addEntity(protagonist2);
			entities.addEntity(protagonist1);
			entities.addEntity({type: 17} as any);

			//Assert
			assert.equal(entities.getFirstEntityOfType(EntityType.Protagonist), protagonist2);
		});
	});

	describe('getPlayer', () => {
		it('Returns undefined if no player-controlled Protagonist exists', () => {
			//Arrange
			const entities = new Entities();
			const protagonist1 = new Protagonist(false);
			const protagonist2 = new Protagonist(false);

			//Act
			entities.addEntity(protagonist1);
			entities.addEntity(protagonist2);

			//Assert
			assert.equal(entities.getPlayer(), undefined);
		});

		it('Returns the entity if exactly one player-controlled Protagonist exists', () => {
			//Arrange
			const entities = new Entities();
			const protagonist1 = new Protagonist(false);
			const protagonist2 = new Protagonist(true);

			//Act
			entities.addEntity(protagonist1);
			entities.addEntity(protagonist2);

			//Assert
			assert.equal(entities.getPlayer(), protagonist2);
		});

		it('Throws an error if more than one player-controlled Protagonist exists', () => {
			//Arrange
			const entities = new Entities();
			const protagonist1 = new Protagonist(true);
			const protagonist2 = new Protagonist(true);

			//Act
			entities.addEntity(protagonist1);
			entities.addEntity(protagonist2);

			//Assert
			assert.throws(() => entities.getPlayer(), 'More than one player-controlled Protagonist was found.');
		});
	});
});
