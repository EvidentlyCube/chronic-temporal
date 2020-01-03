import {GameSession} from '../../../src/GameLogic/GameSession';
import {EntityType} from '../../../src/GameLogic/Enums/EntityType';
import {assert} from 'chai';
import {Level} from '../../../src/GameLogic/Level';
import {TurnState} from '../../../src/GameLogic/TurnState';
import {TurnEventType} from '../../../src/GameLogic/Enums/TurnEventType';
import {FloorType} from '../../../src/GameLogic/Enums/FloorType';

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

	public assertSession(callback: { (session: GameSession): void }): SessionAsserter {
		callback(this.session);

		return this;
	}

	public assertEventRaised(turnEventType: TurnEventType, onTurn: number = this._turnStates.length - 1): SessionAsserter {
		assert.isTrue(this._turnStates[onTurn].hasEvent(turnEventType), `No event of type '${turnEventType}' was found on turn ${onTurn}`);

		return this;
	}

	public assertEventNotRaised(turnEventType: TurnEventType, onTurn: number = this._turnStates.length - 1): SessionAsserter {
		assert.isFalse(this._turnStates[onTurn].hasEvent(turnEventType), `Event of type '${turnEventType}' was found on turn ${onTurn}`);

		return this;
	}

	public assertFloorTileAt(floorType: FloorType, x: number, y: number): SessionAsserter {
		assert.equal(this._session.level.tilesFloor.get(x, y), floorType, `Expected to find floorType '${floorType}' at ${x}x${y}`);

		return this;
	}
}
