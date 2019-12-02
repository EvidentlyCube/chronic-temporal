import {PlayerAction} from '../Enums';

export class ActionSequence {
	private readonly _actionSequence: PlayerAction[];

	private _position = 0;

	public get position(): number {
		return this._position;
	}

	public get actions(): readonly PlayerAction [] {
		return this._actionSequence;
	}

	constructor(actionSequence: PlayerAction[] = []) {
		this._actionSequence = Array.from(actionSequence);
	}

	public push(action: PlayerAction): void {
		this._actionSequence.push(action);
	}

	public getNext(): PlayerAction | undefined {
		if (this._position >= this._actionSequence.length) {
			return undefined;
		}
		return this._actionSequence[this._position++];
	}

	public copy(): ActionSequence {
		return new ActionSequence(this._actionSequence);
	}

	public reset(): void {
		this._position = 0;
	}
}
