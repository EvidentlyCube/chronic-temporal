import {Level} from '../GameLogic/Level';
import {FloorType} from '../GameLogic/Enums/FloorType';
import {GameSession} from '../GameLogic/GameSession';
import {GameScene} from './GameScene/GameScene';
import {Pushable} from '../GameLogic/Entities/Pushable';
import {Fireball} from '../GameLogic/Entities/Fireball';
import {Direction8} from '../GameLogic/Enums/Direction8';
import {Game, Scene} from 'evidently-pixi';
import {Iceblock} from '../GameLogic/Entities/Iceblock';
import {Entity} from '../GameLogic/Entity';
import {Config} from '../../config/config';
import {Campaign} from '../GameLogic/Campaign';
import Constants from '../Core/Constants';

export class InitializerScene implements Scene {
	private readonly _game: Game;

	constructor(game: Game) {
		this._game = game;
	}

	public onStarted(): void {
		this.getInitialCampaign()
			.then(campaign => {
				this.initializeTestSession(campaign.levels[0]);
			});
	}

	public onEnded(): void {
		// Intentionally left blank
	}

	public update(): void {
		// Intentionally left blank
	}

	private initializeTestSession(level: Level): void {
		const session = new GameSession(level);

		this._game.sceneManager.changeScene(new GameScene(this._game, session));
	}

	private async getInitialCampaign(): Promise<Campaign> {
		const campaign = await Config.campaignStore.getCampaign(Constants.DefaultScenarioId);

		if (campaign) {
			return campaign;
		} else {
			const campaign = new Campaign(Constants.DefaultScenarioId);
			campaign.name = 'Default';
			campaign.levels.push(this.getTestLevel());

			await Config.campaignStore.addCampaign(campaign);

			return campaign;
		}
	}

	private getTestLevel(): Level {
		const level = new Level({
			width: 20,
			height: 20,
			playerStartX: 10,
			playerStartY: 10,
		});

		function addEntity(entity: Entity, x: number, y: number): void {
			entity.x = x;
			entity.y = y;
			entity.prevX = x;
			entity.prevY = y;
			level.entities.addEntity(entity);
		}

		for (let i = 0; i < level.width; i++) {
			level.tilesFloor.set(i, 0, FloorType.Wall);
			level.tilesFloor.set(0, i, FloorType.Wall);
			level.tilesFloor.set(i, level.height - 1, FloorType.Wall);
			level.tilesFloor.set(level.width - 1, i, FloorType.Wall);
		}

		level.tilesFloor.set(2, 2, FloorType.Wall);
		level.tilesFloor.set(7, 3, FloorType.Wall);
		level.tilesFloor.set(15, 17, FloorType.Wall);
		level.tilesFloor.set(6, 14, FloorType.Water);
		level.tilesFloor.set(8, 12, FloorType.Water);
		level.tilesFloor.set(15, 4, FloorType.Water);
		level.tilesFloor.set(17, 18, FloorType.Exit);
		level.tilesFloor.set(13, 14, FloorType.IceTrap);
		level.tilesFloor.set(8, 14, FloorType.IceTrap);

		addEntity(new Pushable(), 9, 9);
		addEntity(new Fireball(Direction8.DownRight), 4, 5);
		addEntity(new Iceblock(new Pushable()), 15, 7);

		return level;
	}

	private getEmptyLevel(): Level {
		const level = new Level({
			width: 30,
			height: 22,
			playerStartX: 10,
			playerStartY: 10,
		});

		return level;
	}
}
