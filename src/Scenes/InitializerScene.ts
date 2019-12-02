import {Scene} from '../../src.common/Managers/SceneManager';
import {Game} from '../../src.common/Core/Game';
import {Level} from '../GameLogic/Level';
import {FloorType} from '../GameLogic/Enums';
import {GameSession} from '../GameLogic/GameSession';
import {GameScene} from './GameScene/GameScene';

export class InitializerScene implements Scene {
	private readonly _game: Game;

	constructor(game: Game) {
		this._game = game;
	}

	public onStarted(): void {
		this.initializeTestSession();
	}

	public onEnded(): void {
		// Intentionally left blank
	}

	public update(): void {
		// Intentionally left blank
	}

	private initializeTestSession(): void {
		const levelFactory = (): Level => {
			const level = new Level({
				width: 20,
				height: 20,
				playerStartX: 10,
				playerStartY: 10,
			});

			for (let i = 0; i < level.width; i++) {
				level.tilesFloor.set(i, 0, FloorType.Wall);
				level.tilesFloor.set(0, i, FloorType.Wall);
				level.tilesFloor.set(i, level.height - 1, FloorType.Wall);
				level.tilesFloor.set(level.width - 1, i, FloorType.Wall);
			}

			level.tilesFloor.set(2, 2, FloorType.Wall);
			level.tilesFloor.set(7, 3, FloorType.Wall);
			level.tilesFloor.set(15, 17, FloorType.Wall);

			return level;
		};

		const session = new GameSession(levelFactory);

		this._game.sceneManager.changeScene(new GameScene(this._game, session));
	}
}
