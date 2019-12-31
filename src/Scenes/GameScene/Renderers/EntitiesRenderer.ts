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

		if (turnState.hasEvent(TurnEventType.TurnExecuted) || turnState.hasEvent(TurnEventType.LevelLoaded)) {
			this.removeChildren();
			this._entitiesMap.forEach(entity => entity.release());
			this._entitiesMap.clear();

			level.entities.entities.forEach(entity => this.syncAddEntity(entity));
		} else {
			for (const entity of turnState.getEventData(TurnEventType.EntityAdded)) {
				this.syncAddEntity(entity);
			}
			for (const entity of turnState.getEventData(TurnEventType.EntityRemoved)) {
				this.syncRemoveEntity(entity);
			}
			for (const entity of turnState.getEventData(TurnEventType.EntityModified)) {
				this.syncRemoveEntity(entity);
				this.syncAddEntity(entity);
			}
		}
	}

	private syncAddEntity(entity: Entity): void {
		const sprite = entitySpriteFactory(entity, this._textureStore);

		this._entitiesMap.set(entity, sprite);
		this.addChild(sprite);
	}

	private syncRemoveEntity(entity: Entity): void {
		const sprite = this._entitiesMap.get(entity);

		console.log(sprite);
		if (sprite) {
			this.removeChild(sprite);

			sprite.release();

			this._entitiesMap.delete(entity);
		}
	}
}
