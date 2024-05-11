import Input from './Input';
import Renderer, { type Camera } from './Renderer';
import Shape from './Shape';

/**
 * Engine states enum
 */
enum EngineState {
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
export default abstract class Engine {
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
		position: [0, 0, 0],
		lookDirection: [0, 0, 1],
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
		this.renderer = new Renderer(canvas, this.camera);
		this.input = new Input();

		this.start()
			.catch((error) => {
				this.state = EngineState.failed;
				this.onfail(error);
			})
			.then(() => {
				this.state = EngineState.ready;
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
		cancelAnimationFrame(this.animationframeId);
	}

	/**
	 * Gives current engine state
	 * - 0 : starting
	 * - 1 : preparing
	 * - 2 : ready
	 * - 3 : running
	 * - 4 : stopped
	 * - 5 : failed
	 * @returns Engine state code
	 */
	public getState(): EngineState {
		return this.state;
	}
}
