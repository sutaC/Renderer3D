import Renderer, { type Camera } from './Renderer';
import Shape, { type ShapeNames } from './Shape';
import type { Vector } from './Vector';
import * as vec from './Vector';

export default class Engine {
	private readonly renderer: Renderer;

	private shp: Shape;
	private listeners: Function[] = [];

	public rotate: boolean = true;

	public camera: Camera = {
		position: [0, 0, 0],
		lookDirection: [0, 0, 1],
		yaw: 0
	};

	constructor(canvas: HTMLCanvasElement) {
		this.renderer = new Renderer(canvas, this.camera);

		// start

		this.shp = Shape.createShape('cube', 100);
	}

	public run(): void {
		this.renderer.clear();

		// update

		if (this.rotate) {
			this.shp.rotation.x += 1;
			this.shp.rotation.y += 1;
			this.shp.rotation.z += 1;
			if (this.shp.rotation.x >= 360 || this.shp.rotation.x <= -360) this.shp.rotation.x %= 360;
			if (this.shp.rotation.y >= 360 || this.shp.rotation.y <= -360) this.shp.rotation.y %= 360;
			if (this.shp.rotation.z >= 360 || this.shp.rotation.z <= -360) this.shp.rotation.z %= 360;
		}

		// draw

		this.renderer.drawShape(this.shp);

		// listeners

		for (const listener of this.listeners) {
			listener();
		}

		// recall

		setTimeout(this.run.bind(this), 1000 / 60);
	}

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

	public addListener(fn: Function): void {
		this.listeners.push(fn);
	}

	// Getters / Setters

	public get cameraPosition() {
		return this.camera.position;
	}

	public get yaw() {
		return this.camera.yaw;
	}

	public set yaw(yaw: number) {
		this.camera.yaw = yaw;
	}

	// Move

	public moveForward(): void {
		const move: Vector = vec.vectorMultiply(this.camera.lookDirection, 0.1);
		this.camera.position = vec.vectorAdd(this.camera.position, move);
	}

	public moveBackward(): void {
		const move: Vector = vec.vectorMultiply(this.camera.lookDirection, 0.1);
		this.camera.position = vec.vectorSubtract(this.camera.position, move);
	}
}
