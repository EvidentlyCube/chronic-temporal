import * as PIXI from 'pixi.js';
import {Level} from '../../../GameLogic/Level';
import {GfxConstants} from '../../../Core/Constants/GfxConstants';
import {EntityType} from '../../../GameLogic/Enums';
import {TextureStore} from 'evidently-pixi';
import {EntitySprite} from './Entities/EntitySprite';
import {SingleTextureEntitySprite} from './Entities/SingleTextureEntitySprite';
import {Entity} from '../../../GameLogic/Entity';
import {IceblockEntitySprite} from './Entities/IceblockEntitySprite';
import {Iceblock} from '../../../GameLogic/Entities/Iceblock';

export class EntitiesRenderer extends PIXI.Sprite {
	private readonly _textureStore: TextureStore;

	private readonly _entities: EntitySprite[];

	constructor(textureStore: TextureStore) {
		super();

		this._textureStore = textureStore;
		this._entities = [];
	}

	public update(timePassed: number): void {
		this._entities.forEach(entity => entity.update(timePassed));
	}

	public sync(level: Level): void {
		this.removeChildren();
		this._entities.forEach(entity => entity.release());
		this._entities.length = 0;

		level.entities.entities.forEach(entity => {
			const sprite = this.getEntitySprite(entity);

			this._entities.push(sprite);
			this.addChild(sprite);
		});
	}

	private getEntitySprite(entity: Entity): EntitySprite {
		switch (entity.type) {
			case EntityType.Protagonist:
				return SingleTextureEntitySprite.getOne(entity, this._textureStore.getTile(GfxConstants.InitialTileset, 1, 0));

			case EntityType.Pushable:
				return SingleTextureEntitySprite.getOne(entity, this._textureStore.getTile(GfxConstants.InitialTileset, 7, 5));

			case EntityType.Fireball:
				return SingleTextureEntitySprite.getOne(entity, this._textureStore.getTile(GfxConstants.InitialTileset, 7, 0));

			case EntityType.Iceblock:
				return IceblockEntitySprite.getOne(entity as Iceblock, this._textureStore);

			default:
				throw new Error(`Invalid entity type "${entity.type}"`);
		}
	}
}
