import cubeObj from './shapes/cube.json';
import prismObj from './shapes/prism.json';
import prismSqBObj from './shapes/prismSqB.json';

interface ShapeObject {
	name: string;
	points: number[][];
	triangles: number[][];
}

interface ColorObject {
	hex: string;
	r: number;
	g: number;
	b: number;
}

export type Point = [x: number, y: number, z: number];
export type Triangle = [aIdx: number, bIdx: number, cIdx: number];

export type ShapeNames = 'cube' | 'prism' | 'prismSqB';

export default class Shape {
	public readonly points: Point[];
	public readonly triangles: Triangle[];

	public originZ: number = 150;

	public rotationX: number = 0;
	public rotationY: number = 0;
	public rotationZ: number = 0;

	public size: number = 1;
	public colorObj: ColorObject = {
		hex: '#FFFFFF',
		r: 255,
		g: 255,
		b: 255
	};

	constructor(points: Point[] = [], triangles: Triangle[] = []) {
		this.points = points;
		this.triangles = triangles;
	}

	public setColor(hex: string): void {
		if (hex.length !== 7) {
			console.error('Not proper hex string was provided');
			return;
		}
		this.colorObj = {
			hex,
			r: Number.parseInt(hex.substring(1, 3), 16),
			g: Number.parseInt(hex.substring(3, 5), 16),
			b: Number.parseInt(hex.substring(5, 7), 16)
		};
	}

	// Shapes

	public static createShape(name: ShapeNames, size: number = 100, origin?: Shape) {
		let obj: ShapeObject;
		switch (name) {
			case 'cube':
				obj = cubeObj;
				break;
			case 'prism':
				obj = prismObj;
				break;
			case 'prismSqB':
				obj = prismSqBObj;
				break;
		}
		const shp = new Shape(obj.points as Point[], obj.triangles as Triangle[]);
		shp.size = size;
		if (origin) {
			shp.size = origin.size;
			shp.originZ = origin.originZ;
			shp.rotationX = origin.rotationX;
			shp.rotationY = origin.rotationY;
			shp.rotationZ = origin.rotationZ;
			shp.colorObj = origin.colorObj;
		}
		return shp;
	}
}
