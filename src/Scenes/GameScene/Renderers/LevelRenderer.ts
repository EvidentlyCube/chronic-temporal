import * as PIXI from 'pixi.js';
import {TextureFactory} from '../../../../src.common/Managers/TextureFactory';
import {Level} from '../../../GameLogic/Level';
import {FloorTilesRenderer} from './FloorTilesRenderer';
import {EntitiesRenderer} from './EntitiesRenderer';

export class LevelRenderer extends PIXI.Sprite {
	private readonly _textureFactory: TextureFactory;

	private readonly _floorTilesRenderer: FloorTilesRenderer;

	private readonly _entityRenderer: EntitiesRenderer;

	constructor(textureFactory: TextureFactory) {
		super(undefined);

		this._textureFactory = textureFactory;
		this._floorTilesRenderer = new FloorTilesRenderer(textureFactory);
		this._entityRenderer = new EntitiesRenderer(textureFactory);

		this.addChild(this._floorTilesRenderer);
		this.addChild(this._entityRenderer);
	}

	public sync(level: Level): void {
		this._floorTilesRenderer.sync(level);
		this._entityRenderer.sync(level);
	}
}
