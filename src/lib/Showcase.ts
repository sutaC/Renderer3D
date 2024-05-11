import Engine from './Engine/Engine';
import Shape, { type ShapeNames } from './Engine/Shape';

export default class Showcase extends Engine {
	// Private
	private updateListeners: Function[] = [];
	private shp: Shape = new Shape();

	// Public
	public rotate: boolean = true;

	constructor(canvas: HTMLCanvasElement) {
		super(canvas);
	}

	protected async start(): Promise<void> {
		this.shp = Shape.createShape('cube');
		this.shapes.push(this.shp);
	}

	protected update(deltaTime: number): void {
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
			this.shp = Shape.createShape(name, this.shp);
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
