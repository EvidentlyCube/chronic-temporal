import {GameSession} from './GameSession';

export class EventStore {
	private readonly _gameSession: GameSession;

	constructor(gameSession: GameSession) {
		this._gameSession = gameSession;
	}
}
