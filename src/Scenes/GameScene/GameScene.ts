import {Scene} from '../../../src.common/Managers/SceneManager';
import {GameSession} from '../../GameLogic/GameSession';
import {Game} from '../../../src.common/Core/Game';
import {SessionRenderer} from './SessionRenderer';
import {PlayerAction} from '../../GameLogic/Enums';

export class GameScene implements Scene {
	private readonly _game: Game;

	private readonly _session: GameSession;

	private readonly _sessionRenderer: SessionRenderer;

	private readonly _layer: PIXI.Sprite;

	constructor(game: Game, session: GameSession) {
		this._game = game;
		this._session = session;
		this._sessionRenderer = new SessionRenderer(this._session, game.textureFactory);
		this._layer = game.createLayer();

		this._layer.addChild(this._sessionRenderer);
	}

	public onStarted(): void {
		// Intentionally left empty
	}

	public onEnded(): void {
		this._game.removeLayer(this._layer);
	}

	public update(): void {
		if (this._game.rawInput.isKeyPressed('7')) {
			this._session.runTurn(PlayerAction.MoveUpLeft);
		} else if (this._game.rawInput.isKeyPressed('8')) {
			this._session.runTurn(PlayerAction.MoveUp);
		} else if (this._game.rawInput.isKeyPressed('9')) {
			this._session.runTurn(PlayerAction.MoveUpRight);
		} else if (this._game.rawInput.isKeyPressed('4')) {
			this._session.runTurn(PlayerAction.MoveLeft);
		} else if (this._game.rawInput.isKeyPressed('5')) {
			this._session.runTurn(PlayerAction.Wait);
		} else if (this._game.rawInput.isKeyPressed('6')) {
			this._session.runTurn(PlayerAction.MoveRight);
		} else if (this._game.rawInput.isKeyPressed('1')) {
			this._session.runTurn(PlayerAction.MoveDownLeft);
		} else if (this._game.rawInput.isKeyPressed('2')) {
			this._session.runTurn(PlayerAction.MoveDown);
		} else if (this._game.rawInput.isKeyPressed('3')) {
			this._session.runTurn(PlayerAction.MoveDownRight);
		}

		this._sessionRenderer.update();
	}
}
