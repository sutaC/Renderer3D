import { Engine } from './Engine/Engine';
import * as vec from '$lib/Engine/Vector';
import { Shape } from './Engine/Shape';

export class Game extends Engine {
	constructor(canvas: HTMLCanvasElement) {
		super(canvas);
	}

	protected async start(): Promise<void> {
		const shp = await Shape.loadShape('/sample-objects/teapot.obj');
		shp.setColor('#FFFF00');
		shp.size = 10;
		shp.origin.z = 200;
		this.shapes.push(shp);
	}

	protected update(deltaTime: number): void {
		// Input handling
		const move = 8 * deltaTime;
		const rotation = 64 * deltaTime;
		const moveVector = vec.vectorMultiply(this.camera.lookDirection, 8 * deltaTime);
		if (this.input.isKeyHeld('w')) {
			// Move forward
			this.camera.position = vec.vectorAdd(this.camera.position, moveVector);
		}
		if (this.input.isKeyHeld('s')) {
			// Move backward
			this.camera.position = vec.vectorSubtract(this.camera.position, moveVector);
		}
		if (this.input.isKeyHeld('a')) {
			// Look left
			this.camera.yaw -= rotation;
		}
		if (this.input.isKeyHeld('d')) {
			// Look right
			this.camera.yaw += rotation;
		}
		if (this.input.isKeyHeld('Shift')) {
			// Move up
			this.camera.position.y += move;
		}
		if (this.input.isKeyHeld('Control')) {
			// Move down
			this.camera.position.y -= move;
		}
	}
}
