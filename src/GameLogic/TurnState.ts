import {Level} from './Level';
import {TurnEventTypeDeaths, TurnEventType, TurnEventTypeUtils} from './Enums/TurnEventType';
import {Entity} from './Entity';

export class TurnState {
	private readonly _level: Level;

	private readonly _events: Map<TurnEventType, any[]>;

	public get level(): Level {
		return this._level;
	}

	constructor(level: Level) {
		this._level = level;
		this._events = new Map();

		TurnEventTypeUtils.all.forEach(type => this._events.set(type, []));
	}

	public killEntity(entity: Entity, deathType: TurnEventTypeDeaths): void {
		this.addEvent(deathType, entity);
		this._level.entities.removeEntity(entity);
	}

	public addEvent(event: TurnEventType, data: any | undefined): void {
		this._events.get(event)!.push(data);
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