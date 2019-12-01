import {Constructor} from '../GenericInterfaces';
import {Game} from '../Core/Game';

export interface Scene {
	update(passedTime: number): void;

	onStarted(): void;

	onEnded(): void;
}

export class SceneManager {
	private readonly _game: Game;

	private _currentScene?: Scene;

	constructor(game: Game) {
		this._game = game;
	}

	public update(passedTime: number): void {
		this._currentScene && this._currentScene.update(passedTime);
	}

	public changeScene(newScene: Constructor<Scene> | Scene): void {
		this._currentScene && this._currentScene.onEnded();

		if (typeof newScene === 'function') {
			this._currentScene = new newScene(this._game);
		} else {
			this._currentScene = newScene;
		}

		this._currentScene.onStarted();
	}
}
