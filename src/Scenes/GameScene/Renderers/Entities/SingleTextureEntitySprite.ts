import * as PIXI from 'pixi.js';
import {Pool, SlowPool} from 'evidently-data-structures';
import Constants from '../../../../Core/Constants';
import {EntitySprite} from './EntitySprite';
import {Entity} from '../../../../GameLogic/Entity';

const slideLength = 250;

export class SingleTextureEntitySprite extends PIXI.Sprite implements EntitySprite {
	private static readonly _pool: Pool<SingleTextureEntitySprite>;

	public static getOne(entity: Entity, texture: PIXI.Texture): SingleTextureEntitySprite {
		const effect = SingleTextureEntitySprite._pool.getOne();

		effect.init(entity, texture);

		return effect;
	}

	private _fromX!: number;

	private _fromY!: number;

	private _toX!: number;

	private _toY!: number;

	private _timer = 0;

	constructor() {
		super(undefined);

		this._fromX = 0;
		this._fromY = 0;
		this._toX = 0;
		this._toY = 0;
	}

	public update(timePassed: number): void {
		this._timer += timePassed;

		const slideFraction = 1 - (1 - Math.min(this._timer / slideLength, 1)) ** 2;
		this.x = Math.round(this._fromX + (this._toX - this._fromX) * slideFraction);
		this.y = Math.round(this._fromY + (this._toY - this._fromY) * slideFraction);
	}

	public release(): void {
		SingleTextureEntitySprite._pool.release(this);
	}

	private init(entity: Entity, texture: PIXI.Texture): void {
		this.texture = texture;
		this._timer = 0;

		this._fromX = entity.prevX * Constants.TileWidth;
		this._fromY = entity.prevY * Constants.TileHeight;
		this._toX = entity.x * Constants.TileWidth;
		this._toY = entity.y * Constants.TileHeight;
		this.x = this._fromX;
		this.y = this._fromY;
	}
}

(SingleTextureEntitySprite as any)._pool = new SlowPool<SingleTextureEntitySprite>(
	() => new SingleTextureEntitySprite(),
	undefined,
	{
		autoHydrateSize: 1,
		initialSize: 0,
	},
);
