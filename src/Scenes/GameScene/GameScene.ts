import {GameSession} from '../../GameLogic/GameSession';
import {GameViewManager} from './Views/GameViewManager';
import {SessionController} from './SessionController';
import {PlayerInputManager} from './PlayerInputManager';
import {SessionRenderer} from './Renderers/SessionRenderer';
import {Game, Scene} from 'evidently-pixi';

export class GameScene implements Scene {
	public readonly sessionRenderer: SessionRenderer;

	private readonly _game: Game;

	private readonly _session: GameSession;

	private readonly _layer: PIXI.Sprite;

	private readonly _input: PlayerInputManager;

	private readonly _viewManager: GameViewManager;

	private readonly _sessionController: SessionController;

	constructor(game: Game, session: GameSession) {
		this._game = game;
		this._session = session;
		this._input = new PlayerInputManager(game.keyboard, game.mouse);
		this.sessionRenderer = new SessionRenderer(this._session, game.textureStore);
		this._sessionController = new SessionController(game, this, this._session, this.sessionRenderer);
		this._viewManager = new GameViewManager(this);
		this._layer = game.createContainer();

		this._layer.addChild(this.sessionRenderer);
		this._layer.addChild(this._viewManager);

		this.sessionRenderer.sync(this._session.level);
	}

	public onStarted(): void {
		// Intentionally left empty
	}

	public onEnded(): void {
		this._game.removeContainer(this._layer);
	}

	public update(timePassed: number): void {
		this._viewManager.update(timePassed, this._input, this._sessionController);

		this.sessionRenderer.update(timePassed);
		if (this._sessionController.turnPassed) {
			this.sessionRenderer.sync(this._session.level);
			this._sessionController.turnPassed = false;
		}
	}
}
