import * as PIXI from 'pixi.js';
import {GfxConstants} from '../../../../Core/Constants/GfxConstants';
import {TextureStore} from 'evidently-pixi';
import {Direction8} from '../../../../GameLogic/Enums/Direction8';

export function directionTextureFactory(direction: Direction8, textureStore: TextureStore): PIXI.Texture | undefined {
	switch (direction) {
		case Direction8.UpLeft:
			return textureStore.getTile(GfxConstants.InitialTileset, 0, 8);
		case Direction8.Up:
			return textureStore.getTile(GfxConstants.InitialTileset, 1, 8);
		case Direction8.UpRight:
			return textureStore.getTile(GfxConstants.InitialTileset, 2, 8);
		case Direction8.Left:
			return textureStore.getTile(GfxConstants.InitialTileset, 3, 8);
		case Direction8.Right:
			return textureStore.getTile(GfxConstants.InitialTileset, 4, 8);
		case Direction8.DownLeft:
			return textureStore.getTile(GfxConstants.InitialTileset, 5, 8);
		case Direction8.Down:
			return textureStore.getTile(GfxConstants.InitialTileset, 6, 8);
		case Direction8.DownRight:
			return textureStore.getTile(GfxConstants.InitialTileset, 7, 8);
		default:
			return undefined;
	}
}
