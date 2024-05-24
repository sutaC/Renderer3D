import { Input } from './Input';
import { Renderer, type Camera, type GraphicsOptions, type RendererDebugOptions } from './Renderer';
import { Shape } from './Shape';
import { vector } from './Vector';

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
 * Engine options
 * @prop {boolean} logging - Loggs engine state
 * @prop {number} fpsLimit - Engine FPS limit (if set to 0 limit is not taken into account)
 */
export type EngineOptions = {
	logging: boolean;
	fpsLimit: number;
};

/**
 * Engine options
 */
export type Options = {
	engine: EngineOptions;
	renderer: RendererDebugOptions;
	graphics: GraphicsOptions;
};

/**
 * Keys for storing data in local storage
 */
enum StorageKeys {
	'options' = 'opt'
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
	/**
	 * Time since last fps update (ms)
	 */
	private fpsTime: number = 0;
	/**
	 * Engines frames count
	 */
	private fpsCount: number = 0;
	/**
	 * Engines frames per second
	 */
	private fps: number = 0;

	// Protected
	/**
	 * Shapes that are drawn
	 */
	protected shapes: Shape[] = [];
	/**
	 * Camera object for player position
	 */
	protected camera: Camera = {
		position: vector({ x: 0, y: 0, z: 0 }),
		lookDirection: vector({ x: 0, y: 0, z: 1 }),
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
	 * Engine debug options
	 */
	private readonly engineOptions: EngineOptions = {
		logging: false,
		fpsLimit: 0
	};

	/**
	 * @param canvas Canvas used to show graphics
	 */
	constructor(canvas: HTMLCanvasElement) {
		this.renderer = new Renderer(canvas, this.camera);
		this.input = new Input();

		// Options
		this.updateOptions();

		// Debug
		if (this.engineOptions.logging)
			console.log('%cEngine is loading...', 'color: yellow; font-weight: bold;');

		this.start()
			.catch((error) => {
				this.state = EngineState.failed;
				if (this.engineOptions.logging)
					console.log('%cEngine encountered an error', 'color: red; font-weight: bold;');
				this.onfail(error);
			})
			.then(() => {
				this.state = EngineState.ready;
				if (this.engineOptions.logging)
					console.log('%cEngine is ready!', 'color: greenyellow; font-weight: bold;');
				this.onready(this);
			});
	}

	// Static
	/**
	 * Loads engine options from local storage
	 */
	public static loadOptions(): Options | null {
		const json = localStorage.getItem(StorageKeys.options) || 'null';
		return JSON.parse(json) as Options | null;
	}

	/**
	 * Saves engine options in local storage
	 * @param options Engine options to save
	 */
	public static saveOptions(options: Options): void {
		const json = JSON.stringify(options);
		localStorage.setItem(StorageKeys.options, json);
	}

	/**
	 * Generates default engine options
	 * @returns Default engine options
	 */
	public static defaultOptions(): Options {
		return {
			engine: {
				logging: false,
				fpsLimit: 0
			},
			renderer: {
				clipping: false,
				points: false,
				wireframe: false
			},
			graphics: {
				fov: 10
			}
		};
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
		if (this.engineOptions.fpsLimit > 0)
			if (deltaTimeInMs < Math.round(1000 / this.engineOptions.fpsLimit)) {
				this.animationframeId = requestAnimationFrame(this.gameLoop.bind(this));
				return;
			}
		this.previousTime = currentTime;
		const deltaTimeInS = deltaTimeInMs / 1000;

		// FPS
		this.fpsCount++;
		this.fpsTime += deltaTimeInMs;
		if (this.fpsTime >= 1000) {
			this.fps = this.fpsCount;
			this.fpsTime = 0;
			this.fpsCount = 0;
		}

		// Engine error handling
		try {
			// Update
			this.update(deltaTimeInS);

			// Rendering
			this.renderer.clear();
			for (const shape of this.shapes) this.renderer.drawShape(shape);
		} catch (error) {
			this.stop();
			this.state = EngineState.failed;
			if (this.engineOptions.logging)
				console.log('%cEngine encountered an error', 'color: red; font-weight: bold;');
			this.onfail(error);
			return;
		}

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
		if (this.engineOptions.logging)
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
		if (this.engineOptions.logging)
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
	 * Updates engine options
	 */
	public updateOptions(): void {
		const opt = Engine.loadOptions();
		const def = Engine.defaultOptions();
		// Loads options
		this.engineOptions.logging = opt?.engine?.logging || def.engine.logging;
		this.engineOptions.fpsLimit = opt?.engine?.fpsLimit || def.engine.fpsLimit;
		this.renderer.debugOptions.clipping = opt?.renderer?.clipping || def.renderer.clipping;
		this.renderer.debugOptions.points = opt?.renderer?.points || def.renderer.points;
		this.renderer.debugOptions.wireframe = opt?.renderer?.wireframe || def.renderer.wireframe;
		this.renderer.graphicsOptions.fov = opt?.graphics?.fov || def.graphics.fov;
	}

	/**
	 * Engine frames per second (value is updated once per seckond)
	 * @returns FPS
	 */
	public getFPS() {
		return this.fps;
	}
}
