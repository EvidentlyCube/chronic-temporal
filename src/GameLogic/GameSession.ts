import {Level} from "./Level";
import {TurnRunner} from "./TurnRunner";
import {EventStore} from "./EventStore";

export class GameSession {
	// @todo we need to somehow store the existing temporal recordings
	public level: Level|undefined;
	public turnRunner: TurnRunner;
	public eventStore: EventStore;

	constructor() {
		this.turnRunner = new TurnRunner(this);
		this.eventStore = new EventStore(this);
	}

	public loadLevel(level: Level): void {
		// @todo If a level is loaded destroy it
		// @todo Put the temporal recordings in the room
	}

	// @todo we'll need some kind of enum here instead
	public update(playerInput: any): void {
		// @todo figure out if we pass the input to TurnRunner and it knows which entity is the protagonist or we set the next move on the protagonist here, then just run the turn
		this.turnRunner.update(playerInput);
	}
}