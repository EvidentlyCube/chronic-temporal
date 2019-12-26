import * as PIXI from 'pixi.js';
import {Level} from '../../../GameLogic/Level';
import {TextureStore} from 'evidently-pixi';
import {EntitySprite} from './Entities/EntitySprite';
import {entitySpriteFactory} from './Entities/entitySpriteFactory';

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
			const sprite = entitySpriteFactory(entity, this._textureStore);

			this._entities.push(sprite);
			this.addChild(sprite);
		});
	}
}
