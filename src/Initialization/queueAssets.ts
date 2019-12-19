/// <reference path="../index.d.ts"/>

import {GfxConstants} from '../Core/Constants/GfxConstants';
import * as InitialTileset from '../assets/textures/tileset.png';
import * as FontTopaz8 from '../assets/fonts/topaz.fnt';
import * as FontTopaz8Image from '../assets/fonts/topaz_0.png';
import {Game} from 'evidently-pixi';

export function queueAssets(game: Game): void {
	game.assetLoader.queuePixiAutoFont('topaz_0.png', FontTopaz8Image);
	game.assetLoader.queuePixiAutoFont('font-topaz', FontTopaz8);
	game.assetLoader.queueTexture(GfxConstants.InitialTileset, InitialTileset);
	game.assetLoader.queueTileset(GfxConstants.InitialTileset, {
		tileWidth: 16,
		tileHeight: 16,
		offsetX: 0,
		offsetY: 0,
		spacingX: 0,
		spacingY: 0,
	});
}
