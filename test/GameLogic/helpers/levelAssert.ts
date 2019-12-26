import {assert} from 'chai';
import {EntityType} from '../../../src/GameLogic/Enums/EntityType';
import {Level} from '../../../src/GameLogic/Level';

export const levelAssert = {
	assertEntityCount: function(level: Level, entityType: EntityType, expectedCount: number): void {
		assert.lengthOf(level.entities.getEntitiesOfType(entityType), expectedCount, `Expected to find '${expectedCount}' entities of type '${entityType}'`);
	},

	assertEntityAt: function(level: Level, entityType: EntityType, x: number, y: number): void {
		const entities = level.entities.getEntitiesAt(x, y);

		const expectedEntities = entities.filter(entity => entity.type === entityType);
		assert.isTrue(expectedEntities.length > 0, `No entity of type '${entityType}' found at '${x}x${y}'`);

		expectedEntities.forEach(entity => {
			assert.equal(entity.x, x, `Sanity check: entity of type '${entityType}' placed at ${x}x${y} has different x=${entity.x}`);
			assert.equal(entity.y, y, `Sanity check: entity of type '${entityType}' placed at ${x}x${y} has different y=${entity.y}`);
		});
	},

	assertNoEntityAt: function(level: Level, entityType: EntityType, x: number, y: number): void {
		const entities = level.entities.getEntitiesAt(x, y);

		const expectedEntities = entities.filter(entity => entity.type === entityType);
		assert.lengthOf(expectedEntities, 0, `An entity of type '${entityType}' was found at '${x}x${y}'`);
	},
};
