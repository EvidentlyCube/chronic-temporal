/// <reference path="../pixi-monkey-patch.d.ts"/>
/// <reference path="./index.d.ts"/>

import * as PIXI from 'pixi.js';
import Constants from './Core/Constants';
import {Game} from '../src.common/Core/Game';
import {InitializerScene} from './Scenes/InitializerScene';

import {ScalingGameContainer} from '../src.common/Core/ScalingGameContainer';
import {queueAssets} from './Initialization/queueAssets';

import {Config} from '../config/config';

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
		Config.containerUpscaleMode,
	),
	onQueueAssets: queueAssets,
	onStartGame: () => {
	},
	initialScene: InitializerScene,
});

game.start();
