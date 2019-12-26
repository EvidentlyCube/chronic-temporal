import {Level} from './Level';
import {TurnRunner} from './TurnRunner';
import {EventStore} from './EventStore';
import {PlayerAction} from './Enums/PlayerAction';
import {Protagonist} from './Entities/Protagonist';
import {ActionRecorder} from './ActionRecorder';
import {ActionSequence} from './DataStructures/ActionSequence';
import {TurnState} from './TurnState';

export interface GameSessionConfig {
	recordings?: ActionSequence[];
}

export class GameSession {
	private readonly _levelBlueprint: Level;

	public level!: Level;

	public turnRunner: TurnRunner;

	public eventStore: EventStore;

	public actionRecorder: ActionRecorder;

	private readonly _recordings: ActionSequence[];

	constructor(levelBlueprint: Level, config: GameSessionConfig = {}) {
		this._levelBlueprint = levelBlueprint;

		this.turnRunner = new TurnRunner(this);
		this.eventStore = new EventStore(this);
		this.actionRecorder = new ActionRecorder();
		this._recordings = Array.from(config.recordings ?? []);

		this.resetLevel();
	}

	public get levelBlueprint(): Level {
		return this._levelBlueprint;
	}

	public registerRecording(actionSequence: ActionSequence): void {
		this._recordings.push(actionSequence);
	}

	public removeRecording(actionSequence: ActionSequence): void {
		const index = this._recordings.indexOf(actionSequence);
		if (index === -1) {
			throw new Error('Attempted to remove a recording that does not exist');
		}

		this._recordings.splice(index, 1);
	}

	public getRecordings(): readonly ActionSequence[] {
		return this._recordings;
	}

	public resetLevel(): void {
		if (this.level) {
			// @todo If a level is loaded destroy it
		}

		this.level = this.levelBlueprint.clone();
		this._recordings.forEach(recording => recording.reset());

		this._addProtagonist(true);
		this._recordings.forEach(recording => this._addProtagonist(false, recording));
	}

	public runTurn(playerInput: PlayerAction): TurnState {
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
		return this.turnRunner.runTurn(playerInput, this.level);
	}

	private _addProtagonist(isPlayerControlled: boolean, movesQueue: ActionSequence = new ActionSequence()): void {
		if (!this.level) {
			throw new Error('Tried to add a protagonist on a session that does not have a level attached');
		}
		const protagonist = new Protagonist(isPlayerControlled, movesQueue);
		protagonist.x = this.level.playerStartX;
		protagonist.y = this.level.playerStartY;
		protagonist.prevX = this.level.playerStartX;
		protagonist.prevY = this.level.playerStartY;
		this.level.entities.addEntity(protagonist);
	}
}
