import Renderer from './Renderer';
import Shape, { type ShapeNames } from './Shape';

export default class Engine {
	private readonly renderer: Renderer;

	private shp: Shape;
	private listeners: Function[] = [];

	public rotate: boolean = true;

	constructor(canvas: HTMLCanvasElement) {
		this.renderer = new Renderer(canvas);

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
		setOriginZ: (pos: number): void => {
			this.shp.originZ = pos;
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
		getRotation: (): { x: number; y: number; z: number } => {
			return this.shp.rotation;
		}
	};

	public addListener(fn: Function): void {
		this.listeners.push(fn);
	}
}
