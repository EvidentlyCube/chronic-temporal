import * as PIXI from 'pixi.js';
import {GameView, GameViewManager} from './GameViewManager';
import {PlayerAction} from '../../../GameLogic/Enums';
import {SessionController} from '../SessionController';
import {PlayerInputManager} from '../PlayerInputManager';

export class ViewMoveProtagonist extends PIXI.Container implements GameView {
	private readonly _stateMachine: GameViewManager;

	constructor(stateMachine: GameViewManager) {
		super();

		this._stateMachine = stateMachine;

		this.visible = false;
	}

	public update(passedTime: number, input: PlayerInputManager, controller: SessionController): void {
		if (input.actionMoveUpLeft()) {
			controller.executeAction(PlayerAction.MoveUpLeft);
		} else if (input.actionMoveUp()) {
			controller.executeAction(PlayerAction.MoveUp);
		} else if (input.actionMoveUpRight()) {
			controller.executeAction(PlayerAction.MoveUpRight);
		} else if (input.actionMoveLeft()) {
			controller.executeAction(PlayerAction.MoveLeft);
		} else if (input.actionWait()) {
			controller.executeAction(PlayerAction.Wait);
		} else if (input.actionMoveRight()) {
			controller.executeAction(PlayerAction.MoveRight);
		} else if (input.actionMoveDownLeft()) {
			controller.executeAction(PlayerAction.MoveDownLeft);
		} else if (input.actionMoveDown()) {
			controller.executeAction(PlayerAction.MoveDown);
		} else if (input.actionMoveDownRight()) {
			controller.executeAction(PlayerAction.MoveDownRight);
		} else if (input.actionRestartAndRecord()) {
			controller.restartAndSaveRecording();
		}
	}

	public onFocus(): void {
		this.visible = true;
	}

	public onBlur(): void {
		this.visible = false;
	}
}
