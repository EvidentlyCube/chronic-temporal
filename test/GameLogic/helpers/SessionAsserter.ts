import {GameSession} from '../../../src/GameLogic/GameSession';
import {EntityType} from '../../../src/GameLogic/Enums/EntityType';
import {assert} from 'chai';
import {Level} from '../../../src/GameLogic/Level';
import {TurnState} from '../../../src/GameLogic/TurnState';

export class SessionAsserter {
	private readonly _session: GameSession;

	private readonly _turnStates: TurnState[];

	public get session(): GameSession {
		return this._session;
	}

	public get level(): Level {
		return this._session.level;
	}

	constructor(session: GameSession, turnStates: TurnState[]) {
		this._session = session;
		this._turnStates = turnStates;
	}

	public assertEntityCount(entityType: EntityType, expectedCount: number): SessionAsserter {
		assert.lengthOf(
			this._session.level.entities.getEntitiesOfType(entityType),
			expectedCount,
			`Expected to find '${expectedCount}' entities of type '${entityType}'`
		);

		return this;
	}

	public assertEntityAt(entityType: EntityType, x: number, y: number): SessionAsserter {
		const entities = this._session.level.entities.getEntitiesAt(x, y);

		const expectedEntities = entities.filter(entity => entity.type === entityType);
		assert.isTrue(expectedEntities.length > 0, `No entity of type '${entityType}' found at '${x}x${y}'`);

		expectedEntities.forEach(entity => {
			assert.equal(entity.x, x, `Sanity check: entity of type '${entityType}' placed at ${x}x${y} has different x=${entity.x}`);
			assert.equal(entity.y, y, `Sanity check: entity of type '${entityType}' placed at ${x}x${y} has different y=${entity.y}`);
		});

		return this;
	}

	public assertNoEntityAt(entityType: EntityType, x: number, y: number): SessionAsserter {
		const entities = this._session.level.entities.getEntitiesAt(x, y);

		const expectedEntities = entities.filter(entity => entity.type === entityType);
		assert.lengthOf(expectedEntities, 0, `An entity of type '${entityType}' was found at '${x}x${y}'`);

		return this;
	}

	public assertLevel(callback: { (level: Level): void }): SessionAsserter {
		callback(this.level);

		return this;
	}
}
