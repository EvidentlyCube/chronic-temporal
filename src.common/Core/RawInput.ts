export class RawInput
{
	private _lastMouseX: number;
	private _lastMouseY: number;
	private _keysDown: string[];
	private _keysPressed: string[];
	private _keysReleased: string[];
	private _mouseButtonsDown: number[];
	private _mouseButtonsPressed: number[];
	private _mouseButtonsReleased: number[];
	private _isCtrlDown: boolean;
	private _isShiftDown: boolean;
	private _isAltDown: boolean;
	private _lastKeyPressed: string;
	private _keyString: string;

	public gameOffsetX: number = 0;
	public gameOffsetY: number = 0;
	public gameScaleX: number = 1;
	public gameScaleY: number = 1;

	get rawMouseX(): number
	{
		return this._lastMouseX;
	}

	get rawMouseY(): number
	{
		return this._lastMouseY;
	}

	get localMouseX(): number
	{
		return (this.rawMouseX - this.gameOffsetX) / this.gameScaleX;
	}

	get localMouseY(): number
	{
		return (this.rawMouseY - this.gameOffsetY) / this.gameScaleY;
	}

	get isCtrlDown(): boolean
	{
		return this._isCtrlDown;
	}

	get isShiftDown(): boolean
	{
		return this._isShiftDown;
	}

	get isAltDown(): boolean
	{
		return this._isAltDown;
	}

	public isKeyDown = (key: string): boolean => this._keysDown.indexOf(key) !== -1;
	public isKeyPressed = (key: string): boolean => this._keysPressed.indexOf(key) !== -1;
	public isKeyReleased = (key: string): boolean => this._keysReleased.indexOf(key) !== -1;

	public isMouseDown = (button: number): boolean => this._mouseButtonsDown.indexOf(button) !== -1;
	public isMousePressed = (button: number): boolean => this._mouseButtonsPressed.indexOf(button) !== -1;
	public isMouseReleased = (button: number): boolean => this._mouseButtonsReleased.indexOf(button) !== -1;

	constructor(document: Document)
	{
		this._lastMouseX = 0;
		this._lastMouseY = 0;

		this._isCtrlDown = false;
		this._isAltDown = false;
		this._isShiftDown = false;

		this._keysReleased = [];
		this._keysPressed = [];
		this._keysDown = [];
		this._mouseButtonsDown = [];
		this._mouseButtonsReleased = [];
		this._mouseButtonsPressed = [];
		this._keyString = "";
		this._lastKeyPressed = "";

		document.addEventListener("mousemove", this.handleMouseEvent);
		document.addEventListener("mousedown", this.handleMouseEvent);
		document.addEventListener("mouseup", this.handleMouseEvent);
		document.addEventListener("keydown", this.handleKeyboardEvent);
		document.addEventListener("keyup", this.handleKeyboardEvent);
	}

	public update = (): void =>
	{
		this._keysReleased = this._keysPressed;
		this._keysPressed = [];
		this._mouseButtonsReleased = this._mouseButtonsPressed;
		this._mouseButtonsPressed = [];
	};

	public flushAll = (): void =>
	{
		this.flushKeyboard();
		this.flushMouse();
	};

	public flushKeyboard = (): void =>
	{
		this._keysPressed.length = 0;
		this._keysReleased.length = 0;
		this._keysDown.length = 0;
	};

	public flushMouse = (): void =>
	{
		this._mouseButtonsPressed.length = 0;
		this._mouseButtonsReleased.length = 0;
		this._mouseButtonsDown.length = 0;
	};

	private handleMouseEvent = (event: MouseEvent): void =>
	{
		this._isAltDown = event.altKey;
		this._isCtrlDown = event.ctrlKey;
		this._isShiftDown = event.shiftKey;

		this._lastMouseX = event.pageX;
		this._lastMouseY = event.pageY;

		if (event.type === 'mouseup') {
			this._mouseButtonsDown = this._mouseButtonsDown.filter(button => button !== event.button);

		} else if (event.type === 'mousedown') {
			this._mouseButtonsDown.push(event.button);
			this._mouseButtonsPressed.push(event.button);
		}
	};

	private handleKeyboardEvent = (event: KeyboardEvent): void =>
	{
		this._isAltDown = event.altKey;
		this._isCtrlDown = event.ctrlKey;
		this._isShiftDown = event.shiftKey;

		if (event.type === 'keydown') {
			this._lastKeyPressed = event.key;
			this._keysPressed.push(event.key);
			this._keysDown.push(event.key);

		} else if (event.type === 'keyup') {
			this._keysDown = this._keysDown.filter(key => key !== event.key);
		}

		event.preventDefault();
	};
}