import {Level} from './Level';
import {TurnRunner} from './TurnRunner';
import {EventStore} from './EventStore';
import {PlayerAction} from './Enums';
import {Protagonist} from './Entities/Protagonist';
import {ActionRecorder} from './ActionRecorder';

export class GameSession {
	// @todo we need to somehow store the existing temporal recordings
	public level: Level | undefined;

	public turnRunner: TurnRunner;

	public eventStore: EventStore;

	public actionRecorder: ActionRecorder;

	constructor() {
		this.turnRunner = new TurnRunner(this);
		this.eventStore = new EventStore(this);
		this.actionRecorder = new ActionRecorder();
	}

	public loadLevel(level: Level): void {
		if (this.level) {
			// @todo If a level is loaded destroy it
		}

		this.level = level;

		const player = new Protagonist(true);
		player.x = level.playerStartX;
		player.y = level.playerStartY;
		this.level.entities.push(player);

		// @todo Put the temporal recordings in the room
	}

	public runTurn(playerInput: PlayerAction): void {
		if (!this.level) {
			throw new Error('Tried to runTurn on a session that does not have a level attached');
		}

		if (this.level.entities.getPlayer()) {
			this.actionRecorder.record(playerInput);
		}

		/*
			@todo figure out if we pass the input to TurnRunner and it knows which entity is the protagonist or we set the
				  next move on the protagonist here, then just run the turn
		 */
		this.turnRunner.runTurn(playerInput, this.level);
	}
}
