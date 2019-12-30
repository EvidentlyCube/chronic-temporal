import * as PIXI from 'pixi.js';
import {PlotterDirectionRestriction, Plotter} from './Plotter';
import {FloorType} from '../../../../../GameLogic/Enums/FloorType';
import {TextureStore} from 'evidently-pixi';
import {EditorConfig} from '../EditorConfig';
import {GfxConstants} from '../../../../../Core/Constants/GfxConstants';
import {TurnState} from '../../../../../GameLogic/TurnState';
import {TurnEventType} from '../../../../../GameLogic/Enums/TurnEventType';

export class FloorPlotter implements Plotter {
	public floorType: FloorType;

	constructor(floor: FloorType) {
		this.floorType = floor;
	}

	public plot(turnState: TurnState, editorConfig: EditorConfig, x: number, y: number): void {
		const {level} = turnState;

		level.tilesFloor.set(x, y, this.floorType);
		turnState.addEvent(TurnEventType.TileChanged, [x, y]);
	}

	public unplot(turnState: TurnState, editorConfig: EditorConfig, x: number, y: number): void {
		const {level} = turnState;

		level.tilesFloor.set(x, y, FloorType.FloorTile);
		turnState.addEvent(TurnEventType.TileChanged, [x, y]);
	}

	public getTexture(editorConfig: EditorConfig, textureStore: TextureStore): PIXI.Texture {
		switch (this.floorType) {
			case FloorType.FloorTile:
				return textureStore.getTile(GfxConstants.InitialTileset, 9, 5);
			case FloorType.Wall:
				return textureStore.getTile(GfxConstants.InitialTileset, 5, 7);
			case FloorType.Water:
				return textureStore.getTile(GfxConstants.InitialTileset, 6, 7);
			default:
				throw new Error(`Invalid floor type "${this.floorType}"`);
		}
	}

	public getDirectionRequirement(): PlotterDirectionRestriction {
		return PlotterDirectionRestriction.None;
	}
}
