import {GameSession} from "./GameSession";

export class EventStore {
	private _gameSession: GameSession;

	constructor(gameSession: GameSession) {
		this._gameSession = gameSession;
	}
}