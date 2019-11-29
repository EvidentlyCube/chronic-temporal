import {Level} from './Level';
import {TurnRunner} from './TurnRunner';
import {EventStore} from './EventStore';
import {PlayerAction} from './Enums';
import {Protagonist} from './Entities/Protagonist';
import {ActionRecorder} from './ActionRecorder';
import {ActionSequence} from './DataStructures/ActionSequence';

export class GameSession {
	public level: Level | undefined;

	public turnRunner: TurnRunner;

	public eventStore: EventStore;

	public actionRecorder: ActionRecorder;

	public recordings: ActionSequence[];

	constructor() {
		this.turnRunner = new TurnRunner(this);
		this.eventStore = new EventStore(this);
		this.actionRecorder = new ActionRecorder();
		this.recordings = [];
	}

	public loadLevel(level: Level): void {
		if (this.level) {
			// @todo If a level is loaded destroy it
		}

		this.level = level;

		this._addProtagonist(true);
		this.recordings.forEach(recording => this._addProtagonist(false, recording));
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

	private _addProtagonist(isPlayerControlled: boolean, movesQueue: ActionSequence = new ActionSequence()): void {
		if (!this.level) {
			throw new Error('Tried to add a protagonist on a session that does not have a level attached');
		}
		const protagonist = new Protagonist(isPlayerControlled, movesQueue);
		protagonist.x = this.level.playerStartX;
		protagonist.y = this.level.playerStartY;
		this.level.entities.addEntity(protagonist);
	}
}
