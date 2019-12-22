import * as PIXI from 'pixi.js';
import {Effect} from './Effect';
import {FastPool, Pool} from 'evidently-data-structures';
import {Protagonist} from '../../../../GameLogic/Entities/Protagonist';
import Constants from '../../../../Core/Constants';
import {PlayerActionUtils} from '../../../../GameLogic/Enums';
import {Direction8Utils} from '../../../../GameLogic/Enums/Direction8';
import {GfxConstants} from '../../../../Core/Constants/GfxConstants';
import {TextureStore} from 'evidently-pixi';

const initialAlpha = 0.7;
const finalAlpha = 0.3;
const slideLength = 1000;
const effectBreak = 500;
const cycleLength = slideLength + effectBreak;

export class NextProjectionMoveEffect extends PIXI.Sprite implements Effect {
	private static readonly _pool: Pool<NextProjectionMoveEffect>;

	public static getOne(projection: Protagonist, textureStore: TextureStore): NextProjectionMoveEffect {
		const effect = NextProjectionMoveEffect._pool.getOne();

		effect.init(projection, textureStore);

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
		this._timer = (this._timer + timePassed) % cycleLength;

		const slideFraction = 1 - (1 - Math.min(this._timer / slideLength, 1)) ** 2;
		this.x = this._fromX + (this._toX - this._fromX) * slideFraction | 0;
		this.y = this._fromY + (this._toY - this._fromY) * slideFraction | 0;
		this.alpha = initialAlpha + (finalAlpha - initialAlpha) * slideFraction;
	}

	public release(): void {
		NextProjectionMoveEffect._pool.release(this);
	}

	private init(projection: Protagonist, textureStore: TextureStore): void {
		this.texture = textureStore.getTile(GfxConstants.InitialTileset, 1, 0);
		this.visible = false;
		this.alpha = initialAlpha;
		this._timer = 0;

		this._fromX = projection.x * Constants.TileWidth;
		this._fromY = projection.y * Constants.TileHeight;
		this.x = this._fromX;
		this.y = this._fromY;

		const nextAction = projection.movesQueue.peek();

		if (nextAction !== undefined && PlayerActionUtils.isMoveAction(nextAction)) {
			const direction = PlayerActionUtils.actionToDirection(nextAction);
			this._toX = this._fromX + Direction8Utils.getX(direction) * Constants.TileWidth;
			this._toY = this._fromY + Direction8Utils.getY(direction) * Constants.TileHeight;

			this.visible = true;
		}
	}
}

(NextProjectionMoveEffect as any)._pool = new FastPool<NextProjectionMoveEffect>(
	() => new NextProjectionMoveEffect(),
	undefined,
	{
		autoHydrateSize: 1,
		initialSize: 0,
	},
);
