import cubeObj from './shapes/cube.json';
import prismObj from './shapes/prism.json';
import prismSqBObj from './shapes/prismSqB.json';

interface ShapeObject {
	name: string;
	points: number[][];
	edges: number[][];
}

export type Point = [x: number, y: number, z: number];
export type Edge = [aIdx: number, bIdx: number];

export type ShapeNames = 'cube' | 'prism' | 'prismSqB';

export default class Shape {
	public readonly points: Point[];
	public readonly edges: Edge[];

	public originX: number = 0;
	public originY: number = 0;
	public originZ: number = 150;

	public rotationX: number = 0;
	public rotationY: number = 0;
	public rotationZ: number = 0;

	public size: number = 1;

	constructor(points: Point[] = [], edges: Edge[] = []) {
		this.points = points;
		this.edges = edges;
	}

	// Shapes

	public static createShape(name: ShapeNames, size: number = 100) {
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
		const shp = new Shape(obj.points as Point[], obj.edges as Edge[]);
		shp.size = size;
		return shp;
	}
}
