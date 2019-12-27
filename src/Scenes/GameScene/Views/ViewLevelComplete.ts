import {GameView, GameViewManager} from './GameViewManager';
import * as PIXI from 'pixi.js';
import Constants from '../../../Core/Constants';

export class ViewLevelComplete extends PIXI.Container implements GameView {
	private readonly _stateMachine: GameViewManager;

	private readonly _overlay: PIXI.Sprite;

	private readonly _levelCompleteText: PIXI.BitmapText;

	constructor(stateMachine: GameViewManager) {
		super();

		this._stateMachine = stateMachine;
		this._overlay = new PIXI.Sprite(PIXI.Texture.WHITE);
		this._levelCompleteText = new PIXI.BitmapText('LEVEL COMPLETE!', {
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
		this.addChild(this._levelCompleteText);

		this.visible = false;
	}

	public update(): void {
		// @todo Some way of leaving this screen when campaigns are implemented
	}

	public onBlur(): void {
		this.visible = false;
	}

	public onFocus(): void {
		this.visible = true;
	}
}
