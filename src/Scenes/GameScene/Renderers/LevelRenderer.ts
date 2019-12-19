import * as PIXI from 'pixi.js';
import {Level} from '../../../GameLogic/Level';
import {FloorTilesRenderer} from './FloorTilesRenderer';
import {EntitiesRenderer} from './EntitiesRenderer';
import {TextureStore} from 'evidently-pixi';

export class LevelRenderer extends PIXI.Sprite {
	private readonly _textureStore: TextureStore;

	private readonly _floorTilesRenderer: FloorTilesRenderer;

	private readonly _entityRenderer: EntitiesRenderer;

	constructor(textureStore: TextureStore) {
		super(undefined);

		this._textureStore = textureStore;
		this._floorTilesRenderer = new FloorTilesRenderer(textureStore);
		this._entityRenderer = new EntitiesRenderer(textureStore);

		this.addChild(this._floorTilesRenderer);
		this.addChild(this._entityRenderer);
	}

	public sync(level: Level): void {
		this._floorTilesRenderer.sync(level);
		this._entityRenderer.sync(level);
	}
}
