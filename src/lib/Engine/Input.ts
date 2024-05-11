/**
 * Engine module for handling input
 */
export default class Input {
	/**
	 * Stores currently held keys
	 */
	private heldKeys: Map<string, boolean> = new Map();

	constructor() {
		window.addEventListener('keydown', this.handleKeyDown.bind(this));
		window.addEventListener('keyup', this.handleKeyUp.bind(this));
	}

	/**
	 * Adds given key to held keys map
	 * @param event Keydown event
	 */
	private handleKeyDown(event: KeyboardEvent): void {
		const key = event.key;
		if (this.heldKeys.has(key)) return;
		this.heldKeys.set(key, true);
	}

	/**
	 * Removes given key from held keys map
	 * @param event Keyup event
	 */
	private handleKeyUp(event: KeyboardEvent): void {
		const key = event.key;
		if (!this.heldKeys.has(key)) return;
		this.heldKeys.delete(key);
	}

	/**
	 * Determines whether the key is currently held
	 * @returns Whether or not a key is currently held
	 */
	public isKeyHeld(key: string): boolean {
		return this.heldKeys.has(key);
	}

	/**
	 * Removes all held keys from registy
	 */
	public reset(): void {
		this.heldKeys.clear();
	}
}
