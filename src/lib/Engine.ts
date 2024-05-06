import Renderer from './Renderer';
import Shape, { type ShapeNames } from './Shape';

export default class Engine {
	private readonly renderer: Renderer;

	private shp: Shape;

	constructor(canvas: HTMLCanvasElement) {
		this.renderer = new Renderer(canvas);

		// start

		this.shp = Shape.createShape('cube', 100);
	}

	public run(): void {
		this.renderer.clear();

		// update

		this.shp.rotationX += 1;
		this.shp.rotationY += 1;
		this.shp.rotationZ += 1;

		// draw

		this.renderer.drawShape(this.shp);

		// recall

		setTimeout(this.run.bind(this), 1000 / 60);
	}

	public readonly shapeController = {
		type: (name: ShapeNames): void => {
			this.shp = Shape.createShape(name, 0, this.shp);
		},
		size: (size: number): void => {
			if (size < 0) {
				console.error('Size should be a positive number');
				return;
			}
			this.shp.size = size;
		},
		originZ: (pos: number): void => {
			this.shp.originZ = pos;
		},
		color: (hex: string): void => {
			this.shp.setColor(hex);
		}
	};
}
