import { Engine } from './Engine/Engine';
import * as vec from '$lib/Engine/Vector';
import { Shape } from './Engine/Shape';

export class Game extends Engine {
	constructor(canvas: HTMLCanvasElement) {
		super(canvas);
	}

	protected async start(): Promise<void> {
		// Graphics
		const shp = await Shape.loadShape('/objects/mountains.obj');
		shp.setColor('#79e07b');
		shp.origin.z = -1000;
		shp.origin.y = -1000;
		this.shapes.push(shp);
		// Input
		this.input.addPreventKey('w');
		this.input.addPreventKey('s');
		this.input.addPreventKey('a');
		this.input.addPreventKey('d');
		this.input.addPreventKey('ArrowUp');
		this.input.addPreventKey('ArrowDown');
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
			this.camera.yaw += rotation;
			this.camera.yaw %= 360;
		}
		if (this.input.isKeyHeld('d')) {
			// Look right
			this.camera.yaw -= rotation;
			this.camera.yaw %= 360;
		}
		if (this.input.isKeyHeld('ArrowUp')) {
			// Move up
			this.camera.position.y += move;
		}
		if (this.input.isKeyHeld('ArrowDown')) {
			// Move down
			this.camera.position.y -= move;
		}
	}
}
