import * as PIXI from 'pixi.js';
import {Level} from '../../../GameLogic/Level';
import {GfxConstants} from '../../../Core/Constants/GfxConstants';
import Constants from '../../../Core/Constants';
import {TextureFactory} from '../../../../src.common/Managers/TextureFactory';
import {EntityType} from '../../../GameLogic/Enums';

export class EntitiesRenderer extends PIXI.Sprite {
	private readonly _textureFactory: TextureFactory;

	private readonly _entities: PIXI.Sprite[];

	constructor(textureFactory: TextureFactory) {
		super();

		this._textureFactory = textureFactory;
		this._entities = [];
	}

	public sync(level: Level): void {
		level.entities.entities.forEach((entity, index) => {
			const sprite = this._entities[index] ?? new PIXI.Sprite();
			sprite.texture = this.getTypeTexture(entity.type);

			if (!sprite.parent) {
				this._entities[index] = sprite;
				this.addChild(sprite);
			}

			sprite.x = entity.x * Constants.TileWidth;
			sprite.y = entity.y * Constants.TileHeight;
		});

		while (level.entities.length < this._entities.length) {
			this._entities.pop()?.destroy();
		}
	}

	private getTypeTexture(entityType: EntityType): PIXI.Texture {
		switch (entityType) {
			case EntityType.Protagonist:
				return this._textureFactory.getTile(GfxConstants.InitialTileset, 1, 0);
			case EntityType.Pushable:
				return this._textureFactory.getTile(GfxConstants.InitialTileset, 7, 5);
			default:
				throw new Error(`Invalid entity type "${entityType}"`);
		}
	}
}
