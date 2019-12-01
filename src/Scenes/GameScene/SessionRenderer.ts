import * as PIXI from 'pixi.js';
import {LevelRenderer} from './LevelRenderer';
import {GameSession} from '../../GameLogic/GameSession';
import {TextureFactory} from '../../../src.common/Managers/TextureFactory';

export class SessionRenderer extends PIXI.Sprite {
	private readonly _session: GameSession;

	private readonly _levelRenderer: LevelRenderer;

	constructor(session: GameSession, textureFactory: TextureFactory) {
		super();

		this._session = session;
		this._levelRenderer = new LevelRenderer(textureFactory);

		this.addChild(this._levelRenderer);
	}

	public update(): void {
		this._session.level && this._levelRenderer.sync(this._session.level);
	}
}
