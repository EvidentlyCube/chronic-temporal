import {Direction8} from "../../src.common/Enums/Direction8";
import {Hashmap} from "../../src.common/GenericInterfaces";

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

export enum EntityType {
	Protagonist = 0
}

const directionToActionMap: Hashmap<PlayerAction> = {};
directionToActionMap[Direction8.UpLeft.id] = PlayerAction.MoveUpLeft;
directionToActionMap[Direction8.Up.id] = PlayerAction.MoveUp;
directionToActionMap[Direction8.UpRight.id] = PlayerAction.MoveUpRight;
directionToActionMap[Direction8.Left.id] = PlayerAction.MoveLeft;
directionToActionMap[Direction8.None.id] = PlayerAction.Wait;
directionToActionMap[Direction8.Right.id] = PlayerAction.MoveRight;
directionToActionMap[Direction8.DownLeft.id] = PlayerAction.MoveDownLeft;
directionToActionMap[Direction8.Down.id] = PlayerAction.MoveDown;
directionToActionMap[Direction8.DownRight.id] = PlayerAction.MoveDownRight;

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

export class PlayerActionUtils {
	public static directionToAction(direction: Direction8): PlayerAction {
		const action = directionToActionMap[direction.id];

		if (action === undefined) {
			throw new Error(`No action found for direction ${direction.name}(ID=${direction.id})`);
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
}