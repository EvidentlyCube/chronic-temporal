import * as PIXI from 'pixi.js';
import {EditorConfig} from './EditorConfig';
import {TextureStore} from 'evidently-pixi';
import {PlayerInputManager} from '../../PlayerInputManager';
import {SessionController} from '../../SessionController';
import Constants from '../../../../Core/Constants';
import {TurnState} from '../../../../GameLogic/TurnState';
import {PointUtils} from '../../../../Utils/PointUtils';
import {directionTextureFactory} from '../../Renderers/Entities/directionTextureFactory';

const AlphaAnimationSpeed = 1 / 300;

export class EditorCursor extends PIXI.Sprite {
	private readonly _editorConfig: EditorConfig;

	private readonly _textureStore: TextureStore;

	private readonly _drawSprite: PIXI.Sprite;

	private readonly _directionSprite: PIXI.Sprite;

	private _alphaTimer: number;

	private _lastDrawPosition?: PIXI.IPoint;

	constructor(editorConfig: EditorConfig, textureStore: TextureStore) {
		super();

		this._editorConfig = editorConfig;
		this._textureStore = textureStore;

		this._alphaTimer = 0;
		this._drawSprite = new PIXI.Sprite();
		this._directionSprite = new PIXI.Sprite();

		this.addChild(this._drawSprite);
		this.addChild(this._directionSprite);

		this.handlePlotterChanged();

		editorConfig.addListener('plotterchanged', this.handlePlotterChanged, this);
		editorConfig.addListener('directionchanged', this.handleDirectionChanged, this);
	}

	public update(passedTime: number, input: PlayerInputManager, controller: SessionController, turnState: TurnState): void {
		this._alphaTimer += passedTime * AlphaAnimationSpeed;

		const hoveredTilePosition = controller.getTileUnderMouse();
		const isInBounds = controller.currentLevel.isInBounds(hoveredTilePosition.x, hoveredTilePosition.y);

		this.x = hoveredTilePosition.x * Constants.TileWidth;
		this.y = hoveredTilePosition.y * Constants.TileHeight;
		this._drawSprite.alpha = 0.75 + Math.cos(this._alphaTimer) * 0.25;
		this._drawSprite.tint = isInBounds ? 0xFFFFFF : 0xFF0000;

		const isTryingToDraw = input.editorDraw() || input.editorErase();
		const canDraw = !this._lastDrawPosition || !hoveredTilePosition.equals(this._lastDrawPosition);
		if (isInBounds && isTryingToDraw && canDraw) {
			const drawPoints = this._lastDrawPosition
				? PointUtils.getAllPointsBetween(this._lastDrawPosition, hoveredTilePosition)
				: [hoveredTilePosition];

			for (const point of drawPoints) {
				if (input.editorDraw()) {
					canDraw && this._editorConfig.selectedPlotter.plot(turnState, this._editorConfig, point.x, point.y);
				} else if (input.editorErase()) {
					canDraw && this._editorConfig.selectedPlotter.unplot(turnState, this._editorConfig, point.x, point.y);
				}
			}

			this._lastDrawPosition = hoveredTilePosition;
		} else if (!isTryingToDraw) {
			this._lastDrawPosition = undefined;
		}
	}

	public handlePlotterChanged(): void {
		this._drawSprite.texture = this._editorConfig.selectedPlotter.getTexture(this._editorConfig, this._textureStore);
		this.handleDirectionChanged();
	}

	public handleDirectionChanged(): void {
		(this._directionSprite as any).texture = directionTextureFactory(
			this._editorConfig.getDirectionForPlotterRestriction(this._editorConfig.selectedPlotter.getDirectionRequirement()),
			this._textureStore
		);

		console.log(this._directionSprite.texture);
	}
}
