export default class Input {
	private heldKeys: Map<string, boolean> = new Map();

	constructor() {
		window.addEventListener('keydown', this.handleKeyDown.bind(this));
		window.addEventListener('keyup', this.handleKeyUp.bind(this));
	}

	private handleKeyDown(event: KeyboardEvent): void {
		event.preventDefault();
		const key = event.key;
		if (this.heldKeys.has(key)) return;
		this.heldKeys.set(key, true);
	}

	private handleKeyUp(event: KeyboardEvent): void {
		event.preventDefault();
		const key = event.key;
		if (!this.heldKeys.has(key)) return;
		this.heldKeys.delete(key);
	}

	public isKeyHeld(key: string): boolean {
		return this.heldKeys.has(key);
	}

	public reset(): void {
		this.heldKeys.clear();
	}
}
