import 'mocha';
import {assert} from 'chai';
import {EntityType} from '../../src/GameLogic/Enums';
import {Protagonist} from '../../src/GameLogic/Entities/Protagonist';
import {Entities} from '../../src/GameLogic/DataStructures/Entities';

describe('GameLogic.DataStructures.Entities', () => {
	describe('push', () => {
		it('push adds new entities', () => {
			//Arrange
			const entities = new Entities();
			const protagonist1 = new Protagonist();
			const protagonist2 = new Protagonist();
	
			//Act
			entities.push(protagonist1);
			entities.push(protagonist2);

			//Assert
			assert.deepEqual(entities.entities, [protagonist1, protagonist2]);
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
			entities.push({type: 21} as any); // @todo replace this dummy value with another entity once we have any other entity
			entities.push({type: 17} as any);

			//Assert
			assert.isEmpty(entities.getEntitiesOfType(EntityType.Protagonist));
		});

		it('Return all matching entities (one match)', () => {
			//Arrange
			const entities = new Entities();
			const protagonist = new Protagonist();

			//Act
			entities.push({type: 21} as any);
			entities.push(protagonist);
			entities.push({type: 17} as any);

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
			entities.push({type: 21} as any);
			entities.push(protagonist1);
			entities.push(protagonist2);
			entities.push(protagonist3);
			entities.push({type: 17} as any);

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
			entities.push({type: 21} as any);

			//Assert
			assert.equal(entities.getFirstEntityOfType(EntityType.Protagonist), undefined);
		});

		it('Return first entity (only valid entity)', () => {
			//Arrange
			const entities = new Entities();
			const protagonist = new Protagonist();

			//Act
			entities.push(protagonist);

			//Assert
			assert.equal(entities.getFirstEntityOfType(EntityType.Protagonist), protagonist);
		});

		it('Return first entity (wrong entity first)', () => {
			//Arrange
			const entities = new Entities();
			const protagonist = new Protagonist();

			//Act
			entities.push({type: 21} as any);
			entities.push(protagonist);

			//Assert
			assert.equal(entities.getFirstEntityOfType(EntityType.Protagonist), protagonist);
		});

		it('Return first entity (multiple valid entities order 1-2)', () => {
			//Arrange
			const entities = new Entities();
			const protagonist1 = new Protagonist();
			const protagonist2 = new Protagonist();

			//Act
			entities.push({type: 21} as any);
			entities.push(protagonist1);
			entities.push(protagonist2);
			entities.push({type: 17} as any);

			//Assert
			assert.equal(entities.getFirstEntityOfType(EntityType.Protagonist), protagonist1);
		});

		it('Return first entity (multiple valid entities order 2-1)', () => {
			//Arrange
			const entities = new Entities();
			const protagonist1 = new Protagonist();
			const protagonist2 = new Protagonist();

			//Act
			entities.push({type: 21} as any);
			entities.push(protagonist2);
			entities.push(protagonist1);
			entities.push({type: 17} as any);

			//Assert
			assert.equal(entities.getFirstEntityOfType(EntityType.Protagonist), protagonist2);
		});
	});
});
