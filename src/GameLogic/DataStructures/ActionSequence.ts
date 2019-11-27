import {PlayerAction} from '../Enums';

export class ActionSequence {
	private readonly _actionSequence: PlayerAction[];

	private _step = 0;

	constructor(actionSequence: PlayerAction[] = []) {
		this._actionSequence = Array.from(actionSequence);
	}

	public push(action: PlayerAction): void {
		this._actionSequence.push(action);
	}

	public getNext(): PlayerAction | undefined {
		if (this._step >= this._actionSequence.length) {
			return undefined;
		}
		return this._actionSequence[this._step++];
	}

	public get actions(): readonly PlayerAction [] {
		return this._actionSequence;
	}
}
