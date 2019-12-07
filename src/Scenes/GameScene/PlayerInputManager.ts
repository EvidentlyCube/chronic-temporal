import {KeyboardInput} from 'evidently-input/dist/KeyboardInput';
import {MouseInput} from 'evidently-input/dist/MouseInput';

export class PlayerInputManager {
	private readonly _keyboard: KeyboardInput;

	private readonly _mouse: MouseInput;

	constructor(keyboard: KeyboardInput, mouse: MouseInput) {
		this._keyboard = keyboard;
		this._mouse = mouse;
	}

	public readonly actionMoveUpLeft = (): boolean => this._keyboard.isKeyPressed('7');

	public readonly actionMoveUp = (): boolean => this._keyboard.isKeyPressed('8');

	public readonly actionMoveUpRight = (): boolean => this._keyboard.isKeyPressed('9');

	public readonly actionMoveLeft = (): boolean => this._keyboard.isKeyPressed('4');

	public readonly actionMoveRight = (): boolean => this._keyboard.isKeyPressed('6');

	public readonly actionMoveDownLeft = (): boolean => this._keyboard.isKeyPressed('1');

	public readonly actionMoveDown = (): boolean => this._keyboard.isKeyPressed('2');

	public readonly actionMoveDownRight = (): boolean => this._keyboard.isKeyPressed('3');

	public readonly actionWait = (): boolean => this._keyboard.isKeyPressed('5');

	public readonly actionRestartAndRecord = (): boolean => this._keyboard.isKeyPressed('r');

	public readonly uiUp = (): boolean => this.actionMoveUp();

	public readonly uiDown = (): boolean => this.actionMoveDown();

	public readonly uiOk = (): boolean => this.actionWait();

	public readonly uiSwitchViews = (): boolean => this._keyboard.isKeyPressed('Tab');
}
