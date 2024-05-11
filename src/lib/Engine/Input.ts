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
	 */
	private handleKeyDown(event: KeyboardEvent): void {
		const key = event.key;
		if (this.heldKeys.has(key)) return;
		this.heldKeys.set(key, true);
	}

	/**
	 * Removes given key from held keys map
	 */
	private handleKeyUp(event: KeyboardEvent): void {
		const key = event.key;
		if (!this.heldKeys.has(key)) return;
		this.heldKeys.delete(key);
	}

	/**
	 * Returns true if given key is currently held
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
