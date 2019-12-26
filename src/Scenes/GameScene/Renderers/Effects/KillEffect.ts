import * as PIXI from 'pixi.js';
import {Effect} from './Effect';
import {FastPool, Pool} from 'evidently-data-structures';
import Constants from '../../../../Core/Constants';
import {TextureStore} from 'evidently-pixi';
import {Entity} from '../../../../GameLogic/Entity';
import {EntitySprite} from '../Entities/EntitySprite';
import {entitySpriteFactory} from '../Entities/entitySpriteFactory';

const EffectSpeed = 1;
const RotationSpeed = 1 / 50 * EffectSpeed;
const ScaleSpeed = 1 / 800 * EffectSpeed;
const AlphaSpeed = 1 / 800 * EffectSpeed;

export class KillEffect extends PIXI.Sprite implements Effect {
	private static readonly _pool: Pool<KillEffect>;

	public static getOne(entity: Entity, textureStore: TextureStore): KillEffect {
		const effect = KillEffect._pool.getOne();

		effect.init(entity, textureStore);

		return effect;
	}

	private _entitySprite: EntitySprite;

	private _timer: number;

	constructor() {
		super(undefined);

		this._entitySprite = undefined!;
		this._timer = 0;
	}

	private init(entity: Entity, textureStore: TextureStore): void {
		this._entitySprite = entitySpriteFactory(entity, textureStore);
		this._timer = 0;

		this._entitySprite.pivot.set(Constants.TileWidth / 2, Constants.TileHeight / 2);
		this.x = this._entitySprite.x;
		this.y = this._entitySprite.y;
		this._entitySprite.x -= this.x - Constants.TileWidth / 2;
		this._entitySprite.y -= this.y - Constants.TileHeight / 2;

		this.addChild(this._entitySprite);
	}

	public update(timePassed: number): void {
		if (this._entitySprite.alpha > 0) {
			this._entitySprite.update(timePassed);
			this._timer += timePassed;

			this._entitySprite.rotation += timePassed * RotationSpeed;
			this._entitySprite.alpha -= timePassed * AlphaSpeed;
			this._entitySprite.scale.x -= timePassed * ScaleSpeed;
			this._entitySprite.scale.y -= timePassed * ScaleSpeed;

			this._entitySprite.x -= this.x - Constants.TileWidth / 2;
			this._entitySprite.y -= this.y - Constants.TileHeight / 2;
		}
	}

	public release(): void {
		this.removeChild(this._entitySprite);
		this._entitySprite.rotation = 0;
		this._entitySprite.alpha = 1;
		this._entitySprite.scale.set(1);
		this._entitySprite.pivot.set(0);
		this._entitySprite.release();

		KillEffect._pool.release(this);
	}
}

(KillEffect as any)._pool = new FastPool<KillEffect>(
	() => new KillEffect(),
	undefined,
	{
		autoHydrateSize: 1,
		initialSize: 0,
	},
);
