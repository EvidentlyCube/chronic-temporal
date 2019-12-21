import {PlayerAction} from '../Enums';

export class ActionSequence {
	private readonly _actionSequence: PlayerAction[];

	private _position = 0;

	public get length(): number {
		return this._actionSequence.length;
	}

	public get position(): number {
		return this._position;
	}

	public get actions(): readonly PlayerAction [] {
		return this._actionSequence;
	}

	constructor(actionSequence: PlayerAction[] = [], position = 0) {
		this._actionSequence = Array.from(actionSequence);
		this._position = position;
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

	public peek(): PlayerAction | undefined {
		return this._actionSequence[this._position];
	}

	public copy(): ActionSequence {
		return new ActionSequence(this._actionSequence, this._position);
	}

	public reset(): void {
		this._position = 0;
	}
}
