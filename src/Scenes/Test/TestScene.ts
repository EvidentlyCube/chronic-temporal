import * as PIXI from 'pixi.js';
import {IScene} from "../../../src.common/Managers/SceneManager";
import {Game} from "../../../src.common/Core/Game";

export class TestScene implements IScene
{
	private readonly _game: Game;
	private readonly _layer: PIXI.Sprite;
	private readonly _text:PIXI.Text;

	constructor(game: Game)
	{
		this._game = game;
		this._layer = game.createLayer();
		this._text = new PIXI.Text("Hello World", {fill: 0xFFFFFF});

		this._layer.addChild(this._text);
	}

	public onStarted(): void
	{
	}

	public onEnded(): void
	{
	}

	public update(timePassed: number): void
	{
	}
}