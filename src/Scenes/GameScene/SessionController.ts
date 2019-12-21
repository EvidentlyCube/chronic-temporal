import * as PIXI from 'pixi.js';

import {GameScene} from './GameScene';
import {PlayerAction} from '../../GameLogic/Enums';
import {GameSession} from '../../GameLogic/GameSession';
import {ActionSequence} from '../../GameLogic/DataStructures/ActionSequence';
import {SessionRenderer} from './Renderers/SessionRenderer';
import Constants from '../../Core/Constants';
import {Level} from '../../GameLogic/Level';
import {Game} from 'evidently-pixi';

export class SessionController {
	public turnPassed: boolean;

	private readonly _game: Game;

	private readonly _gameScene: GameScene;

	private readonly _sessionRenderer: SessionRenderer;

	private readonly _session: GameSession;

	constructor(game: Game, gameScene: GameScene, session: GameSession, sessionRenderer: SessionRenderer) {
		this._game = game;
		this._gameScene = gameScene;
		this._session = session;
		this._sessionRenderer = sessionRenderer;
		this.turnPassed = false;
	}

	public get currentLevel(): Level {
		return this._session.level;
	}

	public getTileUnderMouse(): PIXI.Point {
		const globalPoint = new PIXI.Point(this._game.mouse.localX, this._game.mouse.localY);
		const point = new PIXI.Point();

		this._sessionRenderer.levelRenderer.toLocal(globalPoint, undefined, point);

		point.x = Math.floor(point.x / Constants.TileWidth);
		point.y = Math.floor(point.y / Constants.TileHeight);

		return point;
	}

	public executeAction(action: PlayerAction): void {
		this._session.runTurn(action);

		this.turnPassed = true;
	}

	public restartAndSaveRecording(): void {
		this._session.registerRecording(this._session.actionRecorder.end());
		this._session.resetLevel();

		this.turnPassed = true;
	}

	public restartAndRemoveRecording(recording: ActionSequence): void {
		this._session.removeRecording(recording);
		this._session.resetLevel();

		this.turnPassed = true;
	}

	public getRecordings(): readonly ActionSequence[] {
		return this._session.getRecordings();
	}
}
