import * as PIXI from 'pixi.js';
import {AssetLoader} from '../Managers/AssetLoader';
import {TextureFactory} from '../Managers/TextureFactory';
import {Scene, SceneManager} from '../Managers/SceneManager';
import {Constructor} from '../GenericInterfaces';
import {GameContainerLayer, IGameContainer} from './IGameContainer';
import {RawInput} from './RawInput';

export interface GameConfiguration {
	pixiConfig: PIXI.ApplicationOptions;
	document: Document;
	window: Window;
	containerFactory: (game: Game) => IGameContainer;

	initialScene: Constructor<Scene>;

	onSetupLoadingScreen?: (game: Game) => any | void;
	onRemoveLoadingScreen?: (game: Game) => any | void;
	onQueueAssets: (game: Game) => any | void;
	onStartGame: (game: Game) => any | void;
}

export class Game {
	private readonly _config: GameConfiguration;

	public readonly pixi: PIXI.Application;

	public readonly document: Document;

	public readonly rawInput: RawInput;

	public readonly gameContainer: IGameContainer;

	public readonly assetLoader: AssetLoader;

	public readonly textureFactory: TextureFactory;

	public readonly sceneManager: SceneManager;

	constructor(config: GameConfiguration) {
		if (config.pixiConfig.sharedTicker === undefined) {
			config.pixiConfig.sharedTicker = true;
		}

		this._config = config;

		this.pixi = new PIXI.Application(config.pixiConfig);
		this.document = config.document;
		this.rawInput = new RawInput(this.document);
		this.gameContainer = config.containerFactory(this);
		this.assetLoader = new AssetLoader();
		this.textureFactory = this.assetLoader.textureFactory;
		this.sceneManager = new SceneManager(this);

		const gameElement = config.document.getElementById('game');

		if (!gameElement) {
			throw new Error('Failed to find game element');
		}

		gameElement.appendChild(this.pixi.view);
	}

	public start(): void {
		Promise.resolve()
			.then(() => (this._config.onSetupLoadingScreen ?? this.setupLoadingScreen).call(this, this))
			.then(() => this._config.onQueueAssets(this))
			.then(() => this.loadAssets())
			.then(() => (this._config.onRemoveLoadingScreen ?? this.removeLoadingScreen).call(this, this))
			.then(() => this.initializeScene())
			.then(() => this._config.onStartGame(this))
			.then(() => this.finalSetup(this));
	}

	public createLayer(layer: GameContainerLayer = GameContainerLayer.Normal): PIXI.Sprite {
		const sprite = new PIXI.Sprite();

		this.gameContainer.addChild(sprite, layer);

		return sprite;
	}

	public removeLayer(layer: PIXI.Sprite): void {
		this.gameContainer.removeChild(layer);
	}

	private update(): void {
		const delta = this.pixi.ticker.elapsedMS;
		this.sceneManager.update(delta);
		this.gameContainer.update(delta);
		this.rawInput.update();
	}

	private setupLoadingScreen(game: Game): any {
		const div = game.document.createElement('div');
		div.id = '__default-loading-div';
		div.style.position = 'fixed';
		div.style.left = '0';
		div.style.right = '0';
		div.style.top = '0';
		div.style.bottom = '0';
		div.style.background = '#444';
		div.style.color = 'white';
		div.style.fontSize = '80px';
		div.style.display = 'flex';
		div.style.justifyContent = 'center';
		div.style.alignContent = 'center';
		div.style.alignItems = 'center';
		div.textContent = 'Loading';

		this.document.getElementsByTagName('body')[0].appendChild(div);
	}

	private removeLoadingScreen(): any {
		const loadingDiv = this.document.getElementById('__default-loading-div');

		loadingDiv?.parentNode?.removeChild(loadingDiv);
	}

	private loadAssets(): Promise<void> {
		return this.assetLoader.load(this.pixi.loader);
	}

	private initializeScene(): void {
		this.sceneManager.changeScene(this._config.initialScene);
	}

	private finalSetup(game: Game): void {
		game._config.window.onresize = () => game.onWindowResize(game, game._config.window.innerWidth, game._config.window.innerHeight);
		game.pixi.ticker.add(() => game.update());

		game.onWindowResize(game, game._config.window.innerWidth, game._config.window.innerHeight);
	}

	private onWindowResize(game: Game, width: number, height: number): void {
		game.pixi.renderer.resize(width, height);
		game.gameContainer.setWindowDimensions(width, height);
	}
}
