import {Entity} from '../../../../GameLogic/Entity';
import {EntitySprite} from './EntitySprite';
import {EntityType} from '../../../../GameLogic/Enums';
import {SingleTextureEntitySprite} from './SingleTextureEntitySprite';
import {GfxConstants} from '../../../../Core/Constants/GfxConstants';
import {IceblockEntitySprite} from './IceblockEntitySprite';
import {Iceblock} from '../../../../GameLogic/Entities/Iceblock';
import {TextureStore} from 'evidently-pixi';

export function entitySpriteFactory(entity: Entity, textureStore: TextureStore): EntitySprite {
	switch (entity.type) {
		case EntityType.Protagonist:
			return SingleTextureEntitySprite.getOne(entity, textureStore.getTile(GfxConstants.InitialTileset, 1, 0));

		case EntityType.Pushable:
			return SingleTextureEntitySprite.getOne(entity, textureStore.getTile(GfxConstants.InitialTileset, 7, 5));

		case EntityType.Fireball:
			return SingleTextureEntitySprite.getOne(entity, textureStore.getTile(GfxConstants.InitialTileset, 7, 0));

		case EntityType.Iceblock:
			return IceblockEntitySprite.getOne(entity as Iceblock, textureStore);

		default:
			throw new Error(`Invalid entity type "${entity.type}"`);
	}
}
