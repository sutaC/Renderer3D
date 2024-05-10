import Engine from './Engine/Engine';
import Shape, { type ShapeNames } from './Engine/Shape';
import { type Vector } from './Engine/Vector';
import * as vec from './Engine/Vector';

export default class ShowcaseGame extends Engine {
	// Private
	private updateListeners: Function[] = [];
	private shp: Shape;

	// Public
	public rotate: boolean = true;

	constructor(canvas: HTMLCanvasElement) {
		super(canvas);
		// Start
		this.shp = Shape.createShape('cube', 100);
		this.shapes.push(this.shp);
	}

	protected update(deltaTime: number): void {
		// Input handling
		const move = 8 * deltaTime;
		const moveVector: Vector = vec.vectorMultiply(this.camera.lookDirection, 8 * deltaTime);
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

		// Rotation
		if (this.rotate) {
			const rotation = 60 * deltaTime;
			this.shp.rotation.x += rotation;
			this.shp.rotation.y += rotation;
			this.shp.rotation.z += rotation;
			if (this.shp.rotation.x >= 360 || this.shp.rotation.x <= -360) this.shp.rotation.x %= 360;
			if (this.shp.rotation.y >= 360 || this.shp.rotation.y <= -360) this.shp.rotation.y %= 360;
			if (this.shp.rotation.z >= 360 || this.shp.rotation.z <= -360) this.shp.rotation.z %= 360;
		}

		// Update listeners
		for (const listener of this.updateListeners) {
			listener();
		}

		// Shape reload
		this.shapes[0] = this.shp;
	}

	// Exposed controll
	public readonly shapeController = {
		loadType: (name: ShapeNames): void => {
			this.shp = Shape.createShape(name, 0, this.shp);
		},
		loadFile: (file: File): void => {
			(async () => {
				this.shp = await Shape.createShapeFromObjFile(file, this.shp);
			})();
		},
		setSize: (size: number): void => {
			if (size < 0) {
				console.error('Size should be a positive number');
				return;
			}
			this.shp.size = size;
		},
		setOrigin: (origin: { x: number; y: number; z: number }): void => {
			this.shp.origin = origin;
		},
		setColor: (hex: string): void => {
			this.shp.setColor(hex);
		},
		setRotation: (rotation: { x: number; y: number; z: number }): void => {
			this.shp.rotation = rotation;
			if (this.shp.rotation.x >= 360 || this.shp.rotation.x <= -360) this.shp.rotation.x %= 360;
			if (this.shp.rotation.y >= 360 || this.shp.rotation.y <= -360) this.shp.rotation.y %= 360;
			if (this.shp.rotation.z >= 360 || this.shp.rotation.z <= -360) this.shp.rotation.z %= 360;
		},
		getOrigin: (): { x: number; y: number; z: number } => {
			return this.shp.origin;
		},
		getRotation: (): { x: number; y: number; z: number } => {
			return this.shp.rotation;
		}
	};

	public addUpdateListener(fn: Function): void {
		this.updateListeners.push(fn);
	}
}
