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
		const testLevel = new Level({
			width: 20,
			height: 20,
			playerStartX: 10,
			playerStartY: 10,
		});

		for (let i = 0; i < testLevel.width; i++) {
			testLevel.tilesFloor.set(i, 0, FloorType.Wall);
			testLevel.tilesFloor.set(0, i, FloorType.Wall);
			testLevel.tilesFloor.set(i, testLevel.height - 1, FloorType.Wall);
			testLevel.tilesFloor.set(testLevel.width - 1, i, FloorType.Wall);
		}

		testLevel.tilesFloor.set(2, 2, FloorType.Wall);
		testLevel.tilesFloor.set(7, 3, FloorType.Wall);
		testLevel.tilesFloor.set(15, 17, FloorType.Wall);

		const session = new GameSession();
		session.loadLevel(testLevel);

		this._game.sceneManager.changeScene(new GameScene(this._game, session));
	}
}
