import cubeObj from './shapes/cube.json';
import prismObj from './shapes/prism.json';
import prismSqBObj from './shapes/prismSqB.json';

interface ShapeObject {
	name: string;
	points: number[][];
	triangles: number[][];
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

	constructor(points: Point[] = [], triangles: Triangle[] = []) {
		this.points = points;
		this.triangles = triangles;
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
		}
		return shp;
	}
}
