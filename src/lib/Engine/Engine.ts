import { Input } from './Input';
import { Renderer, type Camera } from './Renderer';
import { Shape } from './Shape';

/**
 * Engine states enum
 */
export enum EngineState {
	'starting',
	'preparing',
	'ready',
	'running',
	'stopped',
	'failed'
}

/**
 * Engine abstract class to build more specialized engines
 */
export abstract class Engine {
	// Modules
	/**
	 * Engines renderer module for handling graphics
	 */
	protected readonly renderer: Renderer;
	/**
	 * Engines input module for handling user input
	 */
	protected readonly input: Input;

	// Private
	/**
	 * Engine debug options
	 * @prop {boolean} logging - Loggs engine state
	 */
	private debugOptions: { logging: boolean } = {
		logging: false
	};
	/**
	 * Time treshold for rendering one frame (ms) [readonly]
	 */
	private readonly timeTresholdInMs: number = 60 / 1000;
	/**
	 * Last time the update was performed (ms)
	 */
	private previousTime: number = 0;
	/**
	 * Current engine state
	 */
	private state: EngineState = EngineState.starting;
	/**
	 * Current animationframe id for canceling the animation
	 */
	private animationframeId: number | null = null;

	// Protected
	/**
	 * Shapes that are drawn
	 */
	protected shapes: Shape[] = [];
	/**
	 * Camera object for player position
	 */
	protected camera: Camera = {
		position: { x: 0, y: 0, z: 0 },
		lookDirection: { x: 0, y: 0, z: 1 },
		yaw: 0
	};

	// Public
	/**
	 * Function which is fired when engine is in ready state [to override]
	 * @param self This engine object
	 */
	public onready: (self: this) => any = () => {};
	/**
	 * Function which is fired when engine fails at preparation step [to override]
	 * @param error Caught error
	 */
	public onfail: (error: any) => any = () => {};

	/**
	 * @param canvas Canvas used to show graphics
	 */
	constructor(canvas: HTMLCanvasElement) {
		if (this.debugOptions.logging)
			console.log('%cEngine is loading...', 'color: yellow; font-weight: bold;');

		this.renderer = new Renderer(canvas, this.camera);
		this.input = new Input();

		this.start()
			.catch((error) => {
				this.state = EngineState.failed;
				if (this.debugOptions.logging)
					console.log('%cEngine encountered an error', 'color: red; font-weight: bold;');
				this.onfail(error);
			})
			.then(() => {
				this.state = EngineState.ready;
				if (this.debugOptions.logging)
					console.log('%cEngine is ready!', 'color: greenyellow; font-weight: bold;');
				this.onready(this);
			});
	}

	// Abstract methods
	/**
	 * Method which is fired on engine start
	 */
	protected abstract start(): Promise<void>;
	/**
	 * Method which is fired on every engine udpate
	 * @param deltaTime Time between last update and this update (s)
	 */
	protected abstract update(deltaTime: number): void;

	// Private methods
	/**
	 * Game loop method which is running game
	 * @param currentTime Time of this update (ms)
	 */
	private gameLoop(currentTime: number): void {
		// Time elapsed
		const deltaTimeInMs = currentTime - this.previousTime;
		if (deltaTimeInMs < this.timeTresholdInMs) {
			this.animationframeId = requestAnimationFrame(this.gameLoop.bind(this));
			return;
		}
		this.previousTime = currentTime;
		const deltaTimeInS = deltaTimeInMs / 1000;

		// Update
		this.update(deltaTimeInS);

		// Rendering
		this.renderer.clear();
		for (const shape of this.shapes) this.renderer.drawShape(shape);

		// Recall
		this.animationframeId = requestAnimationFrame(this.gameLoop.bind(this));
	}

	// Public methods
	/**
	 * Runs engine when it is in "ready" or "stoped" state
	 */
	public run(): void {
		if (this.state !== EngineState.ready && this.state !== EngineState.stopped) {
			throw new Error('Cannot run engine when it is not in "ready" or "stopped" state');
		}
		this.state = EngineState.running;
		if (this.debugOptions.logging)
			console.log('%cEngine is running!', 'color: green; font-weight: bold;');
		this.animationframeId = requestAnimationFrame(this.gameLoop.bind(this));
	}

	/**
	 * Stops engine when it is in "running" state
	 */
	public stop() {
		if (this.state !== EngineState.running) {
			throw new Error('Cannot stop engine when it is not in "running" state');
		}
		if (this.animationframeId === null) return;
		if (this.debugOptions.logging)
			console.log('%cEngine is stopped!', 'color: orange; font-weight: bold;');
		cancelAnimationFrame(this.animationframeId);
	}

	/**
	 * Gives current engine state
	 * @returns Engine state code
	 */
	public getState(): EngineState {
		return this.state;
	}

	/**
	 * Adds button as alternative to holding keyboard key
	 * @param button Alternative to key button
	 * @param key Key that the button represents
	 */
	public addAlternativeButton(button: HTMLButtonElement, key: string): void {
		this.input.addAlternativeButton(button, key);
	}

	/**
	 * Sets engine debug option
	 * @param option Debug option
	 * @param value New value of option
	 */
	public setDebugOption(option: 'wireframe' | 'clipping' | 'logging', value: boolean): void {
		switch (option) {
			case 'wireframe':
				this.renderer.debugOptions.wireframe = value;
				break;
			case 'clipping':
				this.renderer.debugOptions.wireframe = value;
				break;
			case 'logging':
				this.debugOptions.logging = value;
				break;
		}
	}
}
