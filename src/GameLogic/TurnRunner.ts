import {GameSession} from "./GameSession";

export class TurnRunner {
	private _gameSession: GameSession;

	constructor(gameSession: GameSession) {
		this._gameSession = gameSession;
	}

	public update(playerInput: any) {
		// @todo run the turn
	}
}