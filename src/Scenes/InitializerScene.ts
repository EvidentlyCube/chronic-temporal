import * as PIXI from 'pixi.js';
import {IScene} from "../../src.common/Managers/SceneManager";
import {Game} from "../../src.common/Core/Game";

export class InitializerScene implements IScene
{
	private _game: Game;

	constructor(game: Game)
	{
		this._game = game;
	}

	public onStarted(): void
	{
		// Intentionally left blank
	}

	public onEnded(): void
	{
		// Intentionally left blank
	}

	public update(timePassed: number): void
	{
		// Intentionally left blank
	}
}