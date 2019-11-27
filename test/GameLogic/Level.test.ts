import 'mocha';
import {assert} from 'chai';
import {TestLevelBuilder} from "./helpers/TestLevelBuilder";
import {EntityType} from "../../src/GameLogic/Enums";
import {Protagonist} from "../../src/GameLogic/Entities/Protagonist";

describe('GameLogic.Level', () => {
	describe('getEntitiesOfType', () => {
		it("Return empty collection when no entity found", () => {
			const level = TestLevelBuilder.newLevel().toLevel();

			assert.isEmpty(level.getEntitiesOfType(EntityType.Protagonist));
		});

		it("Return empty collection when no matching entity found", () => {
			const level = TestLevelBuilder.newLevel().toLevel();

			level.entities.push({type: 21} as any);
			level.entities.push({type: 17} as any);

			assert.isEmpty(level.getEntitiesOfType(EntityType.Protagonist));
		});

		it("Return all matching entities (one match)", () => {
			const level = TestLevelBuilder.newLevel().toLevel();
			const protagonist = new Protagonist();

			level.entities.push({type: 21} as any);
			level.entities.push(protagonist);
			level.entities.push({type: 17} as any);

			assert.deepEqual(level.getEntitiesOfType(EntityType.Protagonist), [protagonist]);
		});

		it("Return all matching entities (many match)", () => {
			const level = TestLevelBuilder.newLevel().toLevel();
			const protagonist1 = new Protagonist();
			const protagonist2 = new Protagonist();
			const protagonist3 = new Protagonist();

			level.entities.push({type: 21} as any);
			level.entities.push(protagonist1);
			level.entities.push(protagonist2);
			level.entities.push(protagonist3);
			level.entities.push({type: 17} as any);

			assert.deepEqual(level.getEntitiesOfType(EntityType.Protagonist), [protagonist1, protagonist2, protagonist3]);
		});
	});

	describe('getFirstEntityOfType', () => {
		it("Return undefined when no entity in level", () => {
			const level = TestLevelBuilder.newLevel().toLevel();

			assert.equal(level.getFirstEntityOfType(EntityType.Protagonist), undefined);
		});

		it("Return undefined when no matching entity in level", () => {
			const level = TestLevelBuilder.newLevel().toLevel();

			level.entities.push({type: 21} as any);

			assert.equal(level.getFirstEntityOfType(EntityType.Protagonist), undefined);
		});

		it("Return first entity (only valid entity)", () => {
			const level = TestLevelBuilder.newLevel().toLevel();
			const protagonist = new Protagonist();

			level.entities.push(protagonist);

			assert.equal(level.getFirstEntityOfType(EntityType.Protagonist), protagonist);
		});

		it("Return first entity (wrong entity first)", () => {
			const level = TestLevelBuilder.newLevel().toLevel();
			const protagonist = new Protagonist();

			level.entities.push({type: 21} as any);
			level.entities.push(protagonist);

			assert.equal(level.getFirstEntityOfType(EntityType.Protagonist), protagonist);
		});

		it("Return first entity (multiple valid entities order 1-2)", () => {
			const level = TestLevelBuilder.newLevel().toLevel();
			const protagonist1 = new Protagonist();
			const protagonist2 = new Protagonist();

			level.entities.push({type: 21} as any);
			level.entities.push(protagonist1);
			level.entities.push(protagonist2);
			level.entities.push({type: 17} as any);

			assert.equal(level.getFirstEntityOfType(EntityType.Protagonist), protagonist1);
		});

		it("Return first entity (multiple valid entities order 2-1)", () => {
			const level = TestLevelBuilder.newLevel().toLevel();
			const protagonist1 = new Protagonist();
			const protagonist2 = new Protagonist();

			level.entities.push({type: 21} as any);
			level.entities.push(protagonist2);
			level.entities.push(protagonist1);
			level.entities.push({type: 17} as any);

			assert.equal(level.getFirstEntityOfType(EntityType.Protagonist), protagonist2);
		});
	});
});