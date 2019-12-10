import {GameView, GameViewManager} from './GameViewManager';
import {PlayerInputManager} from '../PlayerInputManager';
import {SessionController} from '../SessionController';
import * as PIXI from 'pixi.js';
import Constants from '../../../Core/Constants';

export class ViewEditRecordings extends PIXI.Container implements GameView {
	private readonly _stateMachine: GameViewManager;

	private readonly _overlay: PIXI.Sprite;

	private readonly _recordingsText: PIXI.BitmapText;

	private _selectedRecording: number;

	constructor(stateMachine: GameViewManager) {
		super();

		this._stateMachine = stateMachine;
		this._selectedRecording = 0;
		this._overlay = new PIXI.Sprite(PIXI.Texture.WHITE);
		this._recordingsText = new PIXI.BitmapText('No recordings yet.', {
			font: {
				name: 'Topaz-8',
				size: 10,
			},
		});

		this._overlay.width = Constants.VirtualWidth;
		this._overlay.height = Constants.VirtualHeight;
		this._overlay.tint = 0x000000;
		this._overlay.alpha = 0.7;

		this.addChild(this._overlay);
		this.addChild(this._recordingsText);

		this.visible = false;
	}

	public update(passedTime: number, input: PlayerInputManager, controller: SessionController): void {
		if (input.uiUp()) {
			this._selectedRecording--;
			this.refreshText(controller);
		} else if (input.uiDown()) {
			this._selectedRecording++;
			this.refreshText(controller);
		} else if (input.uiOk() && controller.getRecordings().length > 0) {
			controller.restartAndRemoveRecording(controller.getRecordings()[this._selectedRecording]);
			this.refreshText(controller);
		}
	}

	public onBlur(): void {
		this.visible = false;
	}

	public onFocus(controller: SessionController): void {
		this.visible = true;
		this.refreshText(controller);
	}

	private refreshText(controller: SessionController): void {
		this._selectedRecording = Math.max(0, this._selectedRecording % controller.getRecordings().length) || 0;

		if (controller.getRecordings().length === 0) {
			this._recordingsText.text = 'No recordings yet.';
		} else {
			this._recordingsText.text = '\'Wait\' to delete a recording and restart the level:\n' +
				controller.getRecordings().map((recording, index) => {
					return ` [${index === this._selectedRecording ? 'X' : ' '}] Recording #${index + 1}`;
				}).join('\n');
		}
	}
}
