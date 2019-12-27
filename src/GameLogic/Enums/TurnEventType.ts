/**
 * The comment specifies the type of data stored for a given event
 */
export enum TurnEventType {
	EntityKilled = 1, // data: Entity
	EntityDrowned = 2, // data: Entity

	TurnExecuted = 20, // data: undefined
	LevelLoaded = 21, // data: undefined
	TileChanged = 22, // data: [number, number] (x and y coordinate)
	LevelComplete = 23 // data: undefined
}

export type TurnEventTypeDeaths = TurnEventType.EntityKilled| TurnEventType.EntityDrowned;

export class TurnEventTypeUtils {
	public static readonly all: readonly TurnEventType[] = Object.keys(TurnEventType)
		.map(parseFloat)
		.filter(key => !isNaN(key));
}
