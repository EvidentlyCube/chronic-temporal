import * as PIXI from 'pixi.js';
import {Direction8} from '../../../../GameLogic/Enums/Direction8';
import {PlotterDirectionRestriction, Plotter} from './Plotter/Plotter';
import {FloorPlotter} from './Plotter/FloorPlotter';
import {FloorType} from '../../../../GameLogic/Enums/FloorType';

export type EditorConfigEvents = 'plotterchanged' | 'directionchanged';

export class EditorConfig extends PIXI.utils.EventEmitter {
	private _selectedPlotter: Plotter;

	private _direction: Direction8;

	private _lastNotNoneDirection: Direction8;

	public get selectedPlotter(): Plotter {
		return this._selectedPlotter;
	}

	public set selectedPlotter(value: Plotter) {
		if (value !== this._selectedPlotter) {
			this._selectedPlotter = value;
			this.emit('plotterchanged', value);
		}
	}

	public get direction(): Direction8 {
		return this._direction;
	}

	public set direction(value: Direction8) {
		if (value !== this._direction) {
			this._direction = value;
			this._lastNotNoneDirection = value !== Direction8.None ? value : this._lastNotNoneDirection;
			this.emit('directionchanged', value);
		}
	}

	public get notNoneDirection(): Direction8 {
		return this._lastNotNoneDirection;
	}

	constructor() {
		super();

		this._direction = Direction8.Down;
		this._lastNotNoneDirection = Direction8.Down;
		this._selectedPlotter = new FloorPlotter(FloorType.Wall);
	}

	public addListener(event: EditorConfigEvents, fn: Function, context?: any): this {
		return super.addListener(event, fn, context);
	}

	public removeAllListeners(event?: EditorConfigEvents): this {
		return super.removeAllListeners(event);
	}

	public removeListener(event: EditorConfigEvents, fn?: Function, context?: any, once?: boolean): this {
		return super.removeListener(event, fn, context, once);
	}

	public emit(event: EditorConfigEvents, ...args: any[]): boolean {
		return super.emit(event, ...args);
	}

	public once(event: EditorConfigEvents, fn: Function, context?: any): this {
		return super.once(event, fn, context);
	}

	public getDirectionForPlotterRestriction(restriction: PlotterDirectionRestriction): Direction8 {
		switch (restriction) {
			case PlotterDirectionRestriction.None:
				return Direction8.None;
			case PlotterDirectionRestriction.OnlyDirectional:
				return this.notNoneDirection;
			case PlotterDirectionRestriction.NoneAndDirectional:
				return this.direction;
			default:
				throw new Error(`Unknown direction restriction '${restriction}'`);
		}
	}
}
