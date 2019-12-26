import * as PIXI from 'pixi.js';
import {Pool, SlowPool} from 'evidently-data-structures';
import Constants from '../../../../Core/Constants';
import {EntitySprite} from './EntitySprite';
import {Iceblock} from '../../../../GameLogic/Entities/Iceblock';
import {TextureStore} from 'evidently-pixi';
import {GfxConstants} from '../../../../Core/Constants/GfxConstants';
import {Direction8} from '../../../../GameLogic/Enums/Direction8';

const slideLength = 250;

export class IceblockEntitySprite extends PIXI.Sprite implements EntitySprite {
	private static readonly _pool: Pool<IceblockEntitySprite>;

	public static getOne(entity: Iceblock, textureStore: TextureStore): IceblockEntitySprite {
		const effect = IceblockEntitySprite._pool.getOne();

		effect.init(entity, textureStore);

		return effect;
	}

	private _fromX!: number;

	private _fromY!: number;

	private _toX!: number;

	private _toY!: number;

	private _isMoving!: boolean;

	private _timer = 0;

	private readonly _blockSprite: PIXI.Sprite;

	private readonly _directionSprite: PIXI.Sprite;

	constructor() {
		super(undefined);

		this._fromX = 0;
		this._fromY = 0;
		this._toX = 0;
		this._toY = 0;

		this._blockSprite = new PIXI.Sprite();
		this._directionSprite = new PIXI.Sprite();

		this.addChild(this._blockSprite, this._directionSprite);
	}

	private init(entity: Iceblock, textureStore: TextureStore): void {
		this._blockSprite.x = 0;
		this._blockSprite.y = 0;

		this._blockSprite.texture = textureStore.getTile(GfxConstants.InitialTileset, 6, 3);
		(this._directionSprite as any).texture = this.getDirectionTexture(entity.direction, textureStore);
		this._timer = 0;

		this._fromX = entity.prevX * Constants.TileWidth;
		this._fromY = entity.prevY * Constants.TileHeight;
		this._toX = entity.x * Constants.TileWidth;
		this._toY = entity.y * Constants.TileHeight;
		this._isMoving = entity.direction !== Direction8.None;
		this.x = this._fromX;
		this.y = this._fromY;
	}

	public update(timePassed: number): void {
		this._timer += timePassed;

		const slideFraction = 1 - (1 - Math.min(this._timer / slideLength, 1)) ** 2;
		this.x = Math.round(this._fromX + (this._toX - this._fromX) * slideFraction);
		this.y = Math.round(this._fromY + (this._toY - this._fromY) * slideFraction);

		if (this._isMoving) {
			this._blockSprite.x = Math.round(Math.sin(this._timer / 100) * 2);
			this._blockSprite.y = Math.round(Math.cos(this._timer / 50) * -1);
		}
	}

	public release(): void {
		IceblockEntitySprite._pool.release(this);
	}

	private getDirectionTexture(direction: Direction8, textureStore: TextureStore): PIXI.Texture | undefined {
		switch (direction) {
			case Direction8.UpLeft:
				return textureStore.getTile(GfxConstants.InitialTileset, 0, 8);
			case Direction8.Up:
				return textureStore.getTile(GfxConstants.InitialTileset, 1, 8);
			case Direction8.UpRight:
				return textureStore.getTile(GfxConstants.InitialTileset, 2, 8);
			case Direction8.Left:
				return textureStore.getTile(GfxConstants.InitialTileset, 3, 8);
			case Direction8.Right:
				return textureStore.getTile(GfxConstants.InitialTileset, 4, 8);
			case Direction8.DownLeft:
				return textureStore.getTile(GfxConstants.InitialTileset, 5, 8);
			case Direction8.Down:
				return textureStore.getTile(GfxConstants.InitialTileset, 6, 8);
			case Direction8.DownRight:
				return textureStore.getTile(GfxConstants.InitialTileset, 7, 8);
			default:
				return undefined;
		}
	}
}

(IceblockEntitySprite as any)._pool = new SlowPool<IceblockEntitySprite>(
	() => new IceblockEntitySprite(),
	undefined,
	{
		autoHydrateSize: 1,
		initialSize: 0,
	},
);
