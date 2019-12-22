import * as PIXI from 'pixi.js';
import {Level} from '../../../GameLogic/Level';
import {GfxConstants} from '../../../Core/Constants/GfxConstants';
import Constants from '../../../Core/Constants';
import {EntityType} from '../../../GameLogic/Enums';
import {TextureStore} from 'evidently-pixi';

export class EntitiesRenderer extends PIXI.Sprite {
	private readonly _textureStore: TextureStore;

	private readonly _entities: PIXI.Sprite[];

	constructor(textureStore: TextureStore) {
		super();

		this._textureStore = textureStore;
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
				return this._textureStore.getTile(GfxConstants.InitialTileset, 1, 0);

			case EntityType.Pushable:
				return this._textureStore.getTile(GfxConstants.InitialTileset, 7, 5);

			case EntityType.Fireball:
				return this._textureStore.getTile(GfxConstants.InitialTileset, 7, 0);

			case EntityType.Iceblock:
				return this._textureStore.getTile(GfxConstants.InitialTileset, 0, 0);

			default:
				throw new Error(`Invalid entity type "${entityType}"`);
		}
	}
}
