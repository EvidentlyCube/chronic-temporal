import {Grid2D} from '../../../../src.common/DataStructures/Grid2D';
import * as PIXI from 'pixi.js';
import {Level} from '../../../GameLogic/Level';
import {FloorType} from '../../../GameLogic/Enums';
import {GfxConstants} from '../../../Core/Constants/GfxConstants';
import Constants from '../../../Core/Constants';
import {TextureFactory} from '../../../../src.common/Managers/TextureFactory';

export class FloorTilesRenderer extends PIXI.Sprite {
	private readonly _textureFactory: TextureFactory;

	private _floorTiles: Grid2D<PIXI.Sprite | undefined>;

	constructor(textureFactory: TextureFactory) {
		super();

		this._textureFactory = textureFactory;
		this._floorTiles = new Grid2D<PIXI.Sprite | undefined>(20, 20, undefined);
	}

	public sync(level: Level): void {
		if (this._floorTiles.width !== level.width || this._floorTiles.height !== level.height) {
			this.removeChildren();

			this._floorTiles = new Grid2D<PIXI.Sprite | undefined>(level.width, level.height, undefined);
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
			case FloorType.Wall:
				return this._textureFactory.getTile(GfxConstants.InitialTileset, 1, 3);
			case FloorType.Water:
				return this._textureFactory.getTile(GfxConstants.InitialTileset, 1, 4);
			case FloorType.FloorTile:
			default:
				return this._textureFactory.getTile(GfxConstants.InitialTileset, 3, 0);
		}
	}
}
