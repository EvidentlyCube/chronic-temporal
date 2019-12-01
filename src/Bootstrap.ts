/// <reference path="index.d.ts"/>

import Constants from './Core/Constants';
import {Game} from '../src.common/Core/Game';
import {InitializerScene} from './Scenes/InitializerScene';

import * as InitialTileset from './assets/textures/tileset.png';
import {ContainerUpscaleMode, ScalingGameContainer} from '../src.common/Core/ScalingGameContainer';
import {GfxConstants} from './Core/Constants/GfxConstants';

const game = new Game({
	document,
	window,
	pixiConfig: {
		width: Constants.VirtualWidth,
		height: Constants.VirtualHeight,
		backgroundColor: 0,
		antialias: false,
	},
	containerFactory: (game: Game) => new ScalingGameContainer(
		game,
		Constants.VirtualWidth,
		Constants.VirtualHeight,
		PIXI.SCALE_MODES.NEAREST,
		ContainerUpscaleMode.FullScale,
	),
	onQueueAssets: (game: Game) => {
		game.assetLoader.loadTexture(GfxConstants.InitialTileset, InitialTileset);
		game.assetLoader.loadTileset(GfxConstants.InitialTileset, {
			tileWidth: 16,
			tileHeight: 16,
			offsetX: 0,
			offsetY: 0,
			spacingX: 0,
			spacingY: 0,
		});
	},
	onStartGame: () => {
	},
	initialScene: InitializerScene,
});

game.start();
