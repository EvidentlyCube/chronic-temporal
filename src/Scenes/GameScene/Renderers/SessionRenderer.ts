import * as PIXI from 'pixi.js';
import {LevelRenderer} from './LevelRenderer';
import {GameSession} from '../../../GameLogic/GameSession';
import Constants from '../../../Core/Constants';
import {TextureStore} from 'evidently-pixi';

export class SessionRenderer extends PIXI.Sprite {
	private readonly _session: GameSession;

	private readonly _levelRenderer: LevelRenderer;

	public get levelRenderer(): LevelRenderer {
		return this._levelRenderer;
	}

	constructor(session: GameSession, textureStore: TextureStore) {
		super();

		this._session = session;
		this._levelRenderer = new LevelRenderer(textureStore);

		this.addChild(this._levelRenderer);
	}

	public update(): void {
		this._session.level && this._levelRenderer.sync(this._session.level);
		this._levelRenderer.x = (Constants.VirtualWidth - this._levelRenderer.getLocalBounds().width) / 2 | 0;
		this._levelRenderer.y = (Constants.VirtualHeight - this._levelRenderer.getLocalBounds().height) / 2 | 0;
	}
}
