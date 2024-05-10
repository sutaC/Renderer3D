import Engine from './Engine/Engine';
import * as vec from '$lib/Engine/Vector';
import Shape from './Engine/Shape';

export default class Game extends Engine {
	constructor(canvas: HTMLCanvasElement) {
		super(canvas);
	}

	protected async start(): Promise<void> {
		const shp = await Shape.loadShape('/sample-objects/teapot.obj');
		shp.setColor('#FFFF00');
		shp.origin.z = 2000;
		this.shapes.push(shp);
	}

	protected update(deltaTime: number): void {
		// Input handling
		const move = 8 * deltaTime;
		const moveVector = vec.vectorMultiply(this.camera.lookDirection, 8 * deltaTime);
		if (this.input.isKeyHeld('w')) {
			// Move forward
			this.camera.position = vec.vectorAdd(this.camera.position, moveVector);
		}
		if (this.input.isKeyHeld('s')) {
			// Move backward
			this.camera.position = vec.vectorSubtract(this.camera.position, moveVector);
		}
		if (this.input.isKeyHeld('q')) {
			// Look left
			this.camera.yaw -= 1;
		}
		if (this.input.isKeyHeld('e')) {
			// Look right
			this.camera.yaw += 1;
		}
		if (this.input.isKeyHeld('a')) {
			// Move left
			this.camera.position[0] -= move;
		}
		if (this.input.isKeyHeld('d')) {
			// Move right
			this.camera.position[0] += move;
		}
		if (this.input.isKeyHeld('Shift')) {
			// Move up
			this.camera.position[1] += move;
		}
		if (this.input.isKeyHeld('Control')) {
			// Move down
			this.camera.position[1] -= move;
		}
	}
}
