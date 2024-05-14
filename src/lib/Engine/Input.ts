/**
 * Engine module for handling input
 */
export class Input {
	/**
	 * Stores currently held keys
	 */
	private heldKeys: Map<string, boolean> = new Map();

	constructor() {
		window.addEventListener('keydown', (e) => this.addKey(e.key));
		window.addEventListener('keyup', (e) => this.deleteKey(e.key));
	}

	/**
	 * Addes key to currently held keys
	 * @param key Key to add
	 */
	private addKey(key: string): void {
		key = key.toLowerCase();
		if (this.heldKeys.has(key)) return;
		this.heldKeys.set(key, true);
	}

	/**
	 * Deletes key from currently held keys
	 * @param key Key to delete
	 */
	private deleteKey(key: string): void {
		key = key.toLowerCase();
		if (!this.heldKeys.has(key)) return;
		this.heldKeys.delete(key);
	}

	/**
	 * Adds button as alternative to holding keyboard key
	 * @param button Alternative to key button
	 * @param key Key that the button represents
	 */
	public addAlternativeButton(button: HTMLButtonElement, key: string): void {
		// Button down
		button.addEventListener('mousedown', () => this.addKey(key));
		button.addEventListener('touchstart', () => this.addKey(key));
		// Button up
		button.addEventListener('mouseup', () => this.deleteKey(key));
		button.addEventListener('mouseleave', () => this.deleteKey(key));
		button.addEventListener('touchend', () => this.deleteKey(key));
		button.addEventListener('touchcancel', () => this.deleteKey(key));
	}

	/**
	 * Determines whether the key is currently held
	 * @returns Whether or not a key is currently held
	 */
	public isKeyHeld(key: string): boolean {
		key = key.toLowerCase();
		return this.heldKeys.has(key);
	}

	/**
	 * Removes all held keys from registy
	 */
	public reset(): void {
		this.heldKeys.clear();
	}
}
