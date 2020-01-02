/**
 * The comment specifies the type of data stored for a given event
 */
export enum TurnEventType {
	EntityKilled = 1, // data: Entity
	EntityDrowned = 2, // data: Entity
	EntityFrozen = 3, // data: Entity (the one just frozen, not the new Iceblock)

	TurnExecuted = 20, // data: undefined
	LevelLoaded = 21, // data: undefined
	TileChanged = 22, // data: [number, number] (x and y coordinate)
	EntityAdded = 23, // data: Entity
	EntityRemoved = 24, // data: Entity
	EntityModified = 25, // data: Entity

	LevelComplete = 40 // data: Protagonist
}

export type TurnEventTypeDeaths = TurnEventType.EntityKilled| TurnEventType.EntityDrowned;

export class TurnEventTypeUtils {
	public static readonly all: readonly TurnEventType[] = Object.keys(TurnEventType)
		.map(parseFloat)
		.filter(key => !isNaN(key));
}
