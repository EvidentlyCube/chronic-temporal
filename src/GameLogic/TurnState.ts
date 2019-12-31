import {Level} from './Level';
import {TurnEventTypeDeaths, TurnEventType, TurnEventTypeUtils} from './Enums/TurnEventType';
import {Entity} from './Entity';
import {FloorType} from './Enums/FloorType';

export class TurnState {
	private readonly _level: Level;

	private readonly _events: Map<TurnEventType, any[]>;

	private _eventCount = 0;

	public get level(): Level {
		return this._level;
	}

	public get eventCount(): number {
		return this._eventCount;
	}

	constructor(level: Level) {
		this._level = level;
		this._events = new Map();

		TurnEventTypeUtils.all.forEach(type => this._events.set(type, []));
	}

	public killEntity(entity: Entity, deathType: TurnEventTypeDeaths): void {
		this.addEvent(deathType, entity);
		this._level.entities.removeEntity(entity, this);
	}

	public changeFloor(floorType: FloorType, x: number, y: number): void {
		this.addEvent(TurnEventType.TileChanged, [x, y]);
		this.level.tilesFloor.set(x, y, floorType);
	}

	public addEvent(event: TurnEventType, data: any | undefined = undefined): void {
		this._events.get(event)!.push(data);
		this._eventCount++;
	}

	public hasEvent(event: TurnEventType): boolean {
		return this._events.get(event)!.length > 0;
	}

	public getEventData(event: TurnEventType): readonly any[] {
		return this._events.get(event)!;
	}

	public release(): void {
		for (const eventDatas of this._events.values()) {
			for (const eventData of eventDatas) {
				if (eventData?.release) {
					eventData.release();
				}
			}

			eventDatas.length = 0;
		}
	}
}
