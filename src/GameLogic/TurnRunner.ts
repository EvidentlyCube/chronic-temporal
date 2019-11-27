import {GameSession} from "./GameSession";
import {PlayerAction} from "./Enums";
import {Level} from "./Level";

export class TurnRunner {
	private _gameSession: GameSession;

	constructor(gameSession: GameSession) {
		this._gameSession = gameSession;
	}

	public runTurn(playerInput: PlayerAction, level: Level) {
		const player = level.getPlayer();

		if (player) {
			player.movesQueue.push(playerInput);
		}

		level.entities.forEach(entity => entity.update());
	}
}