import { Engine } from './Engine/Engine';
import { Shape, type ShapeNames } from './Engine/Shape';

export class Showcase extends Engine {
	// Private
	private updateListeners: Function[] = [];
	private shp: Shape = new Shape();

	// Public
	public rotate: {
		x: boolean;
		y: boolean;
		z: boolean;
	} = {
		x: true,
		y: true,
		z: true
	};

	constructor(canvas: HTMLCanvasElement) {
		super(canvas);
	}

	protected async start(): Promise<void> {
		this.shp = await Shape.loadShape('/sample-objects/cube.obj');
		this.shp.origin.z = 10;
		this.shapes = [this.shp];
	}

	protected update(deltaTime: number): void {
		// Rotation
		if (this.rotate.x || this.rotate.y || this.rotate.z) {
			const rotation = 60 * deltaTime;
			if (this.rotate.x) {
				this.shp.rotation.x += rotation;
				this.shp.rotation.x %= 360;
			}
			if (this.rotate.y) {
				this.shp.rotation.y += rotation;
				this.shp.rotation.y %= 360;
			}
			if (this.rotate.z) {
				this.shp.rotation.z += rotation;
				this.shp.rotation.z %= 360;
			}
		}

		// Update listeners
		for (const listener of this.updateListeners) {
			listener();
		}

		// Shape reload
		this.shapes = [this.shp];
	}

	// Exposed controll
	public readonly shapeController = {
		unsetShape: (): void => {
			const nshp = new Shape();
			Shape.copyShapeParams(nshp, this.shp);
			this.shp = nshp;
		},
		loadType: async (name: ShapeNames): Promise<void> => {
			const nshp = await Shape.loadShape(`/sample-objects/${name}.obj`);
			Shape.copyShapeParams(nshp, this.shp);
			this.shp = nshp;
		},
		loadFile: async (file: File): Promise<void> => {
			const nshp = await Shape.createShapeFromObjFile(file);
			Shape.copyShapeParams(nshp, this.shp);
			this.shp = nshp;
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
