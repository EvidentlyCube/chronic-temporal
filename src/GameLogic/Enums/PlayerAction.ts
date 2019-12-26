import {Hashmap} from '../../GenericInterfaces';
import {Direction8, Direction8Utils} from './Direction8';

export enum PlayerAction {
	MoveUpLeft = 0,
	MoveUp = 1,
	MoveUpRight = 2,
	MoveLeft = 3,
	Wait = 4,
	MoveRight = 5,
	MoveDownLeft = 6,
	MoveDown = 7,
	MoveDownRight = 8
}

const directionToActionMap: Hashmap<PlayerAction> = {};
directionToActionMap[Direction8.UpLeft] = PlayerAction.MoveUpLeft;
directionToActionMap[Direction8.Up] = PlayerAction.MoveUp;
directionToActionMap[Direction8.UpRight] = PlayerAction.MoveUpRight;
directionToActionMap[Direction8.Left] = PlayerAction.MoveLeft;
directionToActionMap[Direction8.None] = PlayerAction.Wait;
directionToActionMap[Direction8.Right] = PlayerAction.MoveRight;
directionToActionMap[Direction8.DownLeft] = PlayerAction.MoveDownLeft;
directionToActionMap[Direction8.Down] = PlayerAction.MoveDown;
directionToActionMap[Direction8.DownRight] = PlayerAction.MoveDownRight;

const actionToDirectionMap: Hashmap<Direction8> = {};
actionToDirectionMap[PlayerAction.MoveUpLeft] = Direction8.UpLeft;
actionToDirectionMap[PlayerAction.MoveUp] = Direction8.Up;
actionToDirectionMap[PlayerAction.MoveUpRight] = Direction8.UpRight;
actionToDirectionMap[PlayerAction.MoveLeft] = Direction8.Left;
actionToDirectionMap[PlayerAction.Wait] = Direction8.None;
actionToDirectionMap[PlayerAction.MoveRight] = Direction8.Right;
actionToDirectionMap[PlayerAction.MoveDownLeft] = Direction8.DownLeft;
actionToDirectionMap[PlayerAction.MoveDown] = Direction8.Down;
actionToDirectionMap[PlayerAction.MoveDownRight] = Direction8.DownRight;

const playerActionAll = [
	PlayerAction.MoveUpLeft,
	PlayerAction.MoveUp,
	PlayerAction.MoveUpRight,
	PlayerAction.MoveLeft,
	PlayerAction.Wait,
	PlayerAction.MoveRight,
	PlayerAction.MoveDownLeft,
	PlayerAction.MoveDown,
	PlayerAction.MoveDownRight,
];

const playerActionMoves = [
	PlayerAction.MoveUpLeft,
	PlayerAction.MoveUp,
	PlayerAction.MoveUpRight,
	PlayerAction.MoveLeft,
	PlayerAction.MoveRight,
	PlayerAction.MoveDownLeft,
	PlayerAction.MoveDown,
	PlayerAction.MoveDownRight,
];

export class PlayerActionUtils {
	public static get all(): readonly PlayerAction[] {
		return playerActionAll;
	}

	public static get moves(): readonly PlayerAction[] {
		return playerActionMoves;
	}

	public static directionToAction(direction: Direction8): PlayerAction {
		const action = directionToActionMap[direction];

		if (action === undefined) {
			throw new Error(`No action found for direction ${Direction8Utils.getName(direction)}(ID=${direction})`);
		}

		return action;
	}

	public static actionToDirection(action: PlayerAction): Direction8 {
		const direction = actionToDirectionMap[action];

		if (action === undefined) {
			throw new Error(`No direction found for action ${action}(NAME=${PlayerAction[action]})`);
		}

		return direction;
	}

	public static isMoveAction(action: PlayerAction): boolean {
		return action >= PlayerAction.MoveUpLeft && action <= PlayerAction.MoveDownRight && action !== PlayerAction.Wait;
	}
}
