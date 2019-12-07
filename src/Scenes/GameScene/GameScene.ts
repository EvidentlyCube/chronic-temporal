import {Scene} from '../../../src.common/Managers/SceneManager';
import {GameSession} from '../../GameLogic/GameSession';
import {Game} from '../../../src.common/Core/Game';
import {SessionRenderer} from './SessionRenderer';
import {GameViewManager} from './States/GameViewManager';
import {SessionController} from './SessionController';
import {PlayerInputManager} from './PlayerInputManager';

export class GameScene implements Scene {
	private readonly _game: Game;

	private readonly _session: GameSession;

	private readonly _sessionRenderer: SessionRenderer;

	private readonly _layer: PIXI.Sprite;

	private readonly _input: PlayerInputManager;

	private readonly _viewManager: GameViewManager;

	private readonly _sessionController: SessionController;

	constructor(game: Game, session: GameSession) {
		this._game = game;
		this._session = session;
		this._input = new PlayerInputManager(game.keyboard, game.mouse);
		this._viewManager = new GameViewManager();
		this._sessionRenderer = new SessionRenderer(this._session, game.textureFactory);
		this._sessionController = new SessionController(this, this._session);
		this._layer = game.createLayer();

		this._layer.addChild(this._sessionRenderer);
		this._layer.addChild(this._viewManager);
	}

	public onStarted(): void {
		// Intentionally left empty
	}

	public onEnded(): void {
		this._game.removeLayer(this._layer);
	}

	public update(passedTime: number): void {
		this._viewManager.update(passedTime, this._input, this._sessionController);

		this._sessionRenderer.update();
	}
}
