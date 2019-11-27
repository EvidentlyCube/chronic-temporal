import {Level} from "../../../src/GameLogic/Level";
import {TestLevelBuilder} from "./TestLevelBuilder";
import {GameSession} from "../../../src/GameLogic/GameSession";
import {PlayerAction} from "../../../src/GameLogic/Enums";
import {Hashmap} from "../../../src.common/GenericInterfaces";
import {Protagonist} from "../../../src/GameLogic/Entities/Protagonist";

const charToActionMap: Hashmap<PlayerAction> = {
	'7': PlayerAction.MoveUpLeft,
	'8': PlayerAction.MoveUp,
	'9': PlayerAction.MoveUpRight,
	'4': PlayerAction.MoveLeft,
	'5': PlayerAction.Wait,
	'6': PlayerAction.MoveRight,
	'1': PlayerAction.MoveDownLeft,
	'2': PlayerAction.MoveDown,
	'3': PlayerAction.MoveDownRight,
};

function convertStringOfMovesToActions(movesString: string): PlayerAction[] {
	return movesString.split('').map(char => charToActionMap[char]);
}

export class SessionPlayer {
	public static play(
		level: Level | TestLevelBuilder,
		moves: PlayerAction | PlayerAction[] | string,
	): [GameSession, Level, Protagonist] {
		level = level instanceof TestLevelBuilder ? level.toLevel() : level;
		const session = new GameSession();

		session.loadLevel(level);

		const player = level.getPlayer();

		if (!player) {
			throw new Error("No player found in the level!");
		}

		if (typeof moves === 'string') {
			moves = convertStringOfMovesToActions(moves);
		} else if (!Array.isArray(moves)) {
			moves = [moves];
		}

		moves.forEach(move => session.runTurn(move));

		return [session, level, player];
	}
}