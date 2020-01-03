import {GameView, GameViewManager} from './GameViewManager';
import {PlayerInputManager} from '../PlayerInputManager';
import {SessionController} from '../SessionController';
import * as PIXI from 'pixi.js';
import {SessionRenderer} from '../Renderers/SessionRenderer';
import {TurnState} from '../../../GameLogic/TurnState';
import {EditorItemSelector} from './Editor/EditorItemSelector';
import {TextureStore} from 'evidently-pixi';
import {EditorConfig} from './Editor/EditorConfig';
import {EditorCursor} from './Editor/EditorCursor';
import {Direction8} from '../../../GameLogic/Enums/Direction8';

export class ViewLevelEditor extends PIXI.Container implements GameView {
	private readonly _sessionRenderer: SessionRenderer;

	private readonly _header: PIXI.BitmapText;

	private readonly _levelLayer: PIXI.Sprite;

	private readonly _itemSelector: EditorItemSelector;

	private readonly _editorConfig: EditorConfig;

	private readonly _cursor: EditorCursor;

	constructor(viewManager: GameViewManager, sessionRenderer: SessionRenderer, textureStore: TextureStore) {
		super();

		this._sessionRenderer = sessionRenderer;
		this._levelLayer = new PIXI.Sprite();
		this._editorConfig = new EditorConfig();
		this._itemSelector = new EditorItemSelector(textureStore, this._editorConfig);
		this._cursor = new EditorCursor(this._editorConfig, textureStore);
		this._header = new PIXI.BitmapText('Level editor', {
			font: {
				name: 'Topaz-8',
				size: 10,
			},
		});

		this.addChild(this._levelLayer);
		this.addChild(this._header);
		this.addChild(this._itemSelector);
		this._levelLayer.addChild(this._cursor);

		this.visible = false;
	}

	public update(passedTime: number, input: PlayerInputManager, controller: SessionController): void {
		const turnState = new TurnState(controller.currentLevel);

		this._levelLayer.x = this._sessionRenderer.levelRenderer.x;
		this._levelLayer.y = this._sessionRenderer.levelRenderer.y;
		this._levelLayer.scale.x = this._sessionRenderer.levelRenderer.scale.x;
		this._levelLayer.scale.y = this._sessionRenderer.levelRenderer.scale.y;

		this._cursor.visible = !input.editorViewItemSelection();
		this._itemSelector.visible = input.editorViewItemSelection();

		if (input.actionMoveUpLeft()) {
			this._editorConfig.direction = Direction8.UpLeft;
		} else if (input.actionMoveUp()) {
			this._editorConfig.direction = Direction8.Up;
		} else if (input.actionMoveUpRight()) {
			this._editorConfig.direction = Direction8.UpRight;
		} else if (input.actionMoveLeft()) {
			this._editorConfig.direction = Direction8.Left;
		} else if (input.actionMoveRight()) {
			this._editorConfig.direction = Direction8.Right;
		} else if (input.actionMoveDownLeft()) {
			this._editorConfig.direction = Direction8.DownLeft;
		} else if (input.actionMoveDown()) {
			this._editorConfig.direction = Direction8.Down;
		} else if (input.actionMoveDownRight()) {
			this._editorConfig.direction = Direction8.DownRight;
		} else if (input.actionWait()) {
			this._editorConfig.direction = Direction8.None;
		}

		if (!input.editorViewItemSelection()) {
			this._cursor.update(passedTime, input, controller, turnState);
		}

		controller.tryToSync(turnState);
	}

	public onBlur(controller: SessionController): void {
		controller.session.turnRunner;
		this.visible = false;
	}

	public onFocus(): void {
		this.visible = true;
	}
}
