import * as PIXI from "pixi.js";
import {GameContainerLayer} from "./IGameContainer";

export class DefaultGameContainer {

	protected readonly pixi: PIXI.Application;

	protected readonly _layers: PIXI.Container[];

	constructor(pixi: PIXI.Application) {
		this.pixi = pixi;

		this._layers = [];
		this._layers[GameContainerLayer.Normal] = new PIXI.Container();
		this._layers[GameContainerLayer.DebugProportional] = new PIXI.Container();
		this._layers[GameContainerLayer.DebugFullScreen] = new PIXI.Container();

		this._layers.forEach(layer => this.pixi.stage.addChild(layer));
	}

	public update(timePassed: number) {
	}

	public addChild(child: PIXI.DisplayObject, layer: GameContainerLayer): void {
		this._layers[layer].addChild(child);
	}

	public removeChild(child: PIXI.DisplayObject): void {
		this._layers.filter(x => x === child.parent).forEach(x => x.removeChild(child));
	}

	public setWindowDimensions(width: number, height: number) {
		// Do nothing
	}
}