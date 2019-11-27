import {PlayerAction} from "../Enums";

export class ActionSequence {
    private _actionSequence: PlayerAction[];
    private _step: number = 0;

	constructor(actionSequence: PlayerAction[] = [])
	{
		this._actionSequence = actionSequence;
    }
    
    public push(action: PlayerAction): void {
		this._actionSequence.push(action);
    }
    
    public getNext(): PlayerAction {
        if (this._step == this._actionSequence.length - 1) {
            return undefined;
        }
        let output = this._actionSequence[this._step];
        this._step++;
        return output;
    }
}
