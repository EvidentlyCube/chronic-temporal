import * as PIXI from 'pixi.js';
import {Grid2D} from '../../../src.common/DataStructures/Grid2D';
import {TextureFactory} from '../../../src.common/Managers/TextureFactory';
import {Level} from '../../GameLogic/Level';
import {FloorType} from '../../GameLogic/Enums';
import {GfxConstants} from '../../Core/Constants/GfxConstants';
import Constants from '../../Core/Constants';
import {Protagonist} from '../../GameLogic/Entities/Protagonist';

export class LevelRenderer extends PIXI.Sprite {
	public floorTiles: Grid2D<PIXI.Sprite | undefined>;

	public floorLayer: PIXI.Container;

	public entities: PIXI.Sprite[];

	public entityLayer: PIXI.Container;

	private readonly _textureFactory: TextureFactory;

	constructor(textureFactory: TextureFactory) {
		super(undefined);

		this._textureFactory = textureFactory;

		this.floorTiles = new Grid2D<PIXI.Sprite | undefined>(20, 20, undefined);
		this.floorLayer = new PIXI.Container();

		this.entities = [];
		this.entityLayer = new PIXI.Container();

		this.addChild(this.floorLayer);
		this.addChild(this.entityLayer);
	}

	public sync(level: Level): void {
		this.syncFloorTiles(level);
		this.syncEntities(level);
	}

	private syncFloorTiles(level: Level): void {
		if (this.floorTiles.width !== level.width || this.floorTiles.height !== level.height) {
			this.floorLayer.removeChildren();

			this.floorTiles = new Grid2D<PIXI.Sprite | undefined>(level.width, level.height, undefined);
		}

		for (let x = 0; x < level.width; x++) {
			for (let y = 0; y < level.height; y++) {
				const sprite = this.floorTiles.get(x, y) ?? new PIXI.Sprite();
				sprite.texture = level.tilesFloor.get(x, y) === FloorType.Wall // @todo magic texture selection
					? this._textureFactory.getTile(GfxConstants.InitialTileset, 1, 3)
					: this._textureFactory.getTile(GfxConstants.InitialTileset, 3, 0);

				if (!sprite.parent) {
					this.floorTiles.set(x, y, sprite);
					this.floorLayer.addChild(sprite);
					sprite.x = x * Constants.TileWidth; // @todo magic number
					sprite.y = y * Constants.TileHeight; // @todo magic number
				}
			}
		}
	}

	private syncEntities(level: Level): void {
		level.entities.entities.forEach((entity, index) => {
			const sprite = this.entities[index] ?? new PIXI.Sprite();
			sprite.texture = this._textureFactory.getTile(GfxConstants.InitialTileset, 1, 0); // @todo Hardcoded texture selection

			if (!sprite.parent) {
				this.entities[index] = sprite;
				this.entityLayer.addChild(sprite);
			}

			sprite.x = entity.x * Constants.TileWidth;
			sprite.y = entity.y * Constants.TileHeight;
			sprite.tint = (entity as Protagonist).isPlayerControlled // @todo super temporary
				? 0xFFFFFF
				: 0xCCCCFF;
		});

		while (level.entities.length < this.entities.length) {
			this.entities.pop()?.destroy();
		}
	}
}
