import Input from './Input';
import Renderer, { type Camera } from './Renderer';
import Shape from './Shape';

export default abstract class Engine {
	// Modules
	protected readonly renderer: Renderer;
	protected readonly input: Input;

	// Private
	private readonly timeTresholdInMs: number = 60 / 1000;
	private previousTime: number = 0;
	private isRunning: boolean = false;

	// Protected
	protected shapes: Shape[] = [];
	protected camera: Camera = {
		position: [0, 0, 0],
		lookDirection: [0, 0, 1],
		yaw: 0
	};

	constructor(canvas: HTMLCanvasElement) {
		this.renderer = new Renderer(canvas, this.camera);
		this.input = new Input();
	}

	// Abstract methods
	protected abstract update(deltaTime: number): void;

	// Private methods
	private gameLoop(currentTime: number): void {
		// Time elapsed
		const deltaTimeInMs = currentTime - this.previousTime;
		if (deltaTimeInMs < this.timeTresholdInMs) {
			requestAnimationFrame(this.gameLoop.bind(this));
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
		requestAnimationFrame(this.gameLoop.bind(this));
	}

	// Public methods
	public run(): void {
		if (this.isRunning) {
			console.warn('Tried to run game engine when it was already running');
			return;
		}
		this.isRunning = true;
		requestAnimationFrame(this.gameLoop.bind(this));
	}
}
