import {Level} from '../../../src/GameLogic/Level';
import {TestLevelBuilder} from './TestLevelBuilder';
import {GameSession} from '../../../src/GameLogic/GameSession';
import {PlayerAction} from '../../../src/GameLogic/Enums/PlayerAction';
import {Hashmap} from '../../../src/GenericInterfaces';
import {TurnState} from '../../../src/GameLogic/TurnState';

const charToActionMap: Hashmap<PlayerAction> = {
	7: PlayerAction.MoveUpLeft,
	8: PlayerAction.MoveUp,
	9: PlayerAction.MoveUpRight,
	4: PlayerAction.MoveLeft,
	5: PlayerAction.Wait,
	6: PlayerAction.MoveRight,
	1: PlayerAction.MoveDownLeft,
	2: PlayerAction.MoveDown,
	3: PlayerAction.MoveDownRight,
};

function convertStringOfMovesToActions(movesString: string): PlayerAction[] {
	return movesString.split('').map(char => charToActionMap[char]);
}

export class SessionPlayer {
	public static play(
		levelOrBuilder: Level | TestLevelBuilder,
		moves: PlayerAction | PlayerAction[] | string,
	): [GameSession, TurnState[]] {
		const level = levelOrBuilder instanceof TestLevelBuilder ? levelOrBuilder.toLevel() : levelOrBuilder;
		const session = new GameSession(level);

		const player = session.level.entities.getPlayer();

		if (!player) {
			throw new Error('No player found in the level!');
		}

		if (typeof moves === 'string') {
			moves = convertStringOfMovesToActions(moves);
		} else if (!Array.isArray(moves)) {
			moves = [moves];
		}

		const turnStates = moves.map(move => session.runTurn(move));

		return [session, turnStates];
	}
}
