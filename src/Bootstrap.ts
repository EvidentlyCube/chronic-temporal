/// <reference path="../pixi-monkey-patch.d.ts"/>
/// <reference path="./index.d.ts"/>

import * as PIXI from 'pixi.js';
import Constants from './Core/Constants';
import {InitializerScene} from './Scenes/InitializerScene';

import {queueAssets} from './Initialization/queueAssets';

import {Config} from '../config/config';
import {Game, ScalingStage} from 'evidently-pixi';

const game = new Game({
	document,
	window,
	pixiConfig: {
		width: Constants.VirtualWidth,
		height: Constants.VirtualHeight,
		backgroundColor: 0,
		antialias: false,
	},
	stageFactory: (game: Game) => new ScalingStage(
		game,
		Constants.VirtualWidth,
		Constants.VirtualHeight,
		PIXI.SCALE_MODES.NEAREST,
		Config.upscaleMode,
	),
	onQueueAssets: queueAssets,
	onStartGame: () => {
	},
	gameContainerId: 'game',
	initialSceneFactory: (game) => new InitializerScene(game),
});

game.start();
