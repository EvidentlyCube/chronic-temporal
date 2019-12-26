import * as PIXI from 'pixi.js';
import {TextureStore} from 'evidently-pixi';
import {Effect} from './Effects/Effect';
import {Protagonist} from '../../../GameLogic/Entities/Protagonist';
import {NextProjectionMoveEffect} from './Effects/NextProjectionMoveEffect';
import {TurnState} from '../../../GameLogic/TurnState';
import {TurnEventType} from '../../../GameLogic/Enums/TurnEventType';
import {DrownEffect} from './Effects/DrownEffect';
import {Entity} from '../../../GameLogic/Entity';
import {KillEffect} from './Effects/KillEffect';

export class EffectsRenderer extends PIXI.Sprite {
	private readonly _textureStore: TextureStore;

	private _effects: Effect[];

	constructor(textureStore: TextureStore) {
		super();

		this._textureStore = textureStore;
		this._effects = [];
	}

	public update(timePassed: number): void {
		this._effects.forEach(effect => effect.update(timePassed));
	}

	public sync(turnState: TurnState): void {
		const {level} = turnState;

		this.removeChildren();
		this._effects.forEach(effect => effect.release());
		this._effects.length = 0;

		level.entities.entities.forEach(entity => {
			if (entity instanceof Protagonist && !entity.isPlayerControlled) {
				this.addEffect(NextProjectionMoveEffect.getOne(entity, this._textureStore));
			}
		});

		for (const data of turnState.getEventData(TurnEventType.EntityDrowned)) {
			this.addEffect(DrownEffect.getOne(data as Entity, this._textureStore));
		}

		for (const data of turnState.getEventData(TurnEventType.EntityKilled)) {
			this.addEffect(KillEffect.getOne(data as Entity, this._textureStore));
		}
	}

	public addEffect(effect: Effect): void {
		this._effects.push(effect);
		this.addChild(effect);
	}
}
