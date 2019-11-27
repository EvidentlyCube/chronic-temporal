import {PlayerAction} from "./Enums";
import {ActionSequence} from "./DataStructures/ActionSequence";

export class ActionRecorder {
    private _actionSequence: ActionSequence;

    public record(playerInput: PlayerAction): void {
        this._actionSequence.push(playerInput);
    }

    public end(): ActionSequence {
        let savedRecording = this._actionSequence;
        this._actionSequence = new ActionSequence();
        return savedRecording;
    }
}
