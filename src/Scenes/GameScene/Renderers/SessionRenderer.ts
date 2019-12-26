import * as PIXI from 'pixi.js';
import {LevelRenderer} from './LevelRenderer';
import {GameSession} from '../../../GameLogic/GameSession';
import Constants from '../../../Core/Constants';
import {TextureStore} from 'evidently-pixi';
import {Level} from '../../../GameLogic/Level';
import {TurnState} from '../../../GameLogic/TurnState';

export class SessionRenderer extends PIXI.Sprite {
	private readonly _session: GameSession;

	private readonly _levelRenderer: LevelRenderer;

	constructor(session: GameSession, textureStore: TextureStore) {
		super();

		this._session = session;
		this._levelRenderer = new LevelRenderer(textureStore);

		this.addChild(this._levelRenderer);
	}

	public get levelRenderer(): LevelRenderer {
		return this._levelRenderer;
	}

	public update(timePassed: number): void {
		this._levelRenderer.update(timePassed);
		this._levelRenderer.x = (Constants.VirtualWidth - this._levelRenderer.getLocalBounds().width) / 2 | 0;
		this._levelRenderer.y = (Constants.VirtualHeight - this._levelRenderer.getLocalBounds().height) / 2 | 0;
	}

	public sync(turnState: TurnState): void {
		this._levelRenderer.sync(turnState);
	}
}
