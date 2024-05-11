import cubeObj from './shapes/cube.json';
import prismObj from './shapes/prism.json';
import prismSqBObj from './shapes/prismSqB.json';
import { type Vector } from './Vector';

interface ShapeObject {
	name: string;
	points: number[][];
	triangles: number[][];
}

export interface ColorObject {
	hex: string;
	r: number;
	g: number;
	b: number;
}

export type Triangle = [aIdx: number, bIdx: number, cIdx: number];

export type ShapeNames = 'cube' | 'prism' | 'prismSqB';

export default class Shape {
	public readonly points: Vector[];
	public readonly triangles: Triangle[];

	public origin: { x: number; y: number; z: number } = { x: 0, y: 0, z: 300 };
	public rotation: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 };
	public size: number = 1;

	public colorObj: ColorObject = {
		hex: '#FFFFFF',
		r: 255,
		g: 255,
		b: 255
	};

	constructor(points: Vector[] = [], triangles: Triangle[] = []) {
		this.points = points;
		this.triangles = triangles;
	}

	public setColor(hex: string): void {
		if (hex.length !== 7) {
			console.error('Not proper hex string was provided', hex);
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

	private static copyShapeParams(shape: Shape, origin: Shape): void {
		shape.size = origin.size;
		shape.origin = origin.origin;
		shape.rotation = origin.rotation;
		shape.colorObj = origin.colorObj;
	}

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
		const shp = new Shape(obj.points as Vector[], obj.triangles as Triangle[]);
		shp.size = size;
		if (origin) {
			this.copyShapeParams(shp, origin);
		}
		return shp;
	}

	public static parseToShape(text: string): Shape {
		const shape = new Shape();
		const read = text.split('\n');
		for (let i = 0; i < read.length; i++) {
			const line = read[i];

			if (line.length === 0) continue;
			const pivot = line.indexOf(' ');
			const type = line.substring(0, pivot);
			const data = line.substring(pivot + 1, line.length);
			if (type === 'v') {
				const vertices = data
					.split(' ')
					.filter((v) => v.length > 0)
					.map((v) => (v.includes('\r') ? v.substring(0, v.indexOf('\r')) : v));
				if (vertices.length !== 3) {
					console.error(vertices);
					throw new Error(`Not suported vertices was provided at line ${i}: "${data}"`);
				}
				const x = Number(vertices[0]);
				const y = Number(vertices[1]);
				const z = Number(vertices[2]);
				const point: Vector = [x, y, z];
				shape.points.push(point);
			} else if (type === 'f') {
				const faces = data.split(' ');
				if (faces.length !== 3) {
					console.error(faces);
					throw new Error(
						`Not suported face was provided at line ${i}, engine only supports faces of 3 vertices and got provided with ${faces.length}`
					);
				}
				const v1 = Number(faces[0].split('/')[0]) - 1;
				const v2 = Number(faces[1].split('/')[0]) - 1;
				const v3 = Number(faces[2].split('/')[0]) - 1;
				const triangle: Triangle = [v1, v2, v3];
				shape.triangles.push(triangle);
			}
		}
		return shape;
	}

	public static createShapeFromObjFile(file: File, origin?: Shape): Promise<Shape> {
		const extension = file.name.substring(file.name.lastIndexOf('.'));
		if (extension !== '.obj') {
			throw new Error(
				"Wrong file format was provided, accepts only '.obj' files, not " + extension
			);
		}
		return new Promise<Shape>((resolve, reject) => {
			const fileReader = new FileReader();
			fileReader.addEventListener('load', (event) => {
				const result = event.target?.result as String | undefined;
				if (!result) {
					console.error(event);
					return reject('Error ocurred while reading file');
				}
				try {
					const shape: Shape = this.parseToShape(result as string);
					if (origin) {
						this.copyShapeParams(shape, origin);
					}
					return resolve(shape);
				} catch (error) {
					return reject(`Error ocurred while shape parsing: ${error}`);
				}
			});
			fileReader.readAsText(file);
		});
	}

	public static async loadShape(url: string, size: number = 100): Promise<Shape> {
		const result = await fetch(url);
		if (!result.ok) {
			throw new Error("Couldn't fetch file from given url");
		}
		const data = await result.text();
		const shape = this.parseToShape(data);
		shape.size = size;
		return shape;
	}
}
