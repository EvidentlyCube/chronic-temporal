import * as PIXI from 'pixi.js';
import {Level} from '../../../GameLogic/Level';
import {FloorType} from '../../../GameLogic/Enums';
import {GfxConstants} from '../../../Core/Constants/GfxConstants';
import Constants from '../../../Core/Constants';
import {Grid2D} from 'evidently-data-structures';
import {TextureStore} from 'evidently-pixi';

export class FloorTilesRenderer extends PIXI.Sprite {
	private readonly _textureStore: TextureStore;

	private readonly _floorTiles: Grid2D<PIXI.Sprite | undefined>;

	constructor(textureStore: TextureStore) {
		super();

		this._textureStore = textureStore;
		this._floorTiles = new Grid2D<PIXI.Sprite | undefined>(20, 20, () => undefined);
	}

	public sync(level: Level): void {
		if (this._floorTiles.width !== level.width || this._floorTiles.height !== level.height) {
			this.removeChildren();

			this._floorTiles.resize(level.width, level.height);
		}

		for (let x = 0; x < level.width; x++) {
			for (let y = 0; y < level.height; y++) {
				const sprite = this._floorTiles.get(x, y) ?? new PIXI.Sprite();
				sprite.texture = this.getFloorTypeTexture(level.tilesFloor.get(x, y));

				if (!sprite.parent) {
					this._floorTiles.set(x, y, sprite);
					this.addChild(sprite);
					sprite.x = x * Constants.TileWidth;
					sprite.y = y * Constants.TileHeight;
				}
			}
		}
	}

	private getFloorTypeTexture(floorType: FloorType): PIXI.Texture {
		switch (floorType) {
			case FloorType.FloorTile:
				return this._textureStore.getTile(GfxConstants.InitialTileset, 9, 5);
			case FloorType.Wall:
				return this._textureStore.getTile(GfxConstants.InitialTileset, 5, 7);
			case FloorType.Water:
				return this._textureStore.getTile(GfxConstants.InitialTileset, 6, 7);
			default:
				throw new Error(`Invalid floor type "${floorType}"`);
		}
	}
}
