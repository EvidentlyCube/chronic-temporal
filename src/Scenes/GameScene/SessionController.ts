import * as PIXI from 'pixi.js';

import {GameScene} from './GameScene';
import {PlayerAction} from '../../GameLogic/Enums/PlayerAction';
import {GameSession} from '../../GameLogic/GameSession';
import {ActionSequence} from '../../GameLogic/DataStructures/ActionSequence';
import {SessionRenderer} from './Renderers/SessionRenderer';
import Constants from '../../Core/Constants';
import {Level} from '../../GameLogic/Level';
import {Game} from 'evidently-pixi';
import {TurnState} from '../../GameLogic/TurnState';
import {TurnEventType} from '../../GameLogic/Enums/TurnEventType';
import {EntityType} from '../../GameLogic/Enums/EntityType';

export class SessionController {
	public lastTurnState: TurnState|undefined;

	private readonly _game: Game;

	private readonly _gameScene: GameScene;

	private readonly _sessionRenderer: SessionRenderer;

	private readonly _session: GameSession;

	constructor(game: Game, gameScene: GameScene, session: GameSession, sessionRenderer: SessionRenderer) {
		this._game = game;
		this._gameScene = gameScene;
		this._session = session;
		this._sessionRenderer = sessionRenderer;
	}

	public get session(): GameSession {
		return this._session;
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
		this.lastTurnState = this._session.runTurn(action);
	}

	public restartAndSaveRecording(): void {
		this._session.registerRecording(this._session.actionRecorder.end());
		this._session.resetLevel();

		this.lastTurnState = new TurnState(this._session.level);
		this.lastTurnState.addEvent(TurnEventType.LevelLoaded);
	}

	public restartAndRemoveRecording(recording: ActionSequence): void {
		this._session.removeRecording(recording);
		this._session.resetLevel();

		this.lastTurnState = new TurnState(this._session.level);
		this.lastTurnState.addEvent(TurnEventType.LevelLoaded);
	}

	public getRecordings(): readonly ActionSequence[] {
		return this._session.getRecordings();
	}

	public tryToSync(turnState: TurnState): void {
		if (turnState.eventCount > 0) {
			this.lastTurnState = turnState;
		}
	}

	public commitLevelToBlueprint(): void {
		this.session.levelBlueprint = this.session.level.clone();
		const protagonists = this.session.levelBlueprint.entities.getEntitiesOfType(EntityType.Protagonist);
		protagonists.forEach(protagonist => this.session.levelBlueprint.entities.removeEntity(protagonist));
	}
}
