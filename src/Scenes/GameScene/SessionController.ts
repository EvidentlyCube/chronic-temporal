import {GameScene} from './GameScene';
import {PlayerAction} from '../../GameLogic/Enums';
import {GameSession} from '../../GameLogic/GameSession';
import {ActionSequence} from '../../GameLogic/DataStructures/ActionSequence';

export class SessionController {
	private readonly _gameScene: GameScene;

	private readonly _session: GameSession;

	constructor(gameScene: GameScene, session: GameSession) {
		this._gameScene = gameScene;
		this._session = session;
	}

	public executeAction(action: PlayerAction): void {
		this._session.runTurn(action);
	}

	public restartAndSaveRecording(): void {
		const player = this._session.level.entities.getPlayer();
		player && this._session.registerRecording(player.movesQueue.copy());
		this._session.resetLevel();
	}

	public restartAndRemoveRecording(recording: ActionSequence): void {
		this._session.removeRecording(recording);
		this._session.resetLevel();
	}

	public getRecordings(): readonly ActionSequence[] {
		return this._session.getRecordings();
	}
}