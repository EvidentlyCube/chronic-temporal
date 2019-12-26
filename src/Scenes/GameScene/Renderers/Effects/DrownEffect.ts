import * as PIXI from 'pixi.js';
import {Effect} from './Effect';
import {FastPool, Pool} from 'evidently-data-structures';
import Constants from '../../../../Core/Constants';
import {TextureStore} from 'evidently-pixi';
import {Entity} from '../../../../GameLogic/Entity';
import {EntitySprite} from '../Entities/EntitySprite';
import {entitySpriteFactory} from '../Entities/entitySpriteFactory';

const drownSpeed = 0.5;

export class DrownEffect extends PIXI.Sprite implements Effect {
	private static readonly _pool: Pool<DrownEffect>;

	public static getOne(entity: Entity, textureStore: TextureStore): DrownEffect {
		const effect = DrownEffect._pool.getOne();

		effect.init(entity, textureStore);

		return effect;
	}

	private _entitySprite: EntitySprite;

	private readonly _maskSprite: PIXI.Sprite;

	constructor() {
		super(undefined);

		this._entitySprite = undefined!;
		this._maskSprite = new PIXI.Sprite(PIXI.Texture.WHITE);
		this._maskSprite.width = Constants.TileWidth * 100;
		this._maskSprite.height = Constants.TileHeight * 100;

		this.addChild(this._maskSprite);
	}

	private init(entity: Entity, textureStore: TextureStore): void {
		this._entitySprite = entitySpriteFactory(entity, textureStore);
		this._entitySprite.mask = this._maskSprite;

		this.x = this._entitySprite.x;
		this.y = this._entitySprite.y;
		this._entitySprite.x -= this.x;
		this._entitySprite.y -= this.y;

		this._maskSprite.x = this._entitySprite.x;
		this._maskSprite.y = this._entitySprite.y;

		this._maskSprite.height = Constants.TileHeight;

		this.addChild(this._entitySprite);
	}

	public update(timePassed: number): void {
		this._entitySprite.update(timePassed);
		this._maskSprite.height = Math.max(this._maskSprite.height - drownSpeed, 0);

		this._entitySprite.x -= this.x;
		this._entitySprite.y -= this.y;
		this._entitySprite.y += Constants.TileHeight - this._maskSprite.height;

		this._maskSprite.x = this._entitySprite.x;
		this._maskSprite.y = this._entitySprite.y;
	}

	public release(): void {
		this.removeChild(this._entitySprite);

		this._entitySprite.mask = null;
		this._entitySprite.release();

		DrownEffect._pool.release(this);
	}
}

(DrownEffect as any)._pool = new FastPool<DrownEffect>(
	() => new DrownEffect(),
	undefined,
	{
		autoHydrateSize: 1,
		initialSize: 0,
	},
);
