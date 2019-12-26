export enum TurnEventType {
	EntityKilled = 1,
	EntityDrowned = 2,
}

export type TurnEventTypeDeaths = TurnEventType.EntityKilled| TurnEventType.EntityDrowned;

export class TurnEventTypeUtils {
	public static readonly all: readonly TurnEventType[] = [
		TurnEventType.EntityKilled,
		TurnEventType.EntityDrowned,
	];
}
