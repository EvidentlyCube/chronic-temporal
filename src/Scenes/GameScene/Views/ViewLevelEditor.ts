import {GameView, GameViewManager} from './GameViewManager';
import {PlayerInputManager} from '../PlayerInputManager';
import {SessionController} from '../SessionController';
import * as PIXI from 'pixi.js';
import {SessionRenderer} from '../Renderers/SessionRenderer';
import Constants from '../../../Core/Constants';
import {FloorType} from '../../../GameLogic/Enums/FloorType';
import {TurnState} from '../../../GameLogic/TurnState';
import {TurnEventType} from '../../../GameLogic/Enums/TurnEventType';

export class ViewLevelEditor extends PIXI.Container implements GameView {
	private readonly _stateMachine: GameViewManager;

	private readonly _sessionRenderer: SessionRenderer;

	private readonly _header: PIXI.BitmapText;

	private readonly _levelLayer: PIXI.Sprite;

	private readonly _selectedTileHighlight: PIXI.Sprite;

	constructor(stateMachine: GameViewManager, sessionRenderer: SessionRenderer) {
		super();

		this._stateMachine = stateMachine;
		this._sessionRenderer = sessionRenderer;
		this._selectedTileHighlight = new PIXI.Sprite(PIXI.Texture.WHITE);
		this._levelLayer = new PIXI.Sprite();
		this._header = new PIXI.BitmapText('Level editor', {
			font: {
				name: 'Topaz-8',
				size: 10,
			},
		});

		this.addChild(this._levelLayer);
		this.addChild(this._header);
		this._levelLayer.addChild(this._selectedTileHighlight);

		this.visible = false;
	}

	public update(passedTime: number, input: PlayerInputManager, controller: SessionController): void {
		const turnState = new TurnState(controller.currentLevel);

		this._levelLayer.x = this._sessionRenderer.levelRenderer.x;
		this._levelLayer.y = this._sessionRenderer.levelRenderer.y;
		this._levelLayer.scale.x = this._sessionRenderer.levelRenderer.scale.x;
		this._levelLayer.scale.y = this._sessionRenderer.levelRenderer.scale.y;

		const hoveredTilePosition = controller.getTileUnderMouse();
		const isInBounds = controller.currentLevel.isInBounds(hoveredTilePosition.x, hoveredTilePosition.y);

		this._selectedTileHighlight.x = hoveredTilePosition.x * Constants.TileWidth;
		this._selectedTileHighlight.y = hoveredTilePosition.y * Constants.TileHeight;
		this._selectedTileHighlight.alpha = 0.6;
		this._selectedTileHighlight.tint = isInBounds ? 0xFFFFFF : 0xFF0000;

		if (isInBounds) {
			if (input.editorDraw()) {
				controller.currentLevel.tilesFloor.set(hoveredTilePosition.x, hoveredTilePosition.y, FloorType.Wall);
				turnState.addEvent(TurnEventType.TileChanged, [hoveredTilePosition.x, hoveredTilePosition.y]);
			} else if (input.editorErase()) {
				controller.currentLevel.tilesFloor.set(hoveredTilePosition.x, hoveredTilePosition.y, FloorType.FloorTile);
				turnState.addEvent(TurnEventType.TileChanged, [hoveredTilePosition.x, hoveredTilePosition.y]);
			}
		}

		controller.tryToSync(turnState);
	}

	public onBlur(): void {
		this.visible = false;
	}

	public onFocus(): void {
		this.visible = true;
	}
}
