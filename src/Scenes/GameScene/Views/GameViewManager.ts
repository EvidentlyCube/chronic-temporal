import * as PIXI from 'pixi.js';
import {ViewMoveProtagonist} from './ViewMoveProtagonist';
import {ViewEditRecordings} from './ViewEditRecordings';
import {SessionController} from '../SessionController';
import {PlayerInputManager} from '../PlayerInputManager';
import {ViewLevelEditor} from './ViewLevelEditor';
import {GameScene} from '../GameScene';
import {ViewLevelComplete} from './ViewLevelComplete';
import {TextureStore} from 'evidently-pixi';
import {Constructor} from '../../../GenericInterfaces';

export interface GameView extends PIXI.Container {
	update(passedTime: number, input: PlayerInputManager, controller: SessionController): void;

	onBlur(controller: SessionController): void;

	onFocus(controller: SessionController): void;
}

export class GameViewManager extends PIXI.Container {
	private _activeView: GameView;

	private readonly _views: GameView[];

	constructor(gameScene: GameScene, textureStore: TextureStore) {
		super();

		this._views = [
			new ViewMoveProtagonist(this),
			new ViewEditRecordings(this),
			new ViewLevelEditor(this, gameScene.sessionRenderer, textureStore),
			new ViewLevelComplete(this),
		];

		this.addChild(...this._views);

		this._activeView = this._views[0];
	}

	public update(passedTime: number, input: PlayerInputManager, controller: SessionController): void {
		if (input.uiSwitchViews() && this._activeView !== this._views[3]) {
			const activeViewIndex = this._views.indexOf(this._activeView);
			if (activeViewIndex === -1) {
				throw new Error('Active input view was not found in the list of views');
			}

			this.changeView(this._views[(activeViewIndex + 1) % (this._views.length - 1)], controller);
		}

		this._activeView.update(passedTime, input, controller);
	}

	private changeView(newView: GameView, controller: SessionController): void {
		this._activeView.onBlur(controller);
		this._activeView = newView;
		this._activeView.onFocus(controller);
	}

	public setView(type: Constructor<GameView>, controller: SessionController): void {
		const view = this._views.find(view => view instanceof type);

		if (!view) {
			throw new Error('View not found!');
		}

		this.changeView(view, controller);
	}
}
