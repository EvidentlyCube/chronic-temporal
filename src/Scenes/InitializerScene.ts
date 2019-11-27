import {IScene} from '../../src.common/Managers/SceneManager';
import {Game} from '../../src.common/Core/Game';

export class InitializerScene implements IScene {
	private readonly _game: Game;

	constructor(game: Game) {
		this._game = game;
	}

	public onStarted(): void {
		// Intentionally left blank
	}

	public onEnded(): void {
		// Intentionally left blank
	}

	public update(): void {
		// Intentionally left blank
	}
}
