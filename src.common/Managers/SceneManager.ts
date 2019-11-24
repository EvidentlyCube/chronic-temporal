import {Constructor} from "../GenericInterfaces";
import {Game} from "../Core/Game";

export interface IScene {
	 update(passedTime: number): void;
	 onStarted(): void;
	 onEnded(): void;
}

export class SceneManager {
	private readonly _game: Game;
	private _currentScene?: IScene;

	public constructor(game: Game)
	{
		this._game = game;
	}

	public update(passedTime: number): void {
		this._currentScene && this._currentScene.update(passedTime);
	}

	public changeScene(newScene: Constructor<IScene>): void
	{
		this._currentScene && this._currentScene.onEnded();

		this._currentScene = new newScene(this._game);
		this._currentScene.onStarted();
	}
}