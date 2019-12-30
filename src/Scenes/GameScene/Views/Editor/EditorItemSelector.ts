import * as PIXI from 'pixi.js';
import {FloorPlotter} from './Plotter/FloorPlotter';
import {FloorType} from '../../../../GameLogic/Enums/FloorType';
import {Plotter} from './Plotter/Plotter';
import {EntityPlotter} from './Plotter/EntityPlotter';
import {EntityType} from '../../../../GameLogic/Enums/EntityType';
import {TextureStore} from 'evidently-pixi';
import {EditorConfig} from './EditorConfig';
import Constants from '../../../../Core/Constants';

const plotters: Plotter[][] = [
	[new FloorPlotter(FloorType.FloorTile), new FloorPlotter(FloorType.Wall), new FloorPlotter(FloorType.Water)],
	[],
	[new EntityPlotter(EntityType.Pushable), new EntityPlotter(EntityType.Iceblock), new EntityPlotter(EntityType.Fireball)],
];

const OffsetX = Constants.TileWidth;
const OffsetY = Constants.TileHeight;
const SpacingX = Constants.TileWidth / 3 | 0;
const SpacingY = Constants.TileHeight / 3 | 0;

export class EditorItemSelector extends PIXI.Sprite {
	private readonly _background: PIXI.Sprite;

	constructor(textureStore: TextureStore, editorConfig: EditorConfig) {
		super();

		this._background = new PIXI.Sprite(PIXI.Texture.WHITE);
		this._background.tint = 0;
		this._background.alpha = 0.8;
		this._background.width = Constants.VirtualWidth;
		this._background.height = Constants.VirtualHeight;

		this.addChild(this._background);

		for (let y = 0; y < plotters.length; y++) {
			const row = plotters[y];
			for (let x = 0; x < row.length; x++) {
				const plotter = row[x];
				const plotterSelector = new PIXI.Sprite(plotter.getTexture(editorConfig, textureStore));
				plotterSelector.x = OffsetX + (Constants.TileWidth + SpacingX) * x;
				plotterSelector.y = OffsetY + (Constants.TileHeight + SpacingY) * y;
				plotterSelector.addListener('pointerover', () => {
					plotterSelector.alpha = 0.75;
				});
				plotterSelector.addListener('pointerout', () => {
					plotterSelector.alpha = 1;
				});
				plotterSelector.addListener('pointerdown', () => {
					editorConfig.selectedPlotter = plotter;
				});
				plotterSelector.interactive = true;
				this.addChild(plotterSelector);
			}
		}
	}
}
