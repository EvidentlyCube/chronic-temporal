import * as PIXI from 'pixi.js';
import {TextureStore} from 'evidently-pixi';
import {EntitySprite} from './Entities/EntitySprite';
import {entitySpriteFactory} from './Entities/entitySpriteFactory';
import {Entity} from '../../../GameLogic/Entity';
import {TurnState} from '../../../GameLogic/TurnState';
import {TurnEventType} from '../../../GameLogic/Enums/TurnEventType';

export class EntitiesRenderer extends PIXI.Sprite {
	private readonly _textureStore: TextureStore;

	private readonly _entitiesMap: Map<Entity, EntitySprite>;

	constructor(textureStore: TextureStore) {
		super();

		this._textureStore = textureStore;
		this._entitiesMap = new Map();
	}

	public update(timePassed: number): void {
		for (const entity of this._entitiesMap.values()) {
			entity.update(timePassed);
		}
	}

	public sync(turnState: TurnState): void {
		const {level} = turnState;

		if (turnState.hasEvent(TurnEventType.TurnPassed) || turnState.hasEvent(TurnEventType.LevelLoaded)) {
			this.removeChildren();
			this._entitiesMap.forEach(entity => entity.release());
			this._entitiesMap.clear();
		}

		const spritesToRemoveMap: Map<Entity, EntitySprite> = new Map();
		this._entitiesMap.forEach((value, key) => spritesToRemoveMap.set(key, value));

		level.entities.entities.forEach(entity => {
			if (!this._entitiesMap.has(entity)) {
				const sprite = entitySpriteFactory(entity, this._textureStore);

				this._entitiesMap.set(entity, sprite);
				this.addChild(sprite);
			} else {
				spritesToRemoveMap.delete(entity);
			}
		});

		for (const entity of spritesToRemoveMap.keys()) {
			const sprite = spritesToRemoveMap.get(entity)!;

			sprite.removeChild();
			sprite.release();
			this._entitiesMap.delete(entity);
		}
	}
}
