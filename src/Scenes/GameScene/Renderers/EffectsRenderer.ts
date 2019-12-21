import * as PIXI from 'pixi.js';
import {TextureStore} from 'evidently-pixi';
import {Effect} from './Effects/Effect';
import {Level} from '../../../GameLogic/Level';
import {Protagonist} from '../../../GameLogic/Entities/Protagonist';
import {NextProjectionMoveEffect} from './Effects/NextProjectionMoveEffect';

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

	public sync(level: Level): void {
		this.removeChildren();
		this._effects.forEach(effect => effect.release());
		this._effects.length = 0;

		level.entities.entities.forEach(entity => {
			if (entity instanceof Protagonist && !entity.isPlayerControlled) {
				this.addEffect(NextProjectionMoveEffect.getOne(entity, this._textureStore));
			}
		});
	}

	public addEffect(effect: Effect): void {
		this._effects.push(effect);
		this.addChild(effect);
	}
}
