import Input from './Input';
import Renderer, { type Camera } from './Renderer';
import Shape from './Shape';

enum EngineState {
	'starting',
	'preparing',
	'ready',
	'running',
	'failed',
	'stopped'
}

export default abstract class Engine {
	// Modules
	protected readonly renderer: Renderer;
	protected readonly input: Input;

	// Private
	private readonly timeTresholdInMs: number = 60 / 1000;
	private previousTime: number = 0;
	private state: EngineState = EngineState.starting;
	private animationframeId: number | null = null;

	// Protected
	protected shapes: Shape[] = [];
	protected camera: Camera = {
		position: [0, 0, 0],
		lookDirection: [0, 0, 1],
		yaw: 0
	};

	// Public
	public onready: (self: this) => any = () => {};
	public onfail: (error: any) => any = () => {};

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
	protected abstract start(): Promise<void>;
	protected abstract update(deltaTime: number): void;

	// Private methods
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
	public run(): void {
		if (this.state !== EngineState.ready) {
			throw new Error('Cannot run engine when it is not in "ready" state');
		}
		this.state = EngineState.running;
		this.animationframeId = requestAnimationFrame(this.gameLoop.bind(this));
	}

	public stop() {
		if (this.state !== EngineState.running) {
			throw new Error('Cannot stop engine when it is not in "running" state');
		}
		if (this.animationframeId === null) return;
		cancelAnimationFrame(this.animationframeId);
	}

	public getState(): EngineState {
		return this.state;
	}
}
