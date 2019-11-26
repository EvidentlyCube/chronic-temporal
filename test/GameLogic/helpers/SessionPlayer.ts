import {Level} from "../../../src/GameLogic/Level";
import {TestLevelBuilder} from "./TestLevelBuilder";
import {GameSession} from "../../../src/GameLogic/GameSession";

export class SessionPlayer {
	public static play(
		level: Level|TestLevelBuilder,
		moves: any[]
	): GameSession {
		const session = new GameSession();
		// @todo load the level into the session
		// @todo run all the moves

		return session;
	}
}