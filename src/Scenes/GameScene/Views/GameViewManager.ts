import * as PIXI from 'pixi.js';
import {ViewMoveProtagonist} from './ViewMoveProtagonist';
import {ViewEditRecordings} from './ViewEditRecordings';
import {SessionController} from '../SessionController';
import {PlayerInputManager} from '../PlayerInputManager';
import {ViewLevelEditor} from './ViewLevelEditor';
import {GameScene} from '../GameScene';
import {ViewLevelComplete} from './ViewLevelComplete';
import {TextureStore} from 'evidently-pixi';

export interface GameView extends PIXI.Container {
	update(passedTime: number, input: PlayerInputManager, controller: SessionController): void;

	onBlur(controller: SessionController): void;

	onFocus(controller: SessionController): void;
}

export class GameViewManager extends PIXI.Container {
	private _activeState: GameView;

	private readonly _states: GameView[];

	constructor(gameScene: GameScene, textureStore: TextureStore) {
		super();

		this._states = [
			new ViewMoveProtagonist(this),
			new ViewEditRecordings(this),
			new ViewLevelEditor(this, gameScene.sessionRenderer, textureStore),
			new ViewLevelComplete(this),
		];

		this.addChild(...this._states);

		this._activeState = this._states[0];
	}

	public update(passedTime: number, input: PlayerInputManager, controller: SessionController): void {
		if (input.uiSwitchViews() && this._activeState !== this._states[3]) {
			const activeStateIndex = this._states.indexOf(this._activeState);
			if (activeStateIndex === -1) {
				throw new Error('Active input state was not found in the list of states');
			}

			this.setState(this._states[(activeStateIndex + 1) % (this._states.length - 1)], controller);
		}

		this._activeState.update(passedTime, input, controller);
	}

	private setState(newState: GameView, controller: SessionController): void {
		this._activeState.onBlur(controller);
		this._activeState = newState;
		this._activeState.onFocus(controller);
	}

	// @todo Issue #68: Replace this really bad hack with some sensible way of swapping states
	public setStateToIndex(index: number, controller: SessionController): void {
		this.setState(this._states[index % this._states.length], controller);
	}
}
