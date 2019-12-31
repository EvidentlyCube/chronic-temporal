import * as PIXI from 'pixi.js';
import {TextureStore} from 'evidently-pixi';
import {EditorConfig} from '../EditorConfig';
import {TurnState} from '../../../../../GameLogic/TurnState';

export enum PlotterDirectionRestriction {
	None,
	NoneAndDirectional,
	OnlyDirectional
}

export interface Plotter {
	plot(turnState: TurnState, editorConfig: EditorConfig, x: number, y: number): void;

	unplot(turnState: TurnState, editorConfig: EditorConfig, x: number, y: number): void;

	getTexture(editorConfig: EditorConfig, textureStore: TextureStore): PIXI.Texture;

	getDirectionRequirement(): PlotterDirectionRestriction;
}
